import type { ReactNode } from 'react';

import { Avatar } from '@/forge/primitives/Avatar';
import { Badge } from '@/forge/primitives/Badge';
import { Button } from '@/forge/primitives/Button';
import { Icon } from '@/forge/primitives/Icon';
import { Text } from '@/forge/primitives/Typography';
import { useThemeStore } from '@/stores/useThemeStore';
import { cn } from '@/forge/utils';

export interface HeaderUser {
  name: string;
  avatar?: string;
  role?: string;
}

export interface HeaderProps {
  title?: string;
  user?: HeaderUser;
  onMenuClick?: () => void;
  actions?: ReactNode;
  notifications?: number;
  className?: string;
}

export function Header({
  title,
  user,
  onMenuClick,
  actions,
  notifications = 0,
  className,
}: HeaderProps) {
  const mode = useThemeStore((s) => s.mode);
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const locale = useThemeStore((s) => s.locale);
  const setLocale = useThemeStore((s) => s.setLocale);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-16 px-4 flex items-center gap-4',
        'bg-white border-b border-[#e2e8f0]',
        className,
      )}
    >
      {/* Menu toggle — shown on mobile or when sidebar is hidden */}
      <Button
        variant="ghost"
        size="sm"
        icon={<Icon name="Menu" size="md" />}
        onClick={onMenuClick}
        className="flex-shrink-0 text-[#475569]"
        aria-label="Toggle menu"
      />

      {/* Title */}
      {title && (
        <Text size="lg" weight="semibold" color="primary" className="flex-shrink-0">
          {title}
        </Text>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions slot */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}

      {/* Language switcher */}
      <div
        className="hidden sm:flex items-center gap-0.5 rounded-lg border border-[#e2e8f0] p-0.5"
        role="group"
        aria-label="Language selector"
      >
        {(['en', 'hi'] as const).map((lng) => (
          <button
            key={lng}
            type="button"
            onClick={() => setLocale(lng)}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-semibold transition-colors',
              locale === lng
                ? 'bg-[#002C77] text-white'
                : 'text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002C77] focus-visible:ring-offset-1',
            )}
            aria-pressed={locale === lng}
          >
            {lng === 'en' ? 'EN' : 'हि'}
          </button>
        ))}
      </div>

      {/* Dark mode toggle */}
      <Button
        variant="ghost"
        size="sm"
        icon={
          <Icon
            name={mode === 'dark' ? 'Sun' : 'Moon'}
            size="md"
            className="transition-transform duration-200"
          />
        }
        onClick={toggleMode}
        className="text-[#475569]"
        aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      />

      {/* Notifications */}
      <Badge count={notifications} overflowCount={99} size="sm">
        <Button
          variant="ghost"
          size="sm"
          icon={<Icon name="Bell" size="md" />}
          className="text-[#475569]"
          aria-label={`Notifications${notifications > 0 ? `, ${notifications} unread` : ''}`}
        />
      </Badge>

      {/* User info */}
      {user && (
        <div className="flex items-center gap-2 pl-2 border-l border-[#e2e8f0]">
          <Avatar
            src={user.avatar}
            fallback={user.name}
            size="sm"
            shape="circle"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <Text size="sm" weight="medium" color="primary">
              {user.name}
            </Text>
            {user.role && (
              <Text size="xs" color="secondary">
                {user.role}
              </Text>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
