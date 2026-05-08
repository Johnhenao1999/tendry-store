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
  
  &:hover {
    .category-image {
      transform: scale(1.1);
    }
    
    .category-arrow {
      transform: translateX(4px);
    }
    
    .category-overlay {
      background: linear-gradient(
        to top,
        rgba(10, 18, 25, 0.95) 0%,
        rgba(10, 18, 25, 0.7) 50%,
        rgba(10, 18, 25, 0.3) 100%
      );
    }
  }
`;

const CategoryImage = styled.div`
  position: absolute;
  inset: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.slow};
  }
`;

const CategoryOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 18, 25, 0.9) 0%,
    rgba(10, 18, 25, 0.5) 50%,
    rgba(10, 18, 25, 0.1) 100%
  );
  transition: background ${({ theme }) => theme.transitions.normal};
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

const ArrowIcon = styled(ArrowRight)`
  color: ${({ theme }) => theme.colors.secondary[500]};
  transition: transform ${({ theme }) => theme.transitions.fast};
`;

export function CategoryCard({ id, name, description, image, productCount }: CategoryCardProps) {
  return (
    <CategoryCardWrapper to={`/categorias/${id}`}>
      <CategoryImage className="category-image">
        <img src={image} alt={name} loading="lazy" />
      </CategoryImage>
      
      <CategoryOverlay className="category-overlay" />
      
      <CategoryContent>
        <CategoryName>{name}</CategoryName>
        <CategoryDescription>{description}</CategoryDescription>
        <CategoryFooter>
          <ProductCount>{productCount} productos</ProductCount>
          <ArrowIcon className="category-arrow" size={20} />
        </CategoryFooter>
      </CategoryContent>
    </CategoryCardWrapper>
  );
}
