# Frontend: Next.js 15, App Router, chạy bằng "next start"

FROM node:20-alpine

WORKDIR /app

# Copy package
COPY package*.json ./

# Install deps
RUN npm install

# Copy toàn bộ source
COPY . .

# Tắt telemetry cho nhẹ
ENV NEXT_TELEMETRY_DISABLED=1

# Build production
RUN npm run build

# Next.js mặc định dùng port 3000 khi "next start"
EXPOSE 3000

# "npm start" phải là "next start -p 3000" trong package.json
CMD ["npm", "start"]
