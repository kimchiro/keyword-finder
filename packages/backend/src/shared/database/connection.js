require("dotenv").config();
const mysql = require("mysql2/promise");

/**
 * 통합 MySQL 연결 풀
 * 모든 데이터베이스 작업에서 공통으로 사용
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "keyword_finder",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

/**
 * 데이터베이스 연결 테스트
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL 데이터베이스 연결 성공");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ MySQL 데이터베이스 연결 실패:", error);
    throw error;
  }
}

/**
 * 연결 풀 종료
 */
async function closePool() {
  try {
    await pool.end();
    console.log("✅ 데이터베이스 연결 풀이 종료되었습니다.");
  } catch (error) {
    console.error("❌ 연결 풀 종료 실패:", error);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  closePool,
};
