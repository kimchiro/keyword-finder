#!/usr/bin/env node

/**
 * keyword-finder 데이터베이스 생성 스크립트
 */

require("dotenv").config();
const mysql = require("mysql2/promise");

async function createDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST || process.env.MYSQL_HOST || "localhost",
    user: process.env.DB_USER || process.env.MYSQL_USER || "root",
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || "",
    port: process.env.DB_PORT || process.env.MYSQL_PORT || 3306,
    charset: "utf8mb4",
    // database는 제외 (데이터베이스를 생성하기 위해)
  };

  try {
    console.log("🔗 MySQL 서버에 연결 중...");
    const connection = await mysql.createConnection(dbConfig);

    console.log("✅ MySQL 서버 연결 성공");

    // 데이터베이스 생성
    await connection.execute(`
      CREATE DATABASE IF NOT EXISTS \`keyword_finder\` 
      CHARACTER SET utf8mb4 
      COLLATE utf8mb4_unicode_ci
    `);

    console.log("✅ keyword_finder 데이터베이스 생성 완료");

    // 데이터베이스 목록 확인
    const [databases] = await connection.execute("SHOW DATABASES");
    const dbExists = databases.some(
      (db) =>
        db.Database === "keyword_finder" || db.database === "keyword_finder"
    );

    if (dbExists) {
      console.log("✅ keyword_finder 데이터베이스 존재 확인됨");
    } else {
      console.log("⚠️ keyword_finder 데이터베이스를 찾을 수 없습니다");
    }

    await connection.end();
  } catch (error) {
    console.error("❌ 데이터베이스 생성 오류:", error.message);
    console.error("설정:", { ...dbConfig, password: "***" });
    process.exit(1);
  }
}

if (require.main === module) {
  createDatabase();
}

module.exports = { createDatabase };
