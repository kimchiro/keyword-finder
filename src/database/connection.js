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

module.exports = {
  getDbConnection,
  insertKeywords,
};
