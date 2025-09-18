const {
  randomDelay,
  categorizeKeyword,
  isValidKeyword,
} = require("../utils/helpers");

/**
 * 연관검색어 수집기 (2페이지 하단)
 */
class RelatedKeywordsCollector {
  constructor(page, options = {}) {
    this.page = page;
    this.options = options;
  }

  /**
   * 연관검색어 수집 (2페이지 하단에서)
   */
  async collect(query) {
    console.log("🔗 연관검색어 수집 중...");

    try {
      const relatedData = [];

      console.log("  📄 2페이지로 이동하여 연관검색어 탐색 중...");

      // 2페이지로 이동
      await this.navigateToPage2(query);

      // 페이지가 완전히 로드될 때까지 대기
      await this.page.waitForTimeout(3000);

      // 연관검색어 섹션 찾기
      const relatedSection = await this.findRelatedKeywordsSection();

      if (relatedSection) {
        console.log("  ✅ 연관검색어 섹션 발견!");

        // 다양한 연관검색어 링크 셀렉터 시도
        const keywordSelectors = [
          ".lst_related_srch .item a.keyword .tit",
          ".lst_related_srch .item a .tit",
          ".lst_related_srch li a .tit",
          ".related_srch .item a .tit",
          ".lst_related_srch a",
          ".related_srch a",
          "ul.lst_related_srch li a",
          "a.keyword .tit",
          "a.keyword",
        ];

        let keywordLinks = [];

        for (const selector of keywordSelectors) {
          try {
            const links = await relatedSection.locator(selector).all();
            console.log(`    ${selector}: ${links.length}개 링크 발견`);

            if (links.length > 0) {
              keywordLinks = links;
              console.log(`  ✅ 연관검색어 링크 셀렉터: ${selector}`);
              break;
            }
          } catch (e) {
            // 다음 셀렉터 시도
          }
        }

        console.log(`  🔍 연관검색어 링크 ${keywordLinks.length}개 발견`);

        let rank = 1;
        for (const link of keywordLinks) {
          try {
            let text = "";

            // 텍스트 추출 시도 (여러 방법)
            try {
              // 먼저 직접 텍스트 추출 시도
              text = await link.textContent();
              console.log(`    🔍 링크 텍스트: "${text}"`);

              // 텍스트가 없거나 너무 길면 .tit 요소 시도
              if (!text || text.trim().length === 0) {
                const titleElement = await link.locator(".tit").first();
                if (await titleElement.isVisible()) {
                  text = await titleElement.textContent();
                  console.log(`    🔍 .tit 텍스트: "${text}"`);
                }
              }
            } catch (e) {
              console.log(`    ⚠️ 텍스트 추출 오류: ${e.message}`);
            }

            if (text && text.trim().length >= 2) {
              const cleanText = text.trim();
              console.log(`    🧹 정제된 텍스트: "${cleanText}"`);

              // 키워드 유효성 검사 (더 관대하게)
              if (
                cleanText.length >= 2 &&
                cleanText.length <= 50 &&
                cleanText !== query
              ) {
                // 키워드 카테고리 분류
                const category = categorizeKeyword(cleanText);

                relatedData.push({
                  query: query,
                  keyword_type: "relatedKeywords",
                  category: category,
                  text: cleanText,
                  rank: rank++,
                  grp: 1,
                  created_at: new Date().toISOString(),
                });

                console.log(
                  `    ✅ 연관검색어 발견: "${cleanText}" (카테고리: ${category})`
                );
              } else {
                console.log(`    ❌ 키워드 필터링됨: "${cleanText}"`);
              }
            } else {
              console.log(`    ❌ 텍스트 없음 또는 너무 짧음: "${text}"`);
            }
          } catch (error) {
            console.warn(`연관검색어 항목 처리 중 오류:`, error.message);
          }
        }
      } else {
        console.log("  ⚠️ 연관검색어 섹션을 찾을 수 없습니다.");
      }

      console.log(`✅ 연관검색어 ${relatedData.length}개 수집 완료`);
      return relatedData;
    } catch (error) {
      console.error("❌ 연관검색어 수집 중 오류:", error);
      return [];
    }
  }

