# 🚀 Keyword Finder API 엔드포인트 전체 목록

## 📋 개요
네이버 키워드 수집기의 모든 API 엔드포인트를 정리한 문서입니다.

---

## 🏥 Health Module (`/health`)

### 기본 헬스체크
- **GET** `/health`
  - **설명**: 서비스 전반적인 상태 확인
  - **응답**: 상태, 타임스탬프, 업타임 정보

### 시스템 모니터링
- **GET** `/health/circuit-breaker`
  - **설명**: 서킷 브레이커 상태 조회
  - **응답**: 모든 서킷 브레이커의 현재 상태

- **GET** `/health/rate-limit`
  - **설명**: Rate Limit 상태 조회
  - **응답**: 현재 활성화된 Rate Limit 상태

- **GET** `/health/api-metrics`
  - **설명**: API 메트릭 종합 조회
  - **응답**: 서킷 브레이커 + Rate Limit 통계

### 시스템 제어
- **GET** `/health/reset-circuit-breaker/:key`
  - **설명**: 특정 서킷 브레이커 리셋
  - **파라미터**: `key` - 리셋할 서킷 브레이커 키

- **GET** `/health/reset-rate-limit/:key`
  - **설명**: 특정 Rate Limit 리셋
  - **파라미터**: `key` - 리셋할 Rate Limit 키

---

## 🔍 Naver API Module (`/naver`)

### 블로그 검색
- **GET** `/naver/blog-search`
  - **설명**: 네이버 블로그 검색 (상위 10개)
  - **쿼리 파라미터**:
    - `query` (필수): 검색어
    - `display` (선택): 검색 결과 개수 (1-100)
    - `start` (선택): 검색 시작 위치 (1-1000)
    - `sort` (선택): 정렬 방식 (sim/date)
  - **Rate Limit**: 1분당 50회

### 콘텐츠 발행량 조회
- **GET** `/naver/content-counts/:query`
  - **설명**: 키워드 콘텐츠 발행량 조회
  - **파라미터**: `query` - 검색어
  - **Rate Limit**: 1분당 30회

- **POST** `/naver/content-counts-save`
  - **설명**: 콘텐츠 발행량 조회 및 저장
  - **Body**: `{ "query": "검색어" }`
  - **Rate Limit**: 1분당 20회

### 키워드 데이터 수집
- **POST** `/naver/single-keyword-full-data`
  - **설명**: 1개 키워드 전체 검색 결과 (블로그 + 트렌드)
  - **Body**: `SingleKeywordFullDataDto`
  - **Rate Limit**: 1분당 10회

- **POST** `/naver/multiple-keywords-limited-data`
  - **설명**: 5개 키워드 검색 결과 (월간검색량 + 누적발행량)
  - **Body**: `MultipleKeywordsLimitedDataDto`
  - **Rate Limit**: 1분당 15회

---

## 🕷️ Scraping Module (`/scraping`)

### 키워드 스크래핑
- **POST** `/scraping/scrape`
  - **설명**: 네이버에서 관련 키워드 스크래핑
  - **Body**: `ScrapeKeywordsDto`
  - **응답**: 스크래핑된 키워드 목록

### 로그 및 통계
- **GET** `/scraping/logs`
  - **설명**: 키워드 수집 로그 조회
  - **쿼리 파라미터**:
    - `query` (선택): 검색할 키워드
    - `page` (선택): 페이지 번호 (기본값: 1)
    - `limit` (선택): 페이지당 개수 (기본값: 20)

- **GET** `/scraping/stats`
  - **설명**: 스크래핑 통계 조회
  - **쿼리 파라미터**:
    - `days` (선택): 조회할 일수 (기본값: 7)

### 시스템 상태
- **GET** `/scraping/browser-pool/status`
  - **설명**: 브라우저 풀 상태 조회
  - **응답**: 브라우저 풀의 현재 상태

---

## 📊 Keyword Analysis Module (`/keyword-analysis`)

### 키워드 분석
- **POST** `/keyword-analysis/analyze/:keyword`
  - **설명**: 키워드 종합 분석 실행
  - **파라미터**: `keyword` - 분석할 키워드
  - **응답**: 분석 완료 결과

- **GET** `/keyword-analysis/analysis/:keyword`
  - **설명**: 저장된 키워드 분석 결과 조회
  - **파라미터**: `keyword` - 조회할 키워드
  - **응답**: 분석 결과 데이터

### 키워드 목록
- **GET** `/keyword-analysis/list`
  - **설명**: 분석 완료된 키워드 목록 조회
  - **응답**: 분석된 키워드들의 목록

---

## 🎯 Workflow Module (`/workflow`)

### 통합 워크플로우
- **POST** `/workflow/complete/:query`
  - **설명**: 키워드 분석 워크플로우 실행
  - **파라미터**: `query` - 분석할 키워드
  - **워크플로우 단계**:
    1. 스크래핑 실행 (smartblock, related_search)
    2. 스크래핑 데이터 DB 저장
    3. 네이버 API 1개 키워드 데이터 수집
    4. 콘텐츠 발행량 조회 및 저장
    5. 키워드 분석 데이터 저장
    6. 통합 결과 반환

### 워크플로우 상태
- **GET** `/workflow/health`
  - **설명**: 워크플로우 의존 서비스 상태 확인
  - **응답**: naverApi, scraping, keywordAnalysis 서비스 상태

---

## 🔧 Rate Limiting 정보

### 전역 설정
- **Naver API Module**: 1분당 100회 (기본)

### 세부 제한
- **블로그 검색**: 1분당 50회
- **콘텐츠 발행량 조회**: 1분당 30회
- **콘텐츠 발행량 저장**: 1분당 20회
- **단일 키워드 전체 데이터**: 1분당 10회
- **다중 키워드 제한 데이터**: 1분당 15회

---

## 📝 사용 예시

### 기본 헬스체크
```bash
curl -X GET "http://localhost:3000/health"
```

### 키워드 스크래핑
```bash
curl -X POST "http://localhost:3000/scraping/scrape" \
  -H "Content-Type: application/json" \
  -d '{"query": "맛집", "types": ["smartblock", "related_search"]}'
```

### 블로그 검색
```bash
curl -X GET "http://localhost:3000/naver/blog-search?query=맛집&display=10"
```

### 통합 워크플로우 실행
```bash
curl -X POST "http://localhost:3000/workflow/complete/맛집"
```

---

## 🏷️ 태그별 분류

- **health**: 시스템 상태 및 모니터링
- **naver-api**: 네이버 API 통합 서비스
- **scraping**: 웹 스크래핑 서비스
- **keyword-analysis**: 키워드 분석 서비스
- **Workflow**: 통합 워크플로우 서비스

---

## ⚠️ 주의사항

1. **Rate Limiting**: 각 API별로 제한이 다르므로 확인 후 사용
2. **데이터 저장**: 대부분의 API는 결과를 데이터베이스에 저장
3. **에러 처리**: 모든 API는 표준화된 에러 응답 제공
4. **로깅**: 모든 요청과 응답이 로깅됨

---

*📅 마지막 업데이트: 2025년 1월*
