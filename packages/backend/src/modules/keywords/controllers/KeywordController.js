const KeywordService = require("../services/KeywordService");

class KeywordController {
  constructor() {
    this.keywordService = KeywordService;
  }

  /**
   * 키워드 목록 조회 API
   */
  async getKeywords(req, res) {
    try {
      const {
        query,
        keyword_type,
        category,
        limit = 100,
        offset = 0,
      } = req.query;

      const filters = {};
      if (query) filters.query = query;
      if (keyword_type) filters.keyword_type = keyword_type;
      if (category) filters.category = category;

      const result = await this.keywordService.getKeywords(
        filters,
        parseInt(limit),
        parseInt(offset)
      );

      res.json({
        success: true,
        data: result.keywords,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("❌ KeywordController.getKeywords 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "키워드 조회 중 오류가 발생했습니다.",
      });
    }
  }

  /**
   * 키워드 통계 조회 API
   */
  async getKeywordStats(req, res) {
    try {
      const stats = await this.keywordService.getKeywordStatistics();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("❌ KeywordController.getKeywordStats 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "키워드 통계 조회 중 오류가 발생했습니다.",
      });
    }
  }

  /**
   * 키워드 삭제 API
   */
  async deleteKeywords(req, res) {
    try {
      const { query } = req.params;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: "삭제할 쿼리가 필요합니다.",
        });
      }

      await this.keywordService.deleteKeywords(query);

      res.json({
        success: true,
        message: `키워드가 성공적으로 삭제되었습니다: ${query}`,
      });
    } catch (error) {
      console.error("❌ KeywordController.deleteKeywords 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "키워드 삭제 중 오류가 발생했습니다.",
      });
    }
  }

  /**
   * 키워드 저장 API
   */
  async saveKeywords(req, res) {
    try {
      const { keywords } = req.body;

      if (!keywords || !Array.isArray(keywords)) {
        return res.status(400).json({
          success: false,
          error: "키워드 데이터가 필요합니다.",
        });
      }

      await this.keywordService.saveKeywords(keywords);

      res.json({
        success: true,
        message: `키워드가 성공적으로 저장되었습니다: ${keywords.length}개`,
      });
    } catch (error) {
      console.error("❌ KeywordController.saveKeywords 오류:", error);
      res.status(500).json({
        success: false,
        error: error.message || "키워드 저장 중 오류가 발생했습니다.",
      });
    }
  }
}

module.exports = new KeywordController();