  /**
   * 2페이지로 이동
   */
  async navigateToPage2(query) {
    try {
      console.log("  🔄 페이지네이션에서 2번 페이지 버튼 찾는 중...");

      // 페이지네이션 섹션에서 2번 페이지 버튼 찾기
      const page2ButtonSelectors = [
        '.sc_page_inner a.btn[aria-pressed="false"]:has-text("2")',
        '.sc_page_inner a:has-text("2")',
        '.api_sc_page_wrap a:has-text("2")',
        'a.btn:has-text("2")',
        'a[href*="page=2"]',
        'a[href*="start=1"][href*="page=2"]',
      ];

      let page2Button = null;

      for (const selector of page2ButtonSelectors) {
        try {
          const buttons = await this.page.locator(selector).all();
          console.log(`    ${selector}: ${buttons.length}개 버튼 발견`);

          for (const button of buttons) {
            if (await button.isVisible()) {
              const text = await button.textContent();
              const href = await button.getAttribute("href");

              if (text && text.trim() === "2") {
                page2Button = button;
                console.log(`  ✅ 2페이지 버튼 발견: ${selector}`);
                console.log(`    href: ${href}`);
                break;
              }
            }
          }

          if (page2Button) break;
        } catch (e) {
          // 다음 셀렉터 시도
        }
      }

      if (page2Button) {
        console.log("  🖱️ 2페이지 버튼 클릭 중...");
        await page2Button.click();
        await this.page.waitForLoadState("networkidle");
        await randomDelay(this.options.sleepMinMs, this.options.sleepMaxMs);
        console.log("  ✅ 2페이지로 이동 완료");
      } else {
        console.log(
          "  ⚠️ 2페이지 버튼을 찾을 수 없습니다. URL 직접 이동 시도..."
        );
        await this.navigateToPage2ByUrl(query);
      }
    } catch (error) {
      console.warn("2페이지 버튼 클릭 중 오류:", error.message);
      // 대안: URL 직접 이동
      await this.navigateToPage2ByUrl(query);
    }
  }

  /**
   * URL로 직접 2페이지 이동 (백업 방법)
   */
  async navigateToPage2ByUrl(query) {
    try {
      // 현재 URL에서 2페이지로 이동
      const currentUrl = this.page.url();
      let page2Url;

      if (currentUrl.includes("start=")) {
        // 이미 start 파라미터가 있으면 수정
        page2Url = currentUrl
          .replace(/start=\d+/, "start=1")
          .replace(/page=\d+/, "page=2");
      } else {
        // start 파라미터 추가
        const separator = currentUrl.includes("?") ? "&" : "?";
        page2Url = currentUrl + separator + "page=2&start=1&where=web";
      }

      console.log(`  🔄 URL로 2페이지 이동: ${page2Url}`);
      await this.page.goto(page2Url, { waitUntil: "networkidle" });
      await randomDelay(this.options.sleepMinMs, this.options.sleepMaxMs);
    } catch (error) {
      console.warn("URL로 2페이지 이동 중 오류:", error.message);
    }
  }

