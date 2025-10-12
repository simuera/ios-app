FROM node:18-bullseye-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production=false
COPY . .
RUN npm run build

FROM node:18-bullseye-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production=true
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/server/prisma ./prisma
COPY ecosystem.config.js ./
RUN npm i -g pm2
RUN npx prisma generate || true
ENV NODE_ENV=production
EXPOSE 3000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
