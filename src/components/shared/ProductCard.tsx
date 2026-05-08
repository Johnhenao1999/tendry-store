import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Card, CardImage, Badge, Price, OriginalPrice, Text, IconButton } from '../ui';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock?: boolean;
  isNew?: boolean;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
}

// Animaciones
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const ProductCardWrapper = styled(Card)`
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.5s ease-out forwards;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.4s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(212, 168, 67, 0.1);
    
    .product-image img {
      transform: scale(1.08);
    }
    
    .product-overlay {
      opacity: 1;
    }
    
    .product-actions {
      opacity: 1;
      transform: translateY(0);
    }
    
    .quick-view-btn {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const ProductImageWrapper = styled(CardImage)`
  position: relative;
  overflow: hidden;
  
  img {
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

const ProductOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.4) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
`;

const QuickViewButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  opacity: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background: rgba(255, 255, 255, 0.95);
  color: ${({ theme }) => theme.colors.primary[800]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 2;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary[500]};
    color: ${({ theme }) => theme.colors.primary[900]};
    transform: translate(-50%, -50%) scale(1.05);
  }
`;

const ProductBadges = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  left: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  z-index: 3;
  
  > * {
    animation: ${scaleIn} 0.3s ease-out backwards;
    
    &:nth-child(1) { animation-delay: 0.1s; }
    &:nth-child(2) { animation-delay: 0.2s; }
  }
`;

const WishlistButton = styled(IconButton)`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  background: rgba(255, 255, 255, 0.9);
  color: ${({ theme }) => theme.colors.primary[800]};
  z-index: 3;
  backdrop-filter: blur(4px);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  &:hover {
    background: ${({ theme }) => theme.colors.error.main};
    color: ${({ theme }) => theme.colors.neutral.white};
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ProductInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  transition: background-color 0.3s ease;
`;

const ProductBrand = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
  color: ${({ theme }) => theme.colors.secondary[500]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  transition: color 0.3s ease;
`;

const ProductName = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
  
  ${ProductCardWrapper}:hover & {
    color: ${({ theme }) => theme.colors.secondary[400]};
  }
`;

const ProductCategory = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[400]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const AnimatedPrice = styled(Price)`
  transition: transform 0.3s ease;
  
  ${ProductCardWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const ProductActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: 0 ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[4]};
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.secondary[500]} 0%, 
    ${({ theme }) => theme.colors.secondary[600]} 100%
  );
  color: ${({ theme }) => theme.colors.primary[900]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 168, 67, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.neutral[400]};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.15);
  }
`;

const OutOfStock = styled.div`
  margin: 0 ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background: ${({ theme }) => theme.colors.neutral[600]};
  color: ${({ theme }) => theme.colors.neutral[200]};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export function ProductCard({
  slug,
  name,
  brand,
  price,
  originalPrice,
  image,
  category,
  inStock = true,
  isNew = false,
  onAddToCart,
  onAddToWishlist,
}: ProductCardProps) {
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <ProductCardWrapper $variant="default" $padding="none" $hover>
      <Link to={`/productos/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <ProductImageWrapper className="product-image">
          <ProductBadges>
            {isNew && <Badge $variant="gold" $size="sm">Nuevo</Badge>}
            {discount > 0 && <Badge $variant="error" $size="sm">-{discount}%</Badge>}
          </ProductBadges>
          
          <WishlistButton 
            $size="sm" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToWishlist?.();
            }}
            aria-label="Añadir a favoritos"
          >
            <Heart size={18} />
          </WishlistButton>

          <img src={image} alt={name} loading="lazy" />
          
          <ProductOverlay className="product-overlay" />
          
          <QuickViewButton className="quick-view-btn">
            <Eye size={16} />
            Ver más
          </QuickViewButton>
        </ProductImageWrapper>

        <ProductInfo>
          <ProductBrand>{brand}</ProductBrand>
          <ProductName $color="white">{name}</ProductName>
          <ProductCategory>{category}</ProductCategory>
          
          <PriceWrapper>
            <AnimatedPrice $size="md">€{price.toFixed(2)}</AnimatedPrice>
            {originalPrice && <OriginalPrice>€{originalPrice.toFixed(2)}</OriginalPrice>}
          </PriceWrapper>
        </ProductInfo>
      </Link>

      {inStock ? (
        <ProductActions className="product-actions">
          <AddToCartButton onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart?.();
          }}>
            <ShoppingCart size={16} />
            Añadir al carrito
          </AddToCartButton>
        </ProductActions>
      ) : (
        <OutOfStock>Agotado</OutOfStock>
      )}
    </ProductCardWrapper>
  );
}
