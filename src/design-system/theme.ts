import type { DefaultTheme } from 'styled-components';
import {
  colors,
  typography,
  spacing,
  breakpoints,
  borderRadius,
  shadows,
  transitions,
  zIndex,
} from './tokens';

export const theme: DefaultTheme = {
  colors,
  typography,
  spacing,
  breakpoints,
  borderRadius,
  shadows,
  transitions,
  zIndex,
};

export type Theme = typeof theme;
