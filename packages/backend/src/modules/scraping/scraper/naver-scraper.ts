import { Browser, Page } from 'playwright';
import { BrowserPoolService } from '../../../common/services/browser-pool.service';
import { SCRAPING_DEFAULTS, NAVER_SCRAPING, SEARCH_VOLUME } from '../../../constants/scraping.constants';

export interface ScrapedKeyword {
  keyword: string;
  category: 'autosuggest' | 'related' | 'trending' | 'smartblock' | 'related_search';
  searchVolume?: number;
  competition?: 'low' | 'medium' | 'high';
  source: string;
  similarity?: 'low' | 'medium' | 'high';
  relatedData?: any;
}

interface BrowserSession {
  browser: Browser;
  page: Page;
  instanceId: string;
}

export class NaverScraper {
  private session: BrowserSession | null = null;

  constructor(private browserPoolService: BrowserPoolService) {}

  async initialize() {
    console.log('🚀 브라우저 풀에서 브라우저 세션 획득 중...');
    this.session = await this.browserPoolService.acquireBrowser();
    console.log('✅ 브라우저 세션 획득 완료');
  }

  async close() {
    if (this.session) {
      await this.browserPoolService.releaseBrowser(this.session);
      this.session = null;
      console.log('🔒 브라우저 세션 반환 완료');
    }
  }

  private get page(): Page {
    if (!this.session?.page) {
      throw new Error('브라우저 세션이 초기화되지 않았습니다.');
    }
    return this.session.page;
  }

  // 자동완성과 연관검색어 스크래핑은 봇 차단으로 인해 제거됨

  /**
   * 네이버 인기주제 키워드 수집
   */
  async scrapeTrendingKeywords(query: string): Promise<ScrapedKeyword[]> {

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
        .slice(0, SCRAPING_DEFAULTS.MAX_KEYWORDS_PER_TYPE) // 최대 키워드 수
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
        .slice(0, SCRAPING_DEFAULTS.MAX_KEYWORDS_PER_TYPE);

      console.log(`✅ 스마트블록 키워드 ${uniqueKeywords.length}개 수집 완료`);
      return uniqueKeywords;
    } catch (error) {
      console.error('❌ 스마트블록 데이터 수집 실패:', error);
      return [];
    }
  }

  /**
   * 네이버 검색 결과 페이지에서 연관검색어 수집
   */
  async scrapeRelatedSearchKeywords(query: string): Promise<ScrapedKeyword[]> {
    console.log(`🔗 연관검색어 수집 시작: ${query}`);
    
    try {

      // 네이버 검색 결과 페이지로 이동
      const searchUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`;
      await this.page.goto(searchUrl, { waitUntil: 'networkidle' });
      
      // 연관검색어 영역 대기
      await this.page.waitForTimeout(2000);
      
      const relatedKeywords: ScrapedKeyword[] = [];
      
      // 연관검색어 선택자들 (네이버 검색 결과 페이지의 연관검색어 영역)
      const selectors = [
        '.related_srch .keyword', // 연관검색어 영역
        '.lst_related_srch a', // 연관검색어 링크
        '.related_keyword a', // 연관키워드
        '.api_subject_bx .elss', // 연관검색어 박스
      ];
      
      for (const selector of selectors) {
        try {
          const elements = await this.page.$$(selector);
          
          for (const element of elements) {
            const text = await element.textContent();
            if (text && text.trim() && text.trim() !== query) {
              const cleanText = text.trim().replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ');
              
              if (cleanText.length > 1 && cleanText.length < 50) {
                relatedKeywords.push({
                  keyword: cleanText,
                  category: 'related_search',
                  source: 'naver_related_search',
                  searchVolume: Math.floor(Math.random() * SEARCH_VOLUME.DEFAULT_RANGE.MAX) + SEARCH_VOLUME.DEFAULT_RANGE.MIN,
                  competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
                  similarity: 'medium',
                });
              }
            }
          }
        } catch (error) {
          console.warn(`연관검색어 선택자 실패 (${selector}):`, error.message);
        }
      }
      
      // 중복 제거
      const uniqueKeywords = relatedKeywords.filter((keyword, index, self) => 
        index === self.findIndex(k => k.keyword === keyword.keyword)
      );
      
      console.log(`✅ 연관검색어 ${uniqueKeywords.length}개 수집 완료`);
      return uniqueKeywords.slice(0, SCRAPING_DEFAULTS.MAX_KEYWORDS_PER_TYPE); // 최대 키워드 수
      
    } catch (error) {
      console.error('❌ 연관검색어 수집 실패:', error);
      return [];
    }
  }

  /**
   * 스마트블록, 인기주제, 연관검색어 키워드 수집
   */
  async scrapeAllKeywords(
    query: string, 
    types: string[] = ['related_search']
  ): Promise<ScrapedKeyword[]> {
    console.log(`🚀 키워드 수집 시작: ${query}, 타입: ${types.join(', ')}`);
    
    const promises: Promise<ScrapedKeyword[]>[] = [];
    
    if (types.includes('trending')) {
      promises.push(this.scrapeTrendingKeywords(query));
    }
    if (types.includes('smartblock')) {
      promises.push(this.scrapeSmartBlockData(query));
    }
    if (types.includes('related_search')) {
      promises.push(this.scrapeRelatedSearchKeywords(query));
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
