import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

const CategoryCardWrapper = styled(Link)`
  position: relative;
  display: block;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  aspect-ratio: 3/4;
  text-decoration: none;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.4s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    
    .category-image {
      transform: scale(1.1);
    }
    
    .category-arrow {
      transform: translateX(8px);
      background: ${({ theme }) => theme.colors.secondary[500]};
      color: ${({ theme }) => theme.colors.primary[900]};
    }
    
    .category-overlay {
      background: linear-gradient(
        to top,
        rgba(6, 5, 5, 0.96) 0%,
        rgba(6, 5, 5, 0.72) 50%,
        rgba(6, 5, 5, 0.28) 100%
      );
    }
    
    .category-name {
      color: ${({ theme }) => theme.colors.secondary[400]};
    }
    
    .shine-effect {
      left: 100%;
    }
  }
`;

const ShineEffect = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.6s ease;
  z-index: 2;
  pointer-events: none;
`;

const CategoryImage = styled.div`
  position: absolute;
  inset: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

const CategoryOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(6, 5, 5, 0.9) 0%,
    rgba(6, 5, 5, 0.5) 50%,
    rgba(6, 5, 5, 0.1) 100%
  );
  transition: background 0.4s ease;
`;

const CategoryContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const CategoryName = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontFamily.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral.white};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  transition: color 0.3s ease;
`;

const CategoryDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[300]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CategoryFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProductCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[500]};
`;

const ArrowButton = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(216, 154, 51, 0.22);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.secondary[500]};
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

export function CategoryCard({ id, name, description, image, productCount }: CategoryCardProps) {
  return (
    <CategoryCardWrapper to={`/categorias/${id}`}>
      <ShineEffect className="shine-effect" />
      
      <CategoryImage className="category-image">
        <img src={image} alt={name} loading="lazy" />
      </CategoryImage>
      
      <CategoryOverlay className="category-overlay" />
      
      <CategoryContent>
        <CategoryName className="category-name">{name}</CategoryName>
        <CategoryDescription>{description}</CategoryDescription>
        <CategoryFooter>
          <ProductCount>{productCount} productos</ProductCount>
          <ArrowButton className="category-arrow">
            <ArrowRight size={18} />
          </ArrowButton>
        </CategoryFooter>
      </CategoryContent>
    </CategoryCardWrapper>
  );
}
