const express = require("express");
const NaverApiController = require("../controllers/NaverApiController");

const router = express.Router();

// ========== 네이버 검색 API ==========
router.post("/search", (req, res) => NaverApiController.searchBlog(req, res));

// ========== 네이버 데이터랩 API ==========
router.post("/datalab", (req, res) =>
  NaverApiController.getDatalabTrends(req, res)
);

// ========== DB 조회 API ==========
router.get("/search-results/:query", (req, res) =>
  NaverApiController.getStoredSearchResults(req, res)
);
router.get("/trend-data/:query", (req, res) =>
  NaverApiController.getStoredTrendData(req, res)
);

// ========== 통합 데이터 API ==========
router.get("/integrated-data/:query", (req, res) =>
  NaverApiController.getIntegratedData(req, res)
);

// ========== 캐시 관리 API ==========
router.delete("/cache", (req, res) => NaverApiController.cleanCache(req, res));

module.exports = router;
