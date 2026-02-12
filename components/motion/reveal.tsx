'use client';

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  immediate?: boolean;
}

export function Reveal({ children, delay = 0, direction = 'up', className, immediate = false }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const directionOffset = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const animationProps = immediate
    ? {
        initial: {
          opacity: 0,
          ...directionOffset[direction],
        },
        animate: {
          opacity: 1,
          y: 0,
          x: 0,
        },
        transition: {
          duration: 0.8,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      }
    : {
        initial: {
          opacity: 0,
          ...directionOffset[direction],
        },
        whileInView: {
          opacity: 1,
          y: 0,
          x: 0,
        },
        viewport: { once: true, margin: '-50px' },
        transition: {
          duration: 0.5,
          delay,
          ease: [0.22, 1, 0.36, 1],
        },
      };

  return (
    <LazyMotion features={domAnimation}>
      <m.div {...animationProps} className={className}>
        {children}
      </m.div>
    </LazyMotion>
  );
}
