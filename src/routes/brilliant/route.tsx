import { createFileRoute, Outlet, Link, useMatches } from '@tanstack/react-router';

import { cn } from '@/forge/utils';
import { BrilliantHeader } from '@/forge/patterns/BrilliantHeader';
import { Text } from '@/forge/primitives/Typography';

export const Route = createFileRoute('/brilliant')({
  component: BrilliantLayout,
});

const HOME_TABS = [
  { label: 'Calm', to: '/brilliant' },
  { label: 'Dashboard', to: '/brilliant/dashboard' },
  { label: 'Journey', to: '/brilliant/journey' },
] as const;

const PROGRAMMES_TABS = [
  { label: 'Grid', to: '/brilliant/programmes' },
  { label: 'Detail', to: '/brilliant/programmes/detail' },
  { label: 'Kanban', to: '/brilliant/programmes/kanban' },
  { label: 'Timeline', to: '/brilliant/programmes/timeline' },
  { label: 'Table', to: '/brilliant/programmes/table' },
  { label: 'Magazine', to: '/brilliant/programmes/magazine' },
] as const;

function BrilliantLayout() {
  const matches = useMatches();
  const currentPath = (matches[matches.length - 1]?.fullPath ?? '/brilliant/') as string;
  const isProgrammes = currentPath.includes('/programmes');
  const tabs = isProgrammes ? PROGRAMMES_TABS : HOME_TABS;

  const activeHeaderTab = isProgrammes ? 'courses' : 'home';

  return (
    <div className="min-h-screen bg-surface-primary">
      <BrilliantHeader activeTab={activeHeaderTab} userName="Priya Sharma" />

      {/* Design switcher nav */}
      <nav className="w-full border-b border-border-subtle bg-surface-card/80 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-2 h-11">
          <Text size="xs" weight="medium" color="tertiary" className="mr-2">
            Design:
          </Text>
          {tabs.map((tab) => {
            const isActive =
              tab.to === '/brilliant'
                ? currentPath === '/brilliant/' || currentPath === '/brilliant'
                : tab.to === '/brilliant/programmes'
                  ? currentPath === '/brilliant/programmes/' || currentPath === '/brilliant/programmes'
                  : currentPath.startsWith(tab.to);

            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold no-underline transition-colors duration-fast',
                  isActive
                    ? 'bg-subject-code text-white'
                    : 'text-content-secondary hover:text-content-primary hover:bg-surface-tertiary',
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <Outlet />
    </div>
  );
}
