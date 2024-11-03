FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Create data directory for persistent storage
RUN mkdir -p /app/data

EXPOSE 3001

CMD ["npm", "start"]