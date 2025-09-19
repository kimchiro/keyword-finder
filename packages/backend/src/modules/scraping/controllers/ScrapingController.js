const ScrapingService = require("../services/ScrapingService");

class ScrapingController {
  constructor() {
    this.scrapingService = ScrapingService;
  }

  /**
   * 네이버 키워드 스크래핑 API
   */
  async scrapeKeywords(req, res) {
    try {
      const { query, options = {} } = req.body;

      if (!query || typeof query !== "string" || query.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "검색어가 필요합니다.",
        });
      }

      const result = await this.scrapingService.scrapeNaverKeywords(
        query,
        options
      );
      res.json(result);
    } catch (error) {
      console.error("❌ ScrapingController.scrapeKeywords 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "키워드 스크래핑 중 오류가 발생했습니다.",
      });
    }
  }

  /**
   * 스크래핑된 키워드 조회 API
   */
  async getScrapedKeywords(req, res) {
    try {
      const { query } = req.params;
      const { keyword_type } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: "검색어가 필요합니다.",
        });
      }

      const result = await this.scrapingService.getScrapedKeywords(
        query,
        keyword_type
      );
      res.json(result);
    } catch (error) {
      console.error("❌ ScrapingController.getScrapedKeywords 오류:", error);
      res.status(500).json({
        success: false,
        error:
          error.message || "스크래핑된 키워드 조회 중 오류가 발생했습니다.",
      });
    }
  }

  /**
   * 배치 스크래핑 API
   */
  async batchScraping(req, res) {
    try {
      const { queries, options = {} } = req.body;

      if (!Array.isArray(queries) || queries.length === 0) {
        return res.status(400).json({
          success: false,
          error: "스크래핑할 키워드 배열이 필요합니다.",
        });
      }

      // 최대 처리 개수 제한
      if (queries.length > 50) {
        return res.status(400).json({
          success: false,
          error: "한 번에 최대 50개의 키워드까지 처리할 수 있습니다.",
        });
      }

      const result = await this.scrapingService.batchScraping(queries, options);
      res.json(result);
    } catch (error) {
      console.error("❌ ScrapingController.batchScraping 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "배치 스크래핑 중 오류가 발생했습니다.",
      });
    }
  }

  /**
   * 스크래핑 상태 확인 API
   */
  async getScrapingStatus(req, res) {
    try {
      const { query } = req.params;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: "검색어가 필요합니다.",
        });
      }

      const result = await this.scrapingService.getScrapingStatus(query);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("❌ ScrapingController.getScrapingStatus 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "스크래핑 상태 확인 중 오류가 발생했습니다.",
      });
    }
  }

  /**
   * 스크래핑 테스트 API (개발용)
   */
  async testScraping(req, res) {
    try {
      const { query = "테스트" } = req.body;

      const result = await this.scrapingService.scrapeNaverKeywords(query, {
        headless: false, // 브라우저 화면 표시
        timeout: 10000,
        saveToFile: false,
      });

      res.json({
        success: true,
        message: "테스트 스크래핑이 완료되었습니다.",
        data: result,
      });
    } catch (error) {
      console.error("❌ ScrapingController.testScraping 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "테스트 스크래핑 중 오류가 발생했습니다.",
      });
    }
  }
}

module.exports = new ScrapingController();
