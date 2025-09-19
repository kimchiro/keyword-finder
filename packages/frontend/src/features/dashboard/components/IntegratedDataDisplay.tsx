import React from 'react';
import {
  IntegratedDataContainer,
  IntegratedDataTitle,
  IntegratedDataGrid,
  DataCard,
  DataCardTitle,
  IntegratedKeywordItem,
  IntegratedKeywordText,
  KeywordMeta,
  SearchResultItem,
  SearchResultTitle,
  SearchResultMeta,
  TrendDataContainer,
  TrendDataGrid,
  TrendDataItem,
  RelatedKeywordsContainer,
  RelatedKeywordsGrid,
  RelatedKeywordItem,
  RelatedKeywordTitle,
  RelatedKeywordStat
} from '../styles/IntegratedDataStyles';
import { IntegratedDataDisplayProps } from '../types';
import { CrawlingKeyword, NaverSearchResult, NaverTrendData, NaverRelatedKeyword } from '../../../shared/types';

export const IntegratedDataDisplay: React.FC<IntegratedDataDisplayProps> = ({ data }) => {
  return (
    <IntegratedDataContainer>
      <IntegratedDataTitle>
        🔍 통합 키워드 분석: &ldquo;{data.query}&rdquo;
      </IntegratedDataTitle>
      
      <IntegratedDataGrid>
        {/* 크롤링 데이터 */}
        <DataCard>
          <DataCardTitle>
            📊 크롤링 키워드 ({Array.isArray(data.crawlingData) ? data.crawlingData.length : 0}개)
          </DataCardTitle>
          {Array.isArray(data.crawlingData) && data.crawlingData.slice(0, 10).map((item: CrawlingKeyword, index: number) => (
            <IntegratedKeywordItem key={index} isLast={index === 9}>
              <IntegratedKeywordText>{item.text}</IntegratedKeywordText>
              <KeywordMeta>
                <span>{item.keyword_type}</span>
                <span>#{item.rank}</span>
              </KeywordMeta>
            </IntegratedKeywordItem>
          ))}
        </DataCard>

        {/* 네이버 검색 결과 */}
        <DataCard>
          <DataCardTitle>
            🔍 네이버 검색 결과 ({Array.isArray(data.naverApiData?.searchResults) ? data.naverApiData.searchResults.length : 0}개)
          </DataCardTitle>
          {Array.isArray(data.naverApiData?.searchResults) && data.naverApiData.searchResults.slice(0, 5).map((item: NaverSearchResult, index: number) => (
            <SearchResultItem key={item.id} isLast={index === 4}>
              <SearchResultTitle>
                {item.title.replace(/<[^>]*>/g, '')}
              </SearchResultTitle>
              <SearchResultMeta>
                {item.bloggername} • {item.postdate}
              </SearchResultMeta>
            </SearchResultItem>
          ))}
        </DataCard>
      </IntegratedDataGrid>

      {/* 네이버 트렌드 데이터 */}
      {Array.isArray(data.naverApiData?.trendData) && data.naverApiData.trendData.length > 0 && (
        <TrendDataContainer>
          <DataCardTitle>
            📈 검색 트렌드 ({Array.isArray(data.naverApiData?.trendData) ? data.naverApiData.trendData.length : 0}개 데이터 포인트)
          </DataCardTitle>
          <TrendDataGrid>
            {Array.isArray(data.naverApiData?.trendData) && data.naverApiData.trendData.slice(0, 12).map((item: NaverTrendData) => (
              <TrendDataItem key={item.id}>
                {item.period}: {item.ratio}%
              </TrendDataItem>
            ))}
          </TrendDataGrid>
        </TrendDataContainer>
      )}

      {/* 연관검색어 */}
      {Array.isArray(data.naverApiData?.relatedKeywords) && data.naverApiData.relatedKeywords.length > 0 && (
        <RelatedKeywordsContainer>
          <DataCardTitle>
            🔗 연관검색어 ({Array.isArray(data.naverApiData?.relatedKeywords) ? data.naverApiData.relatedKeywords.length : 0}개)
          </DataCardTitle>
          <RelatedKeywordsGrid>
            {Array.isArray(data.naverApiData?.relatedKeywords) && data.naverApiData.relatedKeywords.slice(0, 8).map((item: NaverRelatedKeyword) => (
              <RelatedKeywordItem key={item.id}>
                <RelatedKeywordTitle>
                  {item.related_keyword}
                </RelatedKeywordTitle>
                <RelatedKeywordStat>
                  PC: {item.monthly_pc_qc_cnt.toLocaleString()}
                </RelatedKeywordStat>
                <RelatedKeywordStat>
                  Mobile: {item.monthly_mobile_qc_cnt.toLocaleString()}
                </RelatedKeywordStat>
              </RelatedKeywordItem>
            ))}
          </RelatedKeywordsGrid>
        </RelatedKeywordsContainer>
      )}
    </IntegratedDataContainer>
  );
};
