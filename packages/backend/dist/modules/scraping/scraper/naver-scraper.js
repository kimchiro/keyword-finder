"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NaverScraper = void 0;
const scraping_constants_1 = require("../../../constants/scraping.constants");
class NaverScraper {
    constructor(browserPoolService) {
        this.browserPoolService = browserPoolService;
        this.session = null;
    }
    async initialize() {
        console.log('🚀 브라우저 풀에서 브라우저 세션 획득 중...');
        this.session = await this.browserPoolService.acquireBrowser();
        console.log('✅ 브라우저 세션 획득 완료');
    }
    async close() {
        if (this.session) {
            await this.browserPoolService.releaseBrowser(this.session);
            this.session = null;
            console.log('🔒 브라우저 세션 반환 완료');
        }
    }
    get page() {
        if (!this.session?.page) {
            throw new Error('브라우저 세션이 초기화되지 않았습니다.');
        }
        return this.session.page;
    }
    async scrapeTrendingKeywords(query) {
        console.log(`📈 인기주제 키워드 수집 시작: ${query}`);
        try {
            await this.page.goto(`https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`, {
                waitUntil: 'networkidle',
            });
            await this.page.waitForTimeout(2000);
            const trendingSelectors = [
                '.trend_keyword', '.popular_keyword', '.issue_keyword', '.hot_keyword',
                '.realtime_keyword', '.trending_search', '.keyword_trend', '.popular_search'
            ];
            let trendingExists = false;
            for (const selector of trendingSelectors) {
                const element = await this.page.$(selector);
                if (element) {
                    trendingExists = true;
                    break;
                }
            }
            if (!trendingExists) {
                console.log('⚠️ 인기주제 영역이 존재하지 않습니다');
                return {
                    keywords: [],
                    message: `"${query}" 키워드에 대한 인기주제 데이터가 존재하지 않습니다`,
                    status: 'no_content',
                    count: 0
                };
            }
            const trendingKeywords = [];
            const selectors = [
                '.trend_keyword a',
                '.popular_keyword a',
                '.issue_keyword a',
                '.hot_keyword a',
                '.realtime_keyword a',
                '.trending_search a',
                '.keyword_trend a',
                '.popular_search a',
                '.api_subject_bx .elss',
                '.related_srch .keyword',
            ];
            for (const selector of selectors) {
                try {
                    const elements = await this.page.$$(selector);
                    for (const element of elements) {
                        const text = await element.textContent();
                        if (text && text.trim()) {
                            const cleanText = text.trim().replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ');
                            if (this.isValidKeyword(cleanText, query)) {
                                trendingKeywords.push({
                                    keyword: cleanText,
                                    category: 'trending',
                                    source: 'naver_search_trending',
                                    searchVolume: Math.floor(Math.random() * scraping_constants_1.SEARCH_VOLUME.DEFAULT_RANGE.MAX) + scraping_constants_1.SEARCH_VOLUME.DEFAULT_RANGE.MIN,
                                    competition: this.estimateCompetition(cleanText),
                                    similarity: this.calculateSimilarity(query, cleanText),
                                });
                            }
                        }
                    }
                }
                catch (error) {
                    console.warn(`인기주제 키워드 선택자 실패 (${selector}):`, error.message);
                }
            }
            const uniqueKeywords = trendingKeywords
                .filter((keyword, index, self) => self.findIndex(k => k.keyword === keyword.keyword) === index)
                .slice(0, scraping_constants_1.SCRAPING_DEFAULTS.MAX_KEYWORDS_PER_TYPE);
            console.log(`✅ 인기주제 키워드 ${uniqueKeywords.length}개 수집 완료`);
            return {
                keywords: uniqueKeywords,
                message: `인기주제 키워드 ${uniqueKeywords.length}개 수집 완료`,
                status: 'success',
                count: uniqueKeywords.length
            };
        }
        catch (error) {
            console.error('❌ 인기주제 키워드 수집 실패:', error);
            return {
                keywords: [],
                message: `인기주제 수집 중 오류 발생: ${error.message}`,
                status: 'error',
                count: 0
            };
        }
    }
    async scrapeSmartBlockData(query) {
        console.log(`🧠 스마트블록 데이터 수집 시작: ${query}`);
        try {
            await this.page.goto(`https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`, {
                waitUntil: 'networkidle',
            });
            const smartBlockSelectors = [
                '.api_subject_bx', '.smartblock', '.knowledge_box',
                '._related_box', '.sds-comps-vertical-layout.sds-comps-full-layout.fds-collection-root'
            ];
            let smartBlockExists = false;
            for (const selector of smartBlockSelectors) {
                const element = await this.page.$(selector);
                if (element) {
                    smartBlockExists = true;
                    break;
                }
            }
            if (!smartBlockExists) {
                console.log('⚠️ 스마트블록 영역이 존재하지 않습니다');
                return {
                    keywords: [],
                    message: `"${query}" 키워드에 대한 스마트블록 데이터가 존재하지 않습니다`,
                    status: 'no_content',
                    count: 0
                };
            }
            const allowedSelectorsString = scraping_constants_1.KEYWORD_FILTERING.ALLOWED_SELECTORS.join(', ');
            const smartBlocks = await this.page.locator(allowedSelectorsString).all();
            const keywords = [];
            for (const block of smartBlocks) {
                try {
                    const blockKeywords = await block.locator('a, .keyword, .tag').allTextContents();
                    blockKeywords
                        .filter(keyword => this.isValidKeyword(keyword.trim(), query))
                        .slice(0, 5)
                        .forEach(keyword => {
                        keywords.push({
                            keyword: keyword.trim(),
                            category: 'smartblock',
                            source: 'naver_smartblock',
                            competition: this.estimateCompetition(keyword),
                            similarity: this.calculateSimilarity(query, keyword),
                        });
                    });
                }
                catch (blockError) {
                    console.warn('스마트블록 처리 중 오류:', blockError);
                }
            }
            const uniqueKeywords = keywords
                .filter((keyword, index, self) => self.findIndex(k => k.keyword === keyword.keyword) === index)
                .slice(0, scraping_constants_1.SCRAPING_DEFAULTS.MAX_KEYWORDS_PER_TYPE);
            console.log(`✅ 스마트블록 키워드 ${uniqueKeywords.length}개 수집 완료`);
            return {
                keywords: uniqueKeywords,
                message: `스마트블록 키워드 ${uniqueKeywords.length}개 수집 완료`,
                status: 'success',
                count: uniqueKeywords.length
            };
        }
        catch (error) {
            console.error('❌ 스마트블록 데이터 수집 실패:', error);
            return {
                keywords: [],
                message: `스마트블록 수집 중 오류 발생: ${error.message}`,
                status: 'error',
                count: 0
            };
        }
    }
    async scrapeRelatedSearchKeywords(query, maxResults = scraping_constants_1.SCRAPING_DEFAULTS.MAX_KEYWORDS_PER_TYPE) {
        console.log(`🔗 연관검색어 수집 시작: ${query}`);
        const allKeywords = [];
        const pagesScraped = [];
        try {
            const page1Results = await this.scrapeRelatedFromPage(query, 1);
            if (page1Results.status === 'success') {
                allKeywords.push(...page1Results.keywords);
                pagesScraped.push(1);
            }
            if (allKeywords.length < maxResults && allKeywords.length > 0) {
                console.log('🔄 연관검색어 추가 수집을 위해 2페이지로 이동');
                const page2Results = await this.scrapeRelatedFromPage(query, 2);
                if (page2Results.status === 'success') {
                    allKeywords.push(...page2Results.keywords);
                    pagesScraped.push(2);
                }
            }
            const uniqueKeywords = allKeywords
                .filter((keyword, index, self) => self.findIndex(k => k.keyword === keyword.keyword) === index)
                .slice(0, maxResults);
            if (uniqueKeywords.length === 0) {
                return {
                    keywords: [],
                    message: `"${query}" 키워드에 대한 연관검색어가 존재하지 않습니다`,
                    status: 'no_content',
                    count: 0,
                    pages: []
                };
            }
            console.log(`✅ 연관검색어 ${uniqueKeywords.length}개 수집 완료 (${pagesScraped.join(', ')}페이지)`);
            return {
                keywords: uniqueKeywords,
                message: `연관검색어 ${uniqueKeywords.length}개 수집 완료 (${pagesScraped.join('-')}페이지)`,
                status: 'success',
                count: uniqueKeywords.length,
                pages: pagesScraped
            };
        }
        catch (error) {
            console.error('❌ 연관검색어 수집 실패:', error);
            return {
                keywords: [],
                message: `연관검색어 수집 중 오류 발생: ${error.message}`,
                status: 'error',
                count: 0,
                pages: pagesScraped
            };
        }
    }
    async scrapeRelatedFromPage(query, page) {
        try {
            const start = (page - 1) * 10;
            const searchUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}&start=${start}`;
            console.log(`📄 ${page}페이지 연관검색어 수집: ${searchUrl}`);
            await this.page.goto(searchUrl, { waitUntil: 'networkidle' });
            await this.page.waitForTimeout(2000);
            const relatedKeywords = [];
            const selectors = [
                '.related_srch .keyword',
                '.lst_related_srch a',
                '.related_keyword a',
                '.api_subject_bx .elss',
            ];
            for (const selector of selectors) {
                try {
                    const elements = await this.page.$$(selector);
                    for (const element of elements) {
                        const text = await element.textContent();
                        if (text && text.trim()) {
                            const cleanText = text.trim().replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ');
                            if (this.isValidKeyword(cleanText, query)) {
                                relatedKeywords.push({
                                    keyword: cleanText,
                                    category: 'related_search',
                                    source: `naver_related_search_page${page}`,
                                    searchVolume: Math.floor(Math.random() * scraping_constants_1.SEARCH_VOLUME.DEFAULT_RANGE.MAX) + scraping_constants_1.SEARCH_VOLUME.DEFAULT_RANGE.MIN,
                                    competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                                    similarity: 'medium',
                                });
                            }
                        }
                    }
                }
                catch (error) {
                    console.warn(`연관검색어 선택자 실패 (${selector}):`, error.message);
                }
            }
            console.log(`📄 ${page}페이지에서 ${relatedKeywords.length}개 연관검색어 수집`);
            return {
                keywords: relatedKeywords,
                message: `${page}페이지에서 ${relatedKeywords.length}개 수집`,
                status: relatedKeywords.length > 0 ? 'success' : 'no_content',
                count: relatedKeywords.length
            };
        }
        catch (error) {
            console.error(`❌ ${page}페이지 연관검색어 수집 실패:`, error);
            return {
                keywords: [],
                message: `${page}페이지 수집 중 오류 발생: ${error.message}`,
                status: 'error',
                count: 0
            };
        }
    }
    async scrapeAllKeywords(query, types = ['related_search']) {
        console.log(`🚀 키워드 수집 시작: ${query}, 타입: ${types.join(', ')}`);
        const collectionDetails = {};
        const allKeywords = [];
        if (types.includes('trending')) {
            console.log('📈 인기주제 키워드 수집 중...');
            const trendingResult = await this.scrapeTrendingKeywords(query);
            collectionDetails.trending = {
                status: trendingResult.status,
                message: trendingResult.message,
                count: trendingResult.count || 0,
            };
            allKeywords.push(...trendingResult.keywords);
        }
        if (types.includes('smartblock')) {
            console.log('🧠 스마트블록 데이터 수집 중...');
            const smartblockResult = await this.scrapeSmartBlockData(query);
            collectionDetails.smartblock = {
                status: smartblockResult.status,
                message: smartblockResult.message,
                count: smartblockResult.count || 0,
            };
            allKeywords.push(...smartblockResult.keywords);
        }
        if (types.includes('related_search')) {
            console.log('🔗 연관검색어 수집 중...');
            const relatedResult = await this.scrapeRelatedSearchKeywords(query);
            collectionDetails.related_search = {
                status: relatedResult.status,
                message: relatedResult.message,
                count: relatedResult.count || 0,
                pages: relatedResult.pages || [],
            };
            allKeywords.push(...relatedResult.keywords);
        }
        const uniqueKeywords = allKeywords.filter((keyword, index, self) => self.findIndex(k => k.keyword === keyword.keyword) === index);
        console.log(`✅ 전체 키워드 수집 완료: ${uniqueKeywords.length}개`);
        console.log('📊 수집 상세 정보:', JSON.stringify(collectionDetails, null, 2));
        return {
            keywords: uniqueKeywords,
            collectionDetails
        };
    }
    estimateCompetition(keyword) {
        const length = keyword.length;
        const hasNumbers = /\d/.test(keyword);
        const hasSpecialChars = /[^\w\s가-힣]/.test(keyword);
        if (length <= 2 || hasNumbers || hasSpecialChars) {
            return 'high';
        }
        else if (length <= 4) {
            return 'medium';
        }
        else {
            return 'low';
        }
    }
    calculateSimilarity(original, target) {
        const originalChars = new Set(original.split(''));
        const targetChars = new Set(target.split(''));
        const intersection = new Set([...originalChars].filter(x => targetChars.has(x)));
        const union = new Set([...originalChars, ...targetChars]);
        const similarity = intersection.size / union.size;
        if (similarity >= 0.7)
            return 'high';
        if (similarity >= 0.4)
            return 'medium';
        return 'low';
    }
    isValidKeyword(keyword, originalQuery) {
        if (!keyword || !keyword.trim() || keyword.trim() === originalQuery) {
            return false;
        }
        keyword = keyword.trim();
        if (keyword.length < scraping_constants_1.KEYWORD_FILTERING.VALIDATION_RULES.MIN_LENGTH ||
            keyword.length > scraping_constants_1.KEYWORD_FILTERING.VALIDATION_RULES.MAX_LENGTH) {
            return false;
        }
        if (!scraping_constants_1.KEYWORD_FILTERING.VALIDATION_RULES.ALLOWED_PATTERN.test(keyword)) {
            return false;
        }
        if (scraping_constants_1.KEYWORD_FILTERING.VALIDATION_RULES.URL_PATTERN.test(keyword)) {
            return false;
        }
        if (this.isBlacklistedKeyword(keyword)) {
            return false;
        }
        const similarity = this.calculateSimilarityScore(originalQuery, keyword);
        if (similarity >= scraping_constants_1.KEYWORD_FILTERING.VALIDATION_RULES.SIMILARITY_THRESHOLD) {
            return false;
        }
        return true;
    }
    isBlacklistedKeyword(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        return scraping_constants_1.KEYWORD_FILTERING.KEYWORD_BLACKLIST.some(blacklisted => {
            const lowerBlacklisted = blacklisted.toLowerCase();
            return lowerKeyword === lowerBlacklisted || lowerKeyword.includes(lowerBlacklisted);
        });
    }
    calculateSimilarityScore(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        if (len1 === 0)
            return len2 === 0 ? 1 : 0;
        if (len2 === 0)
            return 0;
        if (str1 === str2)
            return 1;
        const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
        for (let i = 0; i <= len1; i++)
            matrix[i][0] = i;
        for (let j = 0; j <= len2; j++)
            matrix[0][j] = j;
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
            }
        }
        const distance = matrix[len1][len2];
        const maxLen = Math.max(len1, len2);
        return 1 - (distance / maxLen);
    }
}
exports.NaverScraper = NaverScraper;
//# sourceMappingURL=naver-scraper.js.map