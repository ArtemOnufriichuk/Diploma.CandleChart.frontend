FROM node
WORKDIR /app

COPY package-lock.json .
COPY package.json .
RUN npm i

COPY . .
RUN npm run build

CMD ["npm", "run", "serve"]
