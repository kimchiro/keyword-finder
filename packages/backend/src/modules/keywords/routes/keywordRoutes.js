const express = require("express");
const KeywordController = require("../controllers/KeywordController");

const router = express.Router();

// 키워드 목록 조회
router.get("/", (req, res) => KeywordController.getKeywords(req, res));

// 키워드 통계 조회
router.get("/stats", (req, res) => KeywordController.getKeywordStats(req, res));

// 키워드 저장
router.post("/", (req, res) => KeywordController.saveKeywords(req, res));

// 키워드 삭제
router.delete("/:query", (req, res) =>
  KeywordController.deleteKeywords(req, res)
);

module.exports = router;
