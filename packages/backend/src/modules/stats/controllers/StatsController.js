const StatsService = require("../services/StatsService");

class StatsController {
  constructor() {
    this.statsService = StatsService;
  }

  /**
   * 대시보드 통계 API
   */
  async getDashboardStats(req, res) {
    try {
      const result = await this.statsService.getDashboardStats();
      res.json(result);
    } catch (error) {
      console.error("❌ StatsController.getDashboardStats 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "대시보드 통계 조회 중 오류가 발생했습니다.",
      });
    }
  }

  /**
   * 키워드 검색 통계 API
   */
  async getKeywordSearchStats(req, res) {
    try {
      const { query } = req.params;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: "검색어가 필요합니다.",
        });
      }

      const result = await this.statsService.getKeywordSearchStats(query);
      res.json(result);
    } catch (error) {
      console.error("❌ StatsController.getKeywordSearchStats 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "키워드 검색 통계 조회 중 오류가 발생했습니다.",
      });
    }
  }

  /**
   * 전체 시스템 통계 API
   */
  async getSystemStats(req, res) {
    try {
      const result = await this.statsService.getSystemStats();
      res.json(result);
    } catch (error) {
      console.error("❌ StatsController.getSystemStats 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "시스템 통계 조회 중 오류가 발생했습니다.",
      });
    }
  }
}

module.exports = new StatsController();
