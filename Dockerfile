FROM node:18-slim as builder
WORKDIR /build

COPY package.json yarn.lock ./
# devDepを含めてインストール
RUN yarn install --frozen-lockfile

COPY --chown=node:node tsconfig.json config.json ./
COPY --chown=node:node src/ ./src
RUN yarn build

FROM node:18-slim as runtime
ENV NODE_ENV production
WORKDIR /app

COPY --chown=node:node package.json yarn.lock tsconfig.json ./
COPY --from=builder --chown=node:node /build/dist ./dist
# devDepを含めずにインストール
RUN yarn install --frozen-lockfile

USER node
CMD "node" "dist/src/index.js"
