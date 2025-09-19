const {
  keywordService,
} = require("../../../shared/database/typeorm-connection");

class KeywordDao {
  constructor() {
    this.keywordService = keywordService;
  }

  /**
   * 키워드 목록 조회
   */
  async findKeywords(filters = {}, limit = 100, offset = 0) {
    try {
      return await this.keywordService.getKeywords(filters, limit, offset);
    } catch (error) {
      console.error("❌ KeywordDao.findKeywords 오류:", error);
      throw error;
    }
  }

  /**
   * 키워드 통계 조회
   */
  async getKeywordStats() {
    try {
      return await this.keywordService.getKeywordStats();
    } catch (error) {
      console.error("❌ KeywordDao.getKeywordStats 오류:", error);
      throw error;
    }
  }

  /**
   * 특정 쿼리의 키워드 삭제
   */
  async deleteKeywordsByQuery(query) {
    try {
      return await this.keywordService.deleteKeywordsByQuery(query);
    } catch (error) {
      console.error("❌ KeywordDao.deleteKeywordsByQuery 오류:", error);
      throw error;
    }
  }

  /**
   * 키워드 저장
   */
  async saveKeywords(keywordData) {
    try {
      return await this.keywordService.insertKeywords(keywordData);
    } catch (error) {
      console.error("❌ KeywordDao.saveKeywords 오류:", error);
      throw error;
    }
  }
}

module.exports = new KeywordDao();
