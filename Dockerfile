# build environment
FROM node:14-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --silent
# RUN npm install react-scripts@3.4.1 -g --silent
RUN npm install -g --silent
# RUN npm install -g
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine

COPY ./start-nginx.sh /usr/bin/start-nginx.sh
RUN chmod +x /usr/bin/start-nginx.sh

WORKDIR /usr/share/nginx/html

ENV BASE_URL=/administrator

COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build .

# this must be after copy of build to overwrite the config.js
COPY ./config.js .

EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT [ "start-nginx.sh" ]