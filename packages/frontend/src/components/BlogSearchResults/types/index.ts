// 네이버 검색 아이템 타입
export interface NaverSearchItem {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
}

// 네이버 검색 API 응답 타입
export interface NaverSearchApiResponse {
  data?: {
    items?: NaverSearchItem[];
  };
}

// BlogSearchResults 컴포넌트 Props 타입
export interface BlogSearchResultsProps {
  searchResults: NaverSearchApiResponse | NaverBlogSearchResult | null;
}

// 백엔드에서 반환하는 네이버 블로그 검색 결과 타입
export interface NaverBlogSearchResult {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverSearchItem[];
}
