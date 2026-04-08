'use client';

import { useState, useMemo } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isTransitioning] = useState(false);
  
  const displayChildren = useMemo(() => children, [children]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
      role="main"
      aria-live="polite"
    >
      {displayChildren}
    </div>
  );
}
