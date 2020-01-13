---
title: Improving on Building Docker images with Jenkins on Kubernetes
date: '2019-12-24'
tags: ['kubernetes', 'jenkins', 'docker']
---

> This is an update to the previous post, [Building Docker images with Jenkins on Kubernetes](/jenkins-on-kubernetes).

## `dind` update

Recently Docker `dind` updated their image to automatically generate TLS certificates:

> Starting in 18.09+, the dind variants of this image will automatically generate TLS certificates in 
> the directory specified by the DOCKER_TLS_CERTDIR environment variable.
  
> Warning: in 18.09, this behavior is disabled by default (for compatibility). If you use --network=host, 
> shared network namespaces (as in Kubernetes pods), or otherwise have network access to the container 
> (including containers started within the dind instance via their gateway interface), 
> this is a potential security issue (which can lead to access to the host system, for example). 
> It is recommended to enable TLS by setting the variable to an appropriate value (-e DOCKER_TLS_CERTDIR=/certs or similar). 
> In 19.03+, this behavior is enabled by default.

Updating our K8s resource is fairly straightforward. We'll create a new `emptyDir` volume to store and share the certificates
across both containers. Then we'll inject an environment variable on both containers to specify where 
to write/read the certificates to/from, respectively.

```yaml{19,20,27,28,32-34,39-41,45,46}
apiVersion: apps/v1
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
      - name: docker-certs
        emptyDir: {}
      containers:
      - image: my-repo/my-jenkins:1.0
        name: my-jenkins
        env:
        - name: DOCKER_HOST
          value: tcp://localhost:2375
        - name: DOCKER_CERT_PATH
          value: /certs
        ports:
        - name: http
          containerPort: 8080
        volumeMounts:
          - name: docker-certs
            mountPath: /certs
      - name: dind-daemon
        image: docker:dind
        securityContext:
            privileged: true
        env:
          - name: DOCKER_TLS_CERTDIR
            value: /certs
        volumeMounts:
          - name: var-lib-docker
            mountPath: /var/lib/docker
          - name: docker-certs
            mountPath: /certs
```

## Improving `dind` performance

If you try to build images that require a lot of read/write activity  (for example, almost anything involving `node_modules`),
you might notice that the performance of running a build using `dind` and on your own machine is vastly different. It turns
out that `emptyDir` is not the best choice for this kind of operation. We can vastly improve our performance by using a volume backed by a `PVC`.

Additionally, `dind` might not use the best [storage driver](https://docs.docker.com/storage/storagedriver/select-storage-driver/) by default.
According to [GitLab](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#using-the-overlayfs-driver), 
the default for `dind` is `vfs`. I can't find any corresponding documentation on Docker's [official image](https://hub.docker.com/_/docker) page,
but they do have an example where they specify the storage driver explicitly. By making sure we're using `overlay2` we'll
also get a significant performance boost.

This is what our final resource looks like:

```yaml{17-19, 38-40}
apiVersion: apps/v1
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
        persistentVolumeClaim:
          claimName: jenkins-docker-pvc
      - name: docker-certs
        emptyDir: {}
      containers:
      - image: my-repo/my-jenkins:1.0
        name: my-jenkins
        env:
        - name: DOCKER_HOST
          value: tcp://localhost:2375
        - name: DOCKER_CERT_PATH
          value: /certs
        ports:
        - name: http
          containerPort: 8080
        volumeMounts:
          - name: docker-certs
            mountPath: /certs
      - name: dind-daemon
        image: docker:dind
        args:
          - --storage-driver
          - overlay2
        securityContext:
            privileged: true
        env:
          - name: DOCKER_TLS_CERTDIR
            value: /certs
        volumeMounts:
          - name: var-lib-docker
            mountPath: /var/lib/docker
          - name: docker-certs
            mountPath: /certs
```

> Tip: Like in our previous post, you'll probably want a dedicated PVC to store your JENKINS_HOME, 
> this is just a minimal example as a demonstration, not a production-ready template. 
