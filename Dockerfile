FROM node:18-bullseye AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

# remove default config
RUN rm -rf /usr/share/nginx/html/*

# copy build
COPY --from=build /app/build /usr/share/nginx/html

# FIX: allow nginx to write pid
RUN mkdir -p /run && chmod 777 /run

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]