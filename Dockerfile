FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y default-mysql-client

COPY . .

RUN npm run build

EXPOSE 3000

COPY entrypoint.sh /usr/bin
RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT [ "entrypoint.sh" ]
