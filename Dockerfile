# 루트에서 백엔드 서브패스 빌드용 Dockerfile
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 커스텀 Dockerfile 실행 확인 (이 메시지가 보이면 드디어 성공!)
RUN echo "========================================="
RUN echo "=== ROOT DOCKERFILE IS RUNNING!!! ==="
RUN echo "========================================="
RUN echo "Current working directory:" && pwd
RUN echo "Build context contents:" && ls -la .

# 백엔드 디렉토리로 이동
WORKDIR /app

# 백엔드 디렉토리 내용 확인 (캐시 무효화)
RUN echo "=== DEBUGGING BUILD CONTEXT ===" && date
RUN echo "Root directory contents:" && ls -la .
RUN echo "Backend directory exists?" && ls -la packages/ || echo "packages directory not found"
RUN echo "Backend directory contents:" && ls -la packages/backend/ || echo "packages/backend not found"

# package.json 복원 (올바른 경로에서)
RUN echo "Looking for package files..."
COPY packages/backend/package.json packages/backend/package-lock.json ./

# 복사 후 확인
RUN echo "After package.json copy:" && ls -la .
RUN echo "package.json contents:" && head -10 package.json

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY packages/backend/ ./

# TypeScript 빌드
RUN npm run build

# 프로덕션 의존성만 설치
RUN npm ci --only=production && npm cache clean --force

# 포트 노출
EXPOSE 3001

# 애플리케이션 시작
CMD ["npm", "run", "start:prod"]
