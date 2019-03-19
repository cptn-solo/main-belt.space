# cptnsolo

> zero.alpha.belt

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# Docker
Docker container published in private docker hub repo as cptnsolo/zero.alpha.belt:latest and used as an image
in [lnd-dockers](https://github.com/kkrupovich/lnd-dockers) repo.

## To rebuild container docker:
build -t cptnsolo/zero.alpha.belt .
