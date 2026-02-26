import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';

import { cn } from '@/forge/utils';
import { Icon } from '@/forge/primitives/Icon';

export interface BrilliantCarouselProps {
  children: ReactNode;
  className?: string;
}

export function BrilliantCarousel({ children, className }: BrilliantCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={cn('relative group', className)}>
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className={cn(
          'flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory',
          'scrollbar-none',
          '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
        )}
      >
        {children}
      </div>

      {/* Left arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2',
            'w-10 h-10 rounded-full bg-surface-card shadow-soft',
            'flex items-center justify-center',
            'opacity-0 group-hover:opacity-100',
            'transition-opacity duration-fast ease-out',
            'hover:shadow-hover-card',
          )}
          aria-label="Scroll left"
        >
          <Icon name="ChevronLeft" size="md" className="text-content-primary" />
        </button>
      )}

      {/* Right arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
            'w-10 h-10 rounded-full bg-surface-card shadow-soft',
            'flex items-center justify-center',
            'opacity-0 group-hover:opacity-100',
            'transition-opacity duration-fast ease-out',
            'hover:shadow-hover-card',
          )}
          aria-label="Scroll right"
        >
          <Icon name="ChevronRight" size="md" className="text-content-primary" />
        </button>
      )}
    </div>
  );
}
