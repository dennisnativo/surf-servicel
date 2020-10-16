#bin/bash

docker-compose down
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d
docker-compose logs -f
