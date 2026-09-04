import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Star,
  Minus,
  Plus,
  Loader2,
  Check
} from 'lucide-react';
import { Container, Section, Heading, Text, Button } from '../../components/ui';
import { useProduct } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';

const Breadcrumb = styled.nav`
  padding: ${({ theme }) => theme.spacing[4]} 0;
  
  a {
    color: ${({ theme }) => theme.colors.neutral[400]};
    text-decoration: none;
    
    &:hover {
      color: ${({ theme }) => theme.colors.secondary[500]};
    }
  }
  
  span {
    color: ${({ theme }) => theme.colors.neutral[400]};
    margin: 0 ${({ theme }) => theme.spacing[2]};
  }
  
  .current {
    color: ${({ theme }) => theme.colors.neutral.white};
  }
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[12]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[8]};
  }
`;

const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const MainImage = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary[800]};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
  }
  
  &.prev { left: 16px; }
  &.next { right: 16px; }
`;

const Thumbnails = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing[1]};
`;

const Thumbnail = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  border: 2px solid ${({ $active, theme }) => 
    $active ? theme.colors.secondary[500] : 'transparent'};
  cursor: pointer;
  opacity: ${({ $active }) => $active ? 1 : 0.6};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    opacity: 1;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Brand = styled(Text)`
  color: ${({ theme }) => theme.colors.secondary[500]};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ProductName = styled(Heading)`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  .stars {
    display: flex;
    gap: 2px;
    color: ${({ theme }) => theme.colors.secondary[500]};
  }
  
  .count {
    color: ${({ theme }) => theme.colors.neutral[400]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const CurrentPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral.white};
`;

const OriginalPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.neutral[500]};
  text-decoration: line-through;
`;

const Discount = styled.span`
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  background: ${({ theme }) => theme.colors.error.main};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const Description = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral[300]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.8;
`;

const ProductMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary[600]};
`;

const MetaItem = styled.div`
  .label {
    color: ${({ theme }) => theme.colors.neutral[400]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  }
  
  .value {
    color: ${({ theme }) => theme.colors.neutral.white};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

const StockStatus = styled.div<{ $inStock: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background: ${({ $inStock }) =>
    $inStock ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border: 1px solid ${({ $inStock, theme }) => 
    $inStock ? theme.colors.success.main : theme.colors.error.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ $inStock, theme }) => 
    $inStock ? theme.colors.success.main : theme.colors.error.main};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  .label {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const QuantityButton = styled.button`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary[700]};
  border: none;
  color: ${({ theme }) => theme.colors.neutral.white};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  height: 44px;
  text-align: center;
  background: ${({ theme }) => theme.colors.primary[800]};
  border: none;
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const AddToCartButton = styled(Button)<{ $added?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme, $added }) => $added ? theme.colors.success.main : theme.colors.secondary[500]};
  transition: all 0.3s ease;
  
  &:not(:disabled):hover {
    background: ${({ theme, $added }) => $added ? theme.colors.success.dark : theme.colors.secondary[600]};
  }
`;

const IconActionButton = styled.button`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary[700]};
  border: 1px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.neutral.white};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary[500]};
    color: ${({ theme }) => theme.colors.secondary[500]};
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.primary[800]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const Feature = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing[2]};
  
  svg {
    color: ${({ theme }) => theme.colors.secondary[500]};
  }
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.neutral[300]};
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: ${({ theme }) => theme.colors.secondary[500]};
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorWrapper = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]};
`;

export function ProductDetailPage() {
  const { productId } = useParams();
  const { product, loading, error } = useProduct(productId || '');
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      stock: product.stock,
      quantity,
    });
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <Section $padding="lg">
        <Container>
          <LoadingWrapper>
            <Loader2 size={48} />
          </LoadingWrapper>
        </Container>
      </Section>
    );
  }

  if (error || !product) {
    return (
      <Section $padding="lg">
        <Container>
          <ErrorWrapper>
            <Heading as="h2" $size="2xl" style={{ marginBottom: '16px' }}>
              Producto no encontrado
            </Heading>
            <Text $color="muted" style={{ marginBottom: '24px' }}>
              {error || 'El producto que buscas no existe o ha sido eliminado.'}
            </Text>
            <Button as={Link} to="/productos" $variant="primary">
              Ver todos los productos
            </Button>
          </ErrorWrapper>
        </Container>
      </Section>
    );
  }

  const images = product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/600'];
  
  const inStock = product.stock > 0;
  const discount = product.compareAtPrice 
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const handlePrevImage = () => {
    setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + delta)));
  };

  return (
    <Section $padding="md">
      <Container>
        <Breadcrumb>
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/productos">Productos</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/categorias/${product.category.slug}`}>{product.category.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="current">{product.name}</span>
        </Breadcrumb>

        <ProductLayout>
          <ImageGallery>
            <MainImage>
              <img src={images[selectedImage]} alt={product.name} />
              {images.length > 1 && (
                <>
                  <ImageNav className="prev" onClick={handlePrevImage}>
                    <ChevronLeft size={24} />
                  </ImageNav>
                  <ImageNav className="next" onClick={handleNextImage}>
                    <ChevronRight size={24} />
                  </ImageNav>
                </>
              )}
            </MainImage>
            
            {images.length > 1 && (
              <Thumbnails>
                {images.map((img, index) => (
                  <Thumbnail 
                    key={index}
                    $active={selectedImage === index}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} - ${index + 1}`} />
                  </Thumbnail>
                ))}
              </Thumbnails>
            )}
          </ImageGallery>

          <ProductInfo>
            <Brand>{product.brand}</Brand>
            <ProductName as="h1" $size="3xl">
              {product.name}
            </ProductName>

            <Rating>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={18} 
                    fill={star <= Math.round(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="count">
                ({product.reviewCount} {product.reviewCount === 1 ? 'reseña' : 'reseñas'})
              </span>
            </Rating>

            <PriceSection>
              <CurrentPrice>${product.price.toLocaleString('es-CO')} COP</CurrentPrice>
              {product.compareAtPrice && (
                <>
                  <OriginalPrice>${product.compareAtPrice.toLocaleString('es-CO')} COP</OriginalPrice>
                  <Discount>-{discount}%</Discount>
                </>
              )}
            </PriceSection>

            <Description>{product.description}</Description>

            <ProductMeta>
              <MetaItem>
                <div className="label">Categoría</div>
                <div className="value">{product.category?.name || 'Sin categoría'}</div>
              </MetaItem>
              {product.sku && (
                <MetaItem>
                  <div className="label">SKU</div>
                  <div className="value">{product.sku}</div>
                </MetaItem>
              )}
              {product.specifications && product.specifications.length > 0 && (
                <MetaItem>
                  <div className="label">{product.specifications[0].name}</div>
                  <div className="value">{product.specifications[0].value}</div>
                </MetaItem>
              )}
            </ProductMeta>

            <StockStatus $inStock={inStock}>
              {inStock ? (
                <>✓ En stock ({product.stock} disponibles)</>
              ) : (
                <>✗ Agotado</>
              )}
            </StockStatus>

            {inStock && (
              <QuantitySelector>
                <span className="label">Cantidad:</span>
                <QuantityControl>
                  <QuantityButton 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </QuantityButton>
                  <QuantityInput 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    min={1}
                    max={product.stock}
                  />
                  <QuantityButton 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={18} />
                  </QuantityButton>
                </QuantityControl>
              </QuantitySelector>
            )}

            <ActionButtons>
              <AddToCartButton 
                $variant="primary" 
                $size="lg"
                disabled={!inStock}
                onClick={handleAddToCart}
                $added={addedToCart}
              >
                {addedToCart ? (
                  <>
                    <Check size={20} />
                    ¡Agregado!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    {inStock ? 'Añadir al carrito' : 'No disponible'}
                  </>
                )}
              </AddToCartButton>
              <IconActionButton onClick={() => console.log('Add to wishlist:', product._id)}>
                <Heart size={24} />
              </IconActionButton>
              <IconActionButton onClick={() => console.log('Share:', product._id)}>
                <Share2 size={24} />
              </IconActionButton>
            </ActionButtons>

            <Features>
              <Feature>
                <Truck size={24} />
                <span>Envíos a toda España</span>
              </Feature>
              <Feature>
                <Shield size={24} />
                <span>Garantía de 30 días</span>
              </Feature>
              <Feature>
                <RotateCcw size={24} />
                <span>Cambios y devoluciones fáciles</span>
              </Feature>
            </Features>
          </ProductInfo>
        </ProductLayout>
      </Container>
    </Section>
  );
}
