const express = require("express");
const StatsController = require("../controllers/StatsController");

const router = express.Router();

// 대시보드 통계 조회
router.get("/", (req, res) => StatsController.getDashboardStats(req, res));

// 키워드별 검색 통계 조회
router.get("/keyword/:query", (req, res) =>
  StatsController.getKeywordSearchStats(req, res)
);

// 전체 시스템 통계 조회
router.get("/system", (req, res) => StatsController.getSystemStats(req, res));

module.exports = router;
