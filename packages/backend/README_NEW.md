# 키워드 파인더 백엔드 v2.0

네이버 검색 키워드 수집 및 분석을 위한 백엔드 API 서버입니다.

## 🏗️ 아키텍처

### 레이어드 패턴 구조

```
src/
├── app.js                 # 메인 애플리케이션 서버
├── modules/               # 기능별 모듈
│   ├── keywords/          # 키워드 관리 모듈
│   │   ├── routes/        # 라우터
│   │   ├── controllers/   # 컨트롤러
│   │   ├── services/      # 비즈니스 로직
│   │   └── dao/          # 데이터 액세스
│   ├── naver-api/        # 네이버 API 모듈
│   ├── scraping/         # 스크래핑 모듈
│   └── stats/            # 통계 모듈
├── shared/               # 공통 모듈
│   ├── database/         # 데이터베이스 연결
│   ├── middleware/       # 미들웨어
│   └── utils/           # 유틸리티
├── scraper/             # 스크래핑 엔진
├── collectors/          # 데이터 수집기
└── utils/              # 레거시 유틸리티
```

## 🚀 시작하기

### 1. 환경 설정

```bash
# 환경 변수 파일 생성
cp env.example .env

# 필요한 환경 변수 설정
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=keyword_finder
```

### 2. 데이터베이스 설정

```bash
# 데이터베이스 테이블 생성
npm run setup-db
```

### 3. 서버 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start

# 스크래핑만 실행
npm run scraper
```

## 📋 API 엔드포인트

### 🔍 키워드 관리 (`/api/keywords`)

- `GET /` - 키워드 목록 조회
- `GET /stats` - 키워드 통계 조회
- `POST /` - 키워드 저장
- `DELETE /:query` - 키워드 삭제

### 🌐 네이버 API (`/api/naver`)

- `POST /search` - 네이버 블로그 검색
- `POST /datalab` - 데이터랩 트렌드 조회
- `POST /comprehensive-analysis` - 종합 분석
- `GET /search-results/:query` - 저장된 검색 결과 조회
- `GET /trend-data/:query` - 저장된 트렌드 데이터 조회
- `GET /integrated-data/:query` - 통합 데이터 조회
- `DELETE /cache` - 캐시 정리

### 🕷️ 스크래핑 (`/api/scraping`)

- `POST /scrape` - 키워드 스크래핑 실행
- `POST /batch` - 배치 스크래핑
- `GET /keywords/:query` - 스크래핑된 키워드 조회
- `GET /status/:query` - 스크래핑 상태 확인
- `POST /test` - 테스트 스크래핑

### 📊 통계 (`/api/stats`)

- `GET /` - 대시보드 통계
- `GET /keyword/:query` - 키워드별 통계
- `GET /system` - 시스템 통계

## 🔧 주요 기능

### 1. 키워드 스크래핑
- 네이버 자동완성 키워드
- 함께 많이 찾는 키워드
- 인기주제 키워드
- 연관검색어

### 2. 네이버 API 통합
- 블로그 검색 API
- 데이터랩 통합검색어 트렌드
- 검색광고 키워드 도구
- 종합 분석 (모든 API 데이터 통합)

### 3. 데이터 관리
- MySQL 데이터베이스 저장
- TypeORM 기반 데이터 액세스
- 캐시 시스템 (메모리 + DB)
- 자동 데이터 정제

### 4. 통계 및 분석
- 실시간 대시보드 통계
- 키워드별 상세 분석
- 시스템 성능 모니터링

## 🛠️ 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: TypeORM
- **Scraping**: Playwright
- **HTTP Client**: Axios
- **Process Manager**: Nodemon

## 📁 모듈 구조

### Keywords Module
- **DAO**: 키워드 데이터 액세스
- **Service**: 키워드 비즈니스 로직
- **Controller**: HTTP 요청 처리
- **Routes**: API 라우팅

### Naver API Module
- **DAO**: 네이버 API 데이터 관리
- **Service**: API 호출 및 캐싱 로직
- **Controller**: API 요청/응답 처리
- **Routes**: 네이버 API 라우팅

### Scraping Module
- **DAO**: 스크래핑 데이터 저장
- **Service**: 스크래핑 실행 및 관리
- **Controller**: 스크래핑 API 처리
- **Routes**: 스크래핑 라우팅

### Stats Module
- **Service**: 통계 데이터 생성
- **Controller**: 통계 API 처리
- **Routes**: 통계 라우팅

## 🔄 마이그레이션 가이드

### v1.0에서 v2.0으로

1. **기존 코드 백업**
   ```bash
   # 기존 server.js는 server.js.backup으로 저장됨
   ```

2. **새로운 구조 적용**
   - 모든 기능이 모듈별로 분리됨
   - 레이어드 패턴 적용
   - 명확한 책임 분리

3. **API 호환성**
   - 기존 API 엔드포인트 유지
   - 새로운 모듈 기반 엔드포인트 추가

## 🚨 주의사항

- 네이버 API 키 설정 필수
- MySQL 데이터베이스 연결 필요
- 스크래핑 시 적절한 딜레이 설정 권장
- 프로덕션 환경에서는 환경 변수 보안 관리

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. 환경 변수 설정
2. 데이터베이스 연결
3. 네이버 API 키 유효성
4. 로그 파일 확인

---

**Version**: 2.0.0  
**Last Updated**: 2025-09-19
