import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Package, FolderTree, ShoppingCart, DollarSign, TrendingUp, Users } from 'lucide-react';
import api from '../../../services/api';

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        api.getProducts({ limit: 1 }),
        api.getCategories(),
        api.getOrders({ limit: 5 }),
      ]);

      const pendingCount = ordersRes.data?.filter((o: any) => o.status === 'pending').length || 0;
      const totalRevenue = ordersRes.data?.reduce((acc: number, o: any) => 
        o.paymentStatus === 'paid' ? acc + o.total : acc, 0) || 0;

      setStats({
        totalProducts: productsRes.pagination?.total || 0,
        totalCategories: categoriesRes.data?.length || 0,
        totalOrders: ordersRes.pagination?.total || 0,
        pendingOrders: pendingCount,
        revenue: totalRevenue,
      });

      setRecentOrders(ordersRes.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Pendiente', color: '#f59e0b' },
      confirmed: { label: 'Confirmado', color: '#3b82f6' },
      processing: { label: 'Procesando', color: '#8b5cf6' },
      shipped: { label: 'Enviado', color: '#06b6d4' },
      delivered: { label: 'Entregado', color: '#10b981' },
      cancelled: { label: 'Cancelado', color: '#ef4444' },
    };
    return statusMap[status] || { label: status, color: '#6b7280' };
  };

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Spinner />
      </LoadingWrapper>
    );
  }

  return (
    <Container>
      <PageHeader>
        <Title>Dashboard</Title>
        <Subtitle>Bienvenido al panel de administración de TENDRYX</Subtitle>
      </PageHeader>

      <StatsGrid>
        <StatCard $color="#3b82f6">
          <StatIcon $color="#3b82f6">
            <Package size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalProducts}</StatValue>
            <StatLabel>Productos</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard $color="#8b5cf6">
          <StatIcon $color="#8b5cf6">
            <FolderTree size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalCategories}</StatValue>
            <StatLabel>Categorías</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard $color="#10b981">
          <StatIcon $color="#10b981">
            <ShoppingCart size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalOrders}</StatValue>
            <StatLabel>Pedidos</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard $color="#f59e0b">
          <StatIcon $color="#f59e0b">
            <TrendingUp size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.pendingOrders}</StatValue>
            <StatLabel>Pendientes</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <SectionGrid>
        <Section>
          <SectionHeader>
            <SectionTitle>Pedidos Recientes</SectionTitle>
          </SectionHeader>
          <TableWrapper>
            {recentOrders.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <Th>Pedido</Th>
                    <Th>Total</Th>
                    <Th>Estado</Th>
                    <Th>Fecha</Th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const status = getStatusBadge(order.status);
                    return (
                      <Tr key={order._id}>
                        <Td>
                          <OrderNumber>{order.orderNumber}</OrderNumber>
                        </Td>
                        <Td>{formatCurrency(order.total)}</Td>
                        <Td>
                          <StatusBadge $color={status.color}>{status.label}</StatusBadge>
                        </Td>
                        <Td>{new Date(order.createdAt).toLocaleDateString('es-ES')}</Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <EmptyState>No hay pedidos recientes</EmptyState>
            )}
          </TableWrapper>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Resumen</SectionTitle>
          </SectionHeader>
          <SummaryContent>
            <SummaryItem>
              <SummaryIcon $color="#10b981">
                <DollarSign size={20} />
              </SummaryIcon>
              <SummaryText>
                <SummaryLabel>Ingresos Totales</SummaryLabel>
                <SummaryValue>{formatCurrency(stats.revenue)}</SummaryValue>
              </SummaryText>
            </SummaryItem>
            <SummaryItem>
              <SummaryIcon $color="#3b82f6">
                <Users size={20} />
              </SummaryIcon>
              <SummaryText>
                <SummaryLabel>Productos Activos</SummaryLabel>
                <SummaryValue>{stats.totalProducts}</SummaryValue>
              </SummaryText>
            </SummaryItem>
          </SummaryContent>
        </Section>
      </SectionGrid>
    </Container>
  );
};

const Container = styled.div``;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.neutral[100]};
  border-top-color: ${({ theme }) => theme.colors.primary[600]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatCard = styled.div<{ $color: string }>`
  background: white;
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing[8]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${({ $color }) => $color};
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  background: ${({ $color }) => `${$color}15`};
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral[500]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

const Tr = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.colors.neutral[50]};
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  font-size: 14px;
`;

const OrderNumber = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const StatusBadge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 4px 12px;
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const SummaryContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const SummaryIcon = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  background: ${({ $color }) => `${$color}15`};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
`;

const SummaryText = styled.div``;

const SummaryLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const SummaryValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

export default DashboardPage;
