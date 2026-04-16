# build environment
FROM node:22-alpine AS build

WORKDIR /app

ENV PATH=/app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --cache /tmp/empty-npm-cache --silent
# RUN npm install -g
COPY . ./
RUN npm run build

# production environment
FROM nginxinc/nginx-unprivileged:1.29.8-alpine

USER root
RUN apk update && apk upgrade --no-cache
USER 101

WORKDIR /usr/share/nginx/html

ENV API_URL=/api
ENV LOGIN_URL=/login
ENV LOGOUT_URL=/logout
ENV ENABLE_PROXIES=true
ENV ENABLE_TRUSTED_CERTIFICATES=true

COPY --from=build /app/build .