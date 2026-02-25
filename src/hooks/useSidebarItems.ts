import type { SidebarItem } from '@/forge';
import { useTranslation } from '@/i18n';
import { useThemeStore } from '@/stores/useThemeStore';

/**
 * Returns sidebar navigation items with reactive i18n labels.
 * Re-renders when the locale changes so labels always match the active language.
 */
export function useSidebarItems(): SidebarItem[] {
  const locale = useThemeStore((s) => s.locale);
  const { t } = useTranslation(locale);

  return [
    { key: 'dashboard', label: t('nav.dashboard'), icon: 'LayoutDashboard', path: '/' },
    { key: 'programs', label: t('nav.programs'), icon: 'BookOpen', path: '/programs' },
    { key: 'development', label: t('nav.development'), icon: 'Target', path: '/development' },
    { key: 'scheduling', label: t('nav.scheduling'), icon: 'CalendarDays', path: '/scheduling' },
    { key: 'insights', label: t('nav.insights'), icon: 'ChartBar', path: '/insights' },
  ];
}
