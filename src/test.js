#!/usr/bin/env node

const NaverKeywordScraper = require("./scraper/naver-scraper");
const { insertKeywords, getDbConnection } = require("./database/connection");
require("dotenv").config();

/**
 * 테스트 실행 함수
 */
async function runTests() {
  console.log("🧪 네이버 키워드 수집기 테스트 시작\n");

  const testQueries = ["테스트", "맛집"];
  const results = [];

  for (const query of testQueries) {
    console.log(`\n📝 테스트 쿼리: "${query}"`);
    console.log("=".repeat(50));

    try {
      // 스크래핑 테스트
      const scraper = new NaverKeywordScraper({
        headless: true,
        maxPagesPerModule: 2,
        waitTimeoutMs: 3000,
        sleepMinMs: 100,
        sleepMaxMs: 300,
        outputDir: "./test-output",
      });

      const result = await scraper.scrape(query);

      if (result.success) {
        console.log(`✅ 스크래핑 성공`);
        console.log(`   📊 총 키워드: ${result.stats.total}개`);
        console.log(`   📝 자동완성: ${result.stats.autosuggest}개`);
        console.log(`   🔗 함께 많이 찾는: ${result.stats.togetherSearched}개`);
        console.log(`   🔥 인기주제: ${result.stats.hotTopics}개`);
        console.log(`   ⏱️ 실행시간: ${result.stats.duration}초`);

        // 검수 기준 확인
        const issues = [];
        if (result.stats.autosuggest < 3) issues.push("자동완성 부족");
        if (result.stats.togetherSearched < 3)
          issues.push("함께 많이 찾는 부족");
        if (result.stats.hotTopics < 3) issues.push("인기주제 부족");
        if (result.stats.duration > 15) issues.push("실행시간 초과");

        if (issues.length > 0) {
          console.log(`   ⚠️ 이슈: ${issues.join(", ")}`);
        } else {
          console.log(`   ✅ 모든 검수 기준 통과`);
        }

        results.push({
          query: query,
          success: true,
          stats: result.stats,
          issues: issues,
        });
      } else {
        console.log(`❌ 스크래핑 실패: ${result.error}`);
        results.push({
          query: query,
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error(`❌ 테스트 중 오류: ${error.message}`);
      results.push({
        query: query,
        success: false,
        error: error.message,
      });
    }
  }

  // 데이터베이스 연결 테스트
  console.log(`\n🗄️ 데이터베이스 연결 테스트`);
  console.log("=".repeat(50));

  try {
    const db = await getDbConnection();
    console.log("✅ 데이터베이스 연결 성공");

    // 테이블 존재 확인
    const dbType = process.env.DB_TYPE || "mysql";
    let query;

    if (dbType === "mysql") {
      query = "SHOW TABLES LIKE 'naver_keywords'";
    } else {
      query =
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'naver_keywords')";
    }

    const tableResult = await db.query(query);

    if (dbType === "mysql") {
      if (tableResult[0].length > 0) {
        console.log("✅ naver_keywords 테이블 존재");
      } else {
        console.log(
          "⚠️ naver_keywords 테이블이 없습니다. npm run setup-db를 실행하세요."
        );
      }
    } else {
      if (tableResult.rows[0].exists) {
        console.log("✅ naver_keywords 테이블 존재");
      } else {
        console.log(
          "⚠️ naver_keywords 테이블이 없습니다. npm run setup-db를 실행하세요."
        );
      }
    }

    // 연결 종료
    if (dbType === "mysql") {
      await db.end();
    } else {
      await db.end();
    }
  } catch (dbError) {
    console.error("❌ 데이터베이스 연결 실패:", dbError.message);
    console.log("💡 .env 파일의 데이터베이스 설정을 확인하세요.");
  }

  // 전체 결과 요약
  console.log(`\n📋 테스트 결과 요약`);
  console.log("=".repeat(50));

  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;

  console.log(`✅ 성공: ${successCount}/${totalCount}`);
  console.log(`❌ 실패: ${totalCount - successCount}/${totalCount}`);

  if (successCount === totalCount) {
    console.log("\n🎉 모든 테스트가 성공했습니다!");
  } else {
    console.log("\n⚠️ 일부 테스트가 실패했습니다. 로그를 확인하세요.");
  }

  // 상세 결과 출력
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. "${result.query}"`);
    if (result.success) {
      console.log(
        `   ✅ 성공 (${result.stats.total}개 키워드, ${result.stats.duration}초)`
      );
      if (result.issues.length > 0) {
        console.log(`   ⚠️ ${result.issues.join(", ")}`);
      }
    } else {
      console.log(`   ❌ 실패: ${result.error}`);
    }
  });
}

/**
 * 빠른 연결 테스트
 */
async function quickTest() {
  console.log("⚡ 빠른 연결 테스트");

  try {
    const scraper = new NaverKeywordScraper({
      headless: true,
      maxPagesPerModule: 1,
      waitTimeoutMs: 2000,
      sleepMinMs: 50,
      sleepMaxMs: 100,
    });

    // 네이버 접속만 테스트
    await scraper.init();
    await scraper.page.goto("https://www.naver.com");
    console.log("✅ 네이버 접속 성공");

    await scraper.close();
  } catch (error) {
    console.error("❌ 네이버 접속 실패:", error.message);
  }
}

// 명령행 인자 처리
const args = process.argv.slice(2);

if (args.includes("--quick")) {
  quickTest();
} else {
  runTests();
}
