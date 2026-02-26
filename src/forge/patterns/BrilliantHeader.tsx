import { Link } from '@tanstack/react-router';

import { cn } from '@/forge/utils';
import { Text } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';
import { Avatar } from '@/forge/primitives/Avatar';

export interface BrilliantHeaderProps {
  activeTab?: 'home' | 'courses';
  userName?: string;
  avatarUrl?: string;
  className?: string;
}

export function BrilliantHeader({
  activeTab = 'home',
  userName,
  avatarUrl,
  className,
}: BrilliantHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 w-full bg-surface-card border-b border-border-subtle',
        'flex items-center justify-between px-6 h-14',
        className,
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-6">
        <Link to="/brilliant" className="flex items-center gap-2 no-underline">
          <Icon name="Sparkles" size="lg" className="text-subject-code" />
          <Text size="lg" weight="bold" color="primary" className="hidden sm:inline">
            Brilliant
          </Text>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/brilliant"
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium no-underline transition-colors duration-fast',
              activeTab === 'home'
                ? 'bg-subject-code-light text-subject-code-dark'
                : 'text-content-secondary hover:text-content-primary hover:bg-surface-tertiary',
            )}
          >
            Home
          </Link>
          <Link
            to="/brilliant/programmes"
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium no-underline transition-colors duration-fast',
              activeTab === 'courses'
                ? 'bg-subject-code-light text-subject-code-dark'
                : 'text-content-secondary hover:text-content-primary hover:bg-surface-tertiary',
            )}
          >
            Courses
          </Link>
        </nav>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <Avatar
          fallback={userName ?? 'User'}
          src={avatarUrl}
          size={32}
          className="cursor-pointer"
        />
      </div>
    </header>
  );
}
