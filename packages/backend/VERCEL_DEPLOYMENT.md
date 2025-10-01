# Vercel 백엔드 배포 가이드

## 🚀 Vercel 배포 설정

### 1. 필수 환경변수 설정

Vercel 대시보드에서 다음 환경변수들을 설정해주세요:

#### 데이터베이스 설정
```
DB_HOST=your-database-host
DB_PORT=3306
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password
DB_DATABASE=keyword_finder
```

#### 네이버 API 설정
```
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
```

#### 애플리케이션 설정
```
NODE_ENV=production
PORT=3000
```

### 2. 배포 명령어

```bash
# 프로덕션 배포
npm run vercel:deploy

# 개발 환경 테스트
npm run vercel:dev
```

### 3. 빌드 과정

1. **소스 빌드**: `npm run build` - TypeScript를 JavaScript로 컴파일
2. **배포**: Vercel이 `dist/main.js`를 서버리스 함수로 실행

### 4. 주의사항

- **데이터베이스**: Vercel은 서버리스 환경이므로 외부 MySQL 데이터베이스가 필요합니다
- **파일 업로드**: 임시 파일 시스템만 사용 가능 (영구 저장 불가)
- **실행 시간**: 최대 30초 제한 (Hobby 플랜 기준)
- **콜드 스타트**: 첫 요청 시 초기화 시간이 필요할 수 있습니다

### 5. 권장 데이터베이스 서비스

- **PlanetScale**: MySQL 호환, 서버리스 친화적
- **AWS RDS**: 안정적인 관리형 MySQL
- **Google Cloud SQL**: 구글 클라우드 MySQL
- **Azure Database**: 마이크로소프트 MySQL

### 6. 배포 전 체크리스트

- [ ] 모든 환경변수 설정 완료
- [ ] 데이터베이스 연결 테스트
- [ ] 네이버 API 키 유효성 확인
- [ ] 로컬에서 빌드 테스트: `npm run build`
- [ ] 마이그레이션 실행: `npm run migrate`

### 7. 트러블슈팅

#### 빌드 실패 시
```bash
# 로컬에서 빌드 테스트
npm run build

# 타입 에러 확인
npx tsc --noEmit
```

#### 데이터베이스 연결 실패 시
- 환경변수 설정 확인
- 데이터베이스 서버 접근 권한 확인
- SSL 설정 필요 여부 확인

#### API 호출 실패 시
- 네이버 API 키 유효성 확인
- API 호출 제한 확인
- 도메인 등록 여부 확인
