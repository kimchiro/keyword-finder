# 클라우드 시스템 호환성을 위한 단일 스테이지 빌드
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 파일 존재 확인을 위한 디버그
RUN echo "=== CUSTOM DOCKERFILE RUNNING ===" && pwd && ls -la /

# package files 복사 (클라우드 시스템 호환)
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# 프로덕션 의존성만 설치
RUN npm ci --only=production && npm cache clean --force

# 포트 노출
EXPOSE 3001

# 애플리케이션 시작
CMD ["npm", "run", "start:prod"]