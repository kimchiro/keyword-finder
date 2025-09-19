import React from 'react';
import { useKeywordModalLogic } from '../hooks/useKeywordModalLogic';
import { 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  CloseButton, 
  ModalBody, 
  CopyButton, 
  KeywordSection, 
  KeywordItem, 
  KeywordText,
  KeywordType,
  KeywordRank
} from '../styles/ModalStyles';
import { KeywordModalProps } from '../types';
import { KeywordData } from '../../../shared/types';

export const KeywordModal: React.FC<KeywordModalProps> = ({ 
  isOpen, 
  onClose, 
  query, 
  keywords, 
  onCopy 
}) => {
  const { handleOverlayClick, handleCopy, groupedKeywords, getTypeLabel } = useKeywordModalLogic({
    keywords,
    onCopy,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>&apos;{query}&apos; 검색 결과</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <CopyButton onClick={handleCopy}>
            전체 복사
          </CopyButton>
          
          {Object.entries(groupedKeywords).map(([type, typeKeywords]: [string, KeywordData[]]) => (
            <KeywordSection key={type}>
              <KeywordType>{getTypeLabel(type)} ({typeKeywords.length}개)</KeywordType>
              {typeKeywords
                .sort((a: KeywordData, b: KeywordData) => a.rank - b.rank)
                .map((keyword: KeywordData, index: number) => (
                  <KeywordItem key={`${keyword.text}-${index}`}>
                    <KeywordText>{keyword.text}</KeywordText>
                    <KeywordRank>#{keyword.rank}</KeywordRank>
                  </KeywordItem>
                ))}
            </KeywordSection>
          ))}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};
