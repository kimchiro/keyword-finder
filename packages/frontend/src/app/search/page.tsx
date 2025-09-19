'use client';

import React from 'react';
import { useKeywordSearch } from '@/features/keyword-search/hooks/useKeywordSearch';
import { useNaverApi } from '@/features/keyword-search/hooks/useNaverApi';
import { SearchForm } from '@/features/keyword-search/components/SearchForm';
import { SearchResults } from '@/features/keyword-search/components/SearchResults';
import { NaverSearchResults } from '@/features/keyword-search/components/NaverSearchResults';
import { 
  Container, 
  Card, 
  Title, 
  ErrorMessage 
} from '@/features/keyword-search/styles/SearchStyles';

// Shared Chart Components
import { 
  TrendLineChart, 
  DemographicCharts, 
  KeywordAttributesChart
} from '@/shared/components/charts';

export default function SearchPage() {
  const { loading: keywordLoading, results, error, searchKeywords } = useKeywordSearch();
  const { 
    loading: naverLoading, 
    searchResults, 
    datalabResults, 
    error: naverError, 
    searchBlogs, 
    getSearchTrend 
  } = useNaverApi();

  const handleSearch = (query: string) => {
    searchKeywords(query, {
      headless: true,
      maxPagesPerModule: 2,
      saveToDb: true,
    });
  };

  const handleNaverSearch = async (query: string) => {
    // 네이버 검색 API 호출
    await searchBlogs(query, { display: 10, sort: 'sim' });
    
    // 네이버 데이터랩 API 호출 (최근 1년간 트렌드)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    
    await getSearchTrend({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      timeUnit: 'month',
      keywordGroups: [{ groupName: query, keywords: [query] }],
    });
  };

  const isLoading = keywordLoading || naverLoading;
  const displayError = error || naverError;

  return (
    <Container>
      <Card>
        <Title>네이버 키워드 파인더</Title>
        
        <SearchForm 
          onSubmit={handleSearch} 
          onNaverSearch={handleNaverSearch}
          loading={isLoading} 
        />

        {displayError && <ErrorMessage>{displayError}</ErrorMessage>}

        {results && <SearchResults results={results} />}
        
        {(searchResults || datalabResults) && (
          <NaverSearchResults 
            searchResults={searchResults}
            datalabResults={datalabResults}
          />
        )}

        {/* Shared Chart Components 사용 예시 */}
        {datalabResults && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#2d3748', 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              📈 검색 트렌드 분석 (Shared Components)
            </h3>
            
            {/* 트렌드 라인 차트 */}
            {datalabResults.data?.results && datalabResults.data.results.length > 0 && (
              <TrendLineChart 
                data={datalabResults.data.results[0].data.map(item => ({
                  month: item.period,
                  ratio: item.ratio
                }))}
                title="네이버 검색 트렌드"
                keyword={datalabResults.data.results[0].title}
              />
            )}

            {/* 샘플 키워드 속성 데이터 */}
            <KeywordAttributesChart 
              data={{
                keyword: datalabResults.data?.results?.[0]?.title || '검색어',
                issue: 75,
                information: 60,
                commercial: 45
              }}
              title="키워드 속성 분석"
            />

            {/* 샘플 인구통계 데이터 (실제로는 API에서 받아와야 함) */}
            <DemographicCharts
              genderData={[
                { gender: '남성', ratio: 45 },
                { gender: '여성', ratio: 55 }
              ]}
              ageData={[
                { age: '10대', ratio: 15 },
                { age: '20대', ratio: 30 },
                { age: '30대', ratio: 25 },
                { age: '40대', ratio: 20 },
                { age: '50대', ratio: 10 }
              ]}
              deviceData={[
                { device: 'PC', ratio: 35 },
                { device: '모바일', ratio: 65 }
              ]}
              weeklyData={[
                { dayOfWeek: '월', ratio: 12 },
                { dayOfWeek: '화', ratio: 15 },
                { dayOfWeek: '수', ratio: 18 },
                { dayOfWeek: '목', ratio: 16 },
                { dayOfWeek: '금', ratio: 14 },
                { dayOfWeek: '토', ratio: 13 },
                { dayOfWeek: '일', ratio: 12 }
              ]}
            />
          </div>
        )}
      </Card>
    </Container>
  );
}
