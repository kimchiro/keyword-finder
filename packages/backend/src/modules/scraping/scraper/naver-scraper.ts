import { chromium, Browser, Page } from 'playwright';

export interface ScrapedKeyword {
  keyword: string;
  category: 'autosuggest' | 'related' | 'trending' | 'smartblock';
  searchVolume?: number;
  competition?: 'low' | 'medium' | 'high';
  source: string;
  similarity?: 'low' | 'medium' | 'high';
  relatedData?: any;
}

export class NaverScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize() {
    console.log('🚀 Playwright 브라우저 초기화 중...');
    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    });
    this.page = await this.browser.newPage();
    
    // 사용자 에이전트 설정
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    console.log('✅ Playwright 브라우저 초기화 완료');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Playwright 브라우저 종료');
    }
  }

  // 자동완성과 연관검색어 스크래핑은 봇 차단으로 인해 제거됨

  /**
   * 네이버 인기주제 키워드 수집
   */
  async scrapeTrendingKeywords(query: string): Promise<ScrapedKeyword[]> {
    if (!this.page) throw new Error('브라우저가 초기화되지 않았습니다.');

    console.log(`📈 인기주제 키워드 수집 시작: ${query}`);
    
    try {
      // 네이버 트렌드 페이지로 이동
      await this.page.goto('https://datalab.naver.com/keyword/trendSearch.naver', {
        waitUntil: 'networkidle',
      });
      
      // 검색창에 키워드 입력
      const searchInput = await this.page.locator('#content_keyword');
      await searchInput.fill(query);
      await searchInput.press('Enter');
      
      // 결과 로딩 대기
      await this.page.waitForTimeout(3000);
      
      // 관련 키워드들 추출 (실제 선택자는 페이지 구조에 따라 조정 필요)
      const trendingKeywords = await this.page.locator('.trending_keyword').allTextContents();
      
      const keywords: ScrapedKeyword[] = trendingKeywords
        .filter(keyword => keyword.trim() && keyword !== query)
        .slice(0, 10) // 최대 10개
        .map(keyword => ({
          keyword: keyword.trim(),
          category: 'trending' as const,
          source: 'naver_trending',
          competition: this.estimateCompetition(keyword),
        }));

      console.log(`✅ 인기주제 키워드 ${keywords.length}개 수집 완료`);
      return keywords;
    } catch (error) {
      console.error('❌ 인기주제 키워드 수집 실패:', error);
      return [];
    }
  }

  /**
   * 네이버 스마트블록 데이터 수집
   */
  async scrapeSmartBlockData(query: string): Promise<ScrapedKeyword[]> {
    if (!this.page) throw new Error('브라우저가 초기화되지 않았습니다.');

    console.log(`🧠 스마트블록 데이터 수집 시작: ${query}`);
    
    try {
      // 네이버 검색 결과 페이지로 이동
      await this.page.goto(`https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`, {
        waitUntil: 'networkidle',
      });
      
      // 스마트블록 영역들 확인
      const smartBlocks = await this.page.locator('.api_subject_bx, .knowledge_box, .info_group').all();
      
      const keywords: ScrapedKeyword[] = [];
      
      for (const block of smartBlocks) {
        try {
          // 각 스마트블록에서 키워드 추출
          const blockKeywords = await block.locator('a, .keyword, .tag').allTextContents();
          
          blockKeywords
            .filter(keyword => keyword.trim() && keyword !== query && keyword.length > 1)
            .slice(0, 5) // 블록당 최대 5개
            .forEach(keyword => {
              keywords.push({
                keyword: keyword.trim(),
                category: 'smartblock' as const,
                source: 'naver_smartblock',
                competition: this.estimateCompetition(keyword),
                similarity: this.calculateSimilarity(query, keyword),
              });
            });
        } catch (blockError) {
          console.warn('스마트블록 처리 중 오류:', blockError);
        }
      }

      // 중복 제거 및 최대 10개로 제한
      const uniqueKeywords = keywords
        .filter((keyword, index, self) => 
          self.findIndex(k => k.keyword === keyword.keyword) === index
        )
        .slice(0, 10);

      console.log(`✅ 스마트블록 키워드 ${uniqueKeywords.length}개 수집 완료`);
      return uniqueKeywords;
    } catch (error) {
      console.error('❌ 스마트블록 데이터 수집 실패:', error);
      return [];
    }
  }

  /**
   * 스마트블록과 인기주제 키워드만 수집 (봇 차단으로 인해 축소)
   */
  async scrapeAllKeywords(
    query: string, 
    types: string[] = ['trending', 'smartblock']
  ): Promise<ScrapedKeyword[]> {
    console.log(`🚀 키워드 수집 시작: ${query}, 타입: ${types.join(', ')}`);
    
    const promises: Promise<ScrapedKeyword[]>[] = [];
    
    if (types.includes('trending')) {
      promises.push(this.scrapeTrendingKeywords(query));
    }
    if (types.includes('smartblock')) {
      promises.push(this.scrapeSmartBlockData(query));
    }
    
    const results = await Promise.allSettled(promises);
    
    const allKeywords: ScrapedKeyword[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allKeywords.push(...result.value);
      } else {
        console.error(`키워드 수집 실패 (${types[index]}):`, result.reason);
      }
    });
    
    // 중복 제거
    const uniqueKeywords = allKeywords.filter((keyword, index, self) => 
      self.findIndex(k => k.keyword === keyword.keyword) === index
    );
    
    console.log(`✅ 전체 키워드 수집 완료: ${uniqueKeywords.length}개`);
    return uniqueKeywords;
  }

  /**
   * 키워드 경쟁도 추정 (간단한 휴리스틱)
   */
  private estimateCompetition(keyword: string): 'low' | 'medium' | 'high' {
    const length = keyword.length;
    const hasNumbers = /\d/.test(keyword);
    const hasSpecialChars = /[^\w\s가-힣]/.test(keyword);
    
    if (length <= 2 || hasNumbers || hasSpecialChars) {
      return 'high';
    } else if (length <= 4) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * 키워드 유사도 계산 (간단한 문자열 유사도)
   */
  private calculateSimilarity(original: string, target: string): 'low' | 'medium' | 'high' {
    const originalChars = new Set(original.split(''));
    const targetChars = new Set(target.split(''));
    
    const intersection = new Set([...originalChars].filter(x => targetChars.has(x)));
    const union = new Set([...originalChars, ...targetChars]);
    
    const similarity = intersection.size / union.size;
    
    if (similarity >= 0.7) return 'high';
    if (similarity >= 0.4) return 'medium';
    return 'low';
  }
}
