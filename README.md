# belt

> zero.alpha.belt

## Project setup

```bash
#!/bin/bash
yarn install
```

### Compiles and hot-reloads for development

```bash
#!/bin/bash
yarn run serve
```

### Compiles and minifies for production

```bash
#!/bin/bash
yarn run build
```

### Run your tests

```bash
#!/bin/bash
yarn run test
```

### Lints and fixes files

```bash
#!/bin/bash
yarn run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Docker

Docker container published in private docker hub repo as cptnsolo/zero.alpha.belt:latest and used as an image in [lnd-dockers](https://github.com/kkrupovich/lnd-dockers) repo.

## To rebuild container docker

```bash
#!/bin/bash
docker build -t cptnsolo/zero.alpha.belt .
```