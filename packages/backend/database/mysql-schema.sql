-- 네이버 키워드 수집 테이블 (MySQL 버전)
CREATE TABLE IF NOT EXISTS naver_keywords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  query VARCHAR(100) NOT NULL,           -- 기준 검색어 (예: '맛집')
  keyword_type VARCHAR(50) NOT NULL,     -- autosuggest / togetherSearched / hotTopics / relatedKeywords
  category VARCHAR(50) DEFAULT '일반',    -- 키워드 카테고리 (자동 분류)
  text VARCHAR(255) NOT NULL,            -- 키워드 텍스트
  href TEXT,                             -- 관련 링크 (없으면 NULL)
  imageAlt TEXT,                         -- 이미지 대체 텍스트 (인기주제에서 사용)
  `rank` INT NOT NULL,                   -- 섹션 내 순위
  grp INT DEFAULT 1,                     -- 페이지/슬라이드 그룹 번호
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 네이버 API 데이터 저장 테이블들 (MySQL 버전)
-- 1. 네이버 검색 결과 저장 테이블
CREATE TABLE IF NOT EXISTS naver_search_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  query VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT,
  bloggername VARCHAR(100),
  bloggerlink TEXT,
  postdate VARCHAR(20),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. 네이버 데이터랩 트렌드 저장 테이블
CREATE TABLE IF NOT EXISTS naver_datalab_trends (
  id INT AUTO_INCREMENT PRIMARY KEY,
  query VARCHAR(100) NOT NULL,
  period VARCHAR(20) NOT NULL,           -- 2024-01, 2024-02 등
  ratio INT NOT NULL,                    -- 검색 비율
  time_unit VARCHAR(20) DEFAULT 'month', -- month, week, date
  device VARCHAR(10),                    -- pc, mo, null(전체)
  gender VARCHAR(10),                    -- m, f, null(전체)
  age_group VARCHAR(10),                 -- 10, 20, 30, 40, 50, 60, null(전체)
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. 네이버 연관 키워드 저장 테이블
CREATE TABLE IF NOT EXISTS naver_related_keywords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  query VARCHAR(100) NOT NULL,
  related_keyword VARCHAR(255) NOT NULL,
  monthly_pc_qc_cnt BIGINT,              -- 월간 PC 검색수
  monthly_mobile_qc_cnt BIGINT,          -- 월간 모바일 검색수
  monthly_ave_pc_clk_cnt INT,            -- 월간 평균 PC 클릭수
  monthly_ave_mobile_clk_cnt INT,        -- 월간 평균 모바일 클릭수
  monthly_ave_pc_ctr DECIMAL(5,2),       -- 월간 평균 PC CTR
  monthly_ave_mobile_ctr DECIMAL(5,2),   -- 월간 평균 모바일 CTR
  pl_avg_depth DECIMAL(3,1),             -- 평균 노출 깊이
  pc_comp_idx VARCHAR(10),               -- PC 경쟁 지수
  mobile_comp_idx VARCHAR(10),           -- 모바일 경쟁 지수
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. 네이버 종합 분석 결과 저장 테이블
CREATE TABLE IF NOT EXISTS naver_comprehensive_analysis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  query VARCHAR(100) NOT NULL,
  analysis_data JSON NOT NULL,           -- 전체 분석 결과를 JSON으로 저장
  cache_key VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,         -- 캐시 만료 시간
  generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_cache_key (cache_key)
);

-- 인덱스 생성 (MySQL 버전)
CREATE INDEX idx_naver_search_query ON naver_search_results(query);
CREATE INDEX idx_naver_search_created_at ON naver_search_results(created_at);

CREATE INDEX idx_naver_datalab_query ON naver_datalab_trends(query);
CREATE INDEX idx_naver_datalab_period ON naver_datalab_trends(period);
CREATE INDEX idx_naver_datalab_query_period ON naver_datalab_trends(query, period);

CREATE INDEX idx_naver_related_query ON naver_related_keywords(query);
CREATE INDEX idx_naver_related_created_at ON naver_related_keywords(created_at);

CREATE INDEX idx_naver_analysis_query ON naver_comprehensive_analysis(query);
CREATE INDEX idx_naver_analysis_cache_key ON naver_comprehensive_analysis(cache_key);
CREATE INDEX idx_naver_analysis_expires_at ON naver_comprehensive_analysis(expires_at);
