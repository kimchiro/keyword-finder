const KeywordDao = require("../../keywords/dao/KeywordDao");

class ScrapingDao {
  constructor() {
    this.keywordDao = KeywordDao;
  }

  /**
   * 스크래핑된 키워드 저장
   */
  async saveScrapedKeywords(keywordData) {
    try {
      return await this.keywordDao.saveKeywords(keywordData);
    } catch (error) {
      console.error("❌ ScrapingDao.saveScrapedKeywords 오류:", error);
      throw error;
    }
  }

  /**
   * 기존 키워드 삭제 (새로운 스크래핑 데이터로 교체)
   */
  async deleteExistingKeywords(query) {
    try {
      return await this.keywordDao.deleteKeywordsByQuery(query);
    } catch (error) {
      console.error("❌ ScrapingDao.deleteExistingKeywords 오류:", error);
      throw error;
    }
  }

  /**
   * 스크래핑된 키워드 조회
   */
  async getScrapedKeywords(query, keywordType = null) {
    try {
      const filters = { query };
      if (keywordType) {
        filters.keyword_type = keywordType;
      }

      const result = await this.keywordDao.findKeywords(filters, 1000, 0);
      return result;
    } catch (error) {
      console.error("❌ ScrapingDao.getScrapedKeywords 오류:", error);
      throw error;
    }
  }
}

module.exports = new ScrapingDao();
