#bin/bash

BASE_CONTAINER_NAME=servcel

API_CONTAINER_NAME=${BASE_CONTAINER_NAME}-api
API_PORT=3346
API_VOLUME=/api
API_COMMAND="yarn && yarn tsc && yarn start"

NODE_VERSION=node:14.15.2

docker container stop $API_CONTAINER_NAME && docker container rm $API_CONTAINER_NAME
docker container run -dit --restart always -p $API_PORT:$API_PORT -w $API_VOLUME --name $API_CONTAINER_NAME -v $(pwd):$API_VOLUME $NODE_VERSION bash -c "${API_COMMAND}"
docker container logs -f $API_CONTAINER_NAME
