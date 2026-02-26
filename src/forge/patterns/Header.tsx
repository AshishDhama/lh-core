import { useRef, useState, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { Avatar } from '@/forge/primitives/Avatar';
import { Badge } from '@/forge/primitives/Badge';
import { Button } from '@/forge/primitives/Button';
import { Icon } from '@/forge/primitives/Icon';
import type { IconName } from '@/forge/primitives/Icon';
import { Text } from '@/forge/primitives/Typography';
import type { DesignMode } from '@/types/common';
import { useThemeStore } from '@/stores/useThemeStore';
import { cn } from '@/forge/utils';
import { useTranslation } from '@/i18n';
import { useClickOutside, useCountdown } from '@/hooks';

export interface HeaderUser {
  name: string;
  avatar?: string;
  role?: string;
}

export interface NotificationItem {
  id: string;
  message: string;
  time: string;
  read?: boolean;
  color?: string;
}

export interface HeaderProps {
  title?: string;
  user?: HeaderUser;
  onMenuClick?: () => void;
  actions?: ReactNode;
  notifications?: number;
  notificationItems?: NotificationItem[];
  deadline?: Date | string | null;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onSignOut?: () => void;
  className?: string;
}

const designModes: { mode: DesignMode; icon: IconName; label: string }[] = [
  { mode: 'scrolly', icon: 'Layers', label: 'Scrolly' },
  { mode: 'bento', icon: 'LayoutGrid', label: 'Bento' },
  { mode: 'editorial', icon: 'FileText', label: 'Editorial' },
  { mode: 'notion', icon: 'StickyNote', label: 'Notion' },
  { mode: 'm3', icon: 'Palette', label: 'M3' },
  { mode: 'brilliant', icon: 'Sparkles', label: 'Brilliant' },
];

function DesignModeSwitcher() {
  const designMode = useThemeStore((s) => s.designMode);
  const setDesignMode = useThemeStore((s) => s.setDesignMode);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside(panelRef, () => setOpen(false));

  return (
    <div ref={panelRef}>
      {/* Expanded panel */}
      {open && (
        <div
          className="fixed bottom-20 left-6 z-50 rounded-2xl border border-border bg-surface-primary shadow-2xl p-2"
          role="group"
          aria-label="Design mode"
        >
          {designModes.map(({ mode, icon, label }) => {
            const isActive = designMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setDesignMode(mode);
                  setOpen(false);
                  if (mode === 'brilliant') {
                    navigate({ to: '/brilliant' });
                  } else if (designMode === 'brilliant') {
                    navigate({ to: '/' });
                  }
                }}
                className={cn(
                  'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-navy text-white'
                    : 'text-content-secondary hover:bg-surface-tertiary',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-1',
                )}
              >
                <Icon name={icon} size="sm" />
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* FAB trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'fixed bottom-6 left-6 z-50',
          'flex items-center justify-center w-12 h-12 rounded-full',
          'bg-navy text-white shadow-lg',
          'hover:bg-navy-600 active:scale-95',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2',
        )}
        aria-label={open ? 'Close design modes' : 'Design modes'}
        aria-expanded={open}
      >
        <Icon name={open ? 'X' : 'Palette'} size="md" />
      </button>
    </div>
  );
}

export function Header({
  title,
  user,
  onMenuClick,
  actions,
  notifications = 0,
  notificationItems = [],
  deadline = null,
  onProfileClick,
  onSettingsClick,
  onSignOut,
  className,
}: HeaderProps) {
  const mode = useThemeStore((s) => s.mode);
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const locale = useThemeStore((s) => s.locale);
  const setLocale = useThemeStore((s) => s.setLocale);
  const { t } = useTranslation(locale);
  const countdown = useCountdown(deadline);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useClickOutside(profileRef, () => setProfileOpen(false));
  useClickOutside(notifRef, () => setNotifOpen(false));

  return (
    <>
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

      {/* Countdown timer */}
      {deadline && !countdown.isExpired && (
        <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-border bg-surface-secondary px-3 py-1.5">
          <Icon name="Clock" size="sm" className="text-content-tertiary" />
          <Text size="xs" weight="semibold" color="primary" className="tabular-nums">
            {countdown.days > 0 && `${countdown.days}d `}
            {String(countdown.hours).padStart(2, '0')}h{' '}
            {String(countdown.minutes).padStart(2, '0')}m
          </Text>
        </div>
      )}

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
      <div className="relative" ref={notifRef}>
        <Badge count={notifications} overflowCount={99} size="sm">
          <Button
            variant="ghost"
            size="sm"
            icon={<Icon name="Bell" size="md" />}
            className="text-content-secondary"
            onClick={() => setNotifOpen((o) => !o)}
            aria-label={`${t('header.notifications')}${notifications > 0 ? `, ${notifications} ${t('header.unread')}` : ''}`}
            aria-expanded={notifOpen}
            aria-haspopup="true"
          />
        </Badge>

        {/* Notification dropdown */}
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-surface-primary shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <Text size="sm" weight="semibold" color="primary">
                {t('header.notifications')}
              </Text>
              {notificationItems.length > 0 && (
                <button
                  type="button"
                  className="text-xs text-navy dark:text-navy-200 hover:underline"
                  onClick={() => setNotifOpen(false)}
                >
                  {t('header.markAllRead')}
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notificationItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <Icon name="BellOff" size="lg" className="text-content-tertiary" />
                  <Text size="sm" color="tertiary">{t('header.noNotifications')}</Text>
                </div>
              ) : (
                notificationItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 hover:bg-surface-tertiary transition-colors cursor-pointer',
                      !item.read && 'bg-navy-50/50 dark:bg-navy-900/10',
                    )}
                  >
                    <span
                      className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color ?? '#002C77' }}
                    />
                    <div className="min-w-0 flex-1">
                      <Text size="sm" color="primary" className="leading-snug">
                        {item.message}
                      </Text>
                      <Text size="xs" color="tertiary" className="mt-0.5">
                        {item.time}
                      </Text>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User info + profile dropdown */}
      {user && (
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 pl-2 border-l border-border cursor-pointer hover:opacity-80 transition-opacity"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <Avatar
              src={user.avatar}
              fallback={user.name}
              size="sm"
              shape="circle"
            />
            <div className="hidden sm:flex flex-col leading-tight text-left">
              <Text size="sm" weight="medium" color="primary">
                {user.name}
              </Text>
              {user.role && (
                <Text size="xs" color="secondary">
                  {user.role}
                </Text>
              )}
            </div>
            <Icon name="ChevronDown" size="sm" className="text-content-tertiary hidden sm:block" />
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-surface-primary shadow-lg z-50 overflow-hidden">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-border">
                <Text size="sm" weight="semibold" color="primary">{user.name}</Text>
                {user.role && (
                  <Text size="xs" color="tertiary">{user.role}</Text>
                )}
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => { setProfileOpen(false); onProfileClick?.(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-tertiary transition-colors"
                >
                  <Icon name="User" size="sm" className="text-content-secondary" />
                  <Text size="sm" color="primary">{t('header.profile')}</Text>
                </button>
                <button
                  type="button"
                  onClick={() => { setProfileOpen(false); onSettingsClick?.(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-tertiary transition-colors"
                >
                  <Icon name="Settings" size="sm" className="text-content-secondary" />
                  <Text size="sm" color="primary">{t('header.settings')}</Text>
                </button>
                <div className="border-t border-border my-1" />
                <button
                  type="button"
                  onClick={() => { setProfileOpen(false); onSignOut?.(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-tertiary transition-colors"
                >
                  <Icon name="LogOut" size="sm" className="text-error" />
                  <Text size="sm" color="primary">{t('header.signOut')}</Text>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>

    <DesignModeSwitcher />
    </>
  );
}
