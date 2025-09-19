const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { getDbConnection } = require("./connection");

async function setupDatabase() {
  console.log("데이터베이스 설정을 시작합니다...");

  try {
    const db = await getDbConnection();

    // 스키마 파일 읽기
    const schemaPath = path.join(__dirname, "../../database/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // SQL 문을 세미콜론으로 분리하여 실행
    const statements = schema.split(";").filter((stmt) => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        console.log("실행 중:", statement.trim().substring(0, 50) + "...");
        await db.query(statement);
      }
    }

    console.log("✅ 데이터베이스 설정이 완료되었습니다.");

    // 연결 종료
    if (process.env.DB_TYPE === "mysql") {
      await db.end();
    } else {
      await db.end();
    }
  } catch (error) {
    console.error("❌ 데이터베이스 설정 중 오류 발생:", error);
    process.exit(1);
  }
}

// 직접 실행된 경우
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
