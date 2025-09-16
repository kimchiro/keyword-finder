# 네이버 키워드 수집기

네이버 통합검색에서 **자동완성**, **함께 많이 찾는**, **인기주제**, **연관검색어** 키워드를 자동으로 수집하는 도구입니다.

## 🎯 주요 기능

- ✅ **4가지 키워드 모듈** 수집
  - 자동완성 (검색창 실시간 추천)
  - 함께 많이 찾는 (검색 결과 상단)
  - 인기주제 (검색 결과 상단)
  - 연관검색어 (2페이지 하단 공식 연관검색어) ✨

- ✅ **안정적인 데이터 수집**
  - Playwright 기반 브라우저 자동화
  - 랜덤 딜레이로 봇 탐지 방지
  - 페이지네이션/캐러셀 자동 처리
  - 2페이지 자동 이동 및 연관검색어 수집

- ✅ **데이터 저장 및 관리**
  - JSON 파일 자동 저장
  - MySQL/PostgreSQL 데이터베이스 연동
  - 중복 제거 및 데이터 정제

- ✅ **n8n 워크플로우 지원**
  - 자동화 스케줄링
  - 다양한 알림 연동 (Slack, 이메일 등)
  - 구글 시트 백업

## 🚀 빠른 시작

### 1. 설치

```bash
# 프로젝트 클론
git clone <repository-url>
cd keyword-finder

# 의존성 설치
npm install

# Playwright 브라우저 설치
npx playwright install
```

### 2. 환경 설정

```bash
# 환경변수 파일 생성
cp env.example .env

# .env 파일 편집 (데이터베이스 정보 입력)
```

### 3. 데이터베이스 설정

```bash
# 데이터베이스 테이블 생성
npm run setup-db
```

### 4. 실행

```bash
# 기본 실행
npm start "맛집"

# 옵션과 함께 실행
node src/index.js "여행" --headless=false --max-pages=2
```

## 📋 사용법

### 기본 명령어

```bash
node src/index.js <검색어> [옵션]
```

### 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--headless=true/false` | 브라우저 헤드리스 모드 | `true` |
| `--max-pages=N` | 페이지당 최대 수집 페이지 수 | `3` |
| `--timeout=N` | 대기 시간 (ms) | `5000` |
| `--output-dir=PATH` | 출력 디렉토리 | `./output` |
| `--no-db` | 데이터베이스 저장 건너뛰기 | - |

### 사용 예시

```bash
# 기본 수집 (4가지 키워드 타입 모두 수집)
node src/index.js "맛집"

# 브라우저 화면 보면서 수집 (연관검색어 수집 과정 확인)
node src/index.js "여행" --headless=false

# 더 많은 페이지 수집
node src/index.js "카페" --max-pages=5

# JSON만 저장 (DB 저장 안함)
node src/index.js "쇼핑" --no-db

# 연관검색어 포함 전체 수집 테스트
node src/index.js "정부지원금" --headless=false
```

### 📊 수집 결과 예시

```bash
🎉 정부지원금 키워드 수집 성공!
📊 수집 결과:
   총 키워드: 20개
   자동완성: 10개
   함께 많이 찾는: 0개
   인기주제: 0개
   연관검색어: 10개 ✨
   실행시간: 24.79초
   카테고리별:
     자동완성: 10개
     일반: 10개
💾 저장 위치: output/naver_keywords_정부지원금_2025-09-16T08-21.json
```

## 📊 수집 데이터 구조

```json
{
  "query": "맛집",
  "keyword_type": "autosuggest",
  "category": "일반",
  "text": "맛집 추천",
  "href": "https://search.naver.com/...",
  "imageAlt": null,
  "rank": 1,
  "grp": 1,
  "created_at": "2024-01-01T09:00:00.000Z"
}
```

### 필드 설명

- `query`: 기준 검색어
- `keyword_type`: 키워드 타입 (`autosuggest`, `togetherSearched`, `hotTopics`, `relatedKeywords`)
- `category`: 키워드 카테고리 (자동 분류)
- `text`: 키워드 텍스트
- `href`: 관련 링크 (있는 경우)
- `imageAlt`: 이미지 대체 텍스트 (인기주제에서 사용)
- `rank`: 섹션 내 순위
- `grp`: 페이지/슬라이드 그룹 번호
- `created_at`: 수집 시간

## 🗄️ 데이터베이스 스키마

```sql
CREATE TABLE naver_keywords (
  id SERIAL PRIMARY KEY,
  query VARCHAR(100) NOT NULL,
  keyword_type VARCHAR(50) NOT NULL,     -- autosuggest / togetherSearched / hotTopics / relatedKeywords
  category VARCHAR(50) DEFAULT '일반',    -- 키워드 카테고리 (자동 분류)
  text VARCHAR(255) NOT NULL,
  href TEXT,
  imageAlt TEXT,
  rank INT NOT NULL,
  grp INT DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 성능 최적화 인덱스
CREATE INDEX idx_naver_keywords_query ON naver_keywords(query);
CREATE INDEX idx_naver_keywords_type ON naver_keywords(keyword_type);
CREATE INDEX idx_naver_keywords_category ON naver_keywords(category);
CREATE INDEX idx_naver_keywords_query_type ON naver_keywords(query, keyword_type);
```

## 🤖 n8n 자동화

