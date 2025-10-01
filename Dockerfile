# 루트에서 백엔드 서브패스 빌드용 Dockerfile
FROM node:20-alpine

# 빌드 도구 설치
RUN apk add --no-cache python3 make g++

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
RUN echo "App directory:" && ls -la app/ || echo "app not found"
RUN echo "Backend directory:" && ls -la app/backend/ || echo "backend not found"

# 백엔드 파일들을 루트로 이동
RUN if [ -d "app/backend" ]; then \
    echo "Moving backend files to root..." && \
    cp app/backend/package*.json ./ && \
    ls -la package*.json; \
    else echo "Backend directory not found!"; fi

# 복사 후 확인
RUN echo "After moving files:" && ls -la .
RUN echo "package.json contents:" && head -10 package.json || echo "package.json not found"

# 의존성 설치
RUN npm install

# 백엔드 소스 코드를 현재 디렉토리로 복사
RUN if [ -d "app/backend/src" ]; then \
    echo "Copying backend source code..." && \
    cp -r app/backend/src ./ && \
    cp app/backend/tsconfig.json ./ && \
    ls -la src/; \
    else echo "Backend src directory not found!"; fi

# TypeScript 빌드
RUN npm run build

# 프로덕션 의존성만 설치
RUN npm prune --production && npm cache clean --force

# 포트 노출
EXPOSE 3001

# 애플리케이션 시작
CMD ["npm", "run", "start:prod"]
