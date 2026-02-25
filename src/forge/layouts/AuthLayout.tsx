import type { ReactNode } from 'react';

import { cn } from '@/forge/utils';

export interface AuthLayoutProps {
  /** Auth form content rendered in the right panel */
  children: ReactNode;
  /** Content rendered in the left branding panel (illustration, copy, etc.) */
  brandingContent?: ReactNode;
  /** Logo node rendered at top-left of the branding panel */
  logo?: ReactNode;
  /** Additional className for the outer container */
  className?: string;
}

/**
 * AuthLayout — split-screen layout for auth flows.
 *
 * Structure (desktop):
 *   ┌──────────────────────┬─────────────────────┐
 *   │   Branding panel     │    Form panel        │
 *   │   (navy gradient)    │    (white card)      │
 *   │   logo + content     │    children          │
 *   └──────────────────────┴─────────────────────┘
 *
 * Structure (mobile — stacked):
 *   ┌──────────────────────┐
 *   │   Branding panel     │
 *   │   (compact)          │
 *   ├──────────────────────┤
 *   │   Form panel         │
 *   └──────────────────────┘
 *
 * Used for: login, signup, forgot password.
 */
export function AuthLayout({
  children,
  brandingContent,
  logo,
  className,
}: AuthLayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col md:flex-row', className)}>
      {/* Left — branding panel */}
      <div
        className={cn(
          'flex flex-col justify-between p-8 md:p-12',
          'md:w-1/2 lg:w-2/5',
          'bg-navy',
          // Subtle diagonal gradient overlay
          'bg-gradient-to-br from-navy to-navy-800',
          // Compact on mobile (don't take up full screen height)
          'min-h-[200px] md:min-h-screen',
        )}
      >
        {/* Logo slot */}
        {logo && <div className="mb-8">{logo}</div>}

        {/* Branding / illustration */}
        <div className="flex-1 flex items-center justify-center">
          {brandingContent ?? (
            <div className="text-center text-white/80">
              <p className="text-2xl font-semibold text-white">Lighthouse</p>
              <p className="mt-2 text-sm">Your career growth platform</p>
            </div>
          )}
        </div>

        {/* Bottom decorative element */}
        <div className="mt-8 text-xs text-white/40 hidden md:block">
          © {new Date().getFullYear()} Lighthouse
        </div>
      </div>

      {/* Right — form panel */}
      <div
        className={cn(
          'flex-1 flex items-center justify-center',
          'p-6 md:p-12 lg:p-16',
          'bg-surface-secondary',
        )}
      >
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
