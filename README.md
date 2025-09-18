# 네이버 키워드 파인더 (모노레포)

네이버 검색에서 자동완성, 함께 많이 찾는, 인기주제 키워드를 수집하는 모노레포 프로젝트입니다.

## 🏗️ 프로젝트 구조

```
keyword-finder/
├── packages/
│   ├── backend/          # Node.js 백엔드 (Playwright 스크래퍼 + Express API)
│   ├── frontend/         # Next.js 프론트엔드 (TypeScript + Emotion)
│   └── shared/           # 공통 타입 정의
├── package.json          # 모노레포 루트 설정
└── README.md
```

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
백엔드 폴더에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 데이터베이스 설정 (MySQL 또는 PostgreSQL)
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=naver_keywords

# 또는 PostgreSQL 사용시
# DB_TYPE=postgres
# POSTGRES_HOST=localhost
# POSTGRES_PORT=5432
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=your_password
# POSTGRES_DATABASE=naver_keywords

# 서버 설정
PORT=3001
FRONTEND_URL=http://localhost:3000

# 스크래핑 기본 설정
HEADLESS=true
MAX_PAGES_PER_MODULE=3
WAIT_TIMEOUT_MS=5000
SLEEP_MIN_MS=200
SLEEP_MAX_MS=600
OUTPUT_DIR=./output
```

### 3. 데이터베이스 설정
```bash
npm run setup-db
```

### 4. 개발 서버 실행
```bash
# 백엔드 API 서버 + 프론트엔드 개발 서버 동시 실행
npm run dev
```

개별 실행:
```bash
# 백엔드 API 서버만
npm run server:dev

# 프론트엔드만
npm run dev:frontend

# 백엔드 스크래퍼만 (CLI)
npm run scrape "검색어"
```

## 📱 사용법

### 웹 인터페이스
1. 브라우저에서 `http://localhost:3000` 접속
2. 검색어 입력 후 "키워드 수집" 버튼 클릭
3. 수집된 키워드 결과 확인

### CLI 사용
```bash
# 기본 사용법
cd packages/backend
node src/index.js "맛집"

# 옵션 사용
node src/index.js "카페" --headless=false --max-pages=2 --no-db
```

### API 사용
```bash
# 키워드 스크래핑
curl -X POST http://localhost:3001/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"query": "맛집", "options": {"headless": true, "maxPagesPerModule": 2}}'

# 저장된 키워드 조회
curl "http://localhost:3001/api/keywords?query=맛집&limit=50"

# 통계 조회
curl "http://localhost:3001/api/stats"
```

## 🛠️ 개발

### 패키지별 명령어

**백엔드:**
```bash
cd packages/backend
npm run server:dev    # API 서버 개발 모드
npm run dev          # CLI 스크래퍼
npm run test         # 테스트 실행
npm run setup-db     # 데이터베이스 설정
```

**프론트엔드:**
```bash
cd packages/frontend
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
```

**공통 타입:**
```bash
cd packages/shared
npm run build        # TypeScript 컴파일
npm run dev          # 감시 모드
```

### 빌드 및 배포
```bash
# 전체 빌드
npm run build

# 프로덕션 실행
npm run start:server    # 백엔드 API 서버
npm run start:frontend  # 프론트엔드 서버
```

## 📊 수집 데이터

### 키워드 타입
- **autosuggest**: 자동완성 키워드
- **togetherSearched**: 함께 많이 찾는 키워드  
- **hotTopics**: 인기주제 키워드

### 데이터 구조
```typescript
interface KeywordData {
  id?: number;
  query: string;           // 기준 검색어
  keyword_type: KeywordType;
  text: string;           // 키워드 텍스트
  href?: string;          // 관련 링크
  imageAlt?: string;      // 이미지 대체 텍스트
  rank: number;           // 순위
  grp: number;            // 페이지/그룹 번호
  created_at?: string;    // 수집 시간
}
```

## 🔧 기술 스택

### 백엔드
- **Node.js** - 런타임
- **Playwright** - 웹 스크래핑
- **Express** - API 서버
- **MySQL/PostgreSQL** - 데이터베이스

### 프론트엔드
- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Emotion** - CSS-in-JS 스타일링
- **Axios** - HTTP 클라이언트

### 모노레포
- **npm workspaces** - 패키지 관리
- **concurrently** - 동시 실행

## 📋 검수 기준

- 자동완성: 최소 6개
- 함께 많이 찾는: 최소 6개
- 인기주제: 최소 8개
- 실행시간: 12초 이내
- 중복 제거 완료

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.