# Multi-stage build for better optimization
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 파일 존재 확인을 위한 디버그
RUN echo "Current directory contents:" && ls -la

# package.json과 package-lock.json 복사 (파일이 현재 디렉토리에 있는지 확인)
COPY ./package.json ./package-lock.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# 빌드된 파일과 package.json 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# 프로덕션 의존성만 설치
RUN npm ci --only=production && npm cache clean --force

# 포트 노출
EXPOSE 3001

# 애플리케이션 시작
CMD ["npm", "run", "start:prod"]