const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const NaverKeywordScraper = require("./scraper/naver-scraper");
const {
  insertKeywords,
  getKeywords,
  getKeywordStats,
} = require("./database/connection");

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
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

// 정적 파일 서빙 (출력 파일들)
app.use("/output", express.static(path.join(__dirname, "../output")));

// 헬스 체크
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "keyword-finder-backend",
  });
});

// 키워드 스크래핑 API
app.post("/api/scrape", async (req, res) => {
  try {
    const { query, options = {} } = req.body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "검색어가 필요합니다.",
      });
    }

    // 기본 옵션 설정
    const scrapingOptions = {
      headless: options.headless !== false,
      maxPagesPerModule: options.maxPagesPerModule || 3,
      waitTimeoutMs: options.waitTimeoutMs || 5000,
      sleepMinMs: options.sleepMinMs || 200,
      sleepMaxMs: options.sleepMaxMs || 600,
      outputDir: options.outputDir || "./output",
    };

    console.log(`🚀 키워드 스크래핑 시작: "${query}"`);

    // 스크래핑 실행
    const scraper = new NaverKeywordScraper(scrapingOptions);
    const result = await scraper.scrape(query);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || "스크래핑 중 오류가 발생했습니다.",
      });
    }

    // 데이터베이스에 저장 (옵션)
    if (options.saveToDb !== false && result.data.length > 0) {
      try {
        await insertKeywords(result.data);
        console.log("✅ 데이터베이스 저장 완료");
      } catch (dbError) {
        console.error("❌ 데이터베이스 저장 실패:", dbError.message);
        // DB 저장 실패해도 스크래핑 결과는 반환
      }
    }

    res.json({
      success: true,
      data: result.data,
      stats: result.stats,
      outputFile: result.outputFile,
    });
  } catch (error) {
    console.error("❌ 스크래핑 API 오류:", error);
    res.status(500).json({
      success: false,
      error: "서버 내부 오류가 발생했습니다.",
    });
  }
});

// 저장된 키워드 조회 API
app.get("/api/keywords", async (req, res) => {
  try {
    const {
      query,
      keyword_type,
      limit = 100,
      offset = 0,
      start_date,
      end_date,
    } = req.query;

    const filters = {};
    if (query) filters.query = query;
    if (keyword_type) filters.keyword_type = keyword_type;
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;

    const keywords = await getKeywords(
      filters,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({
      success: true,
      data: keywords,
      count: keywords.length,
    });
  } catch (error) {
    console.error("❌ 키워드 조회 API 오류:", error);
    res.status(500).json({
      success: false,
      error: "키워드 조회 중 오류가 발생했습니다.",
    });
  }
});

// 키워드 통계 API
app.get("/api/stats", async (req, res) => {
  try {
    const stats = await getKeywordStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("❌ 통계 API 오류:", error);
    res.status(500).json({
      success: false,
      error: "통계 조회 중 오류가 발생했습니다.",
    });
  }
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "요청한 엔드포인트를 찾을 수 없습니다.",
  });
});

// 에러 핸들러
app.use((error, req, res, next) => {
  console.error("❌ 서버 오류:", error);
  res.status(500).json({
    success: false,
    error: "서버 내부 오류가 발생했습니다.",
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 키워드 파인더 백엔드 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📊 API 문서: http://localhost:${PORT}/health`);
});

module.exports = app;
