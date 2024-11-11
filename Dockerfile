FROM node:20-alpine AS base

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./src
COPY --from=build /app/index.html ./
COPY  /uploads ./
COPY  /src/modules/auth/auth.proto ./src/modules/auth/auth.proto
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./

RUN ls src/modules
RUN ls src/modules/auth

CMD [ "node", "src/index.js" ]
