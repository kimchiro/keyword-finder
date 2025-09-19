import { KeywordData } from '../../types';

export interface KeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  keywords: KeywordData[];
  onCopy: () => void;
}
