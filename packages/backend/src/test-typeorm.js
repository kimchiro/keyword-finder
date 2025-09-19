#!/usr/bin/env node

require("dotenv").config();
const { keywordService } = require("./database/typeorm-connection");

/**
 * TypeORM 연결 테스트
 */
async function testTypeORM() {
  console.log("🧪 TypeORM 연결 테스트 시작");

  try {
    // 데이터베이스 연결 초기화
    console.log("1. 데이터베이스 연결 초기화...");
    await keywordService.initialize();

    // 테스트 데이터 생성
    const testKeywords = [
      {
        query: "테스트",
        keyword_type: "autosuggest",
        text: "테스트 키워드 1",
        rank: 1,
        created_at: new Date(),
      },
      {
        query: "테스트",
        keyword_type: "togetherSearched",
        text: "테스트 키워드 2",
        rank: 2,
        created_at: new Date(),
      },
    ];

    // 데이터 삽입 테스트
    console.log("2. 테스트 데이터 삽입...");
    const insertResult = await keywordService.insertKeywords(testKeywords);
    console.log("✅ 삽입 결과:", insertResult);

    // 데이터 조회 테스트
    console.log("3. 데이터 조회 테스트...");
    const keywords = await keywordService.getKeywords(
      { query: "테스트" },
      10,
      0
    );
    console.log("✅ 조회된 키워드 수:", keywords.length);
    console.log("📋 조회된 데이터:", keywords);

    // 통계 조회 테스트
    console.log("4. 통계 조회 테스트...");
    const stats = await keywordService.getKeywordStats();
    console.log("✅ 통계 데이터:", stats);

    // 테스트 데이터 삭제
    console.log("5. 테스트 데이터 정리...");
    const deleteResult = await keywordService.deleteKeywordsByQuery("테스트");
    console.log("✅ 삭제 결과:", deleteResult);

    console.log("\n🎉 모든 TypeORM 테스트가 성공적으로 완료되었습니다!");
  } catch (error) {
    console.error("❌ TypeORM 테스트 실패:", error);
    process.exit(1);
  } finally {
    // 연결 종료
    try {
      await keywordService.close();
      console.log("✅ 데이터베이스 연결이 종료되었습니다.");
    } catch (closeError) {
      console.error("❌ 연결 종료 실패:", closeError);
    }
  }
}

// 직접 실행된 경우
if (require.main === module) {
  testTypeORM().catch((error) => {
    console.error("❌ 치명적 오류:", error);
    process.exit(1);
  });
}

module.exports = { testTypeORM };
