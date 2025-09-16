const {
  randomDelay,
  categorizeKeyword,
  isValidKeyword,
} = require("../utils/helpers");

/**
 * "함께 많이 찾는" 키워드 수집기
 */
class TogetherSearchedCollector {
  constructor(page, options = {}) {
    this.page = page;
    this.options = options;
  }

  /**
   * "함께 많이 찾는" 키워드 수집 (검색 결과 페이지에서)
   */
  async collect(query) {
    console.log('🔗 "함께 많이 찾는" 키워드 수집 중...');

    try {
      const togetherData = [];

      console.log("  📄 검색 결과 페이지에서 키워드 탐색 중...");

      // 검색 결과 페이지가 완전히 로드될 때까지 대기 (시간 단축)
      await this.page.waitForTimeout(2000);

      // 네이버 검색 결과 페이지의 실제 DOM 구조에서 키워드 직접 수집
      const targetSelectors = [
        '[class*="fds-collection-root"]',
        '[class*="UH6Wgw8cdFg8_TT9WdMR"]',
        '[class*="Svmt7Y5MzD_4l3UgMS3g"]',
        ".fds-collection-root",
        ".UH6Wgw8cdFg8_TT9WdMR",
        ".Svmt7Y5MzD_4l3UgMS3g",
      ];

      let foundKeywords = [];
      let rank = 1;

      for (const selector of targetSelectors) {
        try {
          const containers = await this.page.locator(selector).all();
          console.log(`  🔍 ${selector}: ${containers.length}개 컨테이너 발견`);

          for (const container of containers) {
            if (await container.isVisible().catch(() => false)) {
              const links = await container.locator("a").all();

              for (const link of links) {
                try {
                  const text = await link.textContent();
                  const href = await link.getAttribute("href");

                  if (isValidKeyword(text, query)) {
                    const cleanText = text.trim();

                    // 중복 제거
                    if (!foundKeywords.some((k) => k.text === cleanText)) {
                      // 키워드 카테고리 분류
                      let category = categorizeKeyword(cleanText);

                      // 위치기반, 지역별 키워드만 수집 (일반, 블로그리뷰 제외)
                      if (category === "위치기반" || category === "지역별") {
                        foundKeywords.push({
                          query: query,
                          keyword_type: "togetherSearched",
                          category: category,
                          text: cleanText,
                          rank: rank++,
                          grp: 1,
                          created_at: new Date().toISOString(),
                        });
                      }

                      console.log(`    ✅ 키워드 발견: "${cleanText}"`);
                    }
                  }
                } catch (e) {
                  // 개별 링크 처리 오류 무시
                }
              }
            }
          }

          if (foundKeywords.length > 0) {
            console.log(
              `  ✅ ${selector}에서 ${foundKeywords.length}개 키워드 수집`
            );
            break; // 키워드를 찾았으면 다른 컨테이너는 확인하지 않음
          }
        } catch (e) {
          console.log(`  ⚠️ ${selector} 처리 중 오류:`, e.message);
        }
      }

      // 수집된 키워드를 togetherData에 추가
      togetherData.push(...foundKeywords);

      console.log(
        `✅ "함께 많이 찾는" 키워드 ${togetherData.length}개 수집 완료`
      );
      return togetherData;
    } catch (error) {
      console.error('❌ "함께 많이 찾는" 수집 중 오류:', error);
      return [];
    }
  }
}

module.exports = TogetherSearchedCollector;
