const naverApiDao = require("../../../shared/database/naver-api-dao");

/**
 * 네이버 API DAO 래퍼 클래스
 * 모듈 레이어에서 공통 DAO를 사용하기 위한 래퍼
 */
class NaverApiDao {
  constructor() {
    this.dao = naverApiDao;
  }

  // ========== 검색 결과 관련 ==========

  async saveSearchResults(query, searchResults) {
    try {
      return await this.dao.saveNaverSearchResults(query, searchResults);
    } catch (error) {
      console.error("❌ NaverApiDao.saveSearchResults 오류:", error);
      throw error;
    }
  }

  async getSearchResults(query, limit = 10) {
    try {
      return await this.dao.getNaverSearchResults(query, limit);
    } catch (error) {
      console.error("❌ NaverApiDao.getSearchResults 오류:", error);
      throw error;
    }
  }

  // ========== 데이터랩 트렌드 관련 ==========

  async saveDatalabTrends(query, trendData, options = {}) {
    try {
      return await this.dao.saveNaverDatalabTrends(query, trendData, options);
    } catch (error) {
      console.error("❌ NaverApiDao.saveDatalabTrends 오류:", error);
      throw error;
    }
  }

  async getDatalabTrends(query, options = {}) {
    try {
      return await this.dao.getNaverDatalabTrends(query, options);
    } catch (error) {
      console.error("❌ NaverApiDao.getDatalabTrends 오류:", error);
      throw error;
    }
  }

  // ========== 연관 키워드 관련 ==========

  async saveRelatedKeywords(query, relatedKeywords) {
    try {
      return await this.dao.saveNaverRelatedKeywords(query, relatedKeywords);
    } catch (error) {
      console.error("❌ NaverApiDao.saveRelatedKeywords 오류:", error);
      throw error;
    }
  }

  async getRelatedKeywords(query, limit = 20) {
    try {
      return await this.dao.getNaverRelatedKeywords(query, limit);
    } catch (error) {
      console.error("❌ NaverApiDao.getRelatedKeywords 오류:", error);
      throw error;
    }
  }

  // ========== 종합 분석 관련 ==========

  async saveComprehensiveAnalysis(query, analysisData) {
    try {
      return await this.dao.saveNaverComprehensiveAnalysis(query, analysisData);
    } catch (error) {
      console.error("❌ NaverApiDao.saveComprehensiveAnalysis 오류:", error);
      throw error;
    }
  }

  async getComprehensiveAnalysis(query) {
    try {
      return await this.dao.getNaverComprehensiveAnalysis(query);
    } catch (error) {
      console.error("❌ NaverApiDao.getComprehensiveAnalysis 오류:", error);
      throw error;
    }
  }

  // ========== 통합 데이터 관련 ==========

  async getIntegratedKeywordData(query) {
    try {
      return await this.dao.getIntegratedKeywordData(query);
    } catch (error) {
      console.error("❌ NaverApiDao.getIntegratedKeywordData 오류:", error);
      throw error;
    }
  }

  // ========== 캐시 관리 ==========

  async cleanExpiredCache() {
    try {
      return await this.dao.cleanExpiredCache();
    } catch (error) {
      console.error("❌ NaverApiDao.cleanExpiredCache 오류:", error);
      throw error;
    }
  }

  // ========== 직접 접근 (하위 호환성) ==========

  get naverApiModels() {
    return this.dao;
  }
}

module.exports = new NaverApiDao();
