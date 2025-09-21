# 네이버 키워드 파인더 v3.0 (모노레포)

네이버 검색에서 자동완성, 함께 많이 찾는, 인기주제 키워드를 수집하고 네이버 Open API를 활용한 검색 트렌드 분석을 제공하는 모노레포 프로젝트입니다.

## 🎉 v3.0 주요 업데이트 (2025-09-21)

### 🏗️ 아키텍처 대규모 리팩토링
- ✅ **관심사의 분리**: API 통신, 상태 관리, UI 컴포넌트 완전 분리
- ✅ **전역 공통 리소스**: `commons/` 폴더로 재사용 가능한 자원 중앙화
- ✅ **기능별 컴포넌트**: 각 기능을 독립적인 모듈로 구성
- ✅ **타입 안전성 강화**: `any` 타입 완전 제거, 100% TypeScript 커버리지
- ✅ **코드 품질 향상**: ESLint 에러 0건, 일관된 코딩 스타일

### 🚀 새로운 아키텍처 구조
```
src/
├── app/                    # Next.js App Router 페이지
├── commons/                # 전역 공통 리소스
│   ├── apis/              # API 통신 함수들
│   ├── components/        # 재사용 가능한 공통 컴포넌트
│   ├── enums/             # 전역 상수/열거형
│   ├── hooks/             # 전역 상태 관리 훅
│   └── types/             # 전역 타입 정의
└── components/            # 기능별 컴포넌트
    └── [FeatureName]/     # 기능명 폴더
        ├── apis/          # 기능별 API (선택적)
        ├── hooks/         # 기능별 훅 (선택적)
        ├── types/         # 기능별 타입
        ├── utils/         # 기능별 유틸리티
        ├── index.tsx      # 메인 컴포넌트
        └── styles.ts      # 스타일 정의
```

### 🎯 핵심 개선사항
- ✅ **API 함수 분리**: `commons/apis/`에서 중앙 관리
- ✅ **순수 상태 관리**: `commons/hooks/`에서 React 상태만 담당
- ✅ **타입 중앙화**: `commons/types/`에서 일관된 타입 관리
- ✅ **컴포넌트 모듈화**: 각 기능별 독립적인 구조
- ✅ **개발 가이드라인**: `.cursor/rules/`에 체계적인 개발 규칙 정의

### 🔧 기술적 개선
- ✅ **통합 키워드 테이블**: 모든 데이터를 하나의 테이블로 통합 표시
- ✅ **키워드 트렌드 분석**: 상승/하락/신규/사라진 키워드 분석
- ✅ **랭킹 변화 추적**: 키워드 순위 변화 모니터링
- ✅ **카테고리별 통계**: 키워드 타입별 분포 분석
- ✅ **AI 인사이트**: 데이터 기반 자동 인사이트 생성

## 🎉 v2.1 기존 기능

### 🚀 네이버 Open API 통합
- ✅ **네이버 검색 API**: 블로그 검색 결과 제공
- ✅ **네이버 데이터랩 API**: 검색 트렌드 분석
- ✅ **통합 데이터 조회**: 스크래핑 + API 데이터 결합
- ✅ **실시간 키워드 통계**: PC/모바일 검색량, 클릭수, CTR, 경쟁도

