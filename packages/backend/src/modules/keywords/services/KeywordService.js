const KeywordDao = require("../dao/KeywordDao");

class KeywordService {
  constructor() {
    this.keywordDao = KeywordDao;
  }

  /**
   * 키워드 목록 조회 (필터링 및 페이징)
   */
  async getKeywords(filters = {}, limit = 100, offset = 0) {
    try {
      // 입력 검증
      if (limit <= 0 || limit > 1000) {
        throw new Error("limit은 1~1000 사이의 값이어야 합니다.");
      }
      if (offset < 0) {
        throw new Error("offset은 0 이상이어야 합니다.");
      }

      const keywords = await this.keywordDao.findKeywords(
        filters,
        limit,
        offset
      );

      return {
        keywords,
        pagination: {
          limit,
          offset,
          total: keywords.length,
        },
      };
    } catch (error) {
      console.error("❌ KeywordService.getKeywords 오류:", error);
      throw error;
    }
  }

  /**
   * 키워드 통계 조회
   */
  async getKeywordStatistics() {
    try {
      const stats = await this.keywordDao.getKeywordStats();

      // 통계 데이터 가공
      const processedStats = {
        ...stats,
        summary: {
          totalKeywords: stats.totalKeywords,
          totalQueries: stats.recentQueries.length,
          topKeywordsCount: stats.topKeywords.length,
          keywordTypeCount: Object.keys(stats.keywordsByType).length,
        },
      };

      return processedStats;
    } catch (error) {
      console.error("❌ KeywordService.getKeywordStatistics 오류:", error);
      throw error;
    }
  }

  /**
   * 키워드 삭제
   */
  async deleteKeywords(query) {
    try {
      if (!query || typeof query !== "string") {
        throw new Error("유효한 쿼리가 필요합니다.");
      }

      const result = await this.keywordDao.deleteKeywordsByQuery(query);

      console.log(`✅ 키워드 삭제 완료: ${query}`);
      return result;
    } catch (error) {
      console.error("❌ KeywordService.deleteKeywords 오류:", error);
      throw error;
    }
  }

  /**
   * 키워드 저장
   */
  async saveKeywords(keywordData) {
    try {
      // 데이터 검증
      if (!keywordData || !Array.isArray(keywordData)) {
        throw new Error("키워드 데이터는 배열이어야 합니다.");
      }

      const result = await this.keywordDao.saveKeywords(keywordData);

      console.log(`✅ 키워드 저장 완료: ${keywordData.length}개`);
      return result;
    } catch (error) {
      console.error("❌ KeywordService.saveKeywords 오류:", error);
      throw error;
    }
  }
}

module.exports = new KeywordService();
