FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
RUN npm run build
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
