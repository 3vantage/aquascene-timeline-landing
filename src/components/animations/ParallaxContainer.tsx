'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimationManager } from '@/lib/animation-config';

interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  offset?: number;
}

const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  speed = 0.5,
  className = '',
  offset = 0
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const [isEnabled, setIsEnabled] = useState(true);
  const animationManager = AnimationManager.getInstance();
  const config = animationManager.getAnimationConfig();

  useEffect(() => {
    setIsEnabled(config.enabled && config.complexAnimationsEnabled !== false);
  }, [config.enabled, config.complexAnimationsEnabled]);

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [offset, offset + (isEnabled ? speed * 200 : 0)]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.4, 1, 1, 0.4]
  );

  if (!config.enabled) {
    return <div className={className} ref={ref}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: isEnabled ? y : 0, opacity: isEnabled ? opacity : 1 }}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxContainer;