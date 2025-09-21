const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

// 모듈 라우터 임포트
const keywordModule = require("./modules/keywords");
const naverApiModule = require("./modules/naver-api");
const scrapingModule = require("./modules/scraping");

// 데이터베이스 초기화
const { keywordService } = require("./shared/database/typeorm-connection");

const app = express();
const PORT = process.env.PORT || 3001;

// ========== 미들웨어 설정 ==========
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙
app.use("/output", express.static(path.join(__dirname, "../output")));

// ========== 헬스 체크 ==========
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: "2.0.0",
    services: {
      database: "connected",
      api: "running",
    },
  });
});

// ========== API 라우터 등록 ==========

// 키워드 관련 API
app.use("/api/keywords", keywordModule.routes);

// 네이버 API 관련
app.use("/api/naver", naverApiModule.routes);

// 스크래핑 관련 API
app.use("/api/scraping", scrapingModule.routes);

// ========== 레거시 API 호환성 유지 ==========

// 통합 키워드 데이터 조회 (레거시)
app.get("/api/integrated-keyword-data/:query", (req, res) => {
  naverApiModule.controller.getIntegratedData(req, res);
});

// ========== 에러 핸들링 ==========

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "API 엔드포인트를 찾을 수 없습니다.",
    path: req.path,
    method: req.method,
  });
});

// 전역 에러 핸들러
app.use((error, req, res, next) => {
  console.error("❌ 전역 에러 핸들러:", error);

  res.status(error.status || 500).json({
    success: false,
    error: error.message || "서버 내부 오류가 발생했습니다.",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// ========== 서버 시작 ==========
async function startServer() {
  try {
    // 데이터베이스 연결 확인
    await keywordService.initialize();
    console.log("✅ 데이터베이스 연결 성공");

    // 서버 시작
    app.listen(PORT, () => {
      console.log(
        `🚀 키워드 파인더 백엔드 서버가 포트 ${PORT}에서 실행 중입니다.`
      );
      console.log(`📊 API 문서: http://localhost:${PORT}/health`);
      console.log(`🌐 환경: ${process.env.NODE_ENV || "development"}`);

      // API 엔드포인트 목록 출력
      console.log("\n📋 사용 가능한 API 엔드포인트:");
      console.log("  🔍 키워드: /api/keywords");
      console.log("  🌐 네이버 API: /api/naver");
      console.log("  🕷️  스크래핑: /api/scraping");
      console.log("  ❤️  헬스체크: /health\n");
    });
  } catch (error) {
    console.error("❌ 서버 시작 실패:", error);
    process.exit(1);
  }
}

// 프로세스 종료 시 정리
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM 신호 수신, 서버를 종료합니다...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT 신호 수신, 서버를 종료합니다...");
  process.exit(0);
});

// 처리되지 않은 Promise 거부 처리
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ 처리되지 않은 Promise 거부:", reason);
});

// 처리되지 않은 예외 처리
process.on("uncaughtException", (error) => {
  console.error("❌ 처리되지 않은 예외:", error);
  process.exit(1);
});

// 서버 시작
if (require.main === module) {
  startServer();
}

module.exports = app;