### 🎨 UI/UX 개선
- ✅ **키워드 분석 테이블**: 정렬 가능한 상세 분석 데이터
- ✅ **시각적 경쟁도**: 색상 배지로 경쟁도 레벨 표시
- ✅ **숫자 포맷팅**: 천 단위 구분자 및 소수점 표시
- ✅ **반응형 디자인**: PC/모바일 최적화

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
│   │   │   │   └── scraping/    # 스크래핑
│   │   │   └── shared/          # 공통 기능
│   │   └── .cursor/rules/       # 백엔드 개발 규칙
│   ├── frontend/         # Next.js 프론트엔드 v3.0 (새로운 아키텍처)
│   │   ├── src/
│   │   │   ├── app/             # Next.js App Router
│   │   │   ├── commons/         # 전역 공통 리소스
│   │   │   │   ├── apis/        # API 통신 함수
│   │   │   │   ├── components/  # 공통 컴포넌트
│   │   │   │   ├── enums/       # 전역 상수
│   │   │   │   ├── hooks/       # 전역 훅
│   │   │   │   └── types/       # 전역 타입
│   │   │   └── components/      # 기능별 컴포넌트
│   │   │       ├── SearchResults/
│   │   │       ├── BlogSearchResults/
│   │   │       ├── UnifiedKeywordTable/
│   │   │       └── keyword-search/
│   │   └── .cursor/rules/       # 프론트엔드 개발 규칙
│   └── shared/           # 공통 타입 정의 (제거됨)
├── package.json          # 모노레포 루트 설정
└── README.md
```

## 🎯 새로운 아키텍처 특징

### 📁 관심사의 분리 (Separation of Concerns)

#### 1. API 통신 (`commons/apis/`)
```typescript
// 순수한 HTTP 통신만 담당
export const scrapeKeywords = async (query: string, options: ScrapingOptions) => {
  return await axios.post('/api/scraping/scrape', { query, options });
};
```

#### 2. 상태 관리 (`commons/hooks/`)
```typescript
// React 상태와 라이프사이클만 담당
export const useKeywordScraping = () => {
  const [state, setState] = useState();
  const scrapeKeywords = async (query, options) => {
    const result = await apiScrapeKeywords(query, options);
    setState(result);
  };
};
```

#### 3. 타입 정의 (`commons/types/`)
```typescript
// 중앙 집중식 타입 관리
export interface ScrapingResult {
  success: boolean;
  keywords: KeywordData[];
  // ...
}
```

#### 4. 컴포넌트 (`components/[Feature]/`)
```typescript
// 기능별 독립적인 컴포넌트
export const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  // UI 로직만 담당
};
```

### 🎯 개발 가이드라인

#### 새로운 기능 추가 시 판단 기준:

1. **API 함수 배치**
   - 전역 재사용 → `commons/apis/`
   - 기능별 전용 → `components/[Feature]/apis/`

2. **훅 배치**
   - 순수 상태 관리 → `commons/hooks/`
   - 기능별 비즈니스 로직 → `components/[Feature]/hooks/`

3. **타입 배치**
   - API 응답/공유 타입 → `commons/types/`
   - 컴포넌트 Props → `components/[Feature]/types/`

4. **컴포넌트 배치**
   - 재사용 가능한 UI → `commons/components/`
   - 기능별 특화 → `components/[Feature]/`

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
백엔드 폴더에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 데이터베이스 설정
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=keyword_finder
DB_PORT=3306

# 네이버 Open API (선택사항)
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret

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

### 웹 인터페이스 (v3.0 업데이트)
1. 브라우저에서 `http://localhost:3000` 접속
2. 검색어 입력 후 **"🔍 검색하기"** 버튼 클릭
3. 통합 분석 결과 확인:
   - **통합 키워드 테이블**: 모든 키워드 데이터를 하나의 테이블로 표시
   - **트렌드 분석**: 상승/하락/신규/사라진 키워드 분석
   - **랭킹 변화**: 키워드 순위 변화 추적
   - **카테고리 통계**: 키워드 타입별 분포
   - **AI 인사이트**: 데이터 기반 자동 분석 결과

### 키워드 수집 (스크래핑)
- **"키워드 수집 (스크래핑)"** 버튼으로 별도 실행
- 네이버 자동완성, 함께 많이 찾는, 인기주제 키워드 수집
- 수집된 데이터는 데이터베이스에 저장

### API 사용 (v3.0 업데이트)
```bash
# 키워드 스크래핑
curl -X POST http://localhost:3001/api/scraping/scrape \
  -H "Content-Type: application/json" \
  -d '{"query": "맛집", "options": {"headless": true, "maxPagesPerModule": 2}}'

# 네이버 블로그 검색
curl -X GET "http://localhost:3001/api/naver/blog-search?query=맛집&display=10&sort=sim"

# 네이버 데이터랩 트렌드
curl -X POST http://localhost:3001/api/naver/datalab \
  -H "Content-Type: application/json" \
  -d '{"startDate": "2024-01-01", "endDate": "2024-12-31", "timeUnit": "month", "keywordGroups": [{"groupName": "맛집", "keywords": ["맛집"]}]}'

# 통합 데이터 조회 (트렌드 분석 포함)
curl "http://localhost:3001/api/naver/integrated-data/맛집"

# 저장된 키워드 조회
curl "http://localhost:3001/api/keywords?query=맛집&limit=50"
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
npm run lint         # ESLint 검사
```

