# 강제 Docker 빌드 - Node.js 자동 감지 방지
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 커스텀 Dockerfile 실행 확인
RUN echo "=== CUSTOM DOCKERFILE IS RUNNING ===" && echo "Current working directory:" && pwd && echo "Root directory contents:" && ls -la /

# 빌드 컨텍스트 확인
RUN echo "Build context contents:" && ls -la .

# package.json 존재 확인 및 복사
RUN echo "Looking for package files..." && find . -name "package*.json" -o -name "yarn.lock" -o -name "pnpm-lock.yaml" | head -10

# package files 복사 (존재하는 것만)
COPY package*.json ./
COPY yarn.lock* ./
COPY pnpm-lock.yaml* ./

# 복사 후 확인
RUN echo "After COPY - directory contents:" && ls -la .

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