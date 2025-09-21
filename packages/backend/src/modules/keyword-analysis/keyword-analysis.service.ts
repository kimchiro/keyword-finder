import { Injectable } from '@nestjs/common';
import { KeywordAnalysisDomainService } from './domain';

/**
 * 키워드 분석 서비스 (Application Layer)
 * 도메인 서비스를 활용하여 애플리케이션 로직을 처리
 */
@Injectable()
export class KeywordAnalysisService {
  constructor(
    private keywordAnalysisDomainService: KeywordAnalysisDomainService,
  ) {}

  async analyzeKeyword(keyword: string, analysisDate?: string, naverApiData?: any, relatedKeywordsData?: any[]) {
    try {
      const aggregate = await this.keywordAnalysisDomainService.analyzeKeyword(
        keyword,
        analysisDate,
        naverApiData,
        relatedKeywordsData,
      );

      return aggregate.toDto();
    } catch (error) {
      console.error('❌ KeywordAnalysisService.analyzeKeyword 오류:', error);
      throw error;
    }
  }

  async getKeywordAnalysis(keyword: string) {
    try {
      const result = await this.keywordAnalysisDomainService.getKeywordAnalysis(keyword);
      
      if (!result.success || !result.data) {
        return {
          success: false,
          data: { analytics: null, relatedKeywords: [], chartData: null },
        };
      }

      return {
        success: true,
        data: result.data.toDto(),
      };
    } catch (error) {
      console.error('❌ KeywordAnalysisService.getKeywordAnalysis 오류:', error);
      throw error;
    }
  }

  async getAnalyzedKeywords() {
    try {
      return await this.keywordAnalysisDomainService.getAnalyzedKeywords();
    } catch (error) {
      console.error('❌ KeywordAnalysisService.getAnalyzedKeywords 오류:', error);
      throw error;
    }
  }
}
