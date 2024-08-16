# build environment
FROM node:20-alpine AS build

WORKDIR /app

ENV PATH=/app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --silent
# RUN npm install react-scripts@3.4.1 -g --silent
RUN npm install -g --silent
# RUN npm install -g
COPY . ./
RUN npm run build

# production environment
FROM nginxinc/nginx-unprivileged:1.27.0-alpine

WORKDIR /usr/share/nginx/html

ENV API_URL=/api
ENV LOGIN_URL=/login
ENV LOGOUT_URL=/logout

COPY --from=build /app/build .