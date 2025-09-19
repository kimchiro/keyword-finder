require("dotenv").config();

const config = {
  type: "mysql",
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || "keyword_finder",
  charset: "utf8mb4",
  synchronize: process.env.NODE_ENV !== "production", // 개발 환경에서만 자동 스키마 동기화
  logging: process.env.NODE_ENV === "development",
  entities: ["src/database/entities/*.js"],
  migrations: ["src/database/migrations/*.js"],
  subscribers: ["src/database/subscribers/*.js"],
  cli: {
    entitiesDir: "src/database/entities",
    migrationsDir: "src/database/migrations",
    subscribersDir: "src/database/subscribers",
  },
};

module.exports = config;
