'use client';

import React from 'react';
import { Radar } from 'react-chartjs-2';
import { useKeywordAttributesChart } from './hooks/useKeywordAttributesChart';
import { 
  AttributesChartContainer, 
  AttributesChartTitle, 
  AttributesChartWrapper, 
  AttributeInfo, 
  AttributeItem, 
  AttributeLabel, 
  AttributeValue 
} from './styles/KeywordAttributesChartStyles';
import { KeywordAttributesChartProps } from './types';

export const KeywordAttributesChart: React.FC<KeywordAttributesChartProps> = ({
  data,
  title = "키워드 속성 분석"
}) => {
  const { chartData, options } = useKeywordAttributesChart({ data });

  return (
    <AttributesChartContainer>
      <AttributesChartTitle>{title}</AttributesChartTitle>
      <AttributesChartWrapper>
        <Radar data={chartData} options={options} />
      </AttributesChartWrapper>
      <AttributeInfo>
        <AttributeItem>
          <AttributeLabel>이슈성</AttributeLabel>
          <AttributeValue value={data.issue}>
            {data.issue}점
          </AttributeValue>
        </AttributeItem>
        <AttributeItem>
          <AttributeLabel>정보성</AttributeLabel>
          <AttributeValue value={data.information}>
            {data.information}점
          </AttributeValue>
        </AttributeItem>
        <AttributeItem>
          <AttributeLabel>상업성</AttributeLabel>
          <AttributeValue value={data.commercial}>
            {data.commercial}점
          </AttributeValue>
        </AttributeItem>
      </AttributeInfo>
    </AttributesChartContainer>
  );
};