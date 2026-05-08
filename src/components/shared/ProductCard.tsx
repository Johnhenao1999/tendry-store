import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Heart, ShoppingCart } from 'lucide-react';
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

const ProductCardWrapper = styled(Card)`
  position: relative;
  
  &:hover {
    .product-actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ProductBadges = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  left: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  z-index: 1;
`;

const WishlistButton = styled(IconButton)`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  background: rgba(255, 255, 255, 0.9);
  color: ${({ theme }) => theme.colors.primary[800]};
  z-index: 1;
  
  &:hover {
    background: ${({ theme }) => theme.colors.error.main};
    color: ${({ theme }) => theme.colors.neutral.white};
  }
`;

const ProductInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ProductBrand = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
  color: ${({ theme }) => theme.colors.secondary[500]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ProductName = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const ProductActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  opacity: 0;
  transform: translateY(8px);
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background: ${({ theme }) => theme.colors.secondary[500]};
  color: ${({ theme }) => theme.colors.primary[900]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary[400]};
    box-shadow: ${({ theme }) => theme.shadows.gold};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.neutral[400]};
    cursor: not-allowed;
  }
`;

const OutOfStock = styled.div`
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
        <CardImage>
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
        </CardImage>

        <ProductInfo>
          <ProductBrand>{brand}</ProductBrand>
          <ProductName $color="white">{name}</ProductName>
          <ProductCategory>{category}</ProductCategory>
          
          <PriceWrapper>
            <Price $size="md">€{price.toFixed(2)}</Price>
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
            Añadir
          </AddToCartButton>
        </ProductActions>
      ) : (
        <OutOfStock>Agotado</OutOfStock>
      )}
    </ProductCardWrapper>
  );
}
