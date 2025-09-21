/**
 * 스크래핑 관련 상수 정의
 * 하드코딩된 값들을 중앙 집중식으로 관리합니다.
 */

/**
 * 스크래핑 기본 설정
 */
export const SCRAPING_DEFAULTS = {
  /** 기본 최대 결과 수 */
  MAX_RESULTS: 50,
  
  /** 타입별 최대 키워드 수 */
  MAX_KEYWORDS_PER_TYPE: 10,
  
  /** 페이지 로딩 타임아웃 (ms) */
  PAGE_TIMEOUT: 30000,
  
  /** 요청 간 지연 시간 (ms) */
  DELAY_BETWEEN_REQUESTS: 1000,
  
  /** 재시도 횟수 */
  RETRY_COUNT: 3,
  
  /** 재시도 간격 (ms) */
  RETRY_DELAY: 2000,
} as const;

/**
 * 네이버 스크래핑 관련 상수
 */
export const NAVER_SCRAPING = {
  /** 네이버 검색 기본 URL */
  BASE_URL: 'https://search.naver.com/search.naver',
  
  /** 자동완성 API URL */
  AUTOCOMPLETE_URL: 'https://ac.search.naver.com/nx/ac',
  
  /** 연관검색어 셀렉터 */
  SELECTORS: {
    RELATED_SEARCH: '.lst_related_srch .tit',
    AUTOCOMPLETE: '.item',
    POPULAR_TOPICS: '.lst_issue .tit',
    SEARCH_RESULTS: '.lst_total .total_tit',
  },
  
  /** 검색 파라미터 */
  SEARCH_PARAMS: {
    QUERY_KEY: 'query',
    START_KEY: 'start',
    DISPLAY_KEY: 'display',
    SORT_KEY: 'sort',
  },
  
  /** 기본 검색 옵션 */
  DEFAULT_OPTIONS: {
    DISPLAY: 10,
    START: 1,
    SORT: 'sim', // 정확도순
  },
} as const;

/**
 * 스크래핑 타입 정의
 */
export const SCRAPING_TYPES = {
  /** 연관 검색어 */
  RELATED_SEARCH: 'related_search',
  
  /** 자동완성 */
  AUTOCOMPLETE: 'autocomplete',
  
  /** 인기 주제 */
  POPULAR_TOPICS: 'popular_topics',
  
  /** 함께 많이 찾는 */
  FREQUENTLY_SEARCHED: 'frequently_searched',
} as const;

/**
 * 브라우저 설정 상수
 */
export const BROWSER_CONFIG = {
  /** 기본 뷰포트 크기 */
  VIEWPORT: {
    WIDTH: 1920,
    HEIGHT: 1080,
  },
  
  /** 사용자 에이전트 */
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  
  /** 헤드리스 모드 */
  HEADLESS: true,
  
  /** 브라우저 풀 설정 */
  POOL: {
    MIN_SIZE: 1,
    MAX_SIZE: 5,
    IDLE_TIMEOUT: 60000, // 1분
    ACQUIRE_TIMEOUT: 30000, // 30초
  },
} as const;

/**
 * 에러 메시지 상수
 */
export const SCRAPING_ERRORS = {
  BROWSER_LAUNCH_FAILED: '브라우저 실행에 실패했습니다',
  PAGE_LOAD_FAILED: '페이지 로딩에 실패했습니다',
  ELEMENT_NOT_FOUND: '요소를 찾을 수 없습니다',
  TIMEOUT_EXCEEDED: '타임아웃이 초과되었습니다',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다',
  INVALID_QUERY: '유효하지 않은 검색어입니다',
  NO_RESULTS_FOUND: '검색 결과를 찾을 수 없습니다',
  RATE_LIMIT_EXCEEDED: '요청 제한을 초과했습니다',
} as const;

/**
 * 로깅 관련 상수
 */
export const SCRAPING_LOGS = {
  LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
  },
  
  MESSAGES: {
    SCRAPING_START: '스크래핑을 시작합니다',
    SCRAPING_COMPLETE: '스크래핑이 완료되었습니다',
    SCRAPING_FAILED: '스크래핑에 실패했습니다',
    BROWSER_CREATED: '브라우저가 생성되었습니다',
    BROWSER_CLOSED: '브라우저가 종료되었습니다',
    PAGE_NAVIGATED: '페이지로 이동했습니다',
    KEYWORDS_EXTRACTED: '키워드가 추출되었습니다',
  },
} as const;

/**
 * 검색량 관련 상수
 */
export const SEARCH_VOLUME = {
  /** 기본 검색량 범위 */
  DEFAULT_RANGE: {
    MIN: 100,
    MAX: 10000,
  },
  
  /** 인기도별 검색량 배수 */
  POPULARITY_MULTIPLIER: {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 5,
    VERY_HIGH: 10,
  },
  
  /** 검색량 카테고리 */
  CATEGORIES: {
    VERY_LOW: { min: 0, max: 100 },
    LOW: { min: 101, max: 1000 },
    MEDIUM: { min: 1001, max: 10000 },
    HIGH: { min: 10001, max: 100000 },
    VERY_HIGH: { min: 100001, max: Infinity },
  },
} as const;

/**
 * 타입 정의를 위한 유틸리티
 */
export type ScrapingType = typeof SCRAPING_TYPES[keyof typeof SCRAPING_TYPES];
export type ScrapingError = typeof SCRAPING_ERRORS[keyof typeof SCRAPING_ERRORS];
export type LogLevel = typeof SCRAPING_LOGS.LEVELS[keyof typeof SCRAPING_LOGS.LEVELS];
