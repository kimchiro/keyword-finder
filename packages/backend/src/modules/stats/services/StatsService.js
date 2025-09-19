const KeywordService = require("../../keywords/services/KeywordService");
const NaverApiDao = require("../../naver-api/dao/NaverApiDao");

class StatsService {
  constructor() {
    this.keywordService = KeywordService;
    this.naverApiDao = NaverApiDao;
  }

  /**
   * 대시보드 통계 조회 (실제 검색 기록 포함)
   */
  async getDashboardStats() {
    try {
      // 기본 키워드 통계 조회
      const keywordStats = await this.keywordService.getKeywordStatistics();

      // 실제 검색 기록을 naver_search_results에서 가져오기
      const recentSearchQueries = await this._getRecentSearchQueries();

      // 실제 검색 기록으로 recentQueries 교체
      keywordStats.recentQueries = recentSearchQueries;

      return {
        success: true,
        data: keywordStats,
      };
    } catch (error) {
      console.error("❌ StatsService.getDashboardStats 오류:", error);
      throw error;
    }
  }

  /**
   * 실제 검색 기록 조회 (최근 50개)
   */
  async _getRecentSearchQueries() {
    try {
      const connection =
        await this.naverApiDao.naverApiModels.pool.getConnection();
      try {
        const [recentSearchRows] = await connection.execute(`
          SELECT DISTINCT query, MAX(created_at) as last_search 
          FROM naver_search_results 
          GROUP BY query 
          ORDER BY last_search DESC 
          LIMIT 50
        `);

        return recentSearchRows.map((row) => row.query);
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("❌ StatsService._getRecentSearchQueries 오류:", error);
      // 오류 시 빈 배열 반환
      return [];
    }
  }

  /**
   * 키워드 검색 통계
   */
  async getKeywordSearchStats(query) {
    try {
      if (!query) {
        throw new Error("검색어가 필요합니다.");
      }

      // 크롤링된 키워드 통계
      const scrapedKeywords = await this.keywordService.getKeywords(
        { query },
        1000,
        0
      );

      // 네이버 API 데이터 통계
      const searchResults = await this.naverApiDao.getSearchResults(query, 100);
      const trendData = await this.naverApiDao.getDatalabTrends(query);
      const relatedKeywords = await this.naverApiDao.getRelatedKeywords(
        query,
        100
      );

      return {
        success: true,
        data: {
          query,
          scrapedKeywords: {
            total: scrapedKeywords.keywords.length,
            byType: this._groupByType(scrapedKeywords.keywords),
          },
          naverApiData: {
            searchResults: searchResults.length,
            trendDataPoints: trendData.length,
            relatedKeywords: relatedKeywords.length,
          },
          lastUpdated: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("❌ StatsService.getKeywordSearchStats 오류:", error);
      throw error;
    }
  }

  /**
   * 전체 시스템 통계
   */
  async getSystemStats() {
    try {
      const keywordStats = await this.keywordService.getKeywordStatistics();

      // 추가 시스템 통계
      const connection =
        await this.naverApiDao.naverApiModels.pool.getConnection();
      try {
        // 네이버 API 데이터 통계
        const [searchResultsCount] = await connection.execute(
          "SELECT COUNT(*) as count FROM naver_search_results"
        );
        const [trendsCount] = await connection.execute(
          "SELECT COUNT(*) as count FROM naver_datalab_trends"
        );
        const [relatedKeywordsCount] = await connection.execute(
          "SELECT COUNT(*) as count FROM naver_related_keywords"
        );
        const [analysisCount] = await connection.execute(
          "SELECT COUNT(*) as count FROM naver_comprehensive_analysis"
        );

        return {
          success: true,
          data: {
            keywords: keywordStats,
            naverApiData: {
              searchResults: searchResultsCount[0].count,
              trendData: trendsCount[0].count,
              relatedKeywords: relatedKeywordsCount[0].count,
              comprehensiveAnalysis: analysisCount[0].count,
            },
            systemInfo: {
              uptime: process.uptime(),
              memoryUsage: process.memoryUsage(),
              nodeVersion: process.version,
              platform: process.platform,
            },
            generatedAt: new Date().toISOString(),
          },
        };
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("❌ StatsService.getSystemStats 오류:", error);
      throw error;
    }
  }

  /**
   * 키워드를 타입별로 그룹화
   */
  _groupByType(keywords) {
    const grouped = {};
    keywords.forEach((keyword) => {
      const type = keyword.keyword_type || "unknown";
      if (!grouped[type]) {
        grouped[type] = 0;
      }
      grouped[type]++;
    });
    return grouped;
  }
}

module.exports = new StatsService();
