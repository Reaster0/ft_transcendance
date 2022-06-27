FROM alpine

RUN apk update &&\
	apk add npm

ARG VUE_APP_BACKEND
ENV VUE_APP_BACKEND=$VUE_APP_BACKEND

RUN env | grep VUE

RUN npm install -g serve

COPY . /app

WORKDIR /app
RUN npm install &&\
	npm run build

ENTRYPOINT ["serve", "dist", "-l", "8080"]
