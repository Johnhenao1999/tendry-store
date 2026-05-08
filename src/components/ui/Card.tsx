import styled, { css } from 'styled-components';

interface CardProps {
  $variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  $padding?: 'sm' | 'md' | 'lg' | 'none';
  $hover?: boolean;
}

const cardVariants = {
  default: css`
    background: ${({ theme }) => theme.colors.primary[700]};
    border: 1px solid ${({ theme }) => theme.colors.primary[500]};
  `,
  elevated: css`
    background: ${({ theme }) => theme.colors.primary[700]};
    border: none;
    box-shadow: ${({ theme }) => theme.shadows.lg};
  `,
  outlined: css`
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.primary[400]};
  `,
  glass: css`
    background: rgba(26, 41, 66, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `,
};

const cardPadding = {
  none: css`padding: 0;`,
  sm: css`padding: ${({ theme }) => theme.spacing[4]};`,
  md: css`padding: ${({ theme }) => theme.spacing[6]};`,
  lg: css`padding: ${({ theme }) => theme.spacing[8]};`,
};

export const Card = styled.div<CardProps>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  overflow: hidden;
  
  ${({ $variant = 'default' }) => cardVariants[$variant]}
  ${({ $padding = 'md' }) => cardPadding[$padding]}
  
  ${({ $hover, theme }) => $hover && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      border-color: ${theme.colors.secondary[500]};
      box-shadow: ${theme.shadows.gold};
    }
  `}
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral.white};
`;

export const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.neutral[200]};
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.primary[500]};
`;

export const CardImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.normal};
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;
