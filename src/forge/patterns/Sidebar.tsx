import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { Icon } from '@/forge/primitives/Icon';
import type { IconName } from '@/forge/primitives/Icon';
import { Text } from '@/forge/primitives/Typography';
import { cn } from '@/forge/utils';
import type { DesignMode } from '@/types/common';
import { useThemeStore } from '@/stores/useThemeStore';
import { useTranslation } from '@/i18n';

export interface SidebarItem {
  key: string;
  label: string;
  icon?: IconName;
  path?: string;
  children?: SidebarItem[];
}

export interface SidebarProps {
  items: SidebarItem[];
  activeKey?: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  onSelect?: (key: string) => void;
  logo?: ReactNode;
  className?: string;
}

interface NavItemProps {
  item: SidebarItem;
  activeKey?: string;
  collapsed?: boolean;
  depth?: number;
  onSelect?: (key: string) => void;
}

function NavItem({ item, activeKey, collapsed, depth = 0, onSelect }: NavItemProps) {
  const isActive = activeKey === item.key;
  const hasChildren = item.children && item.children.length > 0;

  const itemContent = (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer select-none',
        'transition-colors duration-150',
        depth > 0 && 'ml-6',
        isActive
          ? 'bg-navy-50 dark:bg-navy-400/15 text-navy dark:text-navy-200'
          : 'text-content-secondary hover:bg-surface-tertiary hover:text-content-primary',
      )}
      onClick={() => onSelect?.(item.key)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(item.key);
        }
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.icon && (
        <Icon
          name={item.icon}
          size="md"
          className={cn(
            'flex-shrink-0',
            isActive ? 'text-navy dark:text-navy-200' : 'text-content-tertiary',
          )}
        />
      )}
      {!collapsed && (
        <Text
          size="sm"
          weight={isActive ? 'semibold' : 'medium'}
          className={cn(
            'flex-1 truncate',
            isActive ? 'text-navy dark:text-navy-200' : 'text-content-secondary',
          )}
        >
          {item.label}
        </Text>
      )}
      {!collapsed && hasChildren && (
        <Icon name="ChevronRight" size="sm" className="text-content-tertiary" />
      )}
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-navy dark:bg-navy-400"
          aria-hidden="true"
        />
      )}
    </div>
  );

  if (item.path && !hasChildren) {
    return (
      <li className="relative list-none">
        <Link to={item.path as never} className="block no-underline">
          {itemContent}
        </Link>
        {hasChildren && !collapsed && (
          <ul className="mt-0.5 space-y-0.5">
            {item.children!.map((child) => (
              <NavItem
                key={child.key}
                item={child}
                activeKey={activeKey}
                collapsed={collapsed}
                depth={depth + 1}
                onSelect={onSelect}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="relative list-none">
      {itemContent}
      {hasChildren && !collapsed && (
        <ul className="mt-0.5 space-y-0.5">
          {item.children!.map((child) => (
            <NavItem
              key={child.key}
              item={child}
              activeKey={activeKey}
              collapsed={collapsed}
              depth={depth + 1}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

const designModes: { mode: DesignMode; icon: IconName; label: string }[] = [
  { mode: 'scrolly', icon: 'Layers', label: 'Scrolly' },
  { mode: 'bento', icon: 'LayoutGrid', label: 'Bento' },
  { mode: 'editorial', icon: 'FileText', label: 'Editorial' },
  { mode: 'notion', icon: 'StickyNote', label: 'Notion' },
  { mode: 'm3', icon: 'Palette', label: 'M3' },
];

function DesignModeSwitcher() {
  const designMode = useThemeStore((s) => s.designMode);
  const setDesignMode = useThemeStore((s) => s.setDesignMode);

  return (
    <div className="flex-shrink-0 px-3 py-3 border-t border-border">
      <Text size="xs" color="tertiary" className="mb-2 px-0.5">
        Design Mode
      </Text>
      <div className="flex items-center gap-1">
        {designModes.map(({ mode, icon, label }) => {
          const isActive = designMode === mode;
          return (
            <button
              key={mode}
              type="button"
              title={label}
              onClick={() => {
                setDesignMode(mode);
              }}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150',
                isActive
                  ? 'bg-navy-50 dark:bg-navy-400/15 text-navy dark:text-navy-200'
                  : 'text-content-tertiary hover:bg-surface-tertiary hover:text-content-primary',
              )}
            >
              <Icon name={icon} size="sm" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SidebarFooterControls() {
  const mode = useThemeStore((s) => s.mode);
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const locale = useThemeStore((s) => s.locale);
  const setLocale = useThemeStore((s) => s.setLocale);
  const { t } = useTranslation(locale);

  return (
    <div className="flex items-center justify-between px-3 pb-3">
      {/* Language selector */}
      <button
        type="button"
        onClick={() => setLocale(locale === 'en' ? 'hi' : 'en')}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-content-tertiary hover:bg-surface-tertiary hover:text-content-primary transition-colors"
        aria-label={t('header.switchLanguage') ?? 'Switch language'}
      >
        <Icon name="Globe" size="sm" />
        <Text size="xs" weight="semibold" className="uppercase">
          {locale}
        </Text>
      </button>

      {/* Dark mode toggle */}
      <button
        type="button"
        onClick={toggleMode}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-content-tertiary hover:bg-surface-tertiary hover:text-content-primary transition-colors"
        aria-label={t(mode === 'dark' ? 'header.switchToLight' : 'header.switchToDark')}
      >
        <Icon name={mode === 'dark' ? 'Sun' : 'Moon'} size="sm" />
      </button>
    </div>
  );
}

export function Sidebar({
  items,
  activeKey,
  collapsed = false,
  onSelect,
  logo,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col h-full',
        'border-r border-border bg-surface-primary',
        'transition-all duration-200 ease-in-out',
        collapsed ? 'w-16' : 'w-60',
        className,
      )}
      aria-label="Main navigation"
    >
      {/* Logo / header area */}
      <div
        className={cn(
          'flex items-center h-16 px-3 border-b border-border flex-shrink-0',
          collapsed ? 'justify-center' : 'gap-2',
        )}
      >
        {logo && !collapsed && <div className="flex-1 overflow-hidden">{logo}</div>}
        {logo && collapsed && <div>{logo}</div>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-0.5">
          {items.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              activeKey={activeKey}
              collapsed={collapsed}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </nav>

      {/* Footer controls (expanded only) */}
      {!collapsed && (
        <>
          <DesignModeSwitcher />
          <SidebarFooterControls />
        </>
      )}
    </aside>
  );
}
