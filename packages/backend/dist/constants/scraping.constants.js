"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEARCH_VOLUME = exports.SCRAPING_LOGS = exports.SCRAPING_ERRORS = exports.BROWSER_CONFIG = exports.SCRAPING_TYPES = exports.NAVER_SCRAPING = exports.SCRAPING_DEFAULTS = void 0;
exports.SCRAPING_DEFAULTS = {
    MAX_RESULTS: 50,
    MAX_KEYWORDS_PER_TYPE: 10,
    PAGE_TIMEOUT: 30000,
    DELAY_BETWEEN_REQUESTS: 1000,
    RETRY_COUNT: 3,
    RETRY_DELAY: 2000,
};
exports.NAVER_SCRAPING = {
    BASE_URL: 'https://search.naver.com/search.naver',
    AUTOCOMPLETE_URL: 'https://ac.search.naver.com/nx/ac',
    SELECTORS: {
        RELATED_SEARCH: '.lst_related_srch .tit',
        AUTOCOMPLETE: '.item',
        POPULAR_TOPICS: '.lst_issue .tit',
        SEARCH_RESULTS: '.lst_total .total_tit',
    },
    SEARCH_PARAMS: {
        QUERY_KEY: 'query',
        START_KEY: 'start',
        DISPLAY_KEY: 'display',
        SORT_KEY: 'sort',
    },
    DEFAULT_OPTIONS: {
        DISPLAY: 10,
        START: 1,
        SORT: 'sim',
    },
};
exports.SCRAPING_TYPES = {
    RELATED_SEARCH: 'related_search',
    AUTOCOMPLETE: 'autocomplete',
    POPULAR_TOPICS: 'popular_topics',
    FREQUENTLY_SEARCHED: 'frequently_searched',
};
exports.BROWSER_CONFIG = {
    VIEWPORT: {
        WIDTH: 1920,
        HEIGHT: 1080,
    },
    USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    HEADLESS: true,
    POOL: {
        MIN_SIZE: 1,
        MAX_SIZE: 5,
        IDLE_TIMEOUT: 60000,
        ACQUIRE_TIMEOUT: 30000,
    },
};
exports.SCRAPING_ERRORS = {
    BROWSER_LAUNCH_FAILED: '브라우저 실행에 실패했습니다',
    PAGE_LOAD_FAILED: '페이지 로딩에 실패했습니다',
    ELEMENT_NOT_FOUND: '요소를 찾을 수 없습니다',
    TIMEOUT_EXCEEDED: '타임아웃이 초과되었습니다',
    NETWORK_ERROR: '네트워크 오류가 발생했습니다',
    INVALID_QUERY: '유효하지 않은 검색어입니다',
    NO_RESULTS_FOUND: '검색 결과를 찾을 수 없습니다',
    RATE_LIMIT_EXCEEDED: '요청 제한을 초과했습니다',
};
exports.SCRAPING_LOGS = {
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
};
exports.SEARCH_VOLUME = {
    DEFAULT_RANGE: {
        MIN: 100,
        MAX: 10000,
    },
    POPULARITY_MULTIPLIER: {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 5,
        VERY_HIGH: 10,
    },
    CATEGORIES: {
        VERY_LOW: { min: 0, max: 100 },
        LOW: { min: 101, max: 1000 },
        MEDIUM: { min: 1001, max: 10000 },
        HIGH: { min: 10001, max: 100000 },
        VERY_HIGH: { min: 100001, max: Infinity },
    },
};
//# sourceMappingURL=scraping.constants.js.map