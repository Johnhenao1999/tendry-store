import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { Container, IconButton, CountBadge } from '../ui';

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  background: rgba(15, 28, 46, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary[600]};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-family: ${({ theme }) => theme.typography.fontFamily.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral.white};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
  
  span {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.secondary[400]} 0%,
      ${({ theme }) => theme.colors.secondary[600]} 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.secondary[500]} 0%,
    ${({ theme }) => theme.colors.secondary[700]} 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const Nav = styled.nav<{ $isOpen: boolean }>`
  display: none;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[8]};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    ${({ $isOpen }) => $isOpen && `
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 72px;
      left: 0;
      right: 0;
      background: rgba(15, 28, 46, 0.98);
      padding: 24px;
      gap: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    `}
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, $active }) => $active ? theme.colors.secondary[500] : theme.colors.neutral[200]};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  position: relative;
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary[500]};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${({ $active }) => $active ? '100%' : '0'};
    height: 2px;
    background: ${({ theme }) => theme.colors.secondary[500]};
    transition: width ${({ theme }) => theme.transitions.fast};
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CartButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.neutral.white};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary[500]};
  }
`;

const CartBadge = styled(CountBadge)`
  position: absolute;
  top: 0;
  right: 0;
`;

const MobileMenuButton = styled(IconButton)`
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const SearchBar = styled.div`
  display: none;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    position: relative;
    max-width: 300px;
  }
  
  input {
    width: 100%;
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]} ${theme.spacing[2]} ${theme.spacing[10]}`};
    background: ${({ theme }) => theme.colors.primary[700]};
    border: 1px solid ${({ theme }) => theme.colors.primary[500]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    color: ${({ theme }) => theme.colors.neutral.white};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.neutral[400]};
    }
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.secondary[500]};
    }
  }
  
  svg {
    position: absolute;
    left: 12px;
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const navItems = [
  { path: '/', label: 'Inicio' },
  { path: '/categorias', label: 'Categorías' },
  { path: '/productos', label: 'Productos' },
  { path: '/ofertas', label: 'Ofertas' },
  { path: '/contacto', label: 'Contacto' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const cartItemsCount = 3; // This would come from your cart state

  return (
    <HeaderWrapper>
      <Container>
        <HeaderContent>
          <Logo to="/">
            <LogoIcon>🧴</LogoIcon>
            <span>TENDRYX</span>
          </Logo>

          <Nav $isOpen={isMenuOpen}>
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path}
                $active={location.pathname === item.path}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>

          <Actions>
            <SearchBar>
              <Search size={18} />
              <input type="text" placeholder="Buscar perfumes..." />
            </SearchBar>
            
            <IconButton aria-label="Mi cuenta">
              <User size={22} />
            </IconButton>

            <CartButton aria-label="Carrito de compras">
              <ShoppingCart size={22} />
              {cartItemsCount > 0 && <CartBadge>{cartItemsCount}</CartBadge>}
            </CartButton>

            <MobileMenuButton 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </MobileMenuButton>
          </Actions>
        </HeaderContent>
      </Container>
    </HeaderWrapper>
  );
}
