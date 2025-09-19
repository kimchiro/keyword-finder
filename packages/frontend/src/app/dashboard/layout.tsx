import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '대시보드 | 네이버 키워드 파인더',
  description: '키워드 수집 통계 및 네이버 검색 트렌드 분석 대시보드',
  keywords: ['키워드 대시보드', '검색 통계', '트렌드 분석', '네이버 API'],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
