import 'styled-components';
import type {
  colors,
  typography,
  spacing,
  breakpoints,
  borderRadius,
  shadows,
  transitions,
  zIndex,
} from './tokens';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof colors;
    typography: typeof typography;
    spacing: typeof spacing;
    breakpoints: typeof breakpoints;
    borderRadius: typeof borderRadius;
    shadows: typeof shadows;
    transitions: typeof transitions;
    zIndex: typeof zIndex;
  }
}
