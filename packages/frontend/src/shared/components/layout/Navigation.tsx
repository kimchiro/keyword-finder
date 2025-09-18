'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from '@emotion/styled';

const Nav = styled.nav`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  
  ${({ isActive }) => isActive ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  ` : `
    color: #374151;
    &:hover {
      background: #f3f4f6;
    }
  `}
`;

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '홈' },
    { href: '/search', label: '키워드 검색' },
    { href: '/dashboard', label: '대시보드' },
    { href: '/stats', label: '통계' },
  ];

  return (
    <Nav>
      <NavContainer>
        <Logo>키워드 파인더</Logo>
        <NavLinks>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              isActive={pathname === item.href}
            >
              {item.label}
            </NavLink>
          ))}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};
