# 네이버 키워드 파인더 v2.1 (모노레포)

네이버 검색에서 자동완성, 함께 많이 찾는, 인기주제 키워드를 수집하고 네이버 Open API를 활용한 검색 트렌드 분석을 제공하는 모노레포 프로젝트입니다.

## 🎉 v2.1 주요 업데이트 (2025-09-19)

### 🚀 새로운 기능
- ✅ **네이버 Open API 통합**: 검색 API + 데이터랩 트렌드 API
- ✅ **RelatedKeywordsTable UI**: 정렬 가능한 전문 키워드 분석 테이블
- ✅ **실시간 키워드 통계**: 네이버 API 데이터 기반 통계 생성
- ✅ **통합 검색 인터페이스**: 스크래핑과 API 데이터 분리된 UI
- ✅ **컴포넌트 재렌더링**: 새 검색 시 이전 결과 즉시 초기화

### 🔧 아키텍처 개선
- ✅ **종합분석 API 제거**: 복잡한 의존성 제거로 성능 향상
- ✅ **검색 트렌드 차트 숨김**: 핵심 데이터에 집중
- ✅ **타입 안전성 강화**: TypeScript 타입 매핑 완전 구현
- ✅ **데이터 플로우 최적화**: 네이버 API → 통계 생성 → UI 표시

### 🎨 UI/UX 개선
- ✅ **키워드 분석 테이블**: PC/모바일 검색량, 클릭수, CTR, 경쟁도 표시
- ✅ **정렬 기능**: 모든 컬럼 클릭으로 오름차순/내림차순 정렬
- ✅ **시각적 경쟁도**: 색상 배지로 경쟁도 레벨 표시
- ✅ **숫자 포맷팅**: 천 단위 구분자 및 소수점 표시

## 🎉 v2.0 기본 기능

- ✅ **레이어드 패턴 아키텍처**: Router → Controller → Service → DAO
- ✅ **모듈별 구조 분리**: 키워드, 네이버API, 스크래핑, 통계
- ✅ **통합 데이터베이스 관리**: 중복 제거 및 성능 최적화
- ✅ **환경변수 통일**: `DB_*` 형식으로 일관성 확보
- ✅ **코드 품질 개선**: ESLint, Prettier 적용

## 🏗️ 프로젝트 구조

```
keyword-finder/
├── packages/
│   ├── backend/          # Node.js 백엔드 v2.0 (레이어드 패턴 + 모듈화)
│   │   ├── src/
│   │   │   ├── app.js           # 메인 서버
│   │   │   ├── modules/         # 기능별 모듈
│   │   │   │   ├── keywords/    # 키워드 관리
│   │   │   │   ├── naver-api/   # 네이버 API
│   │   │   │   ├── scraping/    # 스크래핑
│   │   │   │   └── stats/       # 통계
│   │   │   └── shared/          # 공통 기능
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

### 2. 환경 변수 설정 (v2.0 업데이트)
백엔드 폴더에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 데이터베이스 설정 (통일된 환경변수)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=keyword_finder
DB_PORT=3306
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

### 웹 인터페이스 (v2.1 업데이트)
1. 브라우저에서 `http://localhost:3002` 접속 (Next.js 15)
2. 검색어 입력 후 **"🔍 검색하기"** 버튼 클릭
3. 네이버 API 기반 실시간 분석 결과 확인:
   - **네이버 검색 결과**: 블로그 포스트 목록
   - **키워드 분석 통계**: PC/모바일 검색량, 클릭수, CTR, 경쟁도
   - **연관 키워드 테이블**: 정렬 가능한 상세 분석 데이터
   - **스크래핑된 키워드**: DB에 저장된 수집 데이터

### 키워드 수집 (스크래핑)
- **"키워드 수집 (스크래핑)"** 버튼으로 별도 실행
- 네이버 자동완성, 함께 많이 찾는, 인기주제 키워드 수집
- 수집된 데이터는 데이터베이스에 저장

### CLI 사용
```bash
# 기본 사용법
cd packages/backend
node src/index.js "맛집"

# 옵션 사용
node src/index.js "카페" --headless=false --max-pages=2 --no-db
```

### API 사용 (v2.1 업데이트)
```bash
# 네이버 검색 API (새로운 기능)
curl -X POST http://localhost:3001/api/naver/search \
  -H "Content-Type: application/json" \
  -d '{"query": "맛집", "display": 10, "sort": "sim"}'

# 네이버 데이터랩 트렌드 API (새로운 기능)
curl -X POST http://localhost:3001/api/naver/datalab \
  -H "Content-Type: application/json" \
  -d '{"startDate": "2024-01-01", "endDate": "2024-12-31", "timeUnit": "month", "keywordGroups": [{"groupName": "맛집", "keywords": ["맛집"]}]}'

# 통합 데이터 조회 (새로운 기능)
curl "http://localhost:3001/api/naver/integrated-data/맛집"

# 키워드 스크래핑 (기존 기능)
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

#### 기존 스크래핑 데이터
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

#### 새로운 네이버 API 데이터 (v2.1)
```typescript
// 연관 키워드 분석 데이터
interface RelatedKeyword {
  relKeyword: string;           // 키워드명
  monthlyPcQcCnt: number;       // PC 월간 검색량
  monthlyMobileQcCnt: number;   // 모바일 월간 검색량
  monthlyAvePcClkCnt: number;   // PC 월간 평균 클릭수
  monthlyAveMobileClkCnt: number; // 모바일 월간 평균 클릭수
  monthlyAvePcCtr: number;      // PC 월간 평균 CTR
  monthlyAveMobileCtr: number;  // 모바일 월간 평균 CTR
  plAvgDepth: number;           // 평균 페이지 깊이
  compIdx: string;              // 경쟁도 지수
}

// 키워드 통계 데이터
interface KeywordStatistics {
  searchVolume: {
    pc: StatisticsData;
    mobile: StatisticsData;
    total: StatisticsData;
  };
  clickCount: {
    pc: StatisticsData;
    mobile: StatisticsData;
  };
  ctr: {
    pc: StatisticsData;
    mobile: StatisticsData;
  };
  competition: CompetitionAnalysis;
}

// 통계 세부 데이터
interface StatisticsData {
  label: string;
  unit: string;
  count: number;
  min: number | string;
  max: number | string;
  average: number | string;
  median: number | string;
  q1: number | string;
  q3: number | string;
  standardDeviation: number | string;
}
```

## 🔧 기술 스택

### 백엔드 (v2.1 업데이트)
- **Node.js** - 런타임
- **Express** - API 서버
- **Playwright** - 웹 스크래핑
- **MySQL/PostgreSQL** - 데이터베이스
- **TypeORM** - ORM 및 데이터베이스 관리
- **네이버 Open API** - 검색 API + 데이터랩 트렌드 API
- **Axios** - HTTP 클라이언트

### 프론트엔드 (v2.1 업데이트)
- **Next.js 15** - React 프레임워크 (Turbopack)
- **TypeScript** - 타입 안전성
- **Emotion** - CSS-in-JS 스타일링
- **Axios** - HTTP 클라이언트
- **React Hooks** - 상태 관리 (useState, useMemo, useCallback)
- **Custom Hooks** - 재사용 가능한 로직

### 새로운 컴포넌트 (v2.1)
- **RelatedKeywordsTable** - 정렬 가능한 키워드 분석 테이블
- **SearchAnalytics** - 통합 분석 결과 표시
- **SearchContainer** - 검색 로직 통합 관리
- **TrendLineChart** - 검색 트렌드 시각화 (숨김 처리)

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