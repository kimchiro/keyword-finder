require("dotenv").config();

/**
 * 데이터베이스 연결을 생성합니다.
 * MySQL 또는 PostgreSQL을 환경변수에 따라 선택합니다.
 */
async function getDbConnection() {
  const dbType = process.env.DB_TYPE || "mysql";

  if (dbType === "mysql") {
    const mysql = require("mysql2/promise");

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || "localhost",
      port: parseInt(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE || "naver_keywords",
      charset: "utf8mb4",
    });

    console.log("✅ MySQL 데이터베이스에 연결되었습니다.");
    return connection;
  } else if (dbType === "postgres") {
    const { Client } = require("pg");

    const client = new Client({
      host: process.env.POSTGRES_HOST || "localhost",
      port: parseInt(process.env.POSTGRES_PORT) || 5432,
      user: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE || "naver_keywords",
    });

    await client.connect();
    console.log("✅ PostgreSQL 데이터베이스에 연결되었습니다.");
    return client;
  } else {
    throw new Error(`지원하지 않는 데이터베이스 타입: ${dbType}`);
  }
}

/**
 * 키워드 데이터를 데이터베이스에 삽입합니다.
 */
async function insertKeywords(keywords) {
  const db = await getDbConnection();
  const dbType = process.env.DB_TYPE || "mysql";

  try {
    console.log(`${keywords.length}개의 키워드를 데이터베이스에 저장합니다...`);

    for (const keyword of keywords) {
      const query = `
        INSERT INTO naver_keywords 
        (query, keyword_type, text, href, imageAlt, rank, grp, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        keyword.query,
        keyword.keyword_type,
        keyword.text,
        keyword.href || null,
        keyword.imageAlt || null,
        keyword.rank,
        keyword.grp || 1,
        keyword.created_at,
      ];

      if (dbType === "postgres") {
        // PostgreSQL은 $1, $2 형식 사용
        const pgQuery = query.replace(/\?/g, (match, offset, string) => {
          const count = string.substring(0, offset).split("?").length;
          return `$${count}`;
        });
        await db.query(pgQuery, values);
      } else {
        // MySQL은 ? 형식 사용
        await db.query(query, values);
      }
    }

    console.log("✅ 모든 키워드가 성공적으로 저장되었습니다.");
  } catch (error) {
    console.error("❌ 데이터베이스 저장 중 오류 발생:", error);
    throw error;
  } finally {
    // 연결 종료
    if (dbType === "mysql") {
      await db.end();
    } else {
      await db.end();
    }
  }
}

/**
 * 키워드 데이터를 조회합니다.
 */
async function getKeywords(filters = {}, limit = 100, offset = 0) {
  const db = await getDbConnection();
  const dbType = process.env.DB_TYPE || "mysql";

  try {
    let query = "SELECT * FROM naver_keywords WHERE 1=1";
    const values = [];
    let paramIndex = 1;

    // 필터 조건 추가
    if (filters.query) {
      query += ` AND query = ${
        dbType === "postgres" ? `$${paramIndex++}` : "?"
      }`;
      values.push(filters.query);
    }

    if (filters.keyword_type) {
      query += ` AND keyword_type = ${
        dbType === "postgres" ? `$${paramIndex++}` : "?"
      }`;
      values.push(filters.keyword_type);
    }

    if (filters.start_date) {
      query += ` AND created_at >= ${
        dbType === "postgres" ? `$${paramIndex++}` : "?"
      }`;
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ` AND created_at <= ${
        dbType === "postgres" ? `$${paramIndex++}` : "?"
      }`;
      values.push(filters.end_date);
    }

    // 정렬 및 페이징
    query += " ORDER BY created_at DESC, rank ASC";
    query += ` LIMIT ${dbType === "postgres" ? `$${paramIndex++}` : "?"}`;
    values.push(limit);

    if (offset > 0) {
      query += ` OFFSET ${dbType === "postgres" ? `$${paramIndex++}` : "?"}`;
      values.push(offset);
    }

    const result = await db.query(query, values);
    return dbType === "postgres" ? result.rows : result[0];
  } catch (error) {
    console.error("❌ 키워드 조회 중 오류 발생:", error);
    throw error;
  } finally {
    if (dbType === "mysql") {
      await db.end();
    } else {
      await db.end();
    }
  }
}

/**
 * 키워드 통계를 조회합니다.
 */
async function getKeywordStats() {
  const db = await getDbConnection();
  const dbType = process.env.DB_TYPE || "mysql";

  try {
    // 총 키워드 수
    const totalQuery = "SELECT COUNT(*) as total FROM naver_keywords";
    const totalResult = await db.query(totalQuery);
    const total =
      dbType === "postgres"
        ? totalResult.rows[0].total
        : totalResult[0][0].total;

    // 타입별 키워드 수
    const typeQuery =
      "SELECT keyword_type, COUNT(*) as count FROM naver_keywords GROUP BY keyword_type";
    const typeResult = await db.query(typeQuery);
    const typeData = dbType === "postgres" ? typeResult.rows : typeResult[0];

    const keywordsByType = {};
    typeData.forEach((row) => {
      keywordsByType[row.keyword_type] = parseInt(row.count);
    });

    // 최근 검색어 (최근 10개)
    const recentQuery =
      "SELECT DISTINCT query FROM naver_keywords ORDER BY created_at DESC LIMIT 10";
    const recentResult = await db.query(recentQuery);
    const recentData =
      dbType === "postgres" ? recentResult.rows : recentResult[0];
    const recentQueries = recentData.map((row) => row.query);

    // 인기 키워드 (상위 20개)
    const topQuery = `
      SELECT text, COUNT(*) as count 
      FROM naver_keywords 
      GROUP BY text 
      ORDER BY count DESC 
      LIMIT 20
    `;
    const topResult = await db.query(topQuery);
    const topData = dbType === "postgres" ? topResult.rows : topResult[0];
    const topKeywords = topData.map((row) => ({
      text: row.text,
      count: parseInt(row.count),
    }));

    return {
      totalKeywords: parseInt(total),
      keywordsByType,
      recentQueries,
      topKeywords,
    };
  } catch (error) {
    console.error("❌ 통계 조회 중 오류 발생:", error);
    throw error;
  } finally {
    if (dbType === "mysql") {
      await db.end();
    } else {
      await db.end();
    }
  }
}

module.exports = {
  getDbConnection,
  insertKeywords,
  getKeywords,
  getKeywordStats,
};
