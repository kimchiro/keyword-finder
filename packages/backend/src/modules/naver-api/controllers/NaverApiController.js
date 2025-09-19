const NaverApiService = require("../services/NaverApiService");

class NaverApiController {
  constructor() {
    this.naverApiService = NaverApiService;
  }

  // ========== 네이버 검색 API ==========

  /**
   * 네이버 블로그 검색 API
   */
  async searchBlog(req, res) {
    try {
      const { query, display = 10, start = 1, sort = "sim" } = req.body;

      if (!query || typeof query !== "string" || query.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "검색어가 필요합니다.",
        });
      }

      const result = await this.naverApiService.searchBlog(query, {
        display,
        start,
        sort,
      });

      res.json(result);
    } catch (error) {
      console.error("❌ NaverApiController.searchBlog 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "네이버 검색 API 호출 중 오류가 발생했습니다.",
      });
    }
  }

  // ========== 네이버 데이터랩 API ==========

  /**
   * 네이버 데이터랩 트렌드 API
   */
  async getDatalabTrends(req, res) {
    try {
      const {
        startDate,
        endDate,
        timeUnit,
        keywordGroups,
        device = "",
        gender = "",
        ages = [],
      } = req.body;

      if (
        !startDate ||
        !endDate ||
        !keywordGroups ||
        !Array.isArray(keywordGroups)
      ) {
        return res.status(400).json({
          success: false,
          error:
            "필수 파라미터가 누락되었습니다. (startDate, endDate, keywordGroups)",
        });
      }

      const result = await this.naverApiService.getDatalabTrends({
        startDate,
        endDate,
        timeUnit,
        keywordGroups,
        device,
        gender,
        ages,
      });

      res.json(result);
    } catch (error) {
      console.error("❌ NaverApiController.getDatalabTrends 오류:", error);
      res.status(500).json({
        success: false,
        error:
          error.message || "네이버 데이터랩 API 호출 중 오류가 발생했습니다.",
      });
    }
  }

  // ========== DB 조회 API ==========

  /**
   * DB에서 네이버 검색 결과 조회 API
   */
  async getStoredSearchResults(req, res) {
    try {
      const { query } = req.params;
      const { limit = 10 } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: "검색어가 필요합니다.",
        });
      }

      // limit 파라미터 검증
      const parsedLimit = parseInt(limit);
      const validLimit =
        isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;

      const result = await this.naverApiService.getStoredSearchResults(
        query,
        validLimit
      );
      res.json(result);
    } catch (error) {
      console.error(
        "❌ NaverApiController.getStoredSearchResults 오류:",
        error
      );
      res.status(500).json({
        success: false,
        error: error.message || "네이버 검색 결과 조회 중 오류가 발생했습니다.",
      });
    }
  }

  /**
   * DB에서 네이버 트렌드 데이터 조회 API
   */
  async getStoredTrendData(req, res) {
    try {
      const { query } = req.params;
      const { device, gender, ageGroup } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: "검색어가 필요합니다.",
        });
      }

      const result = await this.naverApiService.getStoredTrendData(query, {
        device: device || null,
        gender: gender || null,
        ageGroup: ageGroup || null,
      });

      res.json(result);
    } catch (error) {
      console.error("❌ NaverApiController.getStoredTrendData 오류:", error);
      res.status(500).json({
        success: false,
        error:
          error.message || "네이버 트렌드 데이터 조회 중 오류가 발생했습니다.",
      });
    }
  }

  /**
   * 통합 키워드 데이터 조회 API
   */
  async getIntegratedData(req, res) {
    try {
      const { query } = req.params;

      if (!query || typeof query !== "string") {
        return res.status(400).json({
          success: false,
          error: "검색어가 필요합니다.",
        });
      }

      const result = await this.naverApiService.getIntegratedData(query);
      res.json(result);
    } catch (error) {
      console.error("❌ NaverApiController.getIntegratedData 오류:", error);
      res.status(500).json({
        success: false,
        error:
          error.message || "통합 키워드 데이터 조회 중 오류가 발생했습니다.",
      });
    }
  }

  // ========== 캐시 관리 API ==========

  /**
   * 캐시 정리 API
   */
  async cleanCache(req, res) {
    try {
      const result = await this.naverApiService.naverApiDao.cleanExpiredCache();

      res.json({
        success: true,
        message: `만료된 캐시가 정리되었습니다.`,
        deletedCount: result,
      });
    } catch (error) {
      console.error("❌ NaverApiController.cleanCache 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "캐시 정리 중 오류가 발생했습니다.",
      });
    }
  }
}

module.exports = new NaverApiController();
