import React from 'react';
import styled from '@emotion/styled';
import { NaverDatalabApiResponse } from '../../../shared/types';
import { ComprehensiveAnalysisData, StatisticsData } from '../types/analysis';

interface ScrapedKeyword {
  keyword_type: string;
  text: string;
  rank: number;
  grp: number;
  category: string;
  created_at: string;
  keyword?: string;
  monthly_pc_qc_cnt?: number;
  monthly_mobile_qc_cnt?: number;
  monthly_ave_pc_clk_cnt?: number;
  monthly_ave_mobile_clk_cnt?: number;
  monthly_ave_pc_ctr?: number;
  monthly_ave_mobile_ctr?: number;
  comp_idx?: number;
}

interface IntegratedData {
  query: string;
  crawlingData: {
    keywords: ScrapedKeyword[];
    total: number;
  };
  naverApiData: {
    searchResults: number;
    trendData: number;
    relatedKeywords: number;
  };
  lastUpdated: string;
}
import { 
  TrendLineChart, 
  DemographicCharts, 
  KeywordAttributesChart,
  RelatedKeywordsTable
} from '@/shared/components/charts';

const AnalyticsContainer = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: center;
`;

const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const StatTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f7fafc;
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  color: #4a5568;
  font-size: 0.9rem;
`;

const StatValue = styled.span`
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
`;


