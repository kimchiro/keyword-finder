const { chromium } = require("playwright");
const { randomDelay } = require("../utils/helpers");
const AutosuggestCollector = require("../collectors/autosuggest-collector");
const TogetherSearchedCollector = require("../collectors/together-searched-collector");
const HotTopicsCollector = require("../collectors/hot-topics-collector");
const RelatedKeywordsCollector = require("../collectors/related-keywords-collector");
const DataProcessor = require("../utils/data-processor");

/**
 * 네이버 키워드 스크래퍼 (리팩토링 버전)
 */
class NaverKeywordScraper {
  constructor(options = {}) {
    this.options = {
      headless: options.headless !== false,
      maxPagesPerModule: options.maxPagesPerModule || 3,
      waitTimeoutMs: options.waitTimeoutMs || 5000,
      sleepMinMs: options.sleepMinMs || 200,
      sleepMaxMs: options.sleepMaxMs || 600,
      outputDir: options.outputDir || "./output",
      ...options,
    };

    this.browser = null;
    this.page = null;
    this.results = [];

    // 데이터 프로세서 초기화
    this.dataProcessor = new DataProcessor(this.options);
  }

  /**
   * 브라우저 초기화
   */
  async init() {
    console.log("🚀 브라우저를 시작합니다...");
    this.browser = await chromium.launch({
      headless: this.options.headless,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    this.page = await this.browser.newPage();

    // User-Agent 설정 (봇 탐지 방지)
    await this.page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    console.log("✅ 브라우저가 준비되었습니다.");
  }

  /**
   * 네이버 검색 페이지로 이동
   */
  async navigateToNaver(query) {
    console.log(`🔍 네이버 검색 페이지로 이동: "${query}"`);

    // 네이버 메인 페이지로 이동
    await this.page.goto("https://www.naver.com", { waitUntil: "networkidle" });
    await randomDelay(this.options.sleepMinMs, this.options.sleepMaxMs);

    // 검색어 입력
    const searchInput = await this.page.locator("#query");
    await searchInput.fill(query);
    await randomDelay(this.options.sleepMinMs, this.options.sleepMaxMs);

    // 검색 실행
    await this.page.keyboard.press("Enter");
    await this.page.waitForLoadState("networkidle");
    await randomDelay(this.options.sleepMinMs, this.options.sleepMaxMs);

    console.log("✅ 검색 페이지 로드 완료");
  }

  /**
   * 모든 키워드 수집기를 초기화
   */
  initializeCollectors() {
    return {
      autosuggest: new AutosuggestCollector(this.page, this.options),
      togetherSearched: new TogetherSearchedCollector(this.page, this.options),
      hotTopics: new HotTopicsCollector(this.page, this.options),
      relatedKeywords: new RelatedKeywordsCollector(this.page, this.options),
    };
  }

  /**
   * 메인 스크래핑 실행
   */
  async scrape(query) {
    const startTime = Date.now();
    console.log(`\n🎯 네이버 키워드 수집 시작: "${query}"`);

    try {
      await this.init();

      // 수집기들 초기화
      const collectors = this.initializeCollectors();

      // 1. 자동완성 수집 (검색 전)
      const autosuggest = await collectors.autosuggest.collect(query);

      // 2. 검색 실행
      await this.navigateToNaver(query);

      // 3. 검색 결과 페이지에서 "함께 많이 찾는"과 "인기주제" 수집
      const [togetherSearched, hotTopics] = await Promise.all([
        collectors.togetherSearched.collect(query),
        collectors.hotTopics.collect(query),
      ]);

      // 4. 연관검색어 수집 (2페이지에서)
      const relatedKeywords = await collectors.relatedKeywords.collect(query);

      // 모든 데이터 합치기
      const allData = [
        ...autosuggest,
        ...togetherSearched,
        ...hotTopics,
        ...relatedKeywords,
      ];

      // 데이터 정제
      const cleanedData = this.dataProcessor.cleanData(allData);

      // 파일 저장
      const filepath = await this.dataProcessor.saveToFile(cleanedData, query);

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      // 통계 생성
      const stats = this.dataProcessor.generateStats(cleanedData, duration);

      console.log(`\n✅ 수집 완료!`);
      console.log(`   📊 총 키워드: ${stats.total}개`);
      console.log(`   📝 자동완성: ${stats.autosuggest}개`);
      console.log(`   🔗 함께 많이 찾는: ${stats.togetherSearched}개`);
      console.log(`   🔥 인기주제: ${stats.hotTopics}개`);
      console.log(`   🔗 연관검색어: ${stats.relatedKeywords}개`);
      console.log(`   ⏱️ 실행시간: ${stats.duration}초`);
      console.log(`   💾 저장위치: ${filepath}`);

      // 카테고리별 통계 출력
      if (stats.categories && Object.keys(stats.categories).length > 0) {
        console.log(`   📂 카테고리별:`);
        Object.entries(stats.categories).forEach(([category, count]) => {
          console.log(`      ${category}: ${count}개`);
        });
      }

      return {
        success: true,
        data: cleanedData,
        filepath: filepath,
        stats: stats,
      };
    } catch (error) {
      console.error("❌ 스크래핑 중 오류 발생:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    } finally {
      if (this.browser) {
        await this.browser.close();
        console.log("🔒 브라우저 종료");
      }
    }
  }

  /**
   * 브라우저 종료
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = NaverKeywordScraper;
