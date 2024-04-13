FROM node:lts-bullseye-slim

ENV NODE_ENV=production

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci --omit=dev

RUN npm prune --omit=dev

COPY --chown=node:node . .

USER node

CMD [ "node", "index.js" ]

# https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker
