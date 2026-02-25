import { memo } from 'react';

import { Icon } from '@/forge/primitives/Icon';
import { StatusBadge } from '@/forge/primitives/Badge';
import { Text, Title } from '@/forge/primitives/Typography';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

export type ExerciseStatus = 'locked' | 'available' | 'active' | 'completed';
export type ExerciseType = 'video' | 'exercise' | 'assessment' | 'document' | 'quiz';

export interface Exercise {
  id: string;
  title: string;
  type: ExerciseType;
  duration?: string;
  status: ExerciseStatus;
  description?: string;
  section?: string;
}

export interface ExerciseListProps {
  exercises: Exercise[];
  onSelect?: (id: string) => void;
  activeId?: string;
  className?: string;
}

const typeIconMap: Record<ExerciseType, string> = {
  video: 'Play',
  exercise: 'ClipboardList',
  assessment: 'FileCheck',
  document: 'FileText',
  quiz: 'HelpCircle',
};

function statusToBadge(
  status: ExerciseStatus,
): 'success' | 'processing' | 'default' | 'error' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'active':
      return 'processing';
    case 'available':
      return 'default';
    case 'locked':
      return 'error';
  }
}

const statusLabel: Record<ExerciseStatus, string> = {
  locked: 'Locked',
  available: 'Available',
  active: 'In Progress',
  completed: 'Completed',
};

interface ExerciseItemProps {
  exercise: Exercise;
  isActive: boolean;
  onSelect?: (id: string) => void;
}

const ExerciseItem = memo(function ExerciseItem({ exercise, isActive, onSelect }: ExerciseItemProps) {
  const isLocked = exercise.status === 'locked';
  const iconName = typeIconMap[exercise.type] as Parameters<typeof Icon>[0]['name'];

  return (
    <li
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-xl cursor-pointer',
        'transition-colors duration-150',
        isActive && 'bg-navy-50',
        !isActive && !isLocked && 'hover:bg-surface-tertiary',
        isLocked && 'opacity-50 cursor-not-allowed',
      )}
      onClick={() => !isLocked && onSelect?.(exercise.id)}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      aria-disabled={isLocked}
      aria-current={isActive ? 'step' : undefined}
      onKeyDown={(e) => {
        if (!isLocked && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect?.(exercise.id);
        }
      }}
    >
      {/* Type icon */}
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg mt-0.5',
          isActive ? 'bg-navy' : 'bg-surface-tertiary',
        )}
        aria-hidden="true"
      >
        <Icon
          name={iconName}
          size="sm"
          style={{ color: isActive ? colors.content.inverse : colors.content.secondary }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Text
            size="sm"
            weight={isActive ? 'semibold' : 'medium'}
            color={isActive ? 'primary' : 'secondary'}
            className="truncate"
          >
            {exercise.title}
          </Text>
          <StatusBadge
            status={statusToBadge(exercise.status)}
            text={statusLabel[exercise.status]}
            className="flex-shrink-0 text-xs"
          />
        </div>
        {exercise.description && (
          <Text size="xs" color="tertiary" className="mt-0.5 line-clamp-1">
            {exercise.description}
          </Text>
        )}
        {exercise.duration && (
          <div className="flex items-center gap-1 mt-1">
            <Icon name="Clock" size={12} style={{ color: colors.content.tertiary }} />
            <Text size="xs" color="tertiary">
              {exercise.duration}
            </Text>
          </div>
        )}
      </div>
    </li>
  );
});

function groupBySection(exercises: Exercise[]): Map<string | undefined, Exercise[]> {
  const map = new Map<string | undefined, Exercise[]>();
  for (const ex of exercises) {
    const key = ex.section;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ex);
  }
  return map;
}

export function ExerciseList({ exercises, onSelect, activeId, className }: ExerciseListProps) {
  const grouped = groupBySection(exercises);
  const hasGroups = grouped.size > 1 || (grouped.size === 1 && grouped.keys().next().value);

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {Array.from(grouped.entries()).map(([section, items]) => (
        <div key={section ?? '__default__'}>
          {hasGroups && section && (
            <div className="px-4 pt-4 pb-1">
              <Title level={4} className="!text-content-tertiary !text-xs !font-semibold uppercase tracking-wide !mb-0">
                {section}
              </Title>
            </div>
          )}
          <ul className="space-y-0.5 list-none p-0 m-0">
            {items.map((ex) => (
              <ExerciseItem
                key={ex.id}
                exercise={ex}
                isActive={ex.id === activeId}
                onSelect={onSelect}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
