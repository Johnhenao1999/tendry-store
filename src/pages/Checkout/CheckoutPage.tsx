import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Check, Loader2, CreditCard, Banknote, Building2, ShoppingBag } from 'lucide-react';
import { Container, Section, Heading, Text } from '../../components/ui';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  postalCode: string;
  paymentMethod: string;
  notes: string;
}

const DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar',
  'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
  'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
  'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
  'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada'
];

const PAYMENT_METHODS = [
  { id: 'nequi', name: 'Nequi', icon: CreditCard, description: 'Pago con Nequi' },
  { id: 'daviplata', name: 'Daviplata', icon: CreditCard, description: 'Pago con Daviplata' },
  { id: 'bancolombia', name: 'Bancolombia', icon: Building2, description: 'Transferencia Bancolombia' },
  { id: 'efectivo', name: 'Contra entrega', icon: Banknote, description: 'Pago en efectivo al recibir' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    city: '',
    address: '',
    postalCode: '',
    paymentMethod: '',
    notes: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('El apellido es requerido');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Ingresa un email válido');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('El teléfono es requerido');
      return false;
    }
    if (!formData.department) {
      setError('Selecciona un departamento');
      return false;
    }
    if (!formData.city.trim()) {
      setError('La ciudad es requerida');
      return false;
    }
    if (!formData.address.trim()) {
      setError('La dirección es requerida');
      return false;
    }
    if (!formData.paymentMethod) {
      setError('Selecciona un método de pago');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (items.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        shippingAddress: {
          department: formData.department,
          city: formData.city.trim(),
          address: formData.address.trim(),
          postalCode: formData.postalCode.trim() || undefined,
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes.trim() || undefined,
      };

      const response = await api.createPublicOrder(orderData);
      
      if (response.success && response.data) {
        setOrderNumber(response.data.orderNumber);
        setOrderComplete(true);
        clearCart();
      } else {
        setError(response.error || 'Error al crear el pedido');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pedido. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <Section>
        <Container>
          <EmptyCart>
            <ShoppingBag size={64} />
            <Heading as="h2">Tu carrito está vacío</Heading>
            <Text $color="secondary">Agrega productos antes de realizar el checkout</Text>
            <BackLink to="/productos">
              <ArrowLeft size={16} />
              Ver productos
            </BackLink>
          </EmptyCart>
        </Container>
      </Section>
    );
  }

  if (orderComplete) {
    return (
      <Section>
        <Container>
          <SuccessContainer>
            <SuccessIcon>
              <Check size={48} />
            </SuccessIcon>
            <Heading as="h1">¡Pedido Confirmado!</Heading>
            <OrderNumberBadge>#{orderNumber}</OrderNumberBadge>
            <Text $color="secondary">
              Gracias por tu compra. Hemos recibido tu pedido y te contactaremos pronto
              para confirmar los detalles del pago y envío.
            </Text>
            <SuccessDetails>
              <p>📧 Te enviamos un correo de confirmación a <strong>{formData.email}</strong></p>
              <p>📱 Te contactaremos al <strong>{formData.phone}</strong></p>
            </SuccessDetails>
            <BackLink to="/">
              Volver al inicio
            </BackLink>
          </SuccessContainer>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <BackLink to="/carrito">
          <ArrowLeft size={16} />
          Volver al carrito
        </BackLink>

        <PageTitle>Finalizar Compra</PageTitle>

        <CheckoutLayout>
          <CheckoutForm onSubmit={handleSubmit}>
            {/* Contact Information */}
            <FormSection>
              <SectionTitle>Información de Contacto</SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Tu nombre"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Tu apellido"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="300 123 4567"
                    required
                  />
                </FormGroup>
              </FormGrid>
            </FormSection>

            {/* Shipping Address */}
            <FormSection>
              <SectionTitle>Dirección de Envío</SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="department">Departamento *</Label>
                  <Select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Tu ciudad"
                    required
                  />
                </FormGroup>
                <FormGroup $full>
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Calle, número, barrio, apartamento..."
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="postalCode">Código Postal (opcional)</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Código postal"
                  />
                </FormGroup>
              </FormGrid>
            </FormSection>

            {/* Payment Method */}
            <FormSection>
              <SectionTitle>Método de Pago</SectionTitle>
              <PaymentMethods>
                {PAYMENT_METHODS.map((method) => (
                  <PaymentOption
                    key={method.id}
                    $selected={formData.paymentMethod === method.id}
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: method.id }))}
                  >
                    <PaymentIcon $selected={formData.paymentMethod === method.id}>
                      <method.icon size={24} />
                    </PaymentIcon>
                    <PaymentInfo>
                      <PaymentName>{method.name}</PaymentName>
                      <PaymentDescription>{method.description}</PaymentDescription>
                    </PaymentInfo>
                    <PaymentCheck $selected={formData.paymentMethod === method.id}>
                      {formData.paymentMethod === method.id && <Check size={16} />}
                    </PaymentCheck>
                  </PaymentOption>
                ))}
              </PaymentMethods>
            </FormSection>

            {/* Notes */}
            <FormSection>
              <SectionTitle>Notas (opcional)</SectionTitle>
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Instrucciones especiales para la entrega..."
                rows={3}
              />
            </FormSection>

            {error && <ErrorMessage>{error}</ErrorMessage>}
          </CheckoutForm>

          {/* Order Summary */}
          <OrderSummary>
            <SummaryTitle>Resumen del Pedido</SummaryTitle>
            
            <SummaryItems>
              {items.map((item) => (
                <SummaryItem key={item.productId}>
                  <ItemImage>
                    <img src={item.image} alt={item.name} />
                    <ItemQuantity>{item.quantity}</ItemQuantity>
                  </ItemImage>
                  <ItemInfo>
                    <ItemName>{item.name}</ItemName>
                    <ItemPrice>{formatPrice(item.price)}</ItemPrice>
                  </ItemInfo>
                  <ItemTotal>{formatPrice(item.price * item.quantity)}</ItemTotal>
                </SummaryItem>
              ))}
            </SummaryItems>

            <SummaryDivider />

            <SummaryRow>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Envío</span>
              <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
            </SummaryRow>
            
            <SummaryDivider />
            
            <SummaryTotal>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </SummaryTotal>

            <SubmitButton type="submit" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={20} className="spinner" />
                  Procesando...
                </>
              ) : (
                `Confirmar Pedido • ${formatPrice(total)}`
              )}
            </SubmitButton>

            <SecureNote>
              🔒 Tus datos están protegidos
            </SecureNote>
          </OrderSummary>
        </CheckoutLayout>
      </Container>
    </Section>
  );
}

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral.white};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
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

const SuccessContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} 0;
  max-width: 500px;
  margin: 0 auto;
  
  h1 {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.secondary[500]};
  color: ${({ theme }) => theme.colors.primary[900]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing[6]};
`;

const OrderNumberBadge = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary[700]};
  color: ${({ theme }) => theme.colors.secondary[500]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: monospace;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SuccessDetails = styled.div`
  background: ${({ theme }) => theme.colors.primary[800]};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    color: ${({ theme }) => theme.colors.neutral[300]};
    
    &:last-child {
      margin-bottom: 0;
    }
    
    strong {
      color: ${({ theme }) => theme.colors.neutral.white};
    }
  }
`;

const CheckoutLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${({ theme }) => theme.spacing[8]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const FormSection = styled.div`
  background: ${({ theme }) => theme.colors.primary[800]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral.white};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ $full?: boolean }>`
  grid-column: ${({ $full }) => $full ? 'span 2' : 'auto'};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-column: auto;
  }
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral[300]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[700]};
  border: 1px solid ${({ theme }) => theme.colors.primary[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[500]};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary[500]};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[700]};
  border: 1px solid ${({ theme }) => theme.colors.primary[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary[500]};
  }
  
  option {
    background: ${({ theme }) => theme.colors.primary[800]};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[700]};
  border: 1px solid ${({ theme }) => theme.colors.primary[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  resize: vertical;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[500]};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary[500]};
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const PaymentOption = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme, $selected }) => 
    $selected ? theme.colors.secondary[500] + '20' : theme.colors.primary[700]};
  border: 2px solid ${({ theme, $selected }) => 
    $selected ? theme.colors.secondary[500] : theme.colors.primary[600]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary[500]};
  }
`;

const PaymentIcon = styled.div<{ $selected: boolean }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $selected }) => 
    $selected ? theme.colors.secondary[500] : theme.colors.primary[600]};
  color: ${({ theme, $selected }) => 
    $selected ? theme.colors.primary[900] : theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const PaymentInfo = styled.div`
  flex: 1;
`;

const PaymentName = styled.span`
  display: block;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral.white};
`;

const PaymentDescription = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[400]};
`;

const PaymentCheck = styled.div<{ $selected: boolean }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme, $selected }) => 
    $selected ? theme.colors.secondary[500] : theme.colors.primary[500]};
  border-radius: 50%;
  background: ${({ theme, $selected }) => 
    $selected ? theme.colors.secondary[500] : 'transparent'};
  color: ${({ theme }) => theme.colors.primary[900]};
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
`;

const OrderSummary = styled.div`
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
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SummaryItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  max-height: 300px;
  overflow-y: auto;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ItemImage = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemQuantity = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.secondary[500]};
  color: ${({ theme }) => theme.colors.primary[900]};
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral.white};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.neutral[400]};
`;

const ItemTotal = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral.white};
  white-space: nowrap;
`;

const SummaryDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.primary[600]};
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.neutral[300]};
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral.white};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SubmitButton = styled.button`
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
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.secondary[600]};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const SecureNote = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[400]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;
