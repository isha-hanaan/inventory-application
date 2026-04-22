FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 CMD node -e "require('http').get('http://localhost:5000/health', (res) => { if (res.statusCode !== 200) throw new Error(res.statusCode) })"
CMD ["npm", "run", "start"]
