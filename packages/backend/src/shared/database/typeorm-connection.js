require("reflect-metadata");
const {
  AppDataSource,
  initializeDatabase,
  closeDatabase,
} = require("./data-source");
const { NaverKeyword } = require("./entities/NaverKeyword");

/**
 * TypeORM을 사용한 키워드 데이터베이스 서비스
 */
class KeywordService {
  constructor() {
    this.dataSource = null;
    this.repository = null;
  }

  /**
   * 데이터베이스 연결 초기화
   */
  async initialize() {
    try {
      this.dataSource = await initializeDatabase();
      this.repository = this.dataSource.getRepository("NaverKeyword");
      console.log("✅ KeywordService가 초기화되었습니다.");
    } catch (error) {
      console.error("❌ KeywordService 초기화 실패:", error);
      throw error;
    }
  }

  /**
   * 키워드 데이터를 데이터베이스에 삽입
   * @param {Array} keywords - 키워드 데이터 배열
   */
  async insertKeywords(keywords) {
    try {
      if (!this.repository) {
        await this.initialize();
      }

      console.log(
        `${keywords.length}개의 키워드를 데이터베이스에 저장합니다...`
      );

      // 배치 삽입을 위해 데이터 변환
      const keywordEntities = keywords.map((keyword) => ({
        query: keyword.query,
        keywordType: keyword.keyword_type,
        category: keyword.category || "일반",
        text: keyword.text,
        href: keyword.href || null,
        imageAlt: keyword.imageAlt || null,
        rank: keyword.rank,
        grp: keyword.grp || 1,
        createdAt: keyword.created_at || new Date(),
      }));

      // 배치 삽입 (성능 최적화)
      await this.repository.save(keywordEntities);

      console.log("✅ 모든 키워드가 성공적으로 저장되었습니다.");
      return { success: true, count: keywords.length };
    } catch (error) {
      console.error("❌ 데이터베이스 저장 중 오류 발생:", error);
      throw error;
    }
  }

  /**
   * 키워드 데이터 조회
   * @param {Object} filters - 필터 조건
   * @param {number} limit - 조회 개수 제한
   * @param {number} offset - 오프셋
   */
  async getKeywords(filters = {}, limit = 100, offset = 0) {
    try {
      if (!this.repository) {
        await this.initialize();
      }

      console.log("🔍 키워드 조회 시작:", { filters, limit, offset });

      const queryBuilder = this.repository.createQueryBuilder("keyword");

      // 필터 조건 추가
      if (filters.query) {
        console.log("📝 쿼리 필터 적용:", filters.query);
        queryBuilder.andWhere("keyword.query = :query", {
          query: filters.query,
        });
      }

      if (filters.keyword_type) {
        queryBuilder.andWhere("keyword.keywordType = :keywordType", {
          keywordType: filters.keyword_type,
        });
      }

      if (filters.category) {
        queryBuilder.andWhere("keyword.category = :category", {
          category: filters.category,
        });
      }

      if (filters.start_date) {
        queryBuilder.andWhere("keyword.createdAt >= :startDate", {
          startDate: filters.start_date,
        });
      }

      if (filters.end_date) {
        queryBuilder.andWhere("keyword.createdAt <= :endDate", {
          endDate: filters.end_date,
        });
      }

      // 정렬 및 페이징
      queryBuilder
        .orderBy("keyword.createdAt", "DESC")
        .addOrderBy("keyword.rank", "ASC")
        .limit(parseInt(limit) || 100)
        .offset(parseInt(offset) || 0);

      console.log("🔍 실행할 SQL:", queryBuilder.getSql());
      console.log("🔍 SQL 파라미터:", queryBuilder.getParameters());

      const keywords = await queryBuilder.getMany();
      console.log("📦 조회된 키워드 수:", keywords.length);

      if (keywords.length > 0) {
        console.log("📦 첫 번째 키워드 샘플:", keywords[0]);
      }

      // undefined 값들을 필터링하고 정리
      const filteredKeywords = keywords
        .filter((keyword) => {
          const isValid =
            keyword &&
            keyword.text &&
            typeof keyword.text === "string" &&
            keyword.keywordType &&
            typeof keyword.keywordType === "string";

          if (!isValid) {
            console.log("⚠️ 유효하지 않은 키워드 데이터:", keyword);
          }

          return isValid;
        })
        .map((keyword) => ({
          ...keyword,
          keyword_type: keyword.keywordType, // 프론트엔드 호환성을 위해 추가
        }));

      console.log("✅ 필터링된 키워드 수:", filteredKeywords.length);

      return filteredKeywords;
    } catch (error) {
      console.error("❌ 키워드 조회 중 오류 발생:", error);
      console.error("❌ 에러 스택:", error.stack);
      console.error("❌ 에러 타입:", error.constructor.name);
      throw error;
    }
  }

  /**
   * 키워드 통계 조회
   */
  async getKeywordStats() {
    try {
      if (!this.repository) {
        await this.initialize();
      }

      // 총 키워드 수
      const totalKeywords = await this.repository.count();

      // 타입별 키워드 수
      const typeStats = await this.repository
        .createQueryBuilder("keyword")
        .select("keyword.keywordType", "keywordType")
        .addSelect("COUNT(*)", "count")
        .groupBy("keyword.keywordType")
        .getRawMany();

      const keywordsByType = {};
      typeStats.forEach((stat) => {
        keywordsByType[stat.keywordType] = parseInt(stat.count);
      });

      // 최근 검색어 (최근 10개)
      const recentQueries = await this.repository
        .createQueryBuilder("keyword")
        .select("keyword.query", "query")
        .addSelect("MAX(keyword.createdAt)", "maxCreatedAt")
        .groupBy("keyword.query")
        .orderBy("maxCreatedAt", "DESC")
        .limit(10)
        .getRawMany();

      // 인기 키워드 (상위 20개) - "추가" 텍스트 제외
      const topKeywords = await this.repository
        .createQueryBuilder("keyword")
        .select("keyword.text", "text")
        .addSelect("COUNT(*)", "count")
        .where("keyword.text NOT LIKE :excludeText", { excludeText: "%추가%" })
        .groupBy("keyword.text")
        .orderBy("count", "DESC")
        .limit(20)
        .getRawMany();

      const formattedTopKeywords = topKeywords.map((item) => ({
        text: item.text,
        count: parseInt(item.count),
      }));

      return {
        totalKeywords,
        keywordsByType,
        recentQueries: recentQueries.map((item) => item.query),
        topKeywords: formattedTopKeywords,
      };
    } catch (error) {
      console.error("❌ 통계 조회 중 오류 발생:", error);
      throw error;
    }
  }

  /**
   * 특정 검색어의 키워드 삭제
   * @param {string} query - 삭제할 검색어
   */
  async deleteKeywordsByQuery(query) {
    try {
      if (!this.repository) {
        await this.initialize();
      }

      const result = await this.repository.delete({ query });
      console.log(
        `✅ '${query}' 검색어의 ${result.affected}개 키워드가 삭제되었습니다.`
      );
      return { success: true, deletedCount: result.affected };
    } catch (error) {
      console.error("❌ 키워드 삭제 중 오류 발생:", error);
      throw error;
    }
  }

  /**
   * 연결 종료
   */
  async close() {
    await closeDatabase();
  }
}

// 싱글톤 인스턴스
const keywordService = new KeywordService();

module.exports = {
  KeywordService,
  keywordService,
};
