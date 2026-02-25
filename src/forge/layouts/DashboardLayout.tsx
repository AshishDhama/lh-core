import { useState, type ReactNode } from 'react';
import { Layout } from 'antd';

import { Header } from '@/forge/patterns/Header';
import type { HeaderUser } from '@/forge/patterns/Header';
import { Sidebar } from '@/forge/patterns/Sidebar';
import type { SidebarItem } from '@/forge/patterns/Sidebar';
import { cn } from '@/forge/utils';

export interface DashboardLayoutProps {
  /** Page content */
  children: ReactNode;
  /** Sidebar navigation items */
  sidebarItems: SidebarItem[];
  /** Logged-in user info shown in header */
  user?: HeaderUser;
  /** Page title shown in header */
  title?: string;
  /** Active sidebar item key */
  activeKey?: string;
  /** Extra content rendered in the header actions slot */
  headerActions?: ReactNode;
  /** Notification count for header bell icon */
  notifications?: number;
  /** Additional className for the content area */
  className?: string;
}

/**
 * DashboardLayout — main app shell.
 *
 * Structure:
 *   ┌─────────────────────────────────────────┐
 *   │              Header (fixed, z-50)        │
 *   ├──────────┬──────────────────────────────┤
 *   │ Sidebar  │   Scrollable content area    │
 *   │ (fixed)  │                              │
 *   └──────────┴──────────────────────────────┘
 *
 * Sidebar collapse state is managed internally.
 */
export function DashboardLayout({
  children,
  sidebarItems,
  user,
  title,
  activeKey,
  headerActions,
  notifications,
  className,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen bg-[#fafbfc]">
      {/* Fixed top bar — renders above everything */}
      <Header
        title={title}
        user={user}
        notifications={notifications}
        actions={headerActions}
        onMenuClick={() => setCollapsed((prev) => !prev)}
      />

      {/* Fixed left sidebar — positioned below the 64px header */}
      <div
        className={cn(
          'fixed left-0 top-16 bottom-0 z-40',
          'transition-[width] duration-200 ease-in-out',
          collapsed ? 'w-16' : 'w-60',
        )}
      >
        <Sidebar
          items={sidebarItems}
          activeKey={activeKey}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          className="h-full"
        />
      </div>

      {/* Main content area — offset for fixed header (pt-16) and sidebar (ml-*) */}
      <Layout.Content
        className={cn(
          'pt-16 min-h-screen overflow-y-auto',
          'transition-[margin] duration-200 ease-in-out',
          collapsed ? 'ml-16' : 'ml-60',
          className,
        )}
      >
        {children}
      </Layout.Content>
    </Layout>
  );
}