### 빌드 및 배포
```bash
# 전체 빌드
npm run build

# 프로덕션 실행
npm run start:server    # 백엔드 API 서버
npm run start:frontend  # 프론트엔드 서버
```

## 📊 데이터 구조

### 키워드 타입
- **autosuggest**: 자동완성 키워드
- **togetherSearched**: 함께 많이 찾는 키워드  
- **hotTopics**: 인기주제 키워드

### 스크래핑 데이터
```typescript
interface ScrapedKeyword {
  keyword_type: string;
  text: string;
  rank: number;
  grp: number;
  category: string;
  created_at: string;
}
```

### 트렌드 분석 데이터 (v3.0 신규)
```typescript
interface KeywordTrendAnalysis {
  rising: ScrapedKeyword[];      // 상승 키워드
  falling: ScrapedKeyword[];     // 하락 키워드
  stable: ScrapedKeyword[];      // 안정 키워드
  new: ScrapedKeyword[];         // 신규 키워드
  disappeared: ScrapedKeyword[]; // 사라진 키워드
}

interface RankingComparison {
  improved: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }>;
  declined: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }>;
  maintained: Array<{ keyword: ScrapedKeyword; rank: number }>;
}

interface CategoryStats {
  [key: string]: {
    count: number;
    percentage: number;
    topKeywords: ScrapedKeyword[];
  };
}
```

## 🔧 기술 스택

### 백엔드
- **Node.js** - 런타임
- **Express** - API 서버
- **Playwright** - 웹 스크래핑
- **MySQL/PostgreSQL** - 데이터베이스
- **TypeORM** - ORM 및 데이터베이스 관리
- **네이버 Open API** - 검색 API + 데이터랩 트렌드 API
- **Axios** - HTTP 클라이언트

### 프론트엔드 (v3.0 업데이트)
- **Next.js 15** - React 프레임워크 (Turbopack)
- **TypeScript** - 타입 안전성 (100% 커버리지)
- **Emotion** - CSS-in-JS 스타일링
- **Axios** - HTTP 클라이언트
- **React Hooks** - 상태 관리
- **Custom Hooks** - 재사용 가능한 로직

### 새로운 아키텍처 컴포넌트 (v3.0)
- **SearchForm** - 공통 검색 폼 (`commons/components/`)
- **SearchResults** - 스크래핑 결과 표시 (`components/SearchResults/`)
- **BlogSearchResults** - 네이버 블로그 검색 결과 (`components/BlogSearchResults/`)
- **UnifiedKeywordTable** - 통합 키워드 테이블 (`components/UnifiedKeywordTable/`)
- **KeywordSearch** - 통합 검색 컨테이너 (`components/keyword-search/`)

### 전역 훅 (v3.0)
- **useKeywordScraping** - 키워드 스크래핑 상태 관리
- **useNaverSearch** - 네이버 검색 API 상태 관리
- **useKeywordAnalysis** - 키워드 분석 및 트렌드 분석

### 모노레포
- **npm workspaces** - 패키지 관리
- **concurrently** - 동시 실행

## 📋 검수 기준

- 자동완성: 최소 6개
- 함께 많이 찾는: 최소 6개
- 인기주제: 최소 8개
- 실행시간: 12초 이내
- 중복 제거 완료
- ESLint 에러: 0건
- TypeScript 타입 커버리지: 100%

## 🎯 개발 가이드라인

### Cursor Rules
프로젝트에는 체계적인 개발 가이드라인이 정의되어 있습니다:

- **`packages/frontend/.cursor/rules/commons.mdc`**: 공통 개발 규칙
- **`packages/frontend/.cursor/rules/frontend-architecture.mdc`**: 상세 아키텍처 가이드
- **`packages/frontend/.cursor/rules/openapi.mdc`**: 네이버 Open API 관련 규칙

### 금지사항
- `any` 타입 사용 금지
- 직접적인 axios 사용 금지 (commons/apis 사용)
- 인라인 스타일 사용 금지 (styles.ts 사용)
- 절대 경로 없는 상대 경로 금지 (`@/` alias 사용)

### 베스트 프랙티스
- 타입 우선 개발 (Type-First Development)
- 단일 책임 원칙 (Single Responsibility Principle)
- 관심사의 분리 (Separation of Concerns)
- 재사용성 고려 (commons vs components 적절한 배치)
- 일관된 export 패턴 (index.ts를 통한 통합 export)

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.