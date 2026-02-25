import { useEffect, useState, type ReactNode } from 'react';
import { Drawer, Layout } from 'antd';

import { Header } from '@/forge/patterns/Header';
import type { HeaderUser } from '@/forge/patterns/Header';
import { Sidebar } from '@/forge/patterns/Sidebar';
import type { SidebarItem } from '@/forge/patterns/Sidebar';
import { useIsMobile } from '@/hooks';
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
 * Desktop structure:
 *   ┌─────────────────────────────────────────┐
 *   │              Header (fixed, z-50)        │
 *   ├──────────┬──────────────────────────────┤
 *   │ Sidebar  │   Scrollable content area    │
 *   │ (fixed)  │                              │
 *   └──────────┴──────────────────────────────┘
 *
 * Mobile structure:
 *   ┌─────────────────────────────────────────┐
 *   │              Header (fixed, z-50)        │
 *   ├─────────────────────────────────────────┤
 *   │        Full-width content area          │
 *   └─────────────────────────────────────────┘
 *   Sidebar rendered as an overlay Drawer (opened via hamburger).
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
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-close mobile drawer when viewport grows to desktop size.
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileOpen(true);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <Layout className="min-h-screen bg-[#fafbfc]">
      {/* Fixed top bar — renders above everything */}
      <Header
        title={title}
        user={user}
        notifications={notifications}
        actions={headerActions}
        onMenuClick={handleMenuClick}
      />

      {/* ── Mobile: Drawer overlay ───────────────────────────────── */}
      {isMobile && (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          placement="left"
          width={240}
          styles={{
            body: { padding: 0 },
            header: { display: 'none' },
          }}
          rootClassName="lh-sidebar-drawer"
          aria-label="Navigation drawer"
        >
          <Sidebar
            items={sidebarItems}
            activeKey={activeKey}
            collapsed={false}
            onCollapse={() => setMobileOpen(false)}
            onSelect={() => setMobileOpen(false)}
            className="h-full"
          />
        </Drawer>
      )}

      {/* ── Desktop: Fixed left sidebar ──────────────────────────── */}
      {!isMobile && (
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
      )}

      {/* Main content area — offset for fixed header (pt-16) and sidebar (ml-*) */}
      <Layout.Content
        className={cn(
          'pt-16 min-h-screen overflow-y-auto',
          'transition-[margin] duration-200 ease-in-out',
          !isMobile && (collapsed ? 'ml-16' : 'ml-60'),
          className,
        )}
      >
        {children}
      </Layout.Content>
    </Layout>
  );
}
