# Workflow Module Tests

워크플로우 모듈의 포괄적인 테스트 코드입니다.

## 📁 테스트 파일 구조

```
workflow/
├── workflow.service.spec.ts          # 서비스 단위 테스트
├── workflow.controller.spec.ts       # 컨트롤러 단위 테스트  
├── workflow.integration.spec.ts      # 통합 테스트
├── jest.config.js                    # Jest 설정
├── test-setup.ts                     # 테스트 환경 설정
└── README.test.md                    # 테스트 문서
```

## 🧪 테스트 종류

### 1. 단위 테스트 (Unit Tests)

#### WorkflowService 테스트
- ✅ **성공 케이스**
  - 완전한 워크플로우 실행 성공
  - 스마트블록 키워드 5개 미만 시 연관검색어 보완
  - 추출된 키워드 5개 초과 시 두 번째 배치 API 호출
  - 빠른 분석 성공
  - 스크래핑 전용 워크플로우 성공
  - 워크플로우 상태 체크 성공

- ❌ **실패 케이스**
  - 스크래핑 실패 시 에러 반환
  - 스크래핑 데이터 없음 시 에러 반환
  - 네이버 API 호출 실패 시 처리
  - DB 저장 실패 시 에러 반환
  - 키워드 추출 실패 시 원본 키워드만으로 진행

#### WorkflowController 테스트
- ✅ **성공 케이스**
  - 완전한 워크플로우 실행 성공
  - 특수문자 포함 키워드 처리
  - 긴 키워드 처리
  - 빠른 분석 성공
  - 스크래핑 전용 워크플로우 성공
  - 워크플로우 상태 체크 성공

- ❌ **실패 케이스**
  - 워크플로우 서비스 실패 시 HttpException
  - 예외 발생 시 HttpException
  - 빈 문자열/null 키워드 처리

### 2. 통합 테스트 (Integration Tests)

#### API 엔드포인트 테스트
- `POST /workflow/complete/:query` - 완전한 워크플로우
- `POST /workflow/quick/:query` - 빠른 분석
- `POST /workflow/scraping/:query` - 스크래핑 전용
- `GET /workflow/health` - 상태 체크

#### 성능 테스트
- 완전한 워크플로우: 30초 이내 응답
- 빠른 분석: 10초 이내 응답
- 상태 체크: 5초 이내 응답

#### 동시성 테스트
- 동시 요청 처리 능력 검증

## 🚀 테스트 실행 방법

### 전체 테스트 실행
```bash
# 워크플로우 모듈 테스트만 실행
npm test -- --testPathPattern=workflow

# 커버리지 포함 실행
npm test -- --testPathPattern=workflow --coverage

# 감시 모드로 실행
npm test -- --testPathPattern=workflow --watch
```

### 개별 테스트 실행
```bash
# 서비스 테스트만
npm test workflow.service.spec.ts

# 컨트롤러 테스트만  
npm test workflow.controller.spec.ts

# 통합 테스트만
npm test workflow.integration.spec.ts
```

### 특정 테스트 케이스 실행
```bash
# 성공 케이스만
npm test -- --testNamePattern="성공 케이스"

# 실패 케이스만
npm test -- --testNamePattern="실패 케이스"
```

## 📊 테스트 커버리지 목표

- **라인 커버리지**: 95% 이상
- **함수 커버리지**: 100%
- **브랜치 커버리지**: 90% 이상
- **구문 커버리지**: 95% 이상

## 🔍 테스트 시나리오

### 완전한 워크플로우 테스트 시나리오

```
1. 스크래핑 실행 (스마트블록 + 연관검색어)
   ├── 성공: 키워드 데이터 반환
   └── 실패: 에러 메시지 반환

2. DB 저장
   ├── 성공: 저장 완료
   └── 실패: 에러 발생

3. 키워드 추출 (rank 1-5)
   ├── 스마트블록 5개: 스마트블록만 사용
   ├── 스마트블록 3개: 연관검색어 2개 보완
   └── 키워드 없음: 빈 배열 반환

4. 네이버 API 호출
   ├── 원본 키워드 1개 호출
   ├── 첫 번째 배치 5개 호출
   └── 두 번째 배치 5개 호출 (필요시)

5. 분석 데이터 생성
   ├── 성공: 분석 결과 반환
   └── 실패: 에러 처리

6. 응답 반환
   ├── 성공: 완전한 데이터 구조
   └── 실패: 에러 메시지
```

## 🧩 Mock 데이터 예제

### 스크래핑 결과 Mock
```typescript
const mockScrapingResult = {
  query: '맛집',
  keywords: [
    {
      keyword: '맛집 추천',
      category: 'smartblock',
      rankPosition: 1,
      source: 'naver_smartblock'
    }
  ],
  totalCount: 1,
  scrapingTime: 2.847,
  timestamp: '2025-09-22T05:30:15.133Z'
};
```

### 네이버 API 결과 Mock
```typescript
const mockNaverApiResult = {
  success: true,
  data: {
    blogSearch: {
      total: 15420,
      items: [...]
    },
    datalab: {
      results: [...]
    }
  }
};
```

## ⚠️ 테스트 주의사항

1. **환경 변수**: 테스트 환경에서는 실제 API 호출을 하지 않도록 Mock 사용
2. **비동기 처리**: `async/await` 패턴 일관성 유지
3. **에러 처리**: 모든 예외 상황에 대한 테스트 케이스 포함
4. **데이터 검증**: 응답 데이터 구조와 타입 엄격 검증
5. **성능**: 테스트 실행 시간 최적화

## 🐛 디버깅 팁

### 테스트 실패 시 확인사항
1. Mock 데이터가 올바르게 설정되었는지 확인
2. 비동기 함수의 `await` 누락 여부 확인  
3. 예상 결과와 실제 결과 비교
4. 콘솔 로그로 중간 값 확인

### 자주 발생하는 오류
- `TypeError: Cannot read property of undefined`: Mock 데이터 구조 확인
- `Timeout`: 비동기 함수의 응답 시간 확인
- `HttpException`: 에러 처리 로직 확인

## 📈 테스트 결과 예시

```
 PASS  src/modules/workflow/workflow.service.spec.ts
 PASS  src/modules/workflow/workflow.controller.spec.ts  
 PASS  src/modules/workflow/workflow.integration.spec.ts

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        12.345 s
Coverage:    95.8% Lines, 100% Functions, 92.1% Branches
```

이 테스트 코드들은 워크플로우 모듈의 모든 기능을 포괄적으로 검증하며, 성공과 실패 시나리오를 모두 다룹니다.
