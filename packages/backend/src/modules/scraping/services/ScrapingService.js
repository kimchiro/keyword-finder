const NaverKeywordScraper = require("../../../scraper/naver-scraper");
const ScrapingDao = require("../dao/ScrapingDao");
const DataProcessor = require("../../../shared/utils/data-processor");

class ScrapingService {
  constructor() {
    this.scrapingDao = ScrapingDao;
    this.dataProcessor = new DataProcessor();
  }

  /**
   * 네이버 키워드 스크래핑 실행
   */
  async scrapeNaverKeywords(query, options = {}) {
    try {
      if (!query || typeof query !== "string" || query.trim().length === 0) {
        throw new Error("유효한 검색어가 필요합니다.");
      }

      console.log(`🚀 네이버 키워드 스크래핑 시작: ${query}`);
      console.log(`📋 옵션:`, options);

      // 스크래퍼 초기화
      const scraper = new NaverKeywordScraper({
        headless: options.headless !== false, // 기본값: true
        timeout: options.timeout || 30000,
        ...options,
      });

      console.log(`🔧 스크래퍼 초기화 완료`);

      // 스크래핑 실행
      console.log(`🕷️ 스크래핑 실행 중...`);
      const scrapedData = await scraper.scrape(query);
      console.log(
        `✅ 스크래핑 완료:`,
        scrapedData ? "데이터 있음" : "데이터 없음"
      );

      if (
        !scrapedData ||
        !scrapedData.success ||
        !scrapedData.data ||
        scrapedData.data.length === 0
      ) {
        throw new Error("스크래핑된 데이터가 없습니다.");
      }

      // 데이터 정제 및 가공
      const processedData = this.dataProcessor.cleanData(scrapedData.data);

      // 기존 데이터 삭제 (최신 데이터로 교체)
      await this.scrapingDao.deleteExistingKeywords(query);

      // 새로운 데이터 저장
      await this.scrapingDao.saveScrapedKeywords(processedData);

      // 파일로도 저장 (백업)
      if (options.saveToFile !== false) {
        await this.dataProcessor.saveToFile(scrapedData, query);
      }

      console.log(
        `✅ 네이버 키워드 스크래핑 완료: ${query} (${processedData.length}개)`
      );

      return {
        success: true,
        query,
        totalKeywords: processedData.length,
        keywords: processedData,
        keywordsByType: this._groupKeywordsByType(processedData),
        scrapedAt: new Date().toISOString(),
        savedToDb: true,
        savedToFile: options.saveToFile !== false,
        stats: scrapedData.stats,
        filepath: scrapedData.filepath,
      };
    } catch (error) {
      console.error("❌ ScrapingService.scrapeNaverKeywords 오류:");
      console.error("📄 에러 메시지:", error.message);
      console.error("📚 에러 스택:", error.stack);
      console.error("🔍 에러 타입:", error.constructor.name);
      throw new Error(`스크래핑 실행 중 오류 발생: ${error.message}`);
    }
  }

  /**
   * 스크래핑된 키워드 조회
   */
  async getScrapedKeywords(query, keywordType = null) {
    try {
      if (!query || typeof query !== "string") {
        throw new Error("유효한 검색어가 필요합니다.");
      }

      const keywords = await this.scrapingDao.getScrapedKeywords(
        query,
        keywordType
      );

      return {
        success: true,
        query,
        keywordType,
        keywords,
        total: keywords.length,
        keywordsByType: this._groupKeywordsByType(keywords),
      };
    } catch (error) {
      console.error("❌ ScrapingService.getScrapedKeywords 오류:", error);
      throw error;
    }
  }

  /**
   * 배치 스크래핑 (여러 키워드 동시 처리)
   */
  async batchScraping(queries, options = {}) {
    try {
      if (!Array.isArray(queries) || queries.length === 0) {
        throw new Error("스크래핑할 키워드 배열이 필요합니다.");
      }

      console.log(`🚀 배치 스크래핑 시작: ${queries.length}개 키워드`);

      const results = [];
      const maxConcurrent = options.maxConcurrent || 3; // 동시 처리 제한

      // 배치 처리
      for (let i = 0; i < queries.length; i += maxConcurrent) {
        const batch = queries.slice(i, i + maxConcurrent);

        const batchPromises = batch.map(async (query) => {
          try {
            const result = await this.scrapeNaverKeywords(query, {
              ...options,
              saveToFile: false, // 배치에서는 파일 저장 비활성화
            });
            return { query, success: true, data: result };
          } catch (error) {
            console.error(`❌ 배치 스크래핑 실패: ${query}`, error);
            return { query, success: false, error: error.message };
          }
        });

        const batchResults = await Promise.allSettled(batchPromises);
        results.push(
          ...batchResults.map((result) =>
            result.status === "fulfilled" ? result.value : result.reason
          )
        );

        // 배치 간 딜레이 (서버 부하 방지)
        if (i + maxConcurrent < queries.length) {
          await new Promise((resolve) =>
            setTimeout(resolve, options.batchDelay || 2000)
          );
        }
      }

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;

      console.log(
        `✅ 배치 스크래핑 완료: 성공 ${successCount}개, 실패 ${failCount}개`
      );

      return {
        success: true,
        totalQueries: queries.length,
        successCount,
        failCount,
        results,
      };
    } catch (error) {
      console.error("❌ ScrapingService.batchScraping 오류:", error);
      throw error;
    }
  }

  /**
   * 스크래핑 상태 확인
   */
  async getScrapingStatus(query) {
    try {
      const keywords = await this.scrapingDao.getScrapedKeywords(query);

      if (keywords.length === 0) {
        return {
          query,
          status: "not_scraped",
          lastScrapedAt: null,
          totalKeywords: 0,
        };
      }

      // 가장 최근 스크래핑 시간 찾기
      const lastScrapedAt = keywords.reduce((latest, keyword) => {
        const createdAt = new Date(keyword.created_at);
        return createdAt > latest ? createdAt : latest;
      }, new Date(0));

      return {
        query,
        status: "scraped",
        lastScrapedAt: lastScrapedAt.toISOString(),
        totalKeywords: keywords.length,
        keywordsByType: this._groupKeywordsByType(keywords),
      };
    } catch (error) {
      console.error("❌ ScrapingService.getScrapingStatus 오류:", error);
      throw error;
    }
  }

  /**
   * 키워드를 타입별로 그룹화
   */
  _groupKeywordsByType(keywords) {
    const grouped = {};
    keywords.forEach((keyword) => {
      const type = keyword.keyword_type || "unknown";
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(keyword);
    });
    return grouped;
  }
}

module.exports = new ScrapingService();
