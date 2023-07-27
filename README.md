# Portainer Webhook Github Relayer

This image will accept github push webhook and update Portainer stacks based on github url and files changed

## Usage

```shell
docker run \
  -p 80:4040 \
  -e API_PREFIX="" \ # Optional, i
  -e PORTAINER_HOST=xxxxxx \
  -e PORTAINER_API_TOKEN=xxxxxx \
  ghcr.io/mhaii/portainer-webhook-github-relayer:latest
```

## Parameters

The parameters are split into two halves, separated by a colon, the left hand side representing the host and the right the container side.

* `-e PORTAINER_HOST=xxxxxx` - Full path to portainer e.g. `https://portainer:9000`
* `-e PORTAINER_API_TOKEN=xxxxxx` - Access token, generated from `User settings > Access tokens`

*Optional Settings:*

* `-e API_PREFIX=/webhook` - Path prefix, in case image is deployed behind reverse proxy
* `-e WEBHOOK_SECRET=xxxxxx` - Will validate payload with secret if set 

## Docker Compose

```yml
version: '3.8'
services:
  portainer-webhook-relay:
    image: ghcr.io/mhaii/portainer-webhook-github-relayer:latest
    restart: always
    ports:
      - '80:4040'
    environment:
      PORTAINER_HOST: ${PORTAINER_ENDPOINT}
      PORTAINER_API_TOKEN: ${PORTAINER_SA_USERNAME}
```
