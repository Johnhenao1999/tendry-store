import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {

  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from 'lucide-react';
import api from '../../../services/api';

interface Order {
  _id: string;
  orderNumber: string;
  user: { _id: string; name: string; email: string };
  items: Array<{
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  createdAt: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  useEffect(() => {
    loadOrders();
  }, [pagination.page, statusFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.getOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter || undefined,
      });
      setOrders(response.data || []);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 0,
      }));
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, { status });
      loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error: any) {
      alert(error.message || 'Error al actualizar estado');
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, { paymentStatus });
      loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, paymentStatus });
      }
    } catch (error: any) {
      alert(error.message || 'Error al actualizar estado de pago');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      pending: { label: 'Pendiente', color: '#f59e0b', icon: <Clock size={14} /> },
      confirmed: { label: 'Confirmado', color: '#3b82f6', icon: <CheckCircle size={14} /> },
      processing: { label: 'Procesando', color: '#8b5cf6', icon: <Package size={14} /> },
      shipped: { label: 'Enviado', color: '#06b6d4', icon: <Truck size={14} /> },
      delivered: { label: 'Entregado', color: '#10b981', icon: <CheckCircle size={14} /> },
      cancelled: { label: 'Cancelado', color: '#ef4444', icon: <XCircle size={14} /> },
    };
    return configs[status] || { label: status, color: '#6b7280', icon: null };
  };

  const getPaymentStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      pending: { label: 'Pendiente', color: '#f59e0b' },
      paid: { label: 'Pagado', color: '#10b981' },
      failed: { label: 'Fallido', color: '#ef4444' },
      refunded: { label: 'Reembolsado', color: '#6b7280' },
    };
    return configs[status] || { label: status, color: '#6b7280' };
  };

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'processing', label: 'Procesando' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  return (
    <Container>
      <PageHeader>
        <div>
          <Title>Pedidos</Title>
          <Subtitle>Gestiona todos los pedidos de la tienda</Subtitle>
        </div>
      </PageHeader>

      <Toolbar>
        <FilterGroup>
          <Filter size={18} />
          <FilterSelect
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>
      </Toolbar>

      <TableCard>
        {isLoading ? (
          <LoadingWrapper>
            <Spinner />
          </LoadingWrapper>
        ) : orders.length > 0 ? (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Pedido</Th>
                  <Th>Cliente</Th>
                  <Th>Total</Th>
                  <Th>Estado</Th>
                  <Th>Pago</Th>
                  <Th>Fecha</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
                  return (
                    <Tr key={order._id}>
                      <Td>
                        <OrderNumber>{order.orderNumber}</OrderNumber>
                        <OrderItems>{order.items.length} artículo(s)</OrderItems>
                      </Td>
                      <Td>
                        <CustomerName>{order.user?.name || 'N/A'}</CustomerName>
                        <CustomerEmail>{order.user?.email || ''}</CustomerEmail>
                      </Td>
                      <Td>
                        <OrderTotal>{formatCurrency(order.total)}</OrderTotal>
                      </Td>
                      <Td>
                        <StatusBadge $color={statusConfig.color}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </StatusBadge>
                      </Td>
                      <Td>
                        <PaymentBadge $color={paymentConfig.color}>
                          {paymentConfig.label}
                        </PaymentBadge>
                      </Td>
                      <Td>
                        <OrderDate>{formatDate(order.createdAt)}</OrderDate>
                      </Td>
                      <Td>
                        <Actions>
                          <ActionButton onClick={() => openDetailModal(order)} title="Ver detalles">
                            <Eye size={16} />
                          </ActionButton>
                        </Actions>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>

            {pagination.pages > 1 && (
              <Pagination>
                <PageInfo>
                  Página {pagination.page} de {pagination.pages} ({pagination.total} pedidos)
                </PageInfo>
                <PageButtons>
                  <PageButton
                    disabled={pagination.page === 1}
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  >
                    <ChevronLeft size={18} />
                  </PageButton>
                  <PageButton
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  >
                    <ChevronRight size={18} />
                  </PageButton>
                </PageButtons>
              </Pagination>
            )}
          </>
        ) : (
          <EmptyState>No se encontraron pedidos</EmptyState>
        )}
      </TableCard>

      {showDetailModal && selectedOrder && (
        <ModalOverlay onClick={() => setShowDetailModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Pedido {selectedOrder.orderNumber}</ModalTitle>
              <CloseButton onClick={() => setShowDetailModal(false)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              <Section>
                <SectionTitle>Estado del Pedido</SectionTitle>
                <StatusGrid>
                  <StatusGroup>
                    <StatusLabel>Estado</StatusLabel>
                    <StatusSelect
                      value={selectedOrder.status}
                      onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="processing">Procesando</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </StatusSelect>
                  </StatusGroup>
                  <StatusGroup>
                    <StatusLabel>Pago</StatusLabel>
                    <StatusSelect
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => updatePaymentStatus(selectedOrder._id, e.target.value)}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="paid">Pagado</option>
                      <option value="failed">Fallido</option>
                      <option value="refunded">Reembolsado</option>
                    </StatusSelect>
                  </StatusGroup>
                </StatusGrid>
              </Section>

              <Section>
                <SectionTitle>Productos</SectionTitle>
                <ItemsList>
                  {selectedOrder.items.map((item, index) => (
                    <OrderItem key={index}>
                      <ItemImage src={item.image || '/placeholder.png'} alt={item.name} />
                      <ItemInfo>
                        <ItemName>{item.name}</ItemName>
                        <ItemQuantity>Cantidad: {item.quantity}</ItemQuantity>
                      </ItemInfo>
                      <ItemPrice>{formatCurrency(item.price * item.quantity)}</ItemPrice>
                    </OrderItem>
                  ))}
                </ItemsList>
              </Section>

              <Section>
                <SectionTitle>Resumen</SectionTitle>
                <SummaryTable>
                  <SummaryRow>
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>IVA</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Envío</span>
                    <span>{formatCurrency(selectedOrder.shipping)}</span>
                  </SummaryRow>
                  <SummaryRow $total>
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </SummaryRow>
                </SummaryTable>
              </Section>

              <Section>
                <SectionTitle>Dirección de Envío</SectionTitle>
                <AddressCard>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                  </p>
                  <p>
                    {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                  </p>
                </AddressCard>
              </Section>

              {selectedOrder.notes && (
                <Section>
                  <SectionTitle>Notas</SectionTitle>
                  <NotesCard>{selectedOrder.notes}</NotesCard>
                </Section>
              )}

              <Section>
                <SectionTitle>Cliente</SectionTitle>
                <CustomerCard>
                  <CustomerDetailName>{selectedOrder.user?.name}</CustomerDetailName>
                  <CustomerDetailEmail>{selectedOrder.user?.email}</CustomerDetailEmail>
                </CustomerCard>
              </Section>
            </ModalContent>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div``;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

const Toolbar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 10px;
  padding: 0 ${({ theme }) => theme.spacing[4]};

  svg {
    color: ${({ theme }) => theme.colors.neutral[500]};
  }
`;

const FilterSelect = styled.select`
  border: none;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[2]};
  font-size: 14px;
  cursor: pointer;
  min-width: 150px;

  &:focus {
    outline: none;
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[16]};
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
  background: ${({ theme }) => theme.colors.neutral[50]};
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
  vertical-align: middle;
`;

const OrderNumber = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const OrderItems = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const CustomerName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const CustomerEmail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const OrderTotal = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const StatusBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const PaymentBadge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 4px 10px;
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const OrderDate = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const ActionButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]};
  background: #f3f4f6;
  color: ${({ theme }) => theme.colors.neutral[500]};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    color: white;
  }
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const PageButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const PageButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[600]};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing[16]};
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[6]};
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral[500]};

  &:hover {
    color: ${({ theme }) => theme.colors.neutral[700]};
  }
`;

const ModalContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
`;

const StatusGroup = styled.div``;

const StatusLabel = styled.label`
  display: block;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatusSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: 10px;
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral[700]};
  font-size: 14px;
`;

const ItemQuantity = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const SummaryTable = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const SummaryRow = styled.div<{ $total?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  font-size: ${({ $total }) => ($total ? '16px' : '14px')};
  font-weight: ${({ $total }) => ($total ? '600' : '400')};
  color: ${({ theme, $total }) => ($total ? theme.colors.neutral[700] : theme.colors.neutral[500])};
  border-top: ${({ $total, theme }) => ($total ? `1px solid ${theme.colors.neutral[100]}` : 'none')};
  margin-top: ${({ $total, theme }) => ($total ? theme.spacing[2] : '0')};
  padding-top: ${({ $total, theme }) => ($total ? theme.spacing[4] : theme.spacing[2])};
`;

const AddressCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing[4]};
  font-size: 14px;
  line-height: 1.6;

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.neutral[700]};
  }
`;

const NotesCard = styled.div`
  background: #fef3c7;
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing[4]};
  font-size: 14px;
  color: #92400e;
`;

const CustomerCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const CustomerDetailName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const CustomerDetailEmail = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

export default OrdersPage;
