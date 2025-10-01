# 🚀 Railway 배포 가이드

## 배포 방법

Railway에서 이 프로젝트를 배포할 때는 **백엔드 디렉토리만** 배포해야 합니다.

### 1️⃣ Railway에서 배포 디렉토리 설정

Railway 대시보드에서:
1. **Settings** → **Build** 섹션으로 이동
2. **Root Directory**를 `app/backend`로 설정
3. 또는 GitHub에서 `app/backend` 폴더만 별도 레포지토리로 분리

### 2️⃣ 환경 변수 설정

Railway 대시보드에서 다음 환경 변수들을 설정하세요:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=your_database_url
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

### 3️⃣ 배포 확인

배포 후 다음 엔드포인트로 헬스체크:
- `https://your-app.railway.app/health`

## 🔧 설정 파일 위치

- **Nixpacks 설정**: `app/backend/nixpacks.toml`
- **Railway 설정**: `app/backend/railway.json`
- **패키지 설정**: `app/backend/package.json`

## ⚠️ 주의사항

1. **루트 디렉토리 설정 필수**: Railway에서 `app/backend`를 루트로 설정해야 함
2. **환경 변수 설정**: 데이터베이스 및 API 키 설정 필요
3. **포트 설정**: PORT=3001로 설정됨

---

*마지막 업데이트: 2025년 1월*
