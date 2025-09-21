export interface ScrapedKeyword {
  keyword: string;
  category: string;
  score?: number;
  url?: string;
  metadata?: Record<string, unknown>;
}

export interface ScrapingData {
  query: string;
  totalKeywords: number;
  executionTime: number;
  categories: Record<string, number>;
  keywords: ScrapedKeyword[];
}

export interface SmartBlockProps {
  scrapingData?: ScrapingData | null;
}
