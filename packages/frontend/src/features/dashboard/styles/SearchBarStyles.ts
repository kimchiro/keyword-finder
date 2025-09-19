import styled from '@emotion/styled';

export const SearchBarContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  min-width: 200px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
  }
`;

export const SearchButton = styled('button', {
  shouldForwardProp: (prop: string) => prop !== 'loading',
})<{ loading?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${(props: { loading?: boolean }) => 
    props.loading 
      ? '#94a3b8' 
      : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
  };
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: ${(props: { loading?: boolean }) => props.loading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const NaverResultsContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ErrorContainer = styled.div`
  margin-top: 1rem;
`;
