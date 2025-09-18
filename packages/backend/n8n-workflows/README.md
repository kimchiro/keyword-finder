# n8n 워크플로우 설정 가이드

## 워크플로우 개요

이 워크플로우는 네이버 키워드 수집기를 자동화하여 정기적으로 키워드를 수집하고 데이터베이스에 저장합니다.

## 워크플로우 구성

1. **Cron Trigger**: 매일 오전 9시 실행 (수정 가능)
2. **Execute Command**: Playwright 스크립트 실행
3. **Read Binary File**: 생성된 JSON 파일 읽기
4. **Move Binary Data**: 바이너리 데이터를 JSON으로 변환
5. **Function**: JSON 배열을 개별 아이템으로 분할
6. **Database Insert**: MySQL/PostgreSQL에 데이터 저장
7. **Google Sheets**: 백업용 스프레드시트 저장 (선택사항)
8. **Slack Notification**: 완료 알림 (선택사항)

## 설치 및 설정

### 1. n8n 워크플로우 가져오기

```bash
# n8n 관리 페이지에서 워크플로우 가져오기
# 파일: naver-keyword-collector.json
```

### 2. 필수 설정 변경

#### Execute Command 노드
```bash
# command 필드를 실제 경로로 변경
cd /Users/kimdongeun/Desktop/keyword-finder && node src/index.js "맛집" --headless=true

# workingDirectory 필드도 실제 경로로 변경
/Users/kimdongeun/Desktop/keyword-finder
```

#### 검색어 설정
기본적으로 "맛집"으로 설정되어 있습니다. 다른 검색어를 사용하려면:
- Execute Command 노드의 command에서 "맛집" 부분을 원하는 검색어로 변경
- 또는 워크플로우 시작 부분에 Set 노드를 추가하여 동적으로 검색어 설정

### 3. 데이터베이스 연결 설정

#### MySQL 연결
1. n8n 관리 페이지 → Credentials → Add Credential
2. MySQL 선택
3. 연결 정보 입력:
   ```
   Host: localhost
   Port: 3306
   Database: naver_keywords
   User: your_username
   Password: your_password
   ```

#### PostgreSQL 연결
MySQL 노드를 PostgreSQL 노드로 변경하고 연결 정보 설정

### 4. 선택사항 설정

#### Google Sheets 백업
1. Google Sheets API 활성화
2. 서비스 계정 생성 및 키 다운로드
3. n8n에서 Google Sheets 연결 설정
4. 스프레드시트 ID 입력

#### Slack 알림
1. Slack 앱 생성 및 Bot Token 발급
2. n8n에서 Slack 연결 설정
3. 채널명 설정 (#keyword-alerts)

## 실행 스케줄 변경

Cron Trigger 노드에서 실행 주기를 변경할 수 있습니다:

```bash
# 매일 오전 9시
0 9 * * *

# 매주 월요일 오전 10시
0 10 * * 1

# 매시간 정각
0 * * * *

# 매일 오전 9시, 오후 6시
0 9,18 * * *
```

## 다중 검색어 처리

여러 검색어를 순차적으로 처리하려면:

1. **Set 노드 추가**: 검색어 배열 설정
   ```json
   {
     "queries": ["맛집", "여행", "카페", "쇼핑"]
   }
   ```

2. **Split In Batches 노드**: 배열을 개별 아이템으로 분할

3. **Execute Command 노드 수정**: 
   ```bash
   cd /path/to/keyword-finder && node src/index.js "{{ $json.query }}" --headless=true
   ```

## 모니터링 및 로그

### 실행 로그 확인
- n8n 관리 페이지 → Executions에서 실행 기록 확인
- 각 노드별 입력/출력 데이터 확인 가능

### 오류 처리
- Execute Command 노드에서 오류 발생 시 워크플로우 중단
- 오류 발생 시 Slack으로 알림 받으려면 Error Trigger 노드 추가

### 성능 최적화
- `--max-pages` 옵션으로 수집 범위 조절
- `--headless=true`로 브라우저 리소스 절약
- 실행 시간이 긴 경우 timeout 설정 조정

## 문제 해결

### 일반적인 문제들

1. **파일 경로 오류**
   - Execute Command의 workingDirectory 확인
   - JSON 파일 경로가 올바른지 확인

2. **데이터베이스 연결 실패**
   - 연결 정보 재확인
   - 데이터베이스 서버 상태 확인
   - 방화벽 설정 확인

3. **브라우저 실행 오류**
   - Playwright 브라우저 설치: `npx playwright install`
   - 시스템 의존성 설치: `npx playwright install-deps`

4. **메모리 부족**
   - `--headless=true` 옵션 사용
   - n8n 메모리 제한 증가

### 디버깅 팁

1. **단계별 테스트**
   - 각 노드를 개별적으로 실행하여 문제 지점 파악

2. **로그 확인**
   - Execute Command 노드의 stdout/stderr 확인
   - JSON 파일 내용 확인

3. **수동 실행**
   - 터미널에서 직접 스크립트 실행하여 문제 확인
   ```bash
   cd /path/to/keyword-finder
   node src/index.js "테스트" --headless=false
   ```

## 보안 고려사항

1. **환경변수 사용**
   - 데이터베이스 비밀번호 등은 n8n 환경변수로 설정
   - `.env` 파일은 버전 관리에서 제외

2. **네트워크 보안**
   - 필요한 경우 VPN 또는 프록시 사용
   - 방화벽 규칙 적절히 설정

3. **접근 권한**
   - 데이터베이스 사용자 권한 최소화
   - 파일 시스템 권한 적절히 설정