  /**
   * 다음 페이지 버튼 클릭 시도
   */
  async tryClickNextPage() {
    try {
      console.log("  🔄 다음 페이지 버튼 클릭 시도...");

      // 다양한 다음 페이지 버튼 셀렉터 시도
      const nextButtonSelectors = [
        'a[aria-label="다음페이지"]',
        ".sc_page_inner a.btn_next",
        ".paging a.next",
        'a:has-text("다음")',
        'a:has-text(">")',
      ];

      for (const selector of nextButtonSelectors) {
        try {
          const nextButton = await this.page.locator(selector).first();
          if (await nextButton.isVisible()) {
            await nextButton.click();
            await this.page.waitForLoadState("networkidle");
            await randomDelay(this.options.sleepMinMs, this.options.sleepMaxMs);
            console.log("  ✅ 다음 페이지로 이동 성공");
            return;
          }
        } catch (e) {
          // 다음 셀렉터 시도
        }
      }

      console.log("  ⚠️ 다음 페이지 버튼을 찾을 수 없습니다.");
    } catch (error) {
      console.warn("다음 페이지 버튼 클릭 중 오류:", error.message);
    }
  }

  /**
   * 연관검색어 섹션 찾기
   */
  async findRelatedKeywordsSection() {
    const possibleSelectors = [
      "section.sc_new.sp_related#nx_footer_related_keywords",
      "#nx_footer_related_keywords",
      'section[id*="related_keywords"]',
      ".sc_new.sp_related",
      ".api_subject_bx._related_box",
      'section:has-text("연관 검색어")',
      ".related_srch",
    ];

    for (const selector of possibleSelectors) {
      try {
        const element = await this.page.locator(selector).first();
        if (await element.isVisible()) {
          console.log(`  ✅ 연관검색어 섹션 발견: ${selector}`);
          return element;
        }
      } catch (e) {
        // 다음 셀렉터 시도
      }
    }

    // 더 넓은 범위의 셀렉터 추가
    const additionalSelectors = [
      'section[id*="related"]',
      'div[class*="related"]',
      'section[class*="related"]',
      "section.sc_new",
      ".sc_new",
      "ul.lst_related_srch",
      ".lst_related_srch li",
      "a.keyword",
    ];

    // 스크롤해서 찾기 시도
    console.log("  🔄 페이지 전체 스크롤하여 연관검색어 섹션 찾는 중...");
    await this.page.evaluate(async () => {
      // 천천히 스크롤하여 동적 컨텐츠 로드
      const scrollStep = 500;
      const scrollDelay = 300;
      let currentPosition = 0;
      const maxHeight = document.body.scrollHeight;

      while (currentPosition < maxHeight) {
        window.scrollTo(0, currentPosition);
        await new Promise((resolve) => setTimeout(resolve, scrollDelay));
        currentPosition += scrollStep;
      }

      // 맨 하단으로 이동
      window.scrollTo(0, document.body.scrollHeight);
    });

    await this.page.waitForTimeout(3000); // 컨텐츠 로드 대기

    // 모든 셀렉터로 다시 시도
    const allSelectors = [...possibleSelectors, ...additionalSelectors];

    for (const selector of allSelectors) {
      try {
        const elements = await this.page.locator(selector).all();
        console.log(`    ${selector}: ${elements.length}개 요소 발견`);

        for (const element of elements) {
          if (await element.isVisible()) {
            const text = await element.textContent();
            if (
              text &&
              (text.includes("연관") ||
                text.includes("관련") ||
                text.includes("검색어"))
            ) {
              console.log(`  ✅ 연관검색어 섹션 발견: ${selector}`);
              console.log(`    텍스트 미리보기: ${text.substring(0, 100)}...`);
              return element;
            }
          }
        }
      } catch (e) {
        // 다음 셀렉터 시도
      }
    }

    // DOM 구조 디버깅
    console.log("  🔍 페이지 하단 DOM 구조 분석 중...");
    const pageStructure = await this.page.evaluate(() => {
      const sections = document.querySelectorAll(
        'section, div[class*="related"], div[id*="related"]'
      );
      return Array.from(sections)
        .slice(-10)
        .map((el) => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          textPreview: el.textContent?.substring(0, 50) || "",
        }));
    });

    console.log(
      "  📋 페이지 하단 요소들:",
      JSON.stringify(pageStructure, null, 2)
    );

    return null;
  }
}

module.exports = RelatedKeywordsCollector;
