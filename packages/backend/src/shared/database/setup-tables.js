const fs = require("fs");
const path = require("path");
const { pool } = require("./connection");

/**
 * 데이터베이스 테이블 생성 및 초기화
 */
async function setupTables() {
  const connection = await pool.getConnection();

  try {
    console.log("🚀 데이터베이스 테이블 생성 시작...");

    // 스키마 파일 읽기
    const schemaPath = path.join(__dirname, "../../../database/schema.sql");

    if (!fs.existsSync(schemaPath)) {
      console.error("❌ 스키마 파일을 찾을 수 없습니다:", schemaPath);
      return;
    }

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
            error.code === "ER_DUP_KEYNAME" ||
            error.code === "ER_TABLE_EXISTS_ERROR"
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
      AND (table_name LIKE 'naver_%' OR table_name LIKE 'keyword_%')
      ORDER BY table_name
    `);

    console.log("\n📊 생성된 테이블:");
    tables.forEach((row) => {
      console.log(`  - ${row.table_name || row.TABLE_NAME}`);
    });

    console.log("\n🎉 데이터베이스 테이블 생성 완료!");
    return true;
  } catch (error) {
    console.error("❌ 테이블 생성 중 오류 발생:", error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 테이블 존재 여부 확인
 */
async function checkTables() {
  const connection = await pool.getConnection();

  try {
    const [tables] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
      AND (table_name LIKE 'naver_%' OR table_name LIKE 'keyword_%')
    `);

    return tables.map((row) => row.table_name || row.TABLE_NAME);
  } catch (error) {
    console.error("❌ 테이블 확인 오류:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// 스크립트 직접 실행 시
if (require.main === module) {
  setupTables()
    .then(() => {
      console.log("✅ 설정 완료");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ 설정 실패:", error);
      process.exit(1);
    });
}

module.exports = { setupTables, checkTables };
