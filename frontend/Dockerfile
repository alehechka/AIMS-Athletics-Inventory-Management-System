# build environment
FROM node:12-alpine as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

# server environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template
ENV PORT 8080
ENV HOST 0.0.0.0
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]


# To create docker image and run locally
# docker images
# docker build -t alehechka/aims-frontend .
# docker images
# docker run -p 5000:5000 -d alehechka/aims-frontend
# docker ps
# docker stop (ps ID)

# To deploy to GCP
# gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/aims-frontend