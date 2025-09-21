import styled from '@emotion/styled';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #742a2a;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid #e53e3e;
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #667eea;
  font-size: 1rem;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1.1rem;
`;
