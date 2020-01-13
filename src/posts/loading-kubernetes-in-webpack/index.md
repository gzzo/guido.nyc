---
title: Loading Kubernetes Resources in Webpack Configs
date: '2020-01-13'
tags: ['kubernetes', 'webpack']
---

I like to keep project wide configuration directly in the Kubernetes cluster. Not only does this make the configuration 
accessible directly by pods via environment variables, but you can access the configuration from any other project 
regardless of what language you use (as long as you are free to communicate with the K8s API). 

I've come across situations where it's useful / more convenient for Webpack to load the configuration directly during 
the build. Of course, it's possible to load the configuration into the environment and use `process.env` in Webpack, 
but loading it directly though Webpack simplifies the build process a bit since you're not dealing with a clean slate 
 -- you don't have to worry about what else could be polluting the process' environment.
 
## Getting started
 
Kubernetes' official client for node is [`@kubernetes/client-node`](https://www.npmjs.com/package/@kubernetes/client-node).

> As with all programs that interface with the Kubernetes API, you'll want to make sure you're on a compatible version with
your cluster and pin the version if necessary.

`yarn add @kubernetes/client-node`

## Configuration Types

Webpack has a feature you might not know that is essential for this to work: Webpack configurations can return
promises and functions (and promises that return functions) -- not just plain objects.

This is covered more in depth in the Webpack documentation: [Configuration Types](https://webpack.js.org/configuration/configuration-types/).
For our purposes we'll start with the bare minimum -- returning a promise.

## Webpack Config

I highly recommend creating a new Webpack configuration file instead of editing your current one and using 
[`webpack-merge`](https://github.com/survivejs/webpack-merge).

> Not only will this make your code more modular and easier to understand, this will make future debugging a lot easier. 
>Say you run into a case where you want to [`git bisect`](https://git-scm.com/docs/git-bisect)
a couple of years of commits. You might find yourself in a position where older versions of your code are no longer 
compatible with your newer K8s cluster!

Loading a `config-map` from K8s consists of loading your credentials and making an API call. This is what our new 
K8s-compatible Webpack config might look like:

```js
// kubernetes.webpack.config.js
import webpack from 'webpack'
import merge from 'webpack-merge'
import { CoreV1Api, KubeConfig } from '@kubernetes/client-node'

import productionConfig from './webpack.production'

const k8Config = new KubeConfig()
k8Config.loadFromDefault()

const k8sApi = k8Config.makeApiClient(CoreV1Api)

const configMap = 'project-config-map'
const namespace = 'project-namespace'

export default k8sApi.readNamespacedConfigMap(configMap, namespace)
  .then(result => {
    const configData = result.body.data  
    
    return merge(productionConfig, {
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            HOSTNAME: JSON.stringify(configData.HOSTNAME),
          }
        })
      ]
    })
  })
```

This is the bare minimum example, all we're doing is injecting a new variable `process.env.HOSTNAME` from the `project-config-map`
that lives on `project-namespace` in your K8s cluster.

## Next Steps

You might want to load from more than one `config-map`, we can use `Promise.all`:

```js
// ...

Promise.all([
  k8sApi.readNamespacedConfigMap(projectAConfig, namespace)
    .then(result => result.body.data),
  k8sApi.readNamespacedConfigMap(projectBConfig, namespace)
    .then(result => result.body.data),
]).then(([projectAData, projectBData]) => {
  // ...
})
```

You might want to be able to run the build within the cluster, we can use `loadFromCluster`:

```js
try {
  k8Config.loadFromDefault()
} catch (e) {
  k8Config.loadFromCluster()
}

// ...
```

You might want to have access to Webpack's `env` and `argv`, we can return a function:

```js
// ...

return (env, argv) => merge(productionConfig, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        HOSTNAME: JSON.stringify(configData.HOSTNAME),
        INCLUDE_FEATURE: JSON.stringify(env.includeFeature),
        OUTPUT_PATH: JSON.stringify(argv.outputPath),
      }
    })
  ]
})

```
