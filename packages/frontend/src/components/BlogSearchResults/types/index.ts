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
  searchResults: NaverSearchApiResponse | null;
}
