FROM node:14

EXPOSE 80

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install -g prisma
RUN npm ci

COPY . .

RUN npm run build

CMD [ "node", "dist/server.js" ]
