import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

interface RevealSectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function RevealSection({ children, className = '', ...props }: RevealSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`reveal-section ${visible ? 'is-visible' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </section>
  );
}
