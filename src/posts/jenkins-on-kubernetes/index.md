---
title: Building Docker images with Jenkins on Kubernetes
date: '2018-09-25'
tags: ['kubernetes', 'jenkins', 'docker']
---

If you've tried to build docker images on your Jenkins instance running on your Kubernetes cluster,
you probably saw this error message trying to debug the problem:

```
Cannot connect to the Docker daemon. Is the docker daemon running on this host?
```

That's because the Jenkins container (or any container for that matter) can't run another Docker daemon inside.

The solution is Docker-in-Docker (DinD).

> You might have come across [this post](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/) 
> warning about the dangers of using DinD.  The following solution will not have any of the issues outlined in that
> post when run on standard K8 deployments.

## Jenkins Image

The default Jenkins image does not come with Docker built-in, so we'll have to make our own image.  We'll also install 
`kubectl` so we can automatically deploy our image after it's built.  Since the `kubectl` utility is not 
[backwards compatible](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/release/versioning.md#supported-releases-and-component-skew)
you might want to specify which version you want to install.

```docker
FROM jenkins/jenkins:lts

ENV K8_CLIENT_VERSION 1.8.14-00

USER root

RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates software-properties-common && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - && \
    curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
    echo "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list && \
    echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" > /etc/apt/sources.list.d/kubernetes.list && \
    apt-get update && \
    apt-get install -y git docker-ce kubectl=$K8_CLIENT_VERSION

RUN usermod -aG docker jenkins

USER jenkins
```

## Jenkins Deployment

With our image ready, we just have to update the Kubernetes deployment to use our image and to run a separate container
that will host the Docker daemon.  Since containers 
[can communicate](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/#networking) 
with each other via localhost on the same pod, we can point Jenkins to use the Daemon on the other container
via environment variables.

```yaml
apiVersion: apps/v1beta2
kind: Deployment
metadata:
  labels:
    app: my-jenkins
  name: my-jenkins-deployment
spec:
  selector:
    matchLabels:
      app: my-jenkins
  template:
    metadata:
      labels:
        app: my-jenkins
    spec:
      volumes:
      - name: var-lib-docker
        emptyDir: {}
      containers:
      - image: my-repo/my-jenkins:1.0
        name: my-jenkins
        env:
        - name: DOCKER_HOST
          value: tcp://localhost:2375
        ports:
        - name: http
          containerPort: 8080
      - name: dind-daemon
        image: docker:dind
        securityContext:
            privileged: true
        volumeMounts:
          - name: var-lib-docker
            mountPath: /var/lib/docker
```

> Tip: You will most likely want Jenkins storage to be persistent, so you'll want a persistent volume on `/var/jenkins_home`

## Jenkins build

All that's left is to integrate this into your Pipelines.  For example, we'll have our pipeline 
build, test and deploy an image.

```groovy
#!/usr/bin/env groovy

pipeline {
    environment {
        MY_REPO = 'my-repo'
        IMAGE_NAME = 'project-image'
        NEW_IMAGE_NAME = "${IMAGE_NAME}:${BUILD_NUMBER}"
        NEW_REMOTE_IMAGE_NAME = "${MY_REPO}/${NEW_IMAGE_NAME}"
    }
    stages {
        stage('Build project') {
            steps {
                sh './build.sh'
            }
        }
        stage('Run tests') {
            steps {
                sh './test.sh
            }
        }
        stage('Deploy') {
            steps {
                sh 'git tag ${BUILD_TAG}'

                sshagent (credentials: ['my-keys']) {
                    sh 'git push origin ${BUILD_TAG}'
                }

                sh 'kubectl set image deployment/project-deployment project-image=${NEW_REMOTE_IMAGE_NAME}'
                sh 'kubectl rollout status --watch deployment/project-deployment'
            }
        }
    }
}
```
