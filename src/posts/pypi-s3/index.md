---
title: Hosting a private PyPi repository on S3
date: '2018-08-16'
tags: ['S3', 'pypi', 'python', 'nginx']
---

Hosting a private PyPi repository is as simple as creating an S3 bucket and configuring an 
nginx instance to authenticate requests to S3 via their 
[REST](http://s3.amazonaws.com/doc/s3-developer-guide/RESTAuthentication.html) API.

We'll also cover options on how to publish your packages to the repository and integrating with Pipenv.

## S3 Bucket Setup

The Python Packaging [docs](https://packaging.python.org/guides/hosting-your-own-index/)
describe what the directory structure of your repository should look like:

```
.
├── bar
│   └── bar-0.1.tar.gz
└── foo
    ├── Foo-1.0.tar.gz
    └── Foo-2.0.tar.gz
```

Let's create a bucket for our repository with the 
[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html):

```
aws s3 mb s3://my-pypi
```

For now we'll use an existing package hosted on PyPi to test our repository.  We'll cover publishing
your own packages later on.

```
wget https://files.pythonhosted.org/packages/e0/86/4eb5228a43042e9a80fe8c84093a8a36f5db34a3767ebd5e1e7729864e7b/arrow-0.12.1.tar.gz#sha256=a558d3b7b6ce7ffc74206a86c147052de23d3d4ef0e17c210dd478c53575c4cd
aws s3 cp arrow-0.12.1.tar.gz s3://my-pypi/arrow/
```

You also need an index page at `/arrow` so `pip` can find the available versions.

```
echo "
<html>
    <body>
        <a href="arrow-0.12.1.tar.gz#sha256=a558d3b7b6ce7ffc74206a86c147052de23d3d4ef0e17c210dd478c53575c4cd">
            arrow-0.12.1.tar.gz
        </a>
    </body>
</html>

" > index.html
aws s3 cp index.html s3://my-pypi/arrow/
```

## Nginx Setup

`pip` doesn't support authenticating requests to AWS natively.  So we'll have to
create a reverse proxy that authenticates our requests to AWS that `pip` can talk to.  

We'll need a couple of extensions in nginx to make this work, so we'll have to build it from source:

1. [ngx\_devel\_kit](https://github.com/simplresty/ngx_devel_kit) - this extension is a dependency for the two below
2. [ngx\_http\_lua\_module](https://github.com/openresty/lua-nginx-module) - this adds lots of features to nginx,
 we'll use it to read environment variables.
3. [ngx\_set\_misc](https://github.com/openresty/set-misc-nginx-module) - this module adds some functions that we need
to generate the signature for the API request

> You might have noticed that there's an nginx module that does something similar, ngx\_aws\_auth.  So why are we
> installing all these extensions?  Mainly for using environment variables -- we don't want to hardcode anything
> into our configuration files.  Having the ability to execute lua on your nginx instance is a nice plus too.

It's pretty straight forward to [build nginx from source](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#sources)
and add these modules.  I wrote a [Dockerfile](https://github.com/gzzo/nginx-lua-misc/blob/master/Dockerfile) 
and uploaded the [Docker image](https://hub.docker.com/r/e11even/nginx-lua-misc/) so you can follow along.  You might 
want to fork that repo so you can edit the configuration flags passed to compile nginx.

You'll need to create two configuration files for nginx, one to declare the environment variables we'll be providing,
and the other to declare the server and location blocks.

> Contents of env.conf
```nginx{numberLines: true}
env AWS_S3_BUCKET;
env AWS_ACCESS_KEY;
env AWS_SECRET_KEY;
```

> Contents of site.conf
```nginx{numberLines: true}
server {
    listen 80;
    location / {
	    rewrite			    ^(.*)/$ $1/index.html;

        set_by_lua $bucket          'return os.getenv("AWS_S3_BUCKET")';
        set_by_lua $aws_access      'return os.getenv("AWS_ACCESS_KEY")';
        set_by_lua $aws_secret      'return os.getenv("AWS_SECRET_KEY")';
        set_by_lua $now             "return ngx.cookie_time(ngx.time())";
        set $string_to_sign         "$request_method\n\n\n\nx-amz-date:${now}\n/$bucket$uri";
        set_hmac_sha1               $aws_signature $aws_secret $string_to_sign;
        set_encode_base64           $aws_signature $aws_signature;
        proxy_http_version          1.1;
        proxy_set_header            Host $bucket.s3.amazonaws.com;
        proxy_set_header            x-amz-date $now;
        proxy_set_header            Authorization "AWS $aws_access:$aws_signature";
        proxy_buffering             off;
        proxy_intercept_errors      on;
    	proxy_pass                  http://s3.amazonaws.com;
	}
}
```

That's it!  We're ready to put it all together.

## Testing

Let's run the image with our configuration files:

```bash
docker run \
-d \
-p 8080:80 \
--mount type=bind,src=$(pwd)/env.conf,target=/etc/nginx/modules-enabled/env.conf \
--mount type=bind,src=$(pwd)/site.conf,target=/etc/nginx/sites-enabled/site.conf \
-e AWS_ACCESS_KEY=$AWS_ACCESS_KEY \
-e AWS_SECRET_KEY=$AWS_SECRET_KEY \
-e AWS_S3_BUCKET=my-pypi \
--name nginx-lua-misc \
e11even/nginx-lua-misc
```

Now you can verify that the authentication is working:

```bash
> $ curl --head localhost:8080/arrow/arrow-0.12.1.tar.gz
HTTP/1.1 200 OK
Server: nginx
...
```

And let's close the loop here and test that it works with `pipenv`.

```bash{5,7,9}
> $ pipenv install arrow -i http://localhost:8080
Installing arrow...
Looking in indexes: http://localhost:8080, https://pypi.org/simple
Collecting arrow
  Downloading http://localhost:8080/arrow/arrow-0.12.1.tar.gz (65kB)
Collecting python-dateutil (from arrow)
  Using cached https://files.pythonhosted.org/packages/cf/f5/af2b09c957ace60dcfac112b669c45c8c97e32f94aa8b56da4c6d1682825/python_dateutil-2.7.3-py2.py3-none-any.whl
Collecting six>=1.5 (from python-dateutil->arrow)
  Using cached https://files.pythonhosted.org/packages/67/4b/141a581104b1f6397bfa78ac9d43d8ad29a7ca43ea90a2d863fe3056e86a/six-1.11.0-py2.py3-none-any.whl
Building wheels for collected packages: arrow
  Running setup.py bdist_wheel for arrow: started
  Running setup.py bdist_wheel for arrow: finished with status 'done'
  Stored in directory: /Users/guido/Library/Caches/pipenv/wheels/cf/d3/5d/7bcd3afb9d8a6fc5c0f861416c582d7aeeadc206e35724a06f
Successfully built arrow
Installing collected packages: six, python-dateutil, arrow
Successfully installed arrow-0.12.1 python-dateutil-2.7.3 six-1.11.0
```

*_Awesome! You'll notice in the output that `pipenv` downloaded `arrow` from our repository and it's 
dependencies from PyPi._*

## Publishing your own packages

We can automate the process of building our package, uploading the artifacts, and generating the index page.

I wrote a tool, [s3_pypi_publisher](https://github.com/gzzo/s3_pypi_publisher), that does exactly that. You can install
it with `pip`:

```bash
pip install --user s3_pypi_publisher
```

You run it from your package's root directory and provide it with the name of your bucket

```bash
cd /path/to/package
publish_package my-pypi
```

## Integration with `pipenv`

Once you're ready to use your packages from your private repository, you'll want to add a source to your `Pipfile`
so `pipenv` will know where to search for your packages when you're building your projects.

```toml
[[source]]
url = "https://pypi.mydomain.com"
verify_ssl = true
name = "mydomain"
```
