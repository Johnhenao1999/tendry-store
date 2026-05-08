import { createGlobalStyle } from 'styled-components';
import { fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight, scaleIn, shimmer } from './animations';

export const GlobalStyles = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    color: ${({ theme }) => theme.colors.neutral.white};
    background-color: ${({ theme }) => theme.colors.primary[800]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.secondary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    color: ${({ theme }) => theme.colors.neutral.white};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  a {
    color: ${({ theme }) => theme.colors.secondary[500]};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.secondary[400]};
    }
  }

  /* Lists */
  ul, ol {
    list-style: none;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  /* Inputs */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Selection */
  ::selection {
    background-color: ${({ theme }) => theme.colors.secondary[500]};
    color: ${({ theme }) => theme.colors.primary[900]};
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.primary[900]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary[500]};
    border-radius: ${({ theme }) => theme.borderRadius.full};

    &:hover {
      background: ${({ theme }) => theme.colors.secondary[600]};
    }
  }

  /* Focus Visible */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.secondary[500]};
    outline-offset: 2px;
  }

  /* Utility Classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Animation Utility Classes */
  .animate-fade-in {
    animation: ${fadeIn} 0.5s ease-out forwards;
  }

  .animate-fade-in-up {
    animation: ${fadeInUp} 0.6s ease-out forwards;
  }

  .animate-fade-in-down {
    animation: ${fadeInDown} 0.6s ease-out forwards;
  }

  .animate-fade-in-left {
    animation: ${fadeInLeft} 0.6s ease-out forwards;
  }

  .animate-fade-in-right {
    animation: ${fadeInRight} 0.6s ease-out forwards;
  }

  .animate-scale-in {
    animation: ${scaleIn} 0.4s ease-out forwards;
  }

  /* Stagger animation delays */
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
  .stagger-5 { animation-delay: 0.5s; }
  .stagger-6 { animation-delay: 0.6s; }

  /* Skeleton loading shimmer */
  .skeleton {
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primary[700]} 0%,
      ${({ theme }) => theme.colors.primary[600]} 50%,
      ${({ theme }) => theme.colors.primary[700]} 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  /* Page transition wrapper */
  .page-transition {
    animation: ${fadeInUp} 0.4s ease-out forwards;
  }

  /* Smooth hover transitions for interactive elements */
  a, button, input, select, textarea {
    transition: all ${({ theme }) => theme.transitions.fast};
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
