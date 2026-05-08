import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

type AnimationType = 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn' | 'scaleIn' | 'slideInUp';

const animationMap = {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fadeIn,
  scaleIn,
  slideInUp,
};

interface AnimatedWrapperProps {
  $isVisible: boolean;
  $animation: AnimationType;
  $duration: number;
  $delay: number;
  $easing: string;
}

const AnimatedWrapper = styled.div<AnimatedWrapperProps>`
  opacity: 0;
  
  ${({ $isVisible, $animation, $duration, $delay, $easing }) =>
    $isVisible &&
    css`
      animation: ${animationMap[$animation]} ${$duration}s ${$easing} ${$delay}s forwards;
    `}
`;

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  easing?: string;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  as?: React.ElementType;
}

export function AnimatedSection({
  children,
  animation = 'fadeInUp',
  duration = 0.6,
  delay = 0,
  easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  threshold = 0.1,
  triggerOnce = true,
  className,
  as,
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, triggerOnce]);

  return (
    <AnimatedWrapper
      ref={ref}
      as={as}
      className={className}
      $isVisible={isVisible}
      $animation={animation}
      $duration={duration}
      $delay={delay}
      $easing={easing}
    >
      {children}
    </AnimatedWrapper>
  );
}

// Staggered children animation component
interface StaggeredListProps {
  children: ReactNode[];
  animation?: AnimationType;
  duration?: number;
  staggerDelay?: number;
  threshold?: number;
  className?: string;
}

const StaggeredWrapper = styled.div`
  display: contents;
`;

const StaggeredItem = styled.div<{
  $isVisible: boolean;
  $animation: AnimationType;
  $duration: number;
  $delay: number;
}>`
  opacity: 0;
  
  ${({ $isVisible, $animation, $duration, $delay }) =>
    $isVisible &&
    css`
      animation: ${animationMap[$animation]} ${$duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${$delay}s forwards;
    `}
`;

export function StaggeredList({
  children,
  animation = 'fadeInUp',
  duration = 0.5,
  staggerDelay = 0.1,
  threshold = 0.1,
  className,
}: StaggeredListProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return (
    <StaggeredWrapper ref={ref} className={className}>
      {React.Children.map(children, (child, index) => (
        <StaggeredItem
          $isVisible={isVisible}
          $animation={animation}
          $duration={duration}
          $delay={index * staggerDelay}
        >
          {child}
        </StaggeredItem>
      ))}
    </StaggeredWrapper>
  );
}

// Page transition wrapper
const PageWrapper = styled.div`
  animation: ${fadeInUp} 0.4s ease-out forwards;
`;

export function PageTransition({ children }: { children: ReactNode }) {
  return <PageWrapper>{children}</PageWrapper>;
}

// Loading skeleton with animation
const SkeletonPulse = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
`;

export const Skeleton = styled.div<{ 
  $width?: string; 
  $height?: string; 
  $borderRadius?: string;
}>`
  width: ${({ $width = '100%' }) => $width};
  height: ${({ $height = '20px' }) => $height};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary[700]} 0%,
    ${({ theme }) => theme.colors.primary[600]} 50%,
    ${({ theme }) => theme.colors.primary[700]} 100%
  );
  background-size: 200% 100%;
  border-radius: ${({ $borderRadius, theme }) => $borderRadius || theme.borderRadius.md};
  animation: ${SkeletonPulse} 1.5s ease-in-out infinite;
`;

// Hover lift effect wrapper
export const HoverLift = styled.div`
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

// Ripple effect for buttons
const rippleAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

export const RippleContainer = styled.span`
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ${rippleAnimation} 0.6s ease-out;
    pointer-events: none;
  }
`;
