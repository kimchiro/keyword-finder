import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '키워드 검색 | 네이버 키워드 파인더',
  description: '네이버 검색 키워드 자동 수집 및 네이버 Open API를 활용한 검색 트렌드 분석',
  keywords: ['네이버 키워드', '키워드 수집', '검색 트렌드', 'SEO', '마케팅'],
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