const CompetitionBadge = styled.span<{ level: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  
  ${({ level }) => {
    switch (level) {
      case '낮음':
        return 'background: #c6f6d5; color: #22543d;';
      case '중간':
        return 'background: #fed7aa; color: #9c4221;';
      case '높음':
        return 'background: #fed7d7; color: #742a2a;';
      default:
        return 'background: #e2e8f0; color: #4a5568;';
    }
  }}
`;

interface SearchAnalyticsProps {
  datalabResults: NaverDatalabApiResponse | null;
  comprehensiveData?: ComprehensiveAnalysisData | null;
  integratedData?: IntegratedData | null;
}

// 통계 데이터 렌더링 컴포넌트
const StatisticsCard: React.FC<{ data: StatisticsData; icon: string }> = ({ data, icon }) => (
  <StatCard>
    <StatTitle>
      <span>{icon}</span>
      {data.label}
    </StatTitle>
    <StatRow>
      <StatLabel>데이터 수</StatLabel>
      <StatValue>{data.count}개</StatValue>
    </StatRow>
    <StatRow>
      <StatLabel>최소값</StatLabel>
      <StatValue>{data.min}{data.unit}</StatValue>
    </StatRow>
    <StatRow>
      <StatLabel>최대값</StatLabel>
      <StatValue>{data.max}{data.unit}</StatValue>
    </StatRow>
    <StatRow>
      <StatLabel>평균</StatLabel>
      <StatValue>{data.average}{data.unit}</StatValue>
    </StatRow>
    <StatRow>
      <StatLabel>중간값</StatLabel>
      <StatValue>{data.median}{data.unit}</StatValue>
    </StatRow>
    <StatRow>
      <StatLabel>1분위수</StatLabel>
      <StatValue>{data.q1}{data.unit}</StatValue>
    </StatRow>
    <StatRow>
      <StatLabel>3분위수</StatLabel>
      <StatValue>{data.q3}{data.unit}</StatValue>
    </StatRow>
  </StatCard>
);

export const SearchAnalytics: React.FC<SearchAnalyticsProps> = ({
  datalabResults,
  comprehensiveData,
  integratedData,
}) => {
  // 최소한 하나의 데이터라도 있으면 컴포넌트를 렌더링
  const hasAnyData = (datalabResults?.data?.results?.length || 0) > 0 || 
                     !!comprehensiveData?.keywordStatistics || 
                     (comprehensiveData?.relatedKeywords?.length || 0) > 0 ||
                     (integratedData?.crawlingData?.keywords?.length || 0) > 0;

  if (!hasAnyData) {
    return (
      <AnalyticsContainer>
        <SectionTitle>📊 분석 결과</SectionTitle>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          분석할 데이터가 없습니다. 키워드를 검색해보세요.
        </div>
      </AnalyticsContainer>
    );
  }

  const trendData = datalabResults?.data?.results?.[0];
  const keyword = trendData?.title || comprehensiveData?.keyword || '키워드';

  // 트렌드 차트용 데이터 변환
  const chartData = trendData?.data?.map(item => ({
    month: item.period,
    ratio: item.ratio
  })) || [];

  // 키워드 속성 데이터 (종합 분석 데이터에서 추출)
  const keywordAttributes = comprehensiveData?.keywordAnalysis || null;

  // 인구통계 데이터 (종합 분석 데이터에서 추출)
  const demographicData = comprehensiveData?.demographics || null;

  // 새로운 키워드 통계 데이터
  const keywordStatistics = comprehensiveData?.keywordStatistics;
  const relatedKeywords = comprehensiveData?.relatedKeywords || [];

  // 연관검색어 데이터 (통합 데이터에서 추출 - 기존 호환성을 위해 유지)
  const scrapedRelatedKeywords = integratedData?.crawlingData?.keywords?.filter(
    k => k.keyword_type === 'relatedKeywords'
  ) || [];

  return (
    <AnalyticsContainer>

      {/* 트렌드 라인 차트 - 숨김 처리 */}
      {chartData.length > 0 && (
        <>
          <TrendLineChart 
            data={chartData}
            title="네이버 검색 트렌드"
            keyword={keyword}
          />
        </>
      )}

      {/* 키워드 통계 분석 */}
      {keywordStatistics && (
        <>
          <SectionTitle>📊 키워드 분석 통계</SectionTitle>
          
          {/* 네이버 API 키가 없어서 실제 데이터를 가져올 수 없다는 안내 */}
          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '8px', 
            padding: '12px', 
            marginBottom: '1rem',
            color: '#856404'
          }}>
            ℹ️ 네이버 검색광고 API 키가 설정되지 않아 실제 검색량, 클릭수, CTR 데이터를 표시할 수 없습니다. 
            스크래핑된 키워드 정보만 표시됩니다.
          </div>
          
          {/* 검색량 통계 */}
          <StatisticsGrid>
            <StatisticsCard data={keywordStatistics.searchVolume.pc} icon="💻" />
            <StatisticsCard data={keywordStatistics.searchVolume.mobile} icon="📱" />
            <StatisticsCard data={keywordStatistics.searchVolume.total} icon="🔍" />
          </StatisticsGrid>

          {/* 클릭수 통계 */}
          <StatisticsGrid>
            <StatisticsCard data={keywordStatistics.clickCount.pc} icon="🖱️" />
            <StatisticsCard data={keywordStatistics.clickCount.mobile} icon="👆" />
          </StatisticsGrid>

          {/* CTR 통계 */}
          <StatisticsGrid>
            <StatisticsCard data={keywordStatistics.ctr.pc} icon="📈" />
            <StatisticsCard data={keywordStatistics.ctr.mobile} icon="📊" />
          </StatisticsGrid>

          {/* 경쟁도 분석 */}
          <StatCard>
            <StatTitle>
              <span>⚔️</span>
              경쟁도 분석
            </StatTitle>
            <StatRow>
              <StatLabel>평균 경쟁도</StatLabel>
              <StatValue>
                <CompetitionBadge level={keywordStatistics.competition.averageLevel}>
                  {keywordStatistics.competition.averageLevel}
                </CompetitionBadge>
              </StatValue>
            </StatRow>
            {Object.entries(keywordStatistics.competition.levelDistribution).map(([level, count]) => (
              <StatRow key={level}>
                <StatLabel>{level} 경쟁도</StatLabel>
                <StatValue>{count}개</StatValue>
              </StatRow>
            ))}
          </StatCard>
        </>
      )}

      {/* 연관 키워드 상세 테이블 - RelatedKeywordsTable 사용 */}
      {relatedKeywords.length > 0 && (
        <RelatedKeywordsTable 
          data={relatedKeywords.map(keyword => ({
            relKeyword: keyword.relKeyword,
            monthlyPcQcCnt: keyword.monthlyPcQcCnt,
            monthlyMobileQcCnt: keyword.monthlyMobileQcCnt,
            monthlyAvePcClkCnt: keyword.monthlyAvePcClkCnt,
            monthlyAveMobileClkCnt: keyword.monthlyAveMobileClkCnt,
            monthlyAvePcCtr: keyword.monthlyAvePcCtr,
            monthlyAveMobileCtr: keyword.monthlyAveMobileCtr,
            plAvgDepth: 0, // EnhancedKeyword에는 없으므로 기본값
            compIdx: keyword.pcCompIdx || keyword.mobileCompIdx || '0'
          }))}
          title="🔗 연관 키워드 상세 분석"
        />
      )}

      {/* 스크래핑된 연관 키워드 테이블 */}
      {scrapedRelatedKeywords.length > 0 && (
        <RelatedKeywordsTable 
          data={scrapedRelatedKeywords.map(keyword => ({
            relKeyword: keyword.keyword || keyword.text,
            monthlyPcQcCnt: keyword.monthly_pc_qc_cnt || 0,
            monthlyMobileQcCnt: keyword.monthly_mobile_qc_cnt || 0,
            monthlyAvePcClkCnt: keyword.monthly_ave_pc_clk_cnt || 0,
            monthlyAveMobileClkCnt: keyword.monthly_ave_mobile_clk_cnt || 0,
            monthlyAvePcCtr: keyword.monthly_ave_pc_ctr || 0,
            monthlyAveMobileCtr: keyword.monthly_ave_mobile_ctr || 0,
            plAvgDepth: 0, // 기본값 설정
            compIdx: String(keyword.comp_idx || 0) // string으로 변환
          }))}
          title="🕷️ 스크래핑된 연관 키워드"
        />
      )}

      {/* 키워드 속성 분석 - 데이터가 있을 때만 표시 */}
      {keywordAttributes && (
        <KeywordAttributesChart 
          data={keywordAttributes}
          title="키워드 속성 분석"
        />
      )}

      {/* 인구통계 분석 - 데이터가 있을 때만 표시 */}
      {demographicData && (
        <DemographicCharts
          genderData={demographicData.gender}
          ageData={demographicData.age}
          deviceData={demographicData.device}
          weeklyData={demographicData.weekly}
        />
      )}
    </AnalyticsContainer>
  );
};
