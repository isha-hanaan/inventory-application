FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
