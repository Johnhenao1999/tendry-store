import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
}

const variants = {
  primary: css`
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary[600]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
    color: ${({ theme }) => theme.colors.primary[900]};
    border: none;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary[500]} 0%, ${({ theme }) => theme.colors.secondary[400]} 100%);
      box-shadow: ${({ theme }) => theme.shadows.gold};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.primary[600]};
    color: ${({ theme }) => theme.colors.neutral.white};
    border: 1px solid ${({ theme }) => theme.colors.primary[400]};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary[500]};
      border-color: ${({ theme }) => theme.colors.secondary[500]};
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.secondary[500]};
    border: 2px solid ${({ theme }) => theme.colors.secondary[500]};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.secondary[500]};
      color: ${({ theme }) => theme.colors.primary[900]};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.secondary[500]};
    border: none;
    
    &:hover:not(:disabled) {
      background: rgba(212, 168, 67, 0.1);
    }
  `,
};

const sizes = {
  sm: css`
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  `,
  md: css`
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  
  ${({ $variant = 'primary' }) => variants[$variant]}
  ${({ $size = 'md' }) => sizes[$size]}
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export const IconButton = styled.button<{ $size?: 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ $size = 'md' }) => {
    const sizes = { sm: '32px', md: '40px', lg: '48px' };
    return css`
      width: ${sizes[$size]};
      height: ${sizes[$size]};
    `;
  }}

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.secondary[500]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
