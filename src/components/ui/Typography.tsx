import styled, { css } from 'styled-components';

interface TextProps {
  $size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  $weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  $color?: 'primary' | 'secondary' | 'muted' | 'white' | 'gold';
  $align?: 'left' | 'center' | 'right';
  $transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

const colorStyles = {
  primary: css`color: ${({ theme }) => theme.colors.neutral.white};`,
  secondary: css`color: ${({ theme }) => theme.colors.neutral[200]};`,
  muted: css`color: ${({ theme }) => theme.colors.neutral[400]};`,
  white: css`color: ${({ theme }) => theme.colors.neutral.white};`,
  gold: css`color: ${({ theme }) => theme.colors.secondary[500]};`,
};

export const Text = styled.p<TextProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: ${({ theme, $size = 'base' }) => theme.typography.fontSize[$size]};
  font-weight: ${({ theme, $weight = 'regular' }) => theme.typography.fontWeight[$weight]};
  text-align: ${({ $align = 'left' }) => $align};
  text-transform: ${({ $transform = 'none' }) => $transform};
  margin: 0;
  
  ${({ $color = 'primary' }) => colorStyles[$color]}
`;

export const Heading = styled.h2<TextProps & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }>`
  font-family: ${({ theme }) => theme.typography.fontFamily.secondary};
  font-size: ${({ theme, $size = '3xl' }) => theme.typography.fontSize[$size]};
  font-weight: ${({ theme, $weight = 'bold' }) => theme.typography.fontWeight[$weight]};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-align: ${({ $align = 'left' }) => $align};
  text-transform: ${({ $transform = 'none' }) => $transform};
  margin: 0;
  
  ${({ $color = 'white' }) => colorStyles[$color]}
`;

export const GradientText = styled.span`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.secondary[400]} 0%,
    ${({ theme }) => theme.colors.secondary[600]} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Price = styled.span<{ $size?: 'sm' | 'md' | 'lg'; $sale?: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme, $sale }) => $sale ? theme.colors.error.main : theme.colors.secondary[500]};
  
  ${({ $size = 'md', theme }) => {
    const sizes = {
      sm: theme.typography.fontSize.lg,
      md: theme.typography.fontSize['2xl'],
      lg: theme.typography.fontSize['3xl'],
    };
    return css`font-size: ${sizes[$size]};`;
  }}
  
  ${({ $sale }) => $sale && css`
    text-decoration: line-through;
    opacity: 0.7;
  `}
`;

export const OriginalPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[400]};
  text-decoration: line-through;
  margin-left: ${({ theme }) => theme.spacing[2]};
`;
