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
            await this.page.goto('https://datalab.naver.com/keyword/trendSearch.naver', {
                waitUntil: 'networkidle',
            });
            const searchInput = await this.page.locator('#content_keyword');
            await searchInput.fill(query);
            await searchInput.press('Enter');
            await this.page.waitForTimeout(3000);
            const trendingKeywords = await this.page.locator('.trending_keyword').allTextContents();
            const keywords = trendingKeywords
                .filter(keyword => keyword.trim() && keyword !== query)
                .slice(0, scraping_constants_1.SCRAPING_DEFAULTS.MAX_KEYWORDS_PER_TYPE)
                .map(keyword => ({
                keyword: keyword.trim(),
                category: 'trending',
                source: 'naver_trending',
                competition: this.estimateCompetition(keyword),
            }));
            console.log(`✅ 인기주제 키워드 ${keywords.length}개 수집 완료`);
            return keywords;
        }
        catch (error) {
            console.error('❌ 인기주제 키워드 수집 실패:', error);
            return [];
        }
    }
    async scrapeSmartBlockData(query) {
        console.log(`🧠 스마트블록 데이터 수집 시작: ${query}`);
        try {
            await this.page.goto(`https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`, {
                waitUntil: 'networkidle',
            });
            const smartBlocks = await this.page.locator('.api_subject_bx, .knowledge_box, .info_group').all();
            const keywords = [];
            for (const block of smartBlocks) {
                try {
                    const blockKeywords = await block.locator('a, .keyword, .tag').allTextContents();
                    blockKeywords
                        .filter(keyword => keyword.trim() && keyword !== query && keyword.length > 1)
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
            return uniqueKeywords;
        }
        catch (error) {
            console.error('❌ 스마트블록 데이터 수집 실패:', error);
            return [];
        }
    }
    async scrapeRelatedSearchKeywords(query) {
        console.log(`🔗 연관검색어 수집 시작: ${query}`);
        try {
            const searchUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`;
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
                        if (text && text.trim() && text.trim() !== query) {
                            const cleanText = text.trim().replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ');
                            if (cleanText.length > 1 && cleanText.length < 50) {
                                relatedKeywords.push({
                                    keyword: cleanText,
                                    category: 'related_search',
                                    source: 'naver_related_search',
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
            const uniqueKeywords = relatedKeywords.filter((keyword, index, self) => index === self.findIndex(k => k.keyword === keyword.keyword));
            console.log(`✅ 연관검색어 ${uniqueKeywords.length}개 수집 완료`);
            return uniqueKeywords.slice(0, scraping_constants_1.SCRAPING_DEFAULTS.MAX_KEYWORDS_PER_TYPE);
        }
        catch (error) {
            console.error('❌ 연관검색어 수집 실패:', error);
            return [];
        }
    }
    async scrapeAllKeywords(query, types = ['related_search']) {
        console.log(`🚀 키워드 수집 시작: ${query}, 타입: ${types.join(', ')}`);
        const promises = [];
        if (types.includes('trending')) {
            promises.push(this.scrapeTrendingKeywords(query));
        }
        if (types.includes('smartblock')) {
            promises.push(this.scrapeSmartBlockData(query));
        }
        if (types.includes('related_search')) {
            promises.push(this.scrapeRelatedSearchKeywords(query));
        }
        const results = await Promise.allSettled(promises);
        const allKeywords = [];
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                allKeywords.push(...result.value);
            }
            else {
                console.error(`키워드 수집 실패 (${types[index]}):`, result.reason);
            }
        });
        const uniqueKeywords = allKeywords.filter((keyword, index, self) => self.findIndex(k => k.keyword === keyword.keyword) === index);
        console.log(`✅ 전체 키워드 수집 완료: ${uniqueKeywords.length}개`);
        return uniqueKeywords;
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
}
exports.NaverScraper = NaverScraper;
//# sourceMappingURL=naver-scraper.js.map