import styled, { css } from 'styled-components';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'gold' | 'outline';

interface BadgeProps {
  $variant?: BadgeVariant;
  $size?: 'sm' | 'md';
}

const badgeVariants = {
  default: css`
    background: ${({ theme }) => theme.colors.primary[500]};
    color: ${({ theme }) => theme.colors.neutral.white};
  `,
  success: css`
    background: ${({ theme }) => theme.colors.success.dark};
    color: ${({ theme }) => theme.colors.neutral.white};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warning.dark};
    color: ${({ theme }) => theme.colors.neutral.white};
  `,
  error: css`
    background: ${({ theme }) => theme.colors.error.main};
    color: ${({ theme }) => theme.colors.neutral.white};
  `,
  gold: css`
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary[600]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
    color: ${({ theme }) => theme.colors.primary[900]};
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.secondary[500]};
    border: 1px solid ${({ theme }) => theme.colors.secondary[500]};
  `,
};

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  white-space: nowrap;
  
  ${({ $variant = 'default' }) => badgeVariants[$variant]}
  
  ${({ $size = 'md', theme }) => {
    const sizes = {
      sm: css`
        padding: ${theme.spacing[1]} ${theme.spacing[2]};
        font-size: ${theme.typography.fontSize.xs};
      `,
      md: css`
        padding: ${theme.spacing[1]} ${theme.spacing[3]};
        font-size: ${theme.typography.fontSize.sm};
      `,
    };
    return sizes[$size];
  }}
`;

export const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[900]};
  background: ${({ theme }) => theme.colors.secondary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

export const Tag = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, $active }) => $active ? theme.colors.primary[900] : theme.colors.neutral.white};
  background: ${({ theme, $active }) => $active ? theme.colors.secondary[500] : theme.colors.primary[600]};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.secondary[500] : theme.colors.primary[400]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary[500]};
    color: ${({ theme }) => theme.colors.primary[900]};
    border-color: ${({ theme }) => theme.colors.secondary[500]};
  }
`;
