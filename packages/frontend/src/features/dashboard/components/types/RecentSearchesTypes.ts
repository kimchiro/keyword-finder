import { DashboardData } from '../../types';

export interface RecentSearchesProps {
  recentSearches: DashboardData['recentSearches'];
  onQueryClick: (query: string) => void;
}
