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
COPY --from=build /app/build /usr/share/nginx/html/administrator
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
