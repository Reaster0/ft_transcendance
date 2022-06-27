FROM alpine

RUN apk update &&\
	apk add npm

RUN npm install -g serve

COPY . /app

WORKDIR /app
RUN npm install &&\
	npm run build

ENTRYPOINT ["serve", "dist", "-l", "8080"]
