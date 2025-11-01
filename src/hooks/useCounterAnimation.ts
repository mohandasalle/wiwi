import { useState, useEffect, useRef } from 'react';

interface UseCounterAnimationOptions {
  end: number;
  duration?: number;
  delay?: number;
  start?: number;
}

export const useCounterAnimation = ({
  end,
  duration = 2500,
  delay = 300,
  start = 0,
}: UseCounterAnimationOptions) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const startAnimation = () => {
      setIsAnimating(true);

      const animate = (currentTime: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = currentTime;
        }

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        const currentCount = Math.floor(start + (end - start) * easeOutQuart);
        setCount(currentCount);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setCount(end);
          setIsAnimating(false);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeoutId);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, delay, start]);

  return { count, isAnimating };
};
