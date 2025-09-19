const express = require("express");
const ScrapingController = require("../controllers/ScrapingController");

const router = express.Router();

// 키워드 스크래핑 실행
router.post("/scrape", (req, res) =>
  ScrapingController.scrapeKeywords(req, res)
);

// 배치 스크래핑 실행
router.post("/batch", (req, res) => ScrapingController.batchScraping(req, res));

// 스크래핑된 키워드 조회
router.get("/keywords/:query", (req, res) =>
  ScrapingController.getScrapedKeywords(req, res)
);

// 스크래핑 상태 확인
router.get("/status/:query", (req, res) =>
  ScrapingController.getScrapingStatus(req, res)
);

// 테스트 스크래핑 (개발용)
router.post("/test", (req, res) => ScrapingController.testScraping(req, res));

module.exports = router;
