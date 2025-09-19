const { pool } = require("./connection");

/**
 * 네이버 API 데이터 액세스 객체
 * 모든 네이버 API 관련 데이터베이스 작업을 담당
 */
class NaverApiDao {
  // ========== 검색 결과 관련 ==========

  /**
   * 네이버 검색 결과 저장
   */
  async saveNaverSearchResults(query, searchResults) {
    const connection = await pool.getConnection();
    try {
      // 기존 데이터 삭제 (최신 데이터로 교체)
      await connection.execute(
        "DELETE FROM naver_search_results WHERE query = ?",
        [query]
      );

      // 새 데이터 삽입
      for (const item of searchResults) {
        await connection.execute(
          `
          INSERT INTO naver_search_results 
          (query, title, link, description, bloggername, bloggerlink, postdate)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
          [
            query,
            item.title,
            item.link,
            item.description,
            item.bloggername,
            item.bloggerlink,
            item.postdate,
          ]
        );
      }

      console.log(
        `✅ 네이버 검색 결과 저장 완료: ${query} (${searchResults.length}개)`
      );
      return { success: true, count: searchResults.length };
    } catch (error) {
      console.error("❌ 네이버 검색 결과 저장 오류:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 네이버 검색 결과 조회
   */
  async getNaverSearchResults(query, limit = 10) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `
        SELECT * FROM naver_search_results 
        WHERE query = ? 
        ORDER BY created_at DESC 
        LIMIT ?
      `,
        [query, limit]
      );
      return rows;
    } catch (error) {
      console.error("❌ 네이버 검색 결과 조회 오류:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // ========== 데이터랩 트렌드 관련 ==========

  /**
   * 네이버 데이터랩 트렌드 저장
   */
  async saveNaverDatalabTrends(query, trendData, options = {}) {
    const connection = await pool.getConnection();
    try {
      const { device = null, gender = null, ageGroup = null } = options;

      // 기존 데이터 삭제
      await connection.execute(
        "DELETE FROM naver_datalab_trends WHERE query = ? AND device = ? AND gender = ? AND age_group = ?",
        [query, device, gender, ageGroup]
      );

      // 새 데이터 삽입
      for (const item of trendData) {
        await connection.execute(
          `
          INSERT INTO naver_datalab_trends 
          (query, period, ratio, device, gender, age_group)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
          [query, item.period, item.ratio, device, gender, ageGroup]
        );
      }

      console.log(
        `✅ 네이버 데이터랩 트렌드 저장 완료: ${query} (${trendData.length}개)`
      );
      return { success: true, count: trendData.length };
    } catch (error) {
      console.error("❌ 네이버 데이터랩 트렌드 저장 오류:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 네이버 데이터랩 트렌드 조회
   */
  async getNaverDatalabTrends(query, options = {}) {
    const connection = await pool.getConnection();
    try {
      const { device = null, gender = null, ageGroup = null } = options;

      const [rows] = await connection.execute(
        `
        SELECT * FROM naver_datalab_trends 
        WHERE query = ? AND device = ? AND gender = ? AND age_group = ?
        ORDER BY period ASC
      `,
        [query, device, gender, ageGroup]
      );
      return rows;
    } catch (error) {
      console.error("❌ 네이버 데이터랩 트렌드 조회 오류:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // ========== 연관 키워드 관련 ==========

  /**
   * 네이버 연관 키워드 저장
   */
  async saveNaverRelatedKeywords(query, relatedKeywords) {
    const connection = await pool.getConnection();
    try {
      // 기존 데이터 삭제
      await connection.execute(
        "DELETE FROM naver_related_keywords WHERE query = ?",
        [query]
      );

      // 새 데이터 삽입
      for (const keyword of relatedKeywords) {
        await connection.execute(
          `
          INSERT INTO naver_related_keywords 
          (query, related_keyword, monthly_pc_qc_cnt, monthly_mobile_qc_cnt, 
           monthly_ave_pc_clk_cnt, monthly_ave_mobile_clk_cnt, monthly_ave_pc_ctr, 
           monthly_ave_mobile_ctr, pc_comp_idx, mobile_comp_idx)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            query,
            keyword.relKeyword,
            keyword.monthlyPcQcCnt,
            keyword.monthlyMobileQcCnt,
            keyword.monthlyAvePcClkCnt,
            keyword.monthlyAveMobileClkCnt,
            keyword.monthlyAvePcCtr,
            keyword.monthlyAveMobileCtr,
            keyword.pcCompIdx,
            keyword.mobileCompIdx,
          ]
        );
      }

      console.log(
        `✅ 네이버 연관 키워드 저장 완료: ${query} (${relatedKeywords.length}개)`
      );
      return { success: true, count: relatedKeywords.length };
    } catch (error) {
      console.error("❌ 네이버 연관 키워드 저장 오류:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 네이버 연관 키워드 조회
   */
  async getNaverRelatedKeywords(query, limit = 20) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `
        SELECT * FROM naver_related_keywords 
        WHERE query = ? 
        ORDER BY monthly_pc_qc_cnt DESC 
        LIMIT ?
      `,
        [query, limit]
      );
      return rows;
    } catch (error) {
      console.error("❌ 네이버 연관 키워드 조회 오류:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // ========== 종합 분석 관련 ==========

  /**
   * 네이버 종합 분석 결과 저장
   */
  async saveNaverComprehensiveAnalysis(query, analysisData) {
    const connection = await pool.getConnection();
    try {
      // 기존 데이터 삭제
      await connection.execute(
        "DELETE FROM naver_comprehensive_analysis WHERE query = ?",
        [query]
      );

      // 새 데이터 삽입
      await connection.execute(
        `
        INSERT INTO naver_comprehensive_analysis 
        (query, analysis_data, generated_at)
        VALUES (?, ?, ?)
      `,
        [query, JSON.stringify(analysisData), new Date()]
      );

      console.log(`✅ 네이버 종합 분석 저장 완료: ${query}`);
      return { success: true };
    } catch (error) {
      console.error("❌ 네이버 종합 분석 저장 오류:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 네이버 종합 분석 결과 조회
   */
  async getNaverComprehensiveAnalysis(query) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `
        SELECT * FROM naver_comprehensive_analysis 
        WHERE query = ? 
        AND generated_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
        ORDER BY generated_at DESC 
        LIMIT 1
      `,
        [query]
      );

      if (rows.length > 0) {
        return JSON.parse(rows[0].analysis_data);
      }
      return null;
    } catch (error) {
      console.error("❌ 네이버 종합 분석 조회 오류:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // ========== 통합 데이터 관련 ==========

  /**
   * 통합 키워드 데이터 조회
   */
  async getIntegratedKeywordData(query) {
    const connection = await pool.getConnection();
    try {
      // 크롤링된 키워드 데이터
      const [crawlingRows] = await connection.execute(
        `
        SELECT keyword_type, text, rank, \`grp\`, created_at
        FROM naver_keywords
        WHERE query = ?
        ORDER BY keyword_type, rank ASC
      `,
        [query]
      );

      // 네이버 API 데이터
      const [searchRows] = await connection.execute(
        "SELECT COUNT(*) as count FROM naver_search_results WHERE query = ?",
        [query]
      );

      const [trendRows] = await connection.execute(
        "SELECT COUNT(*) as count FROM naver_datalab_trends WHERE query = ?",
        [query]
      );

      const [relatedRows] = await connection.execute(
        "SELECT COUNT(*) as count FROM naver_related_keywords WHERE query = ?",
        [query]
      );

      return {
        query,
        crawlingData: {
          keywords: crawlingRows,
          total: crawlingRows.length,
        },
        naverApiData: {
          searchResults: searchRows[0].count,
          trendData: trendRows[0].count,
          relatedKeywords: relatedRows[0].count,
        },
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ 통합 키워드 데이터 조회 오류:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // ========== 캐시 관리 ==========

  /**
   * 만료된 캐시 정리
   */
  async cleanExpiredCache() {
    const connection = await pool.getConnection();
    try {
      // 7일 이상 된 데이터 삭제
      const [result1] = await connection.execute(
        "DELETE FROM naver_search_results WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)"
      );

      const [result2] = await connection.execute(
        "DELETE FROM naver_datalab_trends WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)"
      );

      const [result3] = await connection.execute(
        "DELETE FROM naver_related_keywords WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)"
      );

      const [result4] = await connection.execute(
        "DELETE FROM naver_comprehensive_analysis WHERE generated_at < DATE_SUB(NOW(), INTERVAL 7 DAY)"
      );

      const totalDeleted =
        result1.affectedRows +
        result2.affectedRows +
        result3.affectedRows +
        result4.affectedRows;

      console.log(`✅ 만료된 캐시 정리 완료: ${totalDeleted}개 레코드 삭제`);
      return totalDeleted;
    } catch (error) {
      console.error("❌ 캐시 정리 오류:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new NaverApiDao();
