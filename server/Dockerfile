# setup OS
FROM node:alpine
RUN apk update
RUN apk add git
RUN apk add yarn

# setup project
WORKDIR /usr/src/app

# copy all source files
COPY . .

# install
RUN npm clean-install

# build only this application
RUN npm run build -w=server

# start the app when starting the container
CMD [ "npm", "start", "-w=server"]
