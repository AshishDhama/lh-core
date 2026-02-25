import { StatusBadge } from '@/forge/primitives/Badge';
import { Icon } from '@/forge/primitives/Icon';
import { Text, Title } from '@/forge/primitives/Typography';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

export type CenterStatus = 'active' | 'inactive' | 'full' | 'upcoming';

export interface CenterItem {
  id: string;
  name: string;
  address?: string;
  capacity?: number;
  currentOccupancy?: number;
  status: CenterStatus;
  tags?: string[];
}

export interface CenterGridProps {
  items: CenterItem[];
  /** Number of columns: 1–4. Defaults to 3 */
  columns?: 1 | 2 | 3 | 4;
  onSelect?: (id: string) => void;
  selectedId?: string;
  className?: string;
}

const statusBadgeMap: Record<
  CenterStatus,
  'success' | 'processing' | 'error' | 'default' | 'warning'
> = {
  active: 'success',
  upcoming: 'processing',
  full: 'error',
  inactive: 'default',
};

const statusLabel: Record<CenterStatus, string> = {
  active: 'Active',
  upcoming: 'Upcoming',
  full: 'Full',
  inactive: 'Inactive',
};

const columnClasses: Record<1 | 2 | 3 | 4, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

interface CenterCardProps {
  item: CenterItem;
  isSelected: boolean;
  onSelect?: (id: string) => void;
}

function CenterCard({ item, isSelected, onSelect }: CenterCardProps) {
  const occupancyPercent =
    item.capacity && item.currentOccupancy != null
      ? Math.round((item.currentOccupancy / item.capacity) * 100)
      : null;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-5 rounded-xl border cursor-pointer',
        'transition-all duration-150',
        isSelected
          ? 'border-navy dark:border-navy-400 bg-navy-50 dark:bg-navy-900/20 shadow-md'
          : 'border-border bg-surface-primary hover:border-navy-200 hover:shadow-sm',
        item.status === 'inactive' && 'opacity-60',
      )}
      onClick={() => onSelect?.(item.id)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(item.id);
        }
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              'flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg',
              isSelected ? 'bg-navy dark:bg-navy-400' : 'bg-navy-50 dark:bg-navy-900/20',
            )}
            aria-hidden="true"
          >
            <Icon
              name="Building2"
              size="sm"
              style={{ color: isSelected ? colors.content.inverse : colors.navy.DEFAULT }}
            />
          </div>
          <Title
            level={4}
            className={cn(
              '!text-sm !font-semibold !mb-0 truncate',
              isSelected ? '!text-navy dark:!text-navy-200' : '!text-content-primary',
            )}
          >
            {item.name}
          </Title>
        </div>
        <StatusBadge
          status={statusBadgeMap[item.status]}
          text={statusLabel[item.status]}
          className="flex-shrink-0"
        />
      </div>

      {/* Address */}
      {item.address && (
        <div className="flex items-start gap-1.5">
          <Icon name="MapPin" size={13} style={{ color: colors.content.tertiary }} />
          <Text size="xs" color="tertiary" className="leading-snug">
            {item.address}
          </Text>
        </div>
      )}

      {/* Capacity */}
      {item.capacity != null && (
        <div className="flex items-center gap-1.5">
          <Icon name="Users" size={13} style={{ color: colors.content.tertiary }} />
          <Text size="xs" color="secondary">
            {item.currentOccupancy != null
              ? `${item.currentOccupancy} / ${item.capacity}`
              : `Capacity: ${item.capacity}`}
            {occupancyPercent != null && (
              <span
                className={cn(
                  'ml-1',
                  occupancyPercent >= 90
                    ? 'text-error'
                    : occupancyPercent >= 70
                      ? 'text-warning'
                      : 'text-success',
                )}
              >
                ({occupancyPercent}%)
              </span>
            )}
          </Text>
        </div>
      )}
    </div>
  );
}

export function CenterGrid({
  items,
  columns = 3,
  onSelect,
  selectedId,
  className,
}: CenterGridProps) {
  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)}>
      {items.map((item) => (
        <CenterCard
          key={item.id}
          item={item}
          isSelected={item.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
