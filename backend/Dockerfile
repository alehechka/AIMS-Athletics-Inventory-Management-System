# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12-slim

RUN npm install webpack -g

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

ENV NODE_ENV production

RUN webpack

# Copy local code to the container image.
COPY . ./

EXPOSE 5000

# Run the web service on container startup.
CMD [ "npm", "run", "prod" ]


# To create docker image and run locally
# docker images
# docker build -t alehechka/aims-backend .
# docker images
# docker run -p 5000:5000 -d alehechka/aims-backend
# docker ps
# docker stop (ps ID)

# To deploy to GCP
# gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/aims-backend