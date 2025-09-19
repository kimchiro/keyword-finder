#!/usr/bin/env node

const NaverKeywordScraper = require("./scraper/naver-scraper");
const { keywordService } = require("./database/typeorm-connection");
require("dotenv").config();

/**
 * 메인 실행 함수
 */
async function main() {
  // 명령행 인자 처리
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
사용법: node src/index.js <검색어> [옵션]

예시:
  node src/index.js "맛집"
  node src/index.js "여행" --headless=false
  node src/index.js "카페" --max-pages=2

옵션:
  --headless=true/false     브라우저 헤드리스 모드 (기본: true)
  --max-pages=N            페이지당 최대 수집 페이지 수 (기본: 3)
  --timeout=N              대기 시간 (ms) (기본: 5000)
  --output-dir=PATH        출력 디렉토리 (기본: ./output)
  --no-db                  데이터베이스 저장 건너뛰기
    `);
    process.exit(1);
  }

  const query = args[0];

  // 옵션 파싱
  const options = {
    headless: process.env.HEADLESS !== "false",
    maxPagesPerModule: parseInt(process.env.MAX_PAGES_PER_MODULE) || 3,
    waitTimeoutMs: parseInt(process.env.WAIT_TIMEOUT_MS) || 5000,
    sleepMinMs: parseInt(process.env.SLEEP_MIN_MS) || 200,
    sleepMaxMs: parseInt(process.env.SLEEP_MAX_MS) || 600,
    outputDir: process.env.OUTPUT_DIR || "./output",
  };

  let saveToDb = true;

  // 명령행 옵션 처리
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("--headless=")) {
      options.headless = arg.split("=")[1] === "true";
    } else if (arg.startsWith("--max-pages=")) {
      options.maxPagesPerModule = parseInt(arg.split("=")[1]);
    } else if (arg.startsWith("--timeout=")) {
      options.waitTimeoutMs = parseInt(arg.split("=")[1]);
    } else if (arg.startsWith("--output-dir=")) {
      options.outputDir = arg.split("=")[1];
    } else if (arg === "--no-db") {
      saveToDb = false;
    }
  }

  console.log("🚀 네이버 키워드 수집기 시작");
  console.log("📋 설정:");
  console.log(`   검색어: "${query}"`);
  console.log(`   헤드리스: ${options.headless}`);
  console.log(`   최대 페이지: ${options.maxPagesPerModule}`);
  console.log(`   출력 디렉토리: ${options.outputDir}`);
  console.log(`   DB 저장: ${saveToDb}`);

  try {
    // 스크래핑 실행
    const scraper = new NaverKeywordScraper(options);
    const result = await scraper.scrape(query);

    if (!result.success) {
      console.error("❌ 스크래핑 실패:", result.error);
      process.exit(1);
    }

    // 검수 기준 확인
    const stats = result.stats;
    const issues = [];

    if (stats.autosuggest < 6) {
      issues.push(`자동완성 키워드가 ${stats.autosuggest}개로 기준(6개) 미달`);
    }
    if (stats.togetherSearched < 6) {
      issues.push(
        `함께 많이 찾는 키워드가 ${stats.togetherSearched}개로 기준(6개) 미달`
      );
    }
    if (stats.hotTopics < 8) {
      issues.push(`인기주제 키워드가 ${stats.hotTopics}개로 기준(8개) 미달`);
    }
    if (stats.duration > 12) {
      issues.push(`실행시간이 ${stats.duration}초로 기준(12초) 초과`);
    }

    if (issues.length > 0) {
      console.log("\n⚠️ 검수 기준 미달 항목:");
      issues.forEach((issue) => console.log(`   - ${issue}`));
    } else {
      console.log("\n✅ 모든 검수 기준을 통과했습니다!");
    }

    // 데이터베이스 저장
    if (saveToDb && result.data.length > 0) {
      try {
        console.log("\n💾 데이터베이스에 저장 중...");
        await keywordService.insertKeywords(result.data);
        console.log("✅ 데이터베이스 저장 완료");
      } catch (dbError) {
        console.error("❌ 데이터베이스 저장 실패:", dbError.message);
        console.log("💡 JSON 파일은 정상적으로 저장되었습니다.");
      }
    }

    console.log("\n🎉 모든 작업이 완료되었습니다!");
  } catch (error) {
    console.error("❌ 실행 중 오류 발생:", error);
    process.exit(1);
  }
}

// 직접 실행된 경우
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ 치명적 오류:", error);
    process.exit(1);
  });
}

module.exports = { main };
