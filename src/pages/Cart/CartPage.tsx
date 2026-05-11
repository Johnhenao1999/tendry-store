import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Container, Section, Heading, Text, Button } from '../../components/ui';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, shipping, total, updateQuantity, removeItem, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <Section>
        <Container>
          <EmptyCart>
            <ShoppingBag size={64} />
            <Heading as="h2">Tu carrito está vacío</Heading>
            <Text $color="secondary">¡Agrega productos para comenzar!</Text>
            <Button as={Link} to="/productos" $variant="primary">
              Ver productos
            </Button>
          </EmptyCart>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <PageHeader>
          <Heading as="h1">Carrito de Compras</Heading>
          <ItemCount>{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</ItemCount>
        </PageHeader>

        <CartLayout>
          <CartItems>
            {items.map((item) => (
              <CartItem key={item.productId}>
                <ItemImage>
                  <img src={item.image} alt={item.name} />
                </ItemImage>
                
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>{formatPrice(item.price)}</ItemPrice>
                </ItemDetails>

                <QuantityControl>
                  <QuantityButton 
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </QuantityButton>
                  <QuantityValue>{item.quantity}</QuantityValue>
                  <QuantityButton 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus size={16} />
                  </QuantityButton>
                </QuantityControl>

                <ItemTotal>
                  {formatPrice(item.price * item.quantity)}
                </ItemTotal>

                <RemoveButton onClick={() => removeItem(item.productId)}>
                  <Trash2 size={18} />
                </RemoveButton>
              </CartItem>
            ))}

            <CartActions>
              <ClearButton onClick={clearCart}>
                <Trash2 size={16} />
                Vaciar carrito
              </ClearButton>
              <ContinueLink to="/productos">
                <ArrowLeft size={16} />
                Seguir comprando
              </ContinueLink>
            </CartActions>
          </CartItems>

          <CartSummary>
            <SummaryTitle>Resumen del Pedido</SummaryTitle>
            
            <SummaryRow>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </SummaryRow>
            
            <SummaryRow>
              <span>Envío</span>
              <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
            </SummaryRow>

            {subtotal < 100000 && (
              <FreeShippingNote>
                ¡Agrega {formatPrice(100000 - subtotal)} más para envío gratis!
              </FreeShippingNote>
            )}
            
            <SummaryDivider />
            
            <SummaryTotal>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </SummaryTotal>

            <CheckoutButton onClick={() => navigate('/checkout')}>
              Proceder al pago
              <ArrowRight size={18} />
            </CheckoutButton>

            <SecureNote>
              🔒 Pago 100% seguro
            </SecureNote>
          </CartSummary>
        </CartLayout>
      </Container>
    </Section>
  );
}

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ItemCount = styled.span`
  background: ${({ theme }) => theme.colors.secondary[500]};
  color: ${({ theme }) => theme.colors.primary[900]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 600;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} 0;
  
  svg {
    color: ${({ theme }) => theme.colors.neutral[400]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  h2 {
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }
`;

const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: ${({ theme }) => theme.spacing[8]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[800]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto;
  }
`;

const ItemImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary[700]};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 80px;
    height: 80px;
  }
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const ItemName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral.white};
`;

const ItemPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[400]};
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.primary[700]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[1]};
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.neutral.white};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background 0.2s;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[600]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  min-width: 32px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral.white};
`;

const ItemTotal = styled.span`
  font-weight: 700;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.secondary[500]};
  min-width: 120px;
  text-align: right;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.neutral[600]};
  color: ${({ theme }) => theme.colors.neutral[400]};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s;
  
  &:hover {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }
`;

const CartActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.primary[700]};
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.neutral[400]};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  &:hover {
    color: #ef4444;
  }
`;

const ContinueLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CartSummary = styled.div`
  background: ${({ theme }) => theme.colors.primary[800]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const SummaryTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral.white};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.neutral[300]};
`;

const FreeShippingNote = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[500]};
  background: ${({ theme }) => theme.colors.secondary[500]}20;
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const SummaryDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.primary[600]};
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral.white};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const CheckoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.secondary[500]};
  color: ${({ theme }) => theme.colors.primary[900]};
  border: none;
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: 700;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary[600]};
    transform: translateY(-2px);
  }
`;

const SecureNote = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[400]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;
