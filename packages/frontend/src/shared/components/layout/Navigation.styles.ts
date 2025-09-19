'use client';

import styled from '@emotion/styled';

export const Nav = styled.nav`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

export const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

export const StyledLink = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isActive',
})<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  
  ${({ isActive }: { isActive: boolean }) => isActive ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  ` : `
    color: #374151;
    &:hover {
      background: #f3f4f6;
    }
  `}
`;
