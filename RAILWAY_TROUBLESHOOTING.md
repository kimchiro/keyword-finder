# 🔄 Railway 배포 문제 해결 가이드

## ❌ 현재 문제
Railway에서 "Is a directory (os error 21)" 에러가 계속 발생하고 있습니다.

## 🔧 해결 방법들

### 방법 1: Railway 대시보드 설정 (권장)

1. **Railway 대시보드** → **Settings** → **Build**
2. **Root Directory**에 `app/backend` 입력
3. **Deploy** 버튼 클릭

### 방법 2: GitHub Action을 통한 서브디렉토리 배포

```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway
on:
  push:
    branches: [main]
    paths: ['app/backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        uses: railwayapp/railway-deploy@v1
        with:
          service: your-service-name
          directory: app/backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### 방법 3: 별도 레포지토리 생성

1. `app/backend` 내용만으로 새 GitHub 레포지토리 생성
2. Railway에서 새 레포지토리 연결
3. 자동 배포 설정

### 방법 4: Docker 배포

Railway에서 Dockerfile 사용:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY app/backend/package*.json ./
RUN npm ci --only=production
COPY app/backend/ ./
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

## 🎯 즉시 시도할 수 있는 방법

**Railway 대시보드에서:**
1. **Settings** → **Build** → **Root Directory**: `app/backend`
2. **Variables**에서 환경 변수 설정
3. **Redeploy** 클릭

**안 되면:**
- GitHub에서 `app/backend` 내용만으로 새 레포 생성
- Railway에서 새 레포 연결

---
*문제 해결 후 이 파일은 삭제해도 됩니다.*
