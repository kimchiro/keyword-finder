"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NaverScraper = void 0;
const playwright_1 = require("playwright");
class NaverScraper {
    constructor() {
        this.browser = null;
        this.page = null;
    }
    async initialize() {
        console.log('🚀 Playwright 브라우저 초기화 중...');
        this.browser = await playwright_1.chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
            ],
        });
        this.page = await this.browser.newPage();
        await this.page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        console.log('✅ Playwright 브라우저 초기화 완료');
    }
    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log('🔒 Playwright 브라우저 종료');
        }
    }
    async scrapeTrendingKeywords(query) {
        if (!this.page)
            throw new Error('브라우저가 초기화되지 않았습니다.');
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
                .slice(0, 10)
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
        if (!this.page)
            throw new Error('브라우저가 초기화되지 않았습니다.');
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
                .slice(0, 10);
            console.log(`✅ 스마트블록 키워드 ${uniqueKeywords.length}개 수집 완료`);
            return uniqueKeywords;
        }
        catch (error) {
            console.error('❌ 스마트블록 데이터 수집 실패:', error);
            return [];
        }
    }
    async scrapeAllKeywords(query, types = ['trending', 'smartblock']) {
        console.log(`🚀 키워드 수집 시작: ${query}, 타입: ${types.join(', ')}`);
        const promises = [];
        if (types.includes('trending')) {
            promises.push(this.scrapeTrendingKeywords(query));
        }
        if (types.includes('smartblock')) {
            promises.push(this.scrapeSmartBlockData(query));
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