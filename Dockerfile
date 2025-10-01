# 루트에서 백엔드 서브패스 빌드용 Dockerfile
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 강력한 캐시 무효화 - 매번 다른 값 생성
ARG CACHEBUST=1
RUN echo "=== CACHE BUSTER: $CACHEBUST ===" && date && echo "Random: $$" && echo "Timestamp: $(date +%s)"

# 커스텀 Dockerfile 실행 확인 (이 메시지가 보이면 드디어 성공!)
RUN echo "========================================="
RUN echo "=== ROOT DOCKERFILE IS RUNNING!!! ==="
RUN echo "========================================="
RUN echo "Current working directory:" && pwd
RUN echo "Build context contents:" && ls -la .

# 백엔드 디렉토리로 이동
WORKDIR /app

# 전체 프로젝트 복사 후 백엔드만 추출
COPY . .
RUN echo "After full copy:" && ls -la .
RUN echo "Packages directory:" && ls -la packages/ || echo "packages not found"
RUN echo "Backend directory:" && ls -la packages/backend/ || echo "backend not found"

# 백엔드 파일들을 루트로 이동
RUN if [ -d "packages/backend" ]; then \
    echo "Moving backend files to root..." && \
    cp packages/backend/package*.json ./ && \
    ls -la package*.json; \
    else echo "Backend directory not found!"; fi

# 복사 후 확인
RUN echo "After moving files:" && ls -la .
RUN echo "package.json contents:" && head -10 package.json || echo "package.json not found"

# 의존성 설치
RUN npm ci

# 백엔드 소스 코드를 현재 디렉토리로 복사
RUN if [ -d "packages/backend/src" ]; then \
    echo "Copying backend source code..." && \
    cp -r packages/backend/src ./ && \
    cp packages/backend/tsconfig.json ./ && \
    ls -la src/; \
    else echo "Backend src directory not found!"; fi

# TypeScript 빌드
RUN npm run build

# 프로덕션 의존성만 설치
RUN npm ci --only=production && npm cache clean --force

# 포트 노출
EXPOSE 3001

# 애플리케이션 시작
CMD ["npm", "run", "start:prod"]
