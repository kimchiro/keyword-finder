import React from 'react';
import { useKeywordModal } from './hooks/useKeywordModal';
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
import { KeywordModalProps } from './types/KeywordModalTypes';

export const KeywordModal: React.FC<KeywordModalProps> = ({ 
  isOpen, 
  onClose, 
  query, 
  keywords, 
  onCopy 
}) => {
  const { handleOverlayClick, handleCopy, groupedKeywords, getTypeLabel } = useKeywordModal({
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
          
          {Object.entries(groupedKeywords).map(([type, typeKeywords]) => (
            <KeywordSection key={type}>
              <KeywordType>{getTypeLabel(type)} ({typeKeywords.length}개)</KeywordType>
              {typeKeywords
                .sort((a, b) => a.rank - b.rank)
                .map((keyword, index) => (
                  <KeywordItem key={`${keyword.id}-${index}`}>
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
