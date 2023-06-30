# BUILD STAGE
FROM node:14.21.3 as builder

WORKDIR /home/node/app

COPY package.json .
RUN yarn

COPY --chown=node:node . .
RUN yarn build

# RUN STAGE
FROM node:14.21.3
LABEL maintainer="Santos <lucas.santos@pagtel.com.br>"

WORKDIR /home/node/app
RUN chown node:node /home/node/app

COPY package.json .
RUN yarn install --production=true

USER node

COPY --from=builder /home/node/app/dist ./dist
RUN mkdir -p ./log/error

CMD [ "yarn", "start"]
