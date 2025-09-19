'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Nav, NavContainer, Logo, NavLinks, StyledLink } from './Navigation.styles';

interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, isActive, children }) => (
  <Link href={href}>
    <StyledLink isActive={isActive}>
      {children}
    </StyledLink>
  </Link>
);

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  const navItems: Array<{ href: string; label: string }> = [
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
          {navItems.map((item: { href: string; label: string }) => (
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
