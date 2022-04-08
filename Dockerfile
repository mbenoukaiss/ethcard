# Build the application
FROM node:16-alpine AS build

WORKDIR /app
COPY ./client ./

RUN yarn install && yarn build

# Create the nginx container
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]