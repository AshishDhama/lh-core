import { Link } from '@tanstack/react-router';

import { cn } from '@/forge/utils';
import { Text } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';
import { Button } from '@/forge/primitives/Button';
import { Avatar } from '@/forge/primitives/Avatar';

export interface BrilliantHeaderProps {
  activeTab?: 'home' | 'courses';
  streakCount?: number;
  energyCount?: number;
  userName?: string;
  avatarUrl?: string;
  onPremiumClick?: () => void;
  className?: string;
}

export function BrilliantHeader({
  activeTab = 'home',
  streakCount = 0,
  energyCount = 0,
  userName,
  avatarUrl,
  onPremiumClick,
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
        <Button
          variant="primary"
          size="sm"
          onClick={onPremiumClick}
          className="!rounded-full !bg-subject-code !border-transparent"
        >
          Go Premium
        </Button>

        {/* Streak chip */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-tertiary">
          <span className="text-sm" role="img" aria-label="fire">
            🔥
          </span>
          <Text size="xs" weight="semibold" color="primary">
            {streakCount}
          </Text>
        </div>

        {/* Energy chip */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-tertiary">
          <Icon name="Zap" size="sm" className="text-subject-science" />
          <Text size="xs" weight="semibold" color="primary">
            {energyCount}
          </Text>
        </div>

        {/* Avatar */}
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
