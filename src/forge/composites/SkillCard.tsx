import { Progress } from 'antd';

import { Text } from '@/forge/primitives';
import { cn } from '@/forge/utils';

type SkillLevel = 1 | 2 | 3 | 4 | 5;
type SkillLevelLabel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface SkillCardProps {
  name: string;
  level: SkillLevel | SkillLevelLabel;
  category?: string;
  progress?: number;
  targetLevel?: SkillLevel | SkillLevelLabel;
  icon?: React.ReactNode;
  className?: string;
}

const levelToNumber: Record<SkillLevelLabel, SkillLevel> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

const numberToLabel: Record<SkillLevel, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
  5: 'Master',
};

const levelColors: Record<SkillLevel, string> = {
  1: 'var(--lh-content-tertiary)',
  2: 'var(--color-navy-400)',
  3: 'var(--color-teal)',
  4: 'var(--color-purple)',
  5: 'var(--color-navy-400)',
};

function resolveLevel(level: SkillLevel | SkillLevelLabel): SkillLevel {
  if (typeof level === 'number') return level;
  return levelToNumber[level] ?? 1;
}

function levelToPercent(level: SkillLevel): number {
  return (level / 5) * 100;
}

export function SkillCard({
  name,
  level,
  category,
  progress,
  targetLevel,
  icon,
  className,
}: SkillCardProps) {
  const currentLevel = resolveLevel(level);
  const target = targetLevel !== undefined ? resolveLevel(targetLevel) : undefined;
  const displayProgress = progress ?? levelToPercent(currentLevel);
  const targetProgress = target !== undefined ? levelToPercent(target) : undefined;
  const strokeColor = levelColors[currentLevel];

  const hasGap = target !== undefined && target > currentLevel;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-border bg-surface-primary p-4 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {icon && (
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${strokeColor}18` }}
            >
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <Text size="sm" weight="semibold" color="primary" className="leading-snug">
              {name}
            </Text>
            {category && (
              <Text size="xs" color="tertiary" className="mt-0.5">
                {category}
              </Text>
            )}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span
            className="text-xs font-semibold leading-snug"
            style={{ color: strokeColor }}
          >
            {numberToLabel[currentLevel]}
          </span>
          {target !== undefined && (
            <Text size="xs" color="tertiary" className="mt-0.5 block">
              → {numberToLabel[target]}
            </Text>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Progress
          percent={displayProgress}
          showInfo={false}
          strokeColor={strokeColor}
          trailColor="var(--lh-surface-tertiary)"
          size="small"
        />

        {hasGap && targetProgress !== undefined && (
          <div className="flex items-center justify-between">
            <Text size="xs" color="tertiary">
              Current: {numberToLabel[currentLevel]}
            </Text>
            <Text size="xs" color="tertiary">
              Target: {numberToLabel[target!]}
            </Text>
          </div>
        )}

        <div className="flex justify-between">
          {([1, 2, 3, 4, 5] as SkillLevel[]).map((lvl) => (
            <div
              key={lvl}
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: lvl <= currentLevel ? strokeColor : 'var(--lh-border)',
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
