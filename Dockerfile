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

EXPOSE 0101
CMD [ "nginx", "-g", "daemon off;" ]