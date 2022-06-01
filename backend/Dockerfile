FROM alpine

RUN apk update &&\
	apk add npm

COPY . /app

WORKDIR /app
RUN npm install

ENTRYPOINT [ "npm", "run", "start"]