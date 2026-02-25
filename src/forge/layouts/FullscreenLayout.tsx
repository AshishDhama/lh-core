import type { ReactNode } from 'react';

import { cn } from '@/forge/utils';

export interface FullscreenLayoutProps {
  /** Page content */
  children: ReactNode;
  /** Additional className for the outer container */
  className?: string;
  /** Background color override (defaults to surface.secondary) */
  background?: string;
}

/**
 * FullscreenLayout — immersive shell with no chrome (no sidebar, no header).
 *
 * Structure:
 *   ┌──────────────────────────────────────┐
 *   │                                      │
 *   │          Centered content            │
 *   │                                      │
 *   └──────────────────────────────────────┘
 *
 * Used for: pre-check flows, proctored assessments, immersive tasks.
 */
export function FullscreenLayout({
  children,
  className,
  background,
}: FullscreenLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen w-full flex items-center justify-center',
        'bg-[#fafbfc]',
        className,
      )}
      style={background ? { background } : undefined}
    >
      {children}
    </div>
  );
}
