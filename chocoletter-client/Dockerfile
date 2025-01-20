FROM node:21 as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_SERVER_URL
ENV VITE_API_SERVER_URL=$VITE_API_SERVER_URL

RUN npm run build

# stage2
FROM nginx:stable-alpine as production-stage

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf


COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]