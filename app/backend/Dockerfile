FROM node:20-alpine

# 빌드 도구 설치
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 현재 디렉토리의 모든 파일 복사 (package.json 포함)
COPY . .

# 의존성 설치
RUN npm install

# TypeScript 빌드
RUN npm run build

# 프로덕션 의존성만 유지
RUN npm prune --production && npm cache clean --force

# 포트 노출
EXPOSE 3001

# 애플리케이션 시작
CMD ["npm", "run", "start:prod"]