### 워크플로우 설치

1. n8n 관리 페이지에서 워크플로우 가져오기
2. `n8n-workflows/naver-keyword-collector.json` 파일 사용
3. 경로 및 연결 정보 수정

### 주요 설정

- **실행 스케줄**: 매일 오전 9시 (수정 가능)
- **데이터베이스**: MySQL/PostgreSQL 연결
- **알림**: Slack, 이메일 등
- **백업**: 구글 시트 자동 저장

자세한 설정 방법은 [`n8n-workflows/README.md`](n8n-workflows/README.md)를 참고하세요.

## 🆕 최신 업데이트 (v2.0)

### ✨ 연관검색어 수집 기능 추가
- **2페이지 자동 이동**: 페이지네이션 버튼 자동 클릭
- **공식 연관검색어**: 네이버 하단 연관검색어 섹션에서 수집
- **정확한 DOM 탐지**: `section.sc_new.sp_related#nx_footer_related_keywords` 섹션 탐지
- **다중 셀렉터 지원**: 여러 CSS 셀렉터로 안정적 키워드 추출

### 🔧 모듈화 리팩토링
- **Collector 패턴**: 각 키워드 타입별 독립적인 수집기 모듈
- **Utils 분리**: 공통 유틸리티 함수들을 별도 모듈로 분리
- **데이터 처리 개선**: 전용 DataProcessor 클래스로 정제 및 통계 생성
- **확장성 향상**: 새로운 키워드 타입 추가가 용이한 구조

### 📊 향상된 데이터 품질
- **카테고리 자동 분류**: 키워드 내용 기반 자동 카테고리 분류
- **중복 제거 강화**: 더욱 정교한 중복 키워드 필터링
- **통계 정보 확장**: 카테고리별, 타입별 상세 통계 제공
- **실시간 로깅**: 수집 과정의 상세한 디버깅 로그

## 📈 검수 기준

프로젝트는 다음 기준을 만족하도록 설계되었습니다:

- ✅ **자동완성**: 최소 6개 키워드
- ✅ **함께 많이 찾는**: 최소 6개 키워드 (1~2 페이지)
- ✅ **인기주제**: 최소 8개 키워드 (1~2 슬라이드)
- ✅ **연관검색어**: 최소 8개 키워드 (2페이지 하단) ✨
- ✅ **중복 제거**: 0건
- ✅ **실행 시간**: 20~30초 내 (연관검색어 포함)
- ✅ **데이터 정제**: 공백 정리, 특수문자 필터링
- ✅ **카테고리 분류**: 자동 키워드 분류 시스템

## 🔧 개발 및 테스트

### 테스트 실행

```bash
# 테스트 스크립트 실행
npm test

# 또는 직접 실행
node src/test.js
```

### 디버깅

```bash
# 브라우저 화면 보면서 디버깅
node src/index.js "테스트" --headless=false

# 더 자세한 로그
DEBUG=* node src/index.js "테스트"
```

### 개발 환경 설정

```bash
# 개발 모드 실행
npm run dev

# 코드 변경 시 자동 재시작
npm install -g nodemon
nodemon src/index.js "테스트"
```

## 📁 프로젝트 구조

```
keyword-finder/
├── src/
│   ├── index.js                      # 메인 실행 파일
│   ├── scraper/
│   │   └── naver-scraper.js          # 메인 스크래퍼 (통합 관리)
│   ├── collectors/                   # 모듈화된 수집기들 ✨
│   │   ├── autosuggest-collector.js      # 자동완성 수집
│   │   ├── together-searched-collector.js # 함께 많이 찾는 수집
│   │   ├── hot-topics-collector.js       # 인기주제 수집
│   │   └── related-keywords-collector.js # 연관검색어 수집 ✨
│   ├── utils/                        # 유틸리티 모듈 ✨
│   │   ├── helpers.js                    # 공통 헬퍼 함수
│   │   └── data-processor.js             # 데이터 처리 및 정제
│   └── database/
│       ├── connection.js             # DB 연결 및 저장
│       └── setup.js                  # DB 초기 설정
├── database/
│   └── schema.sql                    # DB 스키마
├── n8n-workflows/
│   ├── naver-keyword-collector.json  # n8n 워크플로우
│   └── README.md                     # n8n 설정 가이드
├── output/                           # JSON 파일 저장 디렉토리
├── package.json
├── env.example                       # 환경변수 예시
└── README.md
```

## ⚠️ 주의사항

### 법적 준수
- 네이버 robots.txt 및 이용약관 준수
- 로그인이나 개인정보 접근 금지
- 광고 클릭 등 상업적 행위 금지
- 과도한 요청 빈도 제한

### 기술적 제한
- 네이버 페이지 구조 변경 시 수정 필요
- 봇 탐지 시스템에 의한 차단 가능성
- 네트워크 상태에 따른 수집 실패 가능성

### 권장사항
- 적절한 딜레이 설정 (200~600ms)
- 헤드리스 모드 사용으로 리소스 절약
- 정기적인 코드 업데이트 및 모니터링

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참고하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면:

1. GitHub Issues에 문제 보고
2. 코드 리뷰 및 개선 제안 환영
3. 새로운 기능 요청

---

**⚡ 빠르고 안정적인 네이버 키워드 수집을 경험해보세요!**
