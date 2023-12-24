FROM node:16.14.2-alpine as builder

LABEL maintainer="tungns <tung@axlehire.com>"

ARG NPM_REGISTRY_URL

ARG NPM_AUTH_KEY

ARG NPM_EMAIL

ENV NPM_REGISTRY_URL $NPM_REGISTRY_URL

ENV NPM_AUTH_KEY $NPM_AUTH_KEY

ENV NPM_EMAIL $NPM_EMAIL

WORKDIR /app/bin

ENV GENERATE_SOURCEMAP false

COPY package*.json ./

COPY install.sh ./

RUN chmod +x install.sh && ./install.sh

COPY . ./

RUN npm run build:jenkins

FROM nginx:alpine

RUN apk update && apk add --no-cache perl

COPY nginx.conf /etc/nginx/nginx.conf.tepmplate

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/bin/build /usr/share/nginx/html

COPY entrypoint.sh ./

RUN chmod +x entrypoint.sh

ENV PORT 80

ENV HOST 0.0.0.0

EXPOSE 80

ENTRYPOINT [ "./entrypoint.sh" ]
