import { keyframes, css } from 'styled-components';

// ============================================
// KEYFRAMES - Animaciones base
// ============================================

// Fade animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Scale animations
export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const scaleUp = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.02);
  }
`;

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

export const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(212, 168, 67, 0.4);
  }
  50% {
    box-shadow: 0 0 20px 5px rgba(212, 168, 67, 0.2);
  }
`;

// Slide animations
export const slideInUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideInDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Bounce & Spring animations
export const bounce = keyframes`
  0%, 20%, 53%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translateY(0);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translateY(-15px);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translateY(-7px);
  }
  90% {
    transform: translateY(-3px);
  }
`;

export const springIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Shimmer for loading states
export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Rotate animations
export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Float animation (subtle)
export const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Glow animation
export const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(212, 168, 67, 0.2),
                0 0 10px rgba(212, 168, 67, 0.1);
  }
  50% {
    box-shadow: 0 0 20px rgba(212, 168, 67, 0.4),
                0 0 30px rgba(212, 168, 67, 0.2);
  }
`;

// ============================================
// ANIMATION MIXINS - CSS helpers
// ============================================

export const animations = {
  // Fade animations
  fadeIn: css`
    animation: ${fadeIn} 0.5s ease-out forwards;
  `,
  fadeInUp: css`
    animation: ${fadeInUp} 0.6s ease-out forwards;
  `,
  fadeInDown: css`
    animation: ${fadeInDown} 0.6s ease-out forwards;
  `,
  fadeInLeft: css`
    animation: ${fadeInLeft} 0.6s ease-out forwards;
  `,
  fadeInRight: css`
    animation: ${fadeInRight} 0.6s ease-out forwards;
  `,

  // Scale animations
  scaleIn: css`
    animation: ${scaleIn} 0.4s ease-out forwards;
  `,
  springIn: css`
    animation: ${springIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `,

  // Continuous animations
  pulse: css`
    animation: ${pulse} 2s ease-in-out infinite;
  `,
  float: css`
    animation: ${float} 3s ease-in-out infinite;
  `,
  glow: css`
    animation: ${glow} 2s ease-in-out infinite;
  `,
  spin: css`
    animation: ${spin} 1s linear infinite;
  `,

  // Loading shimmer
  shimmer: css`
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
  `,
};

// ============================================
// TRANSITION PRESETS
// ============================================

export const transitionPresets = {
  // Para hover effects en cards
  cardHover: css`
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease,
                border-color 0.3s ease;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
  `,

  // Para botones
  buttonHover: css`
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(212, 168, 67, 0.3);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 4px 10px rgba(212, 168, 67, 0.2);
    }
  `,

  // Para imágenes
  imageHover: css`
    transition: transform 0.5s ease, filter 0.5s ease;
    
    &:hover {
      transform: scale(1.08);
      filter: brightness(1.1);
    }
  `,

  // Para links
  linkHover: css`
    position: relative;
    transition: color 0.25s ease;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: currentColor;
      transition: width 0.3s ease;
    }
    
    &:hover::after {
      width: 100%;
    }
  `,

  // Para inputs
  inputFocus: css`
    transition: border-color 0.25s ease,
                box-shadow 0.25s ease,
                background-color 0.25s ease;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.secondary[500]};
      box-shadow: 0 0 0 3px rgba(212, 168, 67, 0.2);
    }
  `,

  // Para elementos que aparecen/desaparecen
  fadeToggle: css`
    transition: opacity 0.3s ease, visibility 0.3s ease;
  `,

  // Para menús desplegables
  dropdownOpen: css`
    transition: opacity 0.2s ease,
                transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                visibility 0.2s ease;
  `,
};

// ============================================
// STAGGER ANIMATION HELPER
// ============================================

export const staggerDelay = (index: number, baseDelay: number = 0.1) => css`
  animation-delay: ${index * baseDelay}s;
`;

// Helper para aplicar delay a children
export const staggerChildren = (count: number, baseDelay: number = 0.08) => {
  let styles = '';
  for (let i = 1; i <= count; i++) {
    styles += `
      &:nth-child(${i}) {
        animation-delay: ${(i - 1) * baseDelay}s;
      }
    `;
  }
  return css`${styles}`;
};
