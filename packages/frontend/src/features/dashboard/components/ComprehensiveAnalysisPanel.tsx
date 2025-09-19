import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { useComprehensiveAnalysis } from '../hooks/useComprehensiveAnalysis';
import { 
  TrendLineChart, 
  DemographicCharts, 
  KeywordAttributesChart, 
  RelatedKeywordsTable 
} from '@/shared/components/charts';
import { LoadingSpinner, ErrorMessage } from '../styles/DashboardStyles';

const PanelContainer = styled.div`
  margin-top: 2rem;
`;

const PanelHeader = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const PanelTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const KeywordBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 600;
`;


const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const LoadingText = styled.div`
  margin-top: 1rem;
  color: #6b7280;
  font-size: 1.1rem;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  color: #6b7280;
  font-size: 1.1rem;
`;

interface ComprehensiveAnalysisPanelProps {
  keyword: string | null;
  onAnalyze: (keyword: string) => void;
}

export const ComprehensiveAnalysisPanel: React.FC<ComprehensiveAnalysisPanelProps> = ({
  keyword,
  onAnalyze,
}) => {
  const { loading, data, error } = useComprehensiveAnalysis();
  const lastAnalyzedKeyword = useRef<string | null>(null);

  // keyword가 변경되면 자동으로 분석 실행 (중복 방지)
  React.useEffect(() => {
    if (keyword && keyword !== lastAnalyzedKeyword.current) {
      console.log(`🔍 새로운 키워드 분석 시작: ${keyword}`);
      lastAnalyzedKeyword.current = keyword;
      onAnalyze(keyword);
    }
  }, [keyword, onAnalyze]);

  if (!keyword) {
    return (
      <PanelContainer>
        <NoDataMessage>
          키워드를 검색하여 상세 분석을 확인해보세요.
        </NoDataMessage>
      </PanelContainer>
    );
  }

  if (loading) {
    return (
      <PanelContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>&ldquo;{keyword}&rdquo; 키워드를 분석하고 있습니다...</LoadingText>
        </LoadingContainer>
      </PanelContainer>
    );
  }

  if (error) {
    return (
      <PanelContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </PanelContainer>
    );
  }

  if (!data) {
    return (
      <PanelContainer>
        <NoDataMessage>
          분석 데이터를 불러올 수 없습니다.
        </NoDataMessage>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>키워드 종합 분석</PanelTitle>
        <KeywordBadge>{data.keyword}</KeywordBadge>
      </PanelHeader>

      {/* 검색량 트렌드 */}
      {data.monthlyRatio && data.monthlyRatio.length > 0 && (
        <TrendLineChart 
          data={data.monthlyRatio}
          title="월별 검색량 트렌드"
          keyword={data.keyword}
        />
      )}

      {/* 키워드 속성 분석 */}
      <KeywordAttributesChart data={data.attributes} />

      {/* 인구통계학적 분석 */}
      <DemographicCharts
        genderData={data.genderRatio}
        ageData={data.ageRatio}
        deviceData={data.deviceRatio}
        weeklyData={data.weeklyRatio}
      />

      {/* 연관 키워드 테이블 */}
      {data.relatedKeywords && data.relatedKeywords.length > 0 && (
        <RelatedKeywordsTable 
          data={data.relatedKeywords}
          title={`"${data.keyword}" 연관 키워드 분석`}
        />
      )}
    </PanelContainer>
  );
};
