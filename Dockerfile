FROM node:20.10.0-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

COPY . .

ENTRYPOINT ["./entrypoint.sh"]
