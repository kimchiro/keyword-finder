const fs = require("fs-extra");
const path = require("path");

/**
 * 데이터 처리 유틸리티
 */
class DataProcessor {
  constructor(options = {}) {
    this.options = {
      outputDir: options.outputDir || "./output",
      ...options,
    };
  }

  /**
   * 데이터 정제 및 중복 제거
   */
  cleanData(data) {
    console.log("🧹 데이터 정제 및 중복 제거 중...");

    const cleaned = data
      .map((item) => ({
        ...item,
        text: item.text
          .replace(/\s+/g, " ") // 공백 정규화
          .replace(/\s*추가\s*/g, "") // "추가" 텍스트 제거
          .trim(),
      }))
      .filter((item) => {
        // 2자 미만 제외
        if (item.text.length < 2) return false;

        // 특수문자만 있는 경우 제외
        if (!/[가-힣a-zA-Z0-9]/.test(item.text)) return false;

        // "추가"만 있는 경우 제외
        if (item.text === "추가" || item.text.includes("추가")) return false;

        return true;
      });

    // 중복 제거 (text 기준)
    const uniqueData = [];
    const seenTexts = new Set();

    for (const item of cleaned) {
      if (!seenTexts.has(item.text)) {
        seenTexts.add(item.text);
        uniqueData.push(item);
      }
    }

    // 타입별로 랭킹 재부여
    const typeGroups = {};
    uniqueData.forEach((item) => {
      const key = `${item.keyword_type}_${item.grp}`;
      if (!typeGroups[key]) typeGroups[key] = [];
      typeGroups[key].push(item);
    });

    Object.values(typeGroups).forEach((group) => {
      group.forEach((item, index) => {
        item.rank = index + 1;
      });
    });

    console.log(`✅ 정제 완료: ${data.length}개 → ${uniqueData.length}개`);
    return uniqueData;
  }

  /**
   * 결과를 JSON 파일로 저장
   */
  async saveToFile(data, query) {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 16);
    const filename = `naver_keywords_${query}_${timestamp}.json`;
    const filepath = path.join(this.options.outputDir, filename);

    // 출력 디렉토리 생성
    await fs.ensureDir(this.options.outputDir);

    // JSON 파일 저장
    await fs.writeJson(filepath, data, { spaces: 2 });

    console.log(`💾 결과 저장: ${filepath}`);
    return filepath;
  }

  /**
   * 통계 정보 생성
   */
  generateStats(data, duration) {
    const stats = {
      total: data.length,
      autosuggest: data.filter((item) => item.keyword_type === "autosuggest")
        .length,
      togetherSearched: data.filter(
        (item) => item.keyword_type === "togetherSearched"
      ).length,
      hotTopics: data.filter((item) => item.keyword_type === "hotTopics")
        .length,
      relatedKeywords: data.filter(
        (item) => item.keyword_type === "relatedKeywords"
      ).length,
      duration: parseFloat(duration),
    };

    // 카테고리별 통계
    const categoryStats = {};
    data.forEach((item) => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = 0;
      }
      categoryStats[item.category]++;
    });

    stats.categories = categoryStats;
    return stats;
  }
}

module.exports = DataProcessor;
