FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

 RUN npm install -g nodemon ts-node

 COPY . .

 RUN npm rebuild bcrypt --build-from-source

EXPOSE 3000

CMD ["sh", "-c", "npm install wait-port && wait-port mysql-db:3306 -- nodemon -e ts --exec ts-node src/index.ts"]
