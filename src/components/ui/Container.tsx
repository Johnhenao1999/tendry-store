import styled, { css } from 'styled-components';

interface ContainerProps {
  $maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  $padding?: boolean;
}

const maxWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
};

export const Container = styled.div<ContainerProps>`
  width: 100%;
  max-width: ${({ $maxWidth = 'xl' }) => maxWidths[$maxWidth]};
  margin: 0 auto;
  
  ${({ $padding = true, theme }) => $padding && css`
    padding-left: ${theme.spacing[4]};
    padding-right: ${theme.spacing[4]};
    
    @media (min-width: ${theme.breakpoints.md}) {
      padding-left: ${theme.spacing[6]};
      padding-right: ${theme.spacing[6]};
    }
    
    @media (min-width: ${theme.breakpoints.lg}) {
      padding-left: ${theme.spacing[8]};
      padding-right: ${theme.spacing[8]};
    }
  `}
`;

export const Section = styled.section<{ $padding?: 'sm' | 'md' | 'lg' }>`
  ${({ $padding = 'md', theme }) => {
    const paddings = {
      sm: css`
        padding-top: ${theme.spacing[8]};
        padding-bottom: ${theme.spacing[8]};
      `,
      md: css`
        padding-top: ${theme.spacing[12]};
        padding-bottom: ${theme.spacing[12]};
      `,
      lg: css`
        padding-top: ${theme.spacing[20]};
        padding-bottom: ${theme.spacing[20]};
      `,
    };
    return paddings[$padding];
  }}
`;

export const Flex = styled.div<{
  $direction?: 'row' | 'column';
  $align?: 'start' | 'center' | 'end' | 'stretch';
  $justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  $gap?: number;
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  align-items: ${({ $align = 'center' }) => {
    const map = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' };
    return map[$align];
  }};
  justify-content: ${({ $justify = 'start' }) => {
    const map = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between', around: 'space-around' };
    return map[$justify];
  }};
  gap: ${({ $gap = 0, theme }) => theme.spacing[$gap as keyof typeof theme.spacing] || `${$gap}px`};
  flex-wrap: ${({ $wrap }) => $wrap ? 'wrap' : 'nowrap'};
`;

export const Grid = styled.div<{
  $columns?: number;
  $gap?: number;
  $minChildWidth?: string;
}>`
  display: grid;
  gap: ${({ $gap = 6, theme }) => theme.spacing[$gap as keyof typeof theme.spacing] || `${$gap}px`};
  
  ${({ $columns, $minChildWidth = '280px' }) => $columns 
    ? css`grid-template-columns: repeat(${$columns}, 1fr);`
    : css`grid-template-columns: repeat(auto-fill, minmax(${$minChildWidth}, 1fr));`
  }
`;

export const Spacer = styled.div<{ $size?: number }>`
  height: ${({ $size = 4, theme }) => theme.spacing[$size as keyof typeof theme.spacing] || `${$size}px`};
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.colors.primary[500]};
  margin: ${({ theme }) => `${theme.spacing[6]} 0`};
`;
