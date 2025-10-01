# 강제 Docker 빌드 - Node.js 자동 감지 완전 방지
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 커스텀 Dockerfile 실행 확인 (이 메시지가 보이면 성공!)
RUN echo "========================================="
RUN echo "=== CUSTOM DOCKERFILE IS RUNNING!!! ==="
RUN echo "========================================="
RUN echo "Current working directory:" && pwd
RUN echo "Root directory contents:" && ls -la /
RUN echo "Build context contents:" && ls -la .

# package.json 복원 (숨겨진 파일에서)
RUN echo "Looking for package files..."
COPY package.json.backup ./package.json
COPY package-lock.json ./package-lock.json

# 복사 후 확인
RUN echo "After package.json restore:" && ls -la .
RUN echo "package.json contents:" && head -10 package.json

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