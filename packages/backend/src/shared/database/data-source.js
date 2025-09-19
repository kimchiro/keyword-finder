require("reflect-metadata");
require("dotenv").config();
const { DataSource } = require("typeorm");
const { NaverKeyword } = require("./entities/NaverKeyword");

/**
 * TypeORM DataSource 설정
 * MySQL 데이터베이스 연결을 위한 설정
 */
const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || "naver_keywords",
  charset: "utf8mb4",
  synchronize: process.env.NODE_ENV !== "production", // 개발 환경에서만 자동 스키마 동기화
  logging: process.env.NODE_ENV === "development",
  entities: [NaverKeyword],
  migrations: [],
  subscribers: [],
});

/**
 * 데이터베이스 연결 초기화
 */
async function initializeDatabase() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ TypeORM MySQL 데이터베이스에 연결되었습니다.");
    }
    return AppDataSource;
  } catch (error) {
    console.error("❌ 데이터베이스 연결 실패:", error);
    throw error;
  }
}

/**
 * 데이터베이스 연결 종료
 */
async function closeDatabase() {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("✅ 데이터베이스 연결이 종료되었습니다.");
    }
  } catch (error) {
    console.error("❌ 데이터베이스 연결 종료 실패:", error);
    throw error;
  }
}

module.exports = {
  AppDataSource,
  initializeDatabase,
  closeDatabase,
};
