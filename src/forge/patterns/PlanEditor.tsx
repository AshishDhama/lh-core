import { useState } from 'react';
import { Checkbox } from 'antd';

import { Button } from '@/forge/primitives/Button';
import { Icon } from '@/forge/primitives/Icon';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Tag } from '@/forge/primitives/Tag';
import type { TagProps } from '@/forge/primitives/Tag';
import { Text, Title } from '@/forge/primitives/Typography';
import { SkillCard } from '@/forge/composites/SkillCard';
import type { SkillCardProps } from '@/forge/composites/SkillCard';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  skills: SkillCardProps[];
  milestones: Milestone[];
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface PlanEditorProps {
  goals: Goal[];
  onGoalUpdate?: (goalId: string, updates: Partial<Goal>) => void;
  onAddGoal?: () => void;
  onDeleteGoal?: (goalId: string) => void;
  className?: string;
}

const statusConfig: Record<
  Goal['status'],
  { label: string; color: TagProps['color'] }
> = {
  not_started: { label: 'Not Started', color: 'default' },
  in_progress: { label: 'In Progress', color: 'navy' },
  completed: { label: 'Completed', color: 'teal' },
};

interface GoalCardProps {
  goal: Goal;
  onGoalUpdate?: PlanEditorProps['onGoalUpdate'];
  onDeleteGoal?: PlanEditorProps['onDeleteGoal'];
}

function GoalCard({ goal, onGoalUpdate, onDeleteGoal }: GoalCardProps) {
  const [expanded, setExpanded] = useState(true);
  const { label: statusLabel, color: statusColor } = statusConfig[goal.status];

  function toggleMilestone(milestoneId: string, checked: boolean) {
    const updated = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: checked } : m,
    );
    const completedCount = updated.filter((m) => m.completed).length;
    const newProgress =
      updated.length > 0 ? Math.round((completedCount / updated.length) * 100) : 0;
    onGoalUpdate?.(goal.id, {
      milestones: updated,
      progress: newProgress,
      status:
        newProgress === 100
          ? 'completed'
          : newProgress > 0
            ? 'in_progress'
            : 'not_started',
    });
  }

  return (
    <div className="flex flex-col gap-0 rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden">
      {/* Goal header */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-[#fafbfc] transition-colors"
        onClick={() => setExpanded((e) => !e)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded((prev) => !prev);
          }
        }}
        aria-expanded={expanded}
      >
        <Icon
          name={expanded ? 'ChevronDown' : 'ChevronRight'}
          size="sm"
          style={{ color: colors.content.tertiary }}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Text size="sm" weight="semibold" color="primary" className="truncate">
              {goal.title}
            </Text>
            <Tag color={statusColor}>{statusLabel}</Tag>
          </div>
          <div className="mt-1.5">
            <ProgressBar
              percent={goal.progress}
              status={goal.status === 'completed' ? 'success' : 'normal'}
              showInfo={false}
              size="sm"
            />
          </div>
        </div>
        <Text size="xs" color="tertiary" className="flex-shrink-0">
          {goal.progress}%
        </Text>
        {onDeleteGoal && (
          <button
            type="button"
            className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#fee2e2] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteGoal(goal.id);
            }}
            aria-label={`Delete goal: ${goal.title}`}
          >
            <Icon name="Trash2" size="sm" style={{ color: colors.error.DEFAULT }} />
          </button>
        )}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="flex flex-col gap-5 px-5 pb-5 border-t border-[#f1f5f9]">
          {/* Skills */}
          {goal.skills.length > 0 && (
            <div className="flex flex-col gap-2 pt-4">
              <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-wide">
                Skills
              </Text>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {goal.skills.map((skill, i) => (
                  <SkillCard key={i} {...skill} />
                ))}
              </div>
            </div>
          )}

          {/* Milestones */}
          {goal.milestones.length > 0 && (
            <div className="flex flex-col gap-2">
              <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-wide">
                Milestones
              </Text>
              <div className="flex flex-col gap-1.5">
                {goal.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={milestone.completed}
                      onChange={(e) => toggleMilestone(milestone.id, e.target.checked)}
                    >
                      <Text
                        size="sm"
                        color={milestone.completed ? 'tertiary' : 'primary'}
                        className={milestone.completed ? 'line-through' : ''}
                      >
                        {milestone.title}
                      </Text>
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PlanEditor({ goals, onGoalUpdate, onAddGoal, onDeleteGoal, className }: PlanEditorProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Title level={3} className="!mb-0">
          Development Plan
        </Title>
        {onAddGoal && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Icon name="Plus" size="sm" />}
            onClick={onAddGoal}
          >
            Add Goal
          </Button>
        )}
      </div>

      {/* Goals */}
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center rounded-2xl border border-dashed border-[#e2e8f0]">
          <Icon name="Target" size="lg" style={{ color: colors.content.tertiary }} />
          <Text size="sm" color="tertiary">
            No goals yet. Add a development goal to get started.
          </Text>
          {onAddGoal && (
            <Button variant="secondary" size="sm" onClick={onAddGoal}>
              Add First Goal
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onGoalUpdate={onGoalUpdate}
              onDeleteGoal={onDeleteGoal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
