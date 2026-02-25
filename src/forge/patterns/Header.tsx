import type { ReactNode } from 'react';

import { Avatar } from '@/forge/primitives/Avatar';
import { Badge } from '@/forge/primitives/Badge';
import { Button } from '@/forge/primitives/Button';
import { Icon } from '@/forge/primitives/Icon';
import { Text } from '@/forge/primitives/Typography';
import { useThemeStore } from '@/stores/useThemeStore';
import { cn } from '@/forge/utils';
import { useTranslation } from '@/i18n';

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
  const { t } = useTranslation(locale);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-16 px-4 flex items-center gap-4',
        'bg-surface-primary border-b border-border',
        className,
      )}
    >
      {/* Menu toggle — shown on mobile or when sidebar is hidden */}
      <Button
        variant="ghost"
        size="sm"
        icon={<Icon name="Menu" size="md" />}
        onClick={onMenuClick}
        className="flex-shrink-0 text-content-secondary"
        aria-label={t('header.toggleMenu')}
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
        className="hidden sm:flex items-center gap-0.5 rounded-lg border border-border p-0.5"
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
                ? 'bg-navy text-white'
                : 'text-content-secondary hover:text-content-primary hover:bg-surface-tertiary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-1',
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
        className="text-content-secondary"
        aria-label={t(mode === 'dark' ? 'header.switchToLight' : 'header.switchToDark')}
      />

      {/* Notifications */}
      <Badge count={notifications} overflowCount={99} size="sm">
        <Button
          variant="ghost"
          size="sm"
          icon={<Icon name="Bell" size="md" />}
          className="text-content-secondary"
          aria-label={`${t('header.notifications')}${notifications > 0 ? `, ${notifications} ${t('header.unread')}` : ''}`}
        />
      </Badge>

      {/* User info */}
      {user && (
        <div className="flex items-center gap-2 pl-2 border-l border-border">
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
