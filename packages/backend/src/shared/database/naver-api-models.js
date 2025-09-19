const mysql = require("mysql2/promise");

// MySQL 연결 설정
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "keyword_finder",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 네이버 검색 결과 저장
const saveNaverSearchResults = async (query, searchResults) => {
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
  } catch (error) {
    console.error("❌ 네이버 검색 결과 저장 오류:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// 네이버 데이터랩 트렌드 저장
const saveNaverDatalabTrends = async (query, trendData, options = {}) => {
  const connection = await pool.getConnection();
  try {
    const { device, gender, ageGroup } = options;

    // 기존 동일 조건 데이터 삭제
    await connection.execute(
      `
      DELETE FROM naver_datalab_trends 
      WHERE query = ? AND (device = ? OR (device IS NULL AND ? IS NULL))
      AND (gender = ? OR (gender IS NULL AND ? IS NULL)) 
      AND (age_group = ? OR (age_group IS NULL AND ? IS NULL))
    `,
      [query, device, device, gender, gender, ageGroup, ageGroup]
    );

    // 새 데이터 삽입
    for (const item of trendData) {
      await connection.execute(
        `
        INSERT INTO naver_datalab_trends 
        (query, period, ratio, device, gender, age_group)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [
          query,
          item.period,
          item.ratio,
          device || null,
          gender || null,
          ageGroup || null,
        ]
      );
    }

    console.log(
      `✅ 네이버 데이터랩 트렌드 저장 완료: ${query} (${trendData.length}개)`
    );
  } catch (error) {
    console.error("❌ 네이버 데이터랩 트렌드 저장 오류:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// 네이버 연관 키워드 저장
const saveNaverRelatedKeywords = async (query, relatedKeywords) => {
  const connection = await pool.getConnection();
  try {
    // 기존 데이터 삭제
    await connection.execute(
      "DELETE FROM naver_related_keywords WHERE query = ?",
      [query]
    );

    // 새 데이터 삽입
    for (const item of relatedKeywords) {
      await connection.execute(
        `
        INSERT INTO naver_related_keywords 
        (query, related_keyword, monthly_pc_qc_cnt, monthly_mobile_qc_cnt,
         monthly_ave_pc_clk_cnt, monthly_ave_mobile_clk_cnt,
         monthly_ave_pc_ctr, monthly_ave_mobile_ctr, pl_avg_depth, comp_idx)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          query,
          item.relKeyword,
          item.monthlyPcQcCnt || 0,
          item.monthlyMobileQcCnt || 0,
          item.monthlyAvePcClkCnt || 0,
          item.monthlyAveMobileClkCnt || 0,
          item.monthlyAvePcCtr || 0,
          item.monthlyAveMobileCtr || 0,
          item.plAvgDepth || 0,
          item.compIdx || "0",
        ]
      );
    }

    console.log(
      `✅ 네이버 연관 키워드 저장 완료: ${query} (${relatedKeywords.length}개)`
    );
  } catch (error) {
    console.error("❌ 네이버 연관 키워드 저장 오류:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// 네이버 종합 분석 결과 저장
const saveNaverComprehensiveAnalysis = async (query, analysisData) => {
  const connection = await pool.getConnection();
  try {
    const cacheKey = `analysis_${query.toLowerCase().trim()}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1시간 후 만료

    // 기존 데이터 삭제
    await connection.execute(
      "DELETE FROM naver_comprehensive_analysis WHERE query = ?",
      [query]
    );

    // 새 데이터 삽입
    await connection.execute(
      `
      INSERT INTO naver_comprehensive_analysis 
      (query, analysis_data, cache_key, expires_at)
      VALUES (?, ?, ?, ?)
    `,
      [
        query,
        typeof analysisData === "object"
          ? JSON.stringify(analysisData)
          : analysisData,
        cacheKey,
        expiresAt,
      ]
    );

    console.log(`✅ 네이버 종합 분석 결과 저장 완료: ${query}`);
  } catch (error) {
    console.error("❌ 네이버 종합 분석 결과 저장 오류:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// 저장된 네이버 검색 결과 조회
const getNaverSearchResults = async (query, limit = 10) => {
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
};

// 저장된 네이버 데이터랩 트렌드 조회
const getNaverDatalabTrends = async (query, options = {}) => {
  const connection = await pool.getConnection();
  try {
    const { device, gender, ageGroup } = options;

    const [rows] = await connection.execute(
      `
      SELECT * FROM naver_datalab_trends 
      WHERE query = ? AND (device = ? OR (device IS NULL AND ? IS NULL))
      AND (gender = ? OR (gender IS NULL AND ? IS NULL)) 
      AND (age_group = ? OR (age_group IS NULL AND ? IS NULL))
      ORDER BY period ASC
    `,
      [query, device, device, gender, gender, ageGroup, ageGroup]
    );

    return rows;
  } catch (error) {
    console.error("❌ 네이버 데이터랩 트렌드 조회 오류:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// 저장된 네이버 연관 키워드 조회
const getNaverRelatedKeywords = async (query, limit = 20) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `
      SELECT * FROM naver_related_keywords 
      WHERE query = ? 
      ORDER BY monthly_pc_qc_cnt DESC, monthly_mobile_qc_cnt DESC
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
};

// 저장된 네이버 종합 분석 결과 조회 (캐시 확인)
const getNaverComprehensiveAnalysis = async (query) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `
      SELECT * FROM naver_comprehensive_analysis 
      WHERE query = ? AND expires_at > NOW()
      ORDER BY created_at DESC 
      LIMIT 1
    `,
      [query]
    );

    if (rows.length > 0) {
      const analysisData = rows[0].analysis_data;

      // 데이터 타입 확인
      if (typeof analysisData === "string") {
        try {
          return JSON.parse(analysisData);
        } catch (parseError) {
          console.error(
            `❌ JSON 파싱 오류 - query: ${query}, data: ${analysisData.substring(
              0,
              100
            )}...`
          );
          console.error("파싱 오류 상세:", parseError);
          return null;
        }
      } else if (typeof analysisData === "object" && analysisData !== null) {
        // 이미 객체인 경우 (MySQL JSON 타입)
        return analysisData;
      } else {
        console.error(
          `❌ 예상치 못한 데이터 타입 - query: ${query}, type: ${typeof analysisData}, data:`,
          analysisData
        );
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("❌ 네이버 종합 분석 결과 조회 오류:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// 통합 데이터 조회 (크롤링 + 네이버 API)
const getIntegratedKeywordData = async (query) => {
  const connection = await pool.getConnection();
  try {
    // 1. 크롤링 데이터 조회
    const [crawlingRows] = await connection.execute(
      `
      SELECT keyword_type, text, rank, \`grp\`, created_at
      FROM naver_keywords 
      WHERE query = ? 
      ORDER BY keyword_type, rank ASC
    `,
      [query]
    );

    // 2. 네이버 API 데이터 조회
    const searchResults = await getNaverSearchResults(query, 5);
    const trendData = await getNaverDatalabTrends(query);
    const relatedKeywords = await getNaverRelatedKeywords(query, 10);
    const comprehensiveAnalysis = await getNaverComprehensiveAnalysis(query);

    return {
      query,
      crawlingData: crawlingRows,
      naverApiData: {
        searchResults,
        trendData,
        relatedKeywords,
        comprehensiveAnalysis,
      },
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ 통합 키워드 데이터 조회 오류:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// 만료된 캐시 정리
const cleanExpiredCache = async () => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(`
      DELETE FROM naver_comprehensive_analysis 
      WHERE expires_at < NOW()
    `);

    console.log(`🧹 만료된 캐시 정리 완료: ${result.affectedRows}개 삭제`);
    return result.affectedRows;
  } catch (error) {
    console.error("❌ 캐시 정리 오류:", error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  // 저장 함수들
  saveNaverSearchResults,
  saveNaverDatalabTrends,
  saveNaverRelatedKeywords,
  saveNaverComprehensiveAnalysis,

  // 조회 함수들
  getNaverSearchResults,
  getNaverDatalabTrends,
  getNaverRelatedKeywords,
  getNaverComprehensiveAnalysis,
  getIntegratedKeywordData,

  // 유틸리티
  cleanExpiredCache,
  pool,
};
