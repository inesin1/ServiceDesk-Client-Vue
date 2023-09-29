# Сборка
FROM node:lts-alpine as build-stage

WORKDIR /workdir/client
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# прод
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /workdir/client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 1001
CMD [ "nginx", "-g", "daemon off;" ]