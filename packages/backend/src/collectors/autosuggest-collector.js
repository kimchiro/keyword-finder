const {
  randomDelay,
  categorizeKeyword,
  isValidKeyword,
} = require("../utils/helpers");

/**
 * 자동완성 키워드 수집기
 */
class AutosuggestCollector {
  constructor(page, options = {}) {
    this.page = page;
    this.options = options;
  }

  /**
   * 자동완성 키워드 수집
   */
  async collect(query) {
    console.log("📝 자동완성 키워드 수집 중...");

    try {
      // 네이버 메인으로 이동 (자동완성 수집용)
      await this.page.goto("https://www.naver.com");
      await randomDelay(this.options.sleepMinMs, this.options.sleepMaxMs);

      // 검색창에 포커스
      const searchInput = await this.page.locator("#query");
      await searchInput.click();
      await randomDelay(this.options.sleepMinMs, this.options.sleepMaxMs);

      // 검색어를 완전히 입력하고 자동완성 대기
      await searchInput.fill("");
      await searchInput.fill(query);

      // 완전한 키워드 입력 후 3초 대기하여 자동완성 확인
      await this.page.waitForTimeout(3000);

      // 자동완성 목록 대기 (여러 셀렉터 시도)
      let suggestions = [];
      try {
        // 자동완성이 나타날 때까지 대기 (더 긴 시간)
        await this.page.waitForTimeout(2000);

        // 여러 가능한 셀렉터로 자동완성 항목 수집 (더 광범위하게)
        const possibleSelectors = [
          '[class*="lst_relate"] li', // 클래스명 부분 매칭
          '[class*="autocomplete"] li', // 자동완성 관련
          '[class*="search_list"] li', // 검색 리스트 관련
          '[class*="lst_search"] li', // 검색 목록 관련
          '[class*="sch_lst"] li', // 스키마 리스트
          'ul[role="listbox"] li', // 리스트박스 역할
          '[class*="lst_type"] li', // 타입 리스트
          ".autocomplete li",
          ".suggest_list li",
          'div[role="listbox"] li',
          ".lst_relate li",
          ".autocomplete_list li",
          ".search_list_1 li",
          ".lst_search li",
        ];

        for (const selector of possibleSelectors) {
          try {
            const items = await this.page.locator(selector).all();
            console.log(`  🔍 ${selector}: ${items.length}개 요소 발견`);

            if (items.length > 0) {
              // 실제로 보이고 텍스트가 있는 요소들만 필터링
              const validItems = [];
              for (const item of items) {
                if (await item.isVisible().catch(() => false)) {
                  const text = await item.textContent();
                  if (text && text.trim().length >= 2) {
                    validItems.push(item);
                  }
                }
              }

              if (validItems.length > 0) {
                suggestions = validItems;
                console.log(
                  `  ✅ 자동완성 셀렉터 발견: ${selector} (${validItems.length}개)`
                );
                break;
              }
            }
          } catch (e) {
            // 다음 셀렉터 시도
          }
        }
      } catch (e) {
        console.log("  ⚠️ 자동완성 목록을 찾을 수 없습니다.");
      }

      const autosuggestData = [];

      for (let i = 0; i < suggestions.length; i++) {
        try {
          const text = await suggestions[i].textContent();
          if (text && text.trim().length >= 2) {
            autosuggestData.push({
              query: query,
              keyword_type: "autosuggest",
              category: "자동완성",
              text: text.trim(),
              rank: i + 1,
              grp: 1,
              created_at: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.warn(`자동완성 항목 ${i} 처리 중 오류:`, error.message);
        }
      }

      console.log(`✅ 자동완성 키워드 ${autosuggestData.length}개 수집 완료`);
      return autosuggestData;
    } catch (error) {
      console.error("❌ 자동완성 수집 중 오류:", error);
      return [];
    }
  }
}

module.exports = AutosuggestCollector;
