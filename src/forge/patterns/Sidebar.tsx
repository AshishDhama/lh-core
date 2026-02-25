import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { Icon } from '@/forge/primitives/Icon';
import type { IconName } from '@/forge/primitives/Icon';
import { Text } from '@/forge/primitives/Typography';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

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
          ? 'bg-[#EEF6FA] text-[#002C77]'
          : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]',
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
            isActive ? 'text-[#002C77]' : 'text-[#64748b]',
          )}
        />
      )}
      {!collapsed && (
        <Text
          size="sm"
          weight={isActive ? 'semibold' : 'medium'}
          className={cn(
            'flex-1 truncate',
            isActive ? 'text-[#002C77]' : 'text-[#475569]',
          )}
        >
          {item.label}
        </Text>
      )}
      {!collapsed && hasChildren && (
        <Icon name="ChevronRight" size="sm" className="text-[#94a3b8]" />
      )}
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#002C77]"
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

export function Sidebar({
  items,
  activeKey,
  collapsed = false,
  onCollapse,
  onSelect,
  logo,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col h-full',
        'border-r border-[#e2e8f0] bg-surface-primary',
        'transition-all duration-200 ease-in-out',
        collapsed ? 'w-16' : 'w-60',
        className,
      )}
      aria-label="Main navigation"
    >
      {/* Logo / header area */}
      <div
        className={cn(
          'flex items-center h-16 px-3 border-b border-[#e2e8f0] flex-shrink-0',
          collapsed ? 'justify-center' : 'justify-between gap-2',
        )}
      >
        {logo && !collapsed && <div className="flex-1 overflow-hidden">{logo}</div>}
        {logo && collapsed && <div>{logo}</div>}
        <button
          type="button"
          onClick={() => onCollapse?.(!collapsed)}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg',
            'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]',
            'transition-colors duration-150 flex-shrink-0',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={collapsed ? 'PanelLeftOpen' : 'PanelLeftClose'} size="md" />
        </button>
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

      {/* Bottom collapse toggle (always visible shortcut) */}
      {!collapsed && (
        <div className="flex-shrink-0 px-3 py-3 border-t border-[#e2e8f0]">
          <div
            className="flex items-center gap-2 text-[#94a3b8] cursor-pointer hover:text-[#475569] transition-colors"
            onClick={() => onCollapse?.(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCollapse?.(true);
              }
            }}
          >
            <Icon name="ChevronsLeft" size="sm" style={{ color: colors.content.tertiary }} />
            <Text size="xs" color="tertiary">Collapse</Text>
          </div>
        </div>
      )}
    </aside>
  );
}
