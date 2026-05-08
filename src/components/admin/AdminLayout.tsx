import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoTendry from '../../assets/images/logo-tendry.jpeg';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Productos' },
    { path: '/admin/categories', icon: FolderTree, label: 'Categorías' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Pedidos' },
  ];

  return (
    <Container>
      <Sidebar $isOpen={sidebarOpen}>
        <SidebarHeader>
          <Logo>
            <LogoIcon>
              <img src={logoTendry} alt="Tendry Logo" />
            </LogoIcon>
            {sidebarOpen && <LogoText>TENDRYX</LogoText>}
          </Logo>
        </SidebarHeader>

        <NavMenu>
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavItem>
          ))}
        </NavMenu>

        <SidebarFooter>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent $sidebarOpen={sidebarOpen}>
        <TopBar>
          <ToggleButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </ToggleButton>

          <TopBarRight>
            <StoreLink href="/" target="_blank">
              Ver Tienda →
            </StoreLink>

            <UserMenu>
              <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <UserAvatar>
                  <User size={20} />
                </UserAvatar>
                <UserInfo>
                  <UserName>{user?.name}</UserName>
                  <UserRole>Administrador</UserRole>
                </UserInfo>
                <ChevronDown size={16} />
              </UserButton>

              {userMenuOpen && (
                <UserDropdown>
                  <DropdownItem onClick={handleLogout}>
                    <LogOut size={16} />
                    Cerrar Sesión
                  </DropdownItem>
                </UserDropdown>
              )}
            </UserMenu>
          </TopBarRight>
        </TopBar>

        <PageContent>
          <Outlet />
        </PageContent>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: ${({ $isOpen }) => ($isOpen ? '260px' : '80px')};
  background: ${({ theme }) => theme.colors.primary[800]};
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
`;

const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LogoText = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: white;
  letter-spacing: 2px;
`;

const NavMenu = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    background: ${({ theme }) => theme.colors.secondary[600]};
    color: ${({ theme }) => theme.colors.primary[800]};
    font-weight: 600;
  }

  span {
    white-space: nowrap;
  }
`;

const SidebarFooter = styled.div`
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  width: 100%;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const MainContent = styled.main<{ $sidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? '260px' : '80px')};
  transition: margin-left 0.3s ease;
`;

const TopBar = styled.header`
  height: 70px;
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing[8]};
  position: sticky;
  top: 0;
  z-index: 50;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.neutral[500]};
  border-radius: 8px;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[50]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const StoreLink = styled.a`
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: 10px;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[50]};
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary[600]};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UserInfo = styled.div`
  text-align: left;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
  font-size: 14px;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing[1]};
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]};
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral[700]};
  font-size: 14px;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[50]};
  }
`;

const PageContent = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
`;

export default AdminLayout;
