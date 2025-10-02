#!/bin/bash
# Railway 백엔드 배포 스크립트

echo "🚀 백엔드 배포 준비 중..."

# 백엔드 디렉토리로 이동
cd app/backend

# 의존성 설치
echo "📦 의존성 설치 중..."
npm ci --only=production

# 빌드 실행
echo "🔨 빌드 실행 중..."
npm run build

# 서버 시작
echo "🎯 서버 시작..."
node dist/main.js
