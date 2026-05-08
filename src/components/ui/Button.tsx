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
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary[500]} 0%, ${({ theme }) => theme.colors.secondary[400]} 100%);
      box-shadow: 0 8px 25px rgba(212, 168, 67, 0.4);
      transform: translateY(-2px);
      
      &::before {
        left: 100%;
      }
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.primary[600]};
    color: ${({ theme }) => theme.colors.neutral.white};
    border: 1px solid ${({ theme }) => theme.colors.primary[400]};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary[500]};
      border-color: ${({ theme }) => theme.colors.secondary[500]};
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.secondary[500]};
    border: 2px solid ${({ theme }) => theme.colors.secondary[500]};
    position: relative;
    overflow: hidden;
    z-index: 1;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 0%;
      height: 100%;
      background: ${({ theme }) => theme.colors.secondary[500]};
      transition: width 0.3s ease;
      z-index: -1;
    }
    
    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.colors.primary[900]};
      transform: translateY(-2px);
      
      &::before {
        width: 100%;
      }
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.secondary[500]};
    border: none;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: ${({ theme }) => theme.colors.secondary[500]};
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }
    
    &:hover:not(:disabled) {
      background: rgba(212, 168, 67, 0.1);
      
      &::after {
        width: 80%;
      }
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
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  
  ${({ $variant = 'primary' }) => variants[$variant]}
  ${({ $size = 'md' }) => sizes[$size]}
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:active:not(:disabled) {
    transform: scale(0.98) translateY(0);
  }
  
  /* Icon animation on hover */
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover:not(:disabled) svg {
    transform: scale(1.1);
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
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  
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
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    transition: transform 0.2s ease;
  }
`;
