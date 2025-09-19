const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

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

async function createTables() {
  const connection = await pool.getConnection();

  try {
    console.log("🚀 데이터베이스 테이블 생성 시작...");

    // 스키마 파일 읽기
    const schemaPath = path.join(__dirname, "../../database/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // SQL 문을 세미콜론으로 분리
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    // 각 SQL 문 실행
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log("✅ SQL 실행 성공:", statement.substring(0, 50) + "...");
        } catch (error) {
          if (
            error.message.includes("already exists") ||
            error.code === "ER_DUP_KEYNAME"
          ) {
            console.log("⚠️ 이미 존재:", statement.substring(0, 50) + "...");
          } else {
            console.error("❌ SQL 실행 오류:", error.message);
            console.error("SQL:", statement);
          }
        }
      }
    }

    // 테이블 생성 확인
    const [tables] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
      AND table_name LIKE 'naver_%'
      ORDER BY table_name
    `);

    console.log("\n📊 생성된 네이버 API 테이블:");
    tables.forEach((row) => {
      console.log(`  - ${row.table_name || row.TABLE_NAME}`);
    });

    console.log("\n🎉 데이터베이스 테이블 생성 완료!");
  } catch (error) {
    console.error("❌ 테이블 생성 중 오류 발생:", error);
  } finally {
    connection.release();
    await pool.end();
  }
}

// 스크립트 직접 실행 시
if (require.main === module) {
  createTables().catch(console.error);
}

module.exports = { createTables };
