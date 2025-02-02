FROM node:22-alpine as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_SERVER_URL
ARG VITE_KAKAOTALK_JAVASCRIPT_KEY
ARG VITE_OPENVIDU_SERVER_URL
ARG VITE_OPENVIDU_SECRET_BASE
ARG VITE_EVENT_DAY

ENV VITE_API_SERVER_URL=$VITE_API_SERVER_URL
ENV VITE_KAKAOTALK_JAVASCRIPT_KEY=$VITE_KAKAOTALK_JAVASCRIPT_KEY
ENV VITE_OPENVIDU_SERVER_URL=$VITE_OPENVIDU_SERVER_URL
ENV VITE_OPENVIDU_SECRET_BASE=$VITE_OPENVIDU_SECRET_BASE
ENV VITE_EVENT_DAY=$VITE_EVENT_DAY

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
