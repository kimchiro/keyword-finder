-- 네이버 키워드 수집 테이블 (v2.0)
-- MySQL과 PostgreSQL 모두 호환되는 스키마
-- 
-- 지원하는 키워드 타입:
-- - autosuggest: 자동완성 키워드
-- - togetherSearched: 함께 많이 찾는 키워드  
-- - hotTopics: 인기주제 키워드
-- - relatedKeywords: 연관검색어 (2페이지 하단)

CREATE TABLE IF NOT EXISTS naver_keywords (
  id SERIAL PRIMARY KEY,
  query VARCHAR(100) NOT NULL,           -- 기준 검색어 (예: '맛집')
  keyword_type VARCHAR(50) NOT NULL,     -- autosuggest / togetherSearched / hotTopics / relatedKeywords
  category VARCHAR(50) DEFAULT '일반',    -- 키워드 카테고리 (자동 분류)
  text VARCHAR(255) NOT NULL,            -- 키워드 텍스트
  href TEXT,                             -- 관련 링크 (없으면 NULL)
  imageAlt TEXT,                         -- 이미지 대체 텍스트 (인기주제에서 사용)
  rank INT NOT NULL,                     -- 섹션 내 순위
  grp INT DEFAULT 1,                     -- 페이지/슬라이드 그룹 번호
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_naver_keywords_query ON naver_keywords(query);
CREATE INDEX IF NOT EXISTS idx_naver_keywords_type ON naver_keywords(keyword_type);
CREATE INDEX IF NOT EXISTS idx_naver_keywords_category ON naver_keywords(category);
CREATE INDEX IF NOT EXISTS idx_naver_keywords_created_at ON naver_keywords(created_at);
CREATE INDEX IF NOT EXISTS idx_naver_keywords_query_type ON naver_keywords(query, keyword_type);
CREATE INDEX IF NOT EXISTS idx_naver_keywords_query_category ON naver_keywords(query, category);

-- MySQL용 스키마 (AUTO_INCREMENT 사용)
-- CREATE TABLE IF NOT EXISTS naver_keywords (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   query VARCHAR(100) NOT NULL,
--   keyword_type VARCHAR(50) NOT NULL,
--   category VARCHAR(50) DEFAULT '일반',
--   text VARCHAR(255) NOT NULL,
--   href TEXT,
--   imageAlt TEXT,
--   rank INT NOT NULL,
--   grp INT DEFAULT 1,
--   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- 기존 테이블 마이그레이션 (v1.0 → v2.0)
-- 기존 테이블에 category 컬럼 추가하려면:
-- ALTER TABLE naver_keywords ADD COLUMN category VARCHAR(50) DEFAULT '일반';
-- CREATE INDEX idx_naver_keywords_category ON naver_keywords(category);
-- CREATE INDEX idx_naver_keywords_query_category ON naver_keywords(query, category);
