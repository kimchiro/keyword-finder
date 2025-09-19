export interface NaverSearchItem {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
}

export interface NaverSearchData {
  lastBuildDate?: string;
  total: number;
  start?: number;
  display?: number;
  items: NaverSearchItem[];
}

export interface NaverSearchCardProps {
  searchData: NaverSearchData | null;
  query?: string;
}
