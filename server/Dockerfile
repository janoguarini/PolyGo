# Construir desde la raíz del repo (el servidor importa ../shared):
#   docker build -f server/Dockerfile -t polygo-battle-server .
FROM node:22-alpine
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev
COPY shared ./shared
COPY server/src ./server/src
WORKDIR /app/server
ENV NODE_ENV=production PORT=3001
EXPOSE 3001
USER node
CMD ["node", "--import", "tsx", "src/index.ts"]
