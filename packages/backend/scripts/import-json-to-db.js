#!/usr/bin/env node

/**
 * JSON 파일들을 데이터베이스로 가져오는 스크립트
 *
 * 사용법:
 * node scripts/import-json-to-db.js
 * node scripts/import-json-to-db.js --file=specific-file.json
 * node scripts/import-json-to-db.js --query=맛집
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

// 데이터베이스 연결 설정
const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQL_HOST || "localhost",
  user: process.env.DB_USER || process.env.MYSQL_USER || "root",
  password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || "",
  database:
    process.env.DB_NAME || process.env.MYSQL_DATABASE || "keyword_finder",
  port: process.env.DB_PORT || process.env.MYSQL_PORT || 3306,
  charset: "utf8mb4",
};

/**
 * 데이터베이스 연결 테스트
 */
async function testConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ 데이터베이스 연결 성공:", dbConfig.database);
    await connection.end();
    return true;
  } catch (error) {
    console.error("❌ 데이터베이스 연결 실패:", error.message);
    console.error("설정:", { ...dbConfig, password: "***" });
    return false;
  }
}

/**
 * 테이블 존재 여부 확인 및 생성
 */
async function ensureTablesExist() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    // naver_keywords 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS naver_keywords (
        id INT AUTO_INCREMENT PRIMARY KEY,
        query VARCHAR(100) NOT NULL,
        keyword_type VARCHAR(50) NOT NULL,
        category VARCHAR(50) DEFAULT '일반',
        text VARCHAR(255) NOT NULL,
        href TEXT,
        imageAlt TEXT,
        \`rank\` INT NOT NULL,
        grp INT DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_query (query),
        INDEX idx_keyword_type (keyword_type),
        INDEX idx_category (category),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // naver_related_keywords 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS naver_related_keywords (
        id INT AUTO_INCREMENT PRIMARY KEY,
        query VARCHAR(100) NOT NULL,
        related_keyword VARCHAR(255) NOT NULL,
        monthly_pc_qc_cnt BIGINT,
        monthly_mobile_qc_cnt BIGINT,
        monthly_ave_pc_clk_cnt INT,
        monthly_ave_mobile_clk_cnt INT,
        monthly_ave_pc_ctr DECIMAL(5,2),
        monthly_ave_mobile_ctr DECIMAL(5,2),
        pl_avg_depth DECIMAL(3,1),
        comp_idx VARCHAR(10),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_query (query),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log("✅ 테이블 확인/생성 완료");
  } catch (error) {
    console.error("❌ 테이블 생성 오류:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

/**
 * JSON 파일에서 키워드 데이터 추출
 */
function extractKeywordsFromJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(content);

    if (jsonData.success && Array.isArray(jsonData.data)) {
      return jsonData.data;
    } else if (Array.isArray(jsonData)) {
      return jsonData;
    } else {
      console.warn(`⚠️ 예상하지 못한 JSON 구조: ${filePath}`);
      return [];
    }
  } catch (error) {
    console.error(`❌ JSON 파일 읽기 오류 (${filePath}):`, error.message);
    return [];
  }
}

/**
 * 키워드 데이터를 데이터베이스에 삽입
 */
async function insertKeywords(keywords) {
  if (!keywords || keywords.length === 0) {
    return { success: true, count: 0 };
  }

  const connection = await mysql.createConnection(dbConfig);

  try {
    // 배치 삽입을 위한 쿼리 준비
    const insertQuery = `
      INSERT INTO naver_keywords 
      (query, keyword_type, category, text, href, imageAlt, \`rank\`, grp, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      text = VALUES(text),
      href = VALUES(href),
      imageAlt = VALUES(imageAlt),
      \`rank\` = VALUES(\`rank\`),
      grp = VALUES(grp)
    `;

    let insertedCount = 0;

    for (const keyword of keywords) {
      try {
        // ISO 8601 날짜를 MySQL datetime 형식으로 변환
        let createdAt = keyword.created_at || new Date();
        if (typeof createdAt === "string") {
          createdAt = new Date(createdAt);
        }
        const mysqlDateTime = createdAt
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        await connection.execute(insertQuery, [
          keyword.query || "",
          keyword.keyword_type || "unknown",
          keyword.category || "일반",
          keyword.text || "",
          keyword.href || null,
          keyword.imageAlt || null,
          keyword.rank || 0,
          keyword.grp || 1,
          mysqlDateTime,
        ]);
        insertedCount++;
      } catch (error) {
        console.error(`❌ 키워드 삽입 오류 (${keyword.text}):`, error.message);
      }
    }

    console.log(`✅ ${insertedCount}/${keywords.length}개 키워드 저장 완료`);
    return { success: true, count: insertedCount };
  } catch (error) {
    console.error("❌ 데이터베이스 삽입 오류:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log("🚀 JSON 파일을 데이터베이스로 가져오기 시작...\n");

  // 명령행 인자 처리
  const args = process.argv.slice(2);
  const options = {};

  args.forEach((arg) => {
    if (arg.startsWith("--file=")) {
      options.file = arg.split("=")[1];
    } else if (arg.startsWith("--query=")) {
      options.query = arg.split("=")[1];
    }
  });

  // 데이터베이스 연결 테스트
  const connected = await testConnection();
  if (!connected) {
    console.error(
      "❌ 데이터베이스에 연결할 수 없습니다. 환경설정을 확인하세요."
    );
    process.exit(1);
  }

  // 테이블 확인/생성
  await ensureTablesExist();

  // JSON 파일들 찾기
  const outputDir = path.join(__dirname, "../output");
  if (!fs.existsSync(outputDir)) {
    console.error("❌ output 디렉토리가 존재하지 않습니다:", outputDir);
    process.exit(1);
  }

  let jsonFiles = fs
    .readdirSync(outputDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.join(outputDir, file));

  // 필터링 적용
  if (options.file) {
    jsonFiles = jsonFiles.filter(
      (file) => path.basename(file) === options.file
    );
  }

  if (options.query) {
    jsonFiles = jsonFiles.filter((file) => file.includes(`_${options.query}_`));
  }

  if (jsonFiles.length === 0) {
    console.log("⚠️ 처리할 JSON 파일이 없습니다.");
    return;
  }

  console.log(`📁 ${jsonFiles.length}개의 JSON 파일을 처리합니다:\n`);

  let totalProcessed = 0;
  let totalInserted = 0;

  // 각 JSON 파일 처리
  for (const filePath of jsonFiles) {
    const fileName = path.basename(filePath);
    console.log(`📄 처리 중: ${fileName}`);

    const keywords = extractKeywordsFromJson(filePath);
    if (keywords.length > 0) {
      const result = await insertKeywords(keywords);
      totalProcessed += keywords.length;
      totalInserted += result.count;

      console.log(
        `   → ${keywords.length}개 키워드 중 ${result.count}개 저장\n`
      );
    } else {
      console.log(`   → 키워드 데이터 없음\n`);
    }
  }

  console.log("🎉 가져오기 완료!");
  console.log(`📊 총 처리된 키워드: ${totalProcessed}개`);
  console.log(`💾 총 저장된 키워드: ${totalInserted}개`);

  // 데이터베이스 통계 확인
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT query) as unique_queries,
        COUNT(DISTINCT keyword_type) as keyword_types
      FROM naver_keywords
    `);

    console.log(`\n📈 데이터베이스 현황:`);
    console.log(`   전체 키워드: ${rows[0].total}개`);
    console.log(`   고유 검색어: ${rows[0].unique_queries}개`);
    console.log(`   키워드 타입: ${rows[0].keyword_types}개`);
  } catch (error) {
    console.error("❌ 통계 조회 오류:", error.message);
  } finally {
    await connection.end();
  }
}

// 스크립트 직접 실행 시
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ 실행 오류:", error);
    process.exit(1);
  });
}

module.exports = { main, insertKeywords, extractKeywordsFromJson };
