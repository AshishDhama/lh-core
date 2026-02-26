import { createFileRoute } from '@tanstack/react-router';

import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Illustration } from '@/forge/primitives/Illustration';
import { Icon } from '@/forge/primitives/Icon';
import { Button } from '@/forge/primitives/Button';
import { programList } from '@/data/programs';

import type { Program, Exercise } from '@/types/program';
import type { ItemStatus } from '@/types/common';
import type { IconName } from '@/forge/primitives/Icon';

export const Route = createFileRoute('/brilliant/programmes/timeline')({
  component: TimelineProgrammesPage,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ExerciseKind = 'sequential' | 'open';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function overallProgress(programs: Program[]): number {
  if (programs.length === 0) return 0;
  return Math.round(programs.reduce((s, p) => s + p.pct, 0) / programs.length);
}

function allExerciseCount(programs: Program[]): { complete: number; total: number } {
  let total = 0;
  let complete = 0;
  for (const p of programs) {
    for (const ex of [...p.seqExercises, ...p.openExercises]) {
      total++;
      if (ex.status === 'complete') complete++;
    }
  }
  return { complete, total };
}

function nearestDeadline(programs: Program[]): Program | undefined {
  return [...programs].sort((a, b) => a.daysLeft - b.daysLeft)[0];
}

// ---------------------------------------------------------------------------
// Status configuration
// ---------------------------------------------------------------------------

type StatusConfig = {
  label: string;
  icon: IconName;
  nodeClass: string;
  lineClass: string;
  chipClass: string;
  textColor: 'primary' | 'secondary' | 'tertiary' | 'success' | 'error';
};

const STATUS_CONFIG: Record<ItemStatus, StatusConfig> = {
  complete: {
    label: 'Complete',
    icon: 'CircleCheckBig',
    nodeClass: 'bg-success-light border-2 border-success-dark/30 text-success-dark',
    lineClass: 'bg-success-dark/30',
    chipClass: 'bg-success-light text-success-dark',
    textColor: 'success',
  },
  progress: {
    label: 'In Progress',
    icon: 'CircleDot',
    nodeClass: 'bg-subject-code-light border-2 border-subject-code/50 text-subject-code-dark',
    lineClass: 'bg-subject-code/40',
    chipClass: 'bg-subject-code-light text-subject-code-dark',
    textColor: 'primary',
  },
  notstarted: {
    label: 'Not Started',
    icon: 'Circle',
    nodeClass: 'bg-surface-card border-2 border-border-muted text-content-tertiary',
    lineClass: 'bg-border-subtle',
    chipClass: 'bg-surface-tertiary text-content-tertiary',
    textColor: 'secondary',
  },
  locked: {
    label: 'Locked',
    icon: 'Lock',
    nodeClass: 'bg-surface-tertiary border-2 border-border-subtle text-content-tertiary',
    lineClass: 'bg-border-subtle',
    chipClass: 'bg-surface-tertiary text-content-tertiary',
    textColor: 'tertiary',
  },
};

// ---------------------------------------------------------------------------
// Overall progress banner
// ---------------------------------------------------------------------------

interface OverallProgressBannerProps {
  programs: Program[];
}

function OverallProgressBanner({ programs }: OverallProgressBannerProps) {
  const overall = overallProgress(programs);
  const { complete, total } = allExerciseCount(programs);
  const nearest = nearestDeadline(programs);
  const isUrgent = nearest && nearest.daysLeft <= 7;
  const completedProgrammes = programs.filter((p) => p.status === 'complete').length;
  const inProgressProgrammes = programs.filter((p) => p.status === 'progress').length;

  return (
    <div className="rounded-4xl bg-surface-card border border-border-subtle shadow-soft overflow-hidden mb-10">
      {/* Top gradient strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-subject-code via-subject-code-dark to-success-dark" />

      <div className="px-7 py-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
          <div>
            <Overline className="block mb-1.5">Your Learning Journey</Overline>
            <Title level={2} weight="bold" color="primary" className="!mb-1">
              Programmes &amp; Exercises
            </Title>
            <Text size="sm" color="secondary">
              {completedProgrammes} of {programs.length} programmes complete
              {inProgressProgrammes > 0 && (
                <> · <Text size="sm" weight="semibold" color="primary">{inProgressProgrammes} in progress</Text></>
              )}
            </Text>
          </div>

          {/* Circle progress */}
          <div className="flex items-center gap-4 shrink-0">
            <ProgressBar
              percent={overall}
              type="circle"
              size="md"
              strokeColor="#8B5CF6"
              showInfo
              format={(pct) => (
                <span className="text-sm font-bold text-content-primary">{pct}%</span>
              )}
            />
            <div>
              <Text size="sm" weight="semibold" color="primary" className="block">
                {complete} / {total}
              </Text>
              <Text size="xs" color="tertiary" className="block">
                exercises done
              </Text>
            </div>
          </div>
        </div>

        {/* Stat pills row */}
        <div className="flex flex-wrap gap-3">
          {/* Exercises pill */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-tertiary">
            <Icon name="ListChecks" size="sm" className="text-content-tertiary" />
            <div>
              <Text size="xs" color="tertiary" className="block leading-none mb-0.5">
                Exercises
              </Text>
              <Text size="sm" weight="bold" color="primary" className="block leading-none">
                {complete} / {total} done
              </Text>
            </div>
          </div>

          {/* Overall progress pill */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-subject-code-light">
            <Icon name="TrendingUp" size="sm" className="text-subject-code-dark" />
            <div>
              <Text size="xs" className="block leading-none mb-0.5 text-subject-code-dark">
                Overall
              </Text>
              <Text size="sm" weight="bold" className="block leading-none text-subject-code-dark">
                {overall}% complete
              </Text>
            </div>
          </div>

          {/* Next deadline pill */}
          {nearest && (
            <div
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-2xl',
                isUrgent ? 'bg-error-light' : 'bg-surface-tertiary',
              )}
            >
              <Icon
                name="Calendar"
                size="sm"
                className={isUrgent ? 'text-error-dark' : 'text-content-tertiary'}
              />
              <div>
                <Text
                  size="xs"
                  className={cn(
                    'block leading-none mb-0.5',
                    isUrgent ? 'text-error-dark' : 'text-content-tertiary',
                  )}
                >
                  Next deadline
                </Text>
                <Text
                  size="sm"
                  weight="bold"
                  className={cn(
                    'block leading-none',
                    isUrgent ? 'text-error-dark' : 'text-content-primary',
                  )}
                >
                  {nearest.due} · {nearest.daysLeft}d
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Timeline connector line
// ---------------------------------------------------------------------------

interface ConnectorLineProps {
  status: ItemStatus;
  dashed?: boolean;
  short?: boolean;
}

function ConnectorLine({ status, dashed = false, short = false }: ConnectorLineProps) {
  const isComplete = status === 'complete';
  const isProgress = status === 'progress';

  return (
    <div
      className={cn(
        'w-0.5 mx-auto',
        short ? 'h-5' : 'h-8',
        dashed ? 'border-l-2 border-dashed border-border-muted bg-transparent w-0' : '',
        !dashed && isComplete && 'bg-success-dark/30',
        !dashed && isProgress && 'bg-subject-code/40',
        !dashed && status === 'notstarted' && 'bg-border-subtle',
        !dashed && status === 'locked' && 'bg-border-subtle opacity-50',
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Programme milestone node (large node on the spine)
// ---------------------------------------------------------------------------

interface ProgrammeMilestoneProps {
  program: Program;
  programIndex: number;
  isLast: boolean;
}

function ProgrammeMilestone({ program, programIndex }: ProgrammeMilestoneProps) {
  const config = STATUS_CONFIG[program.status];
  const isComplete = program.status === 'complete';
  const isProgress = program.status === 'progress';
  const isUrgent = program.daysLeft <= 7;
  const totalExercises = program.seqExercises.length + program.openExercises.length;
  const completedExercises = [...program.seqExercises, ...program.openExercises].filter(
    (e) => e.status === 'complete',
  ).length;

  return (
    <div className="relative flex flex-col items-center">
      {/* The milestone node */}
      <div className="relative flex items-center w-full gap-4">
        {/* Left: programme number */}
        <div className="w-16 shrink-0 flex justify-end">
          <span
            className={cn(
              'text-xs font-bold tabular-nums leading-none px-2 py-1 rounded-full',
              isComplete
                ? 'bg-success-light text-success-dark'
                : isProgress
                  ? 'bg-subject-code-light text-subject-code-dark'
                  : 'bg-surface-tertiary text-content-tertiary',
            )}
          >
            P{programIndex + 1}
          </span>
        </div>

        {/* Center spine dot — large milestone */}
        <div className="flex flex-col items-center shrink-0 z-10">
          <div
            className={cn(
              'w-11 h-11 rounded-full flex items-center justify-center shadow-soft',
              'transition-all duration-moderate',
              isComplete && 'bg-success-light border-2 border-success-dark/40',
              isProgress && 'bg-subject-code-light border-2 border-subject-code/50 ring-4 ring-subject-code/10',
              !isComplete && !isProgress && 'bg-surface-card border-2 border-border-muted',
            )}
          >
            {isComplete && <Icon name="CircleCheckBig" size="lg" className="text-success-dark" />}
            {isProgress && (
              <ProgressBar
                percent={program.pct}
                type="circle"
                size="xs"
                strokeColor={program.accent}
                showInfo
                format={(pct) => (
                  <span style={{ fontSize: 8, fontWeight: 700, color: program.accent }}>{pct}</span>
                )}
              />
            )}
            {!isComplete && !isProgress && (
              <Icon name="MapPin" size="md" className="text-content-tertiary" />
            )}
          </div>
        </div>

        {/* Right: programme card */}
        <div
          className={cn(
            'flex-1 min-w-0 rounded-3xl border shadow-soft overflow-hidden',
            'transition-all duration-moderate',
            isProgress && 'shadow-hover-card',
            isComplete ? 'bg-surface-card border-border-subtle' : 'bg-surface-warm border-border-subtle',
          )}
          style={{
            borderLeftWidth: 3,
            borderLeftColor: program.accent,
          }}
        >
          <div className="px-5 py-5">
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Title level={4} weight="bold" color="primary" className="!mb-0 !text-base">
                    {program.name}
                  </Title>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0',
                      config.chipClass,
                    )}
                  >
                    <Icon name={config.icon} size={10} />
                    {config.label}
                  </span>
                </div>
                <Text size="xs" color="secondary" className="block leading-relaxed line-clamp-2">
                  {program.desc}
                </Text>
              </div>

              {/* Meta cluster */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="flex items-center gap-1">
                  <Icon
                    name="Calendar"
                    size={12}
                    className={isUrgent ? 'text-error-dark' : 'text-content-tertiary'}
                  />
                  <Text
                    size="xs"
                    weight="semibold"
                    color={isUrgent ? 'error' : 'tertiary'}
                  >
                    {program.due}
                  </Text>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none',
                      isUrgent
                        ? 'bg-error-light text-error-dark'
                        : 'bg-surface-tertiary text-content-tertiary',
                    )}
                  >
                    {program.daysLeft}d
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Layers" size={12} className="text-content-tertiary" />
                  <Text size="xs" color="tertiary">
                    {completedExercises}/{totalExercises} exercises
                  </Text>
                </div>
              </div>
            </div>

            {/* Progress bar row */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <ProgressBar
                  percent={program.pct}
                  type="line"
                  size="xs"
                  strokeColor={program.accent}
                  showInfo={false}
                />
              </div>
              <Text size="xs" weight="bold" color="primary" className="w-8 text-right shrink-0">
                {program.pct}%
              </Text>
              {isProgress && (
                <Button variant="primary" size="sm" subjectColor="code" className="!rounded-full shrink-0 !text-xs !h-7 !px-3">
                  Continue
                </Button>
              )}
              {isComplete && (
                <Button variant="secondary" size="sm" className="!rounded-full shrink-0 !text-xs !h-7 !px-3">
                  Report
                </Button>
              )}
              {program.status === 'notstarted' && (
                <Button variant="secondary" size="sm" className="!rounded-full shrink-0 !text-xs !h-7 !px-3">
                  Start
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom connector — leads into exercises */}
      {totalExercises > 0 && (
        <ConnectorLine status={program.status} short />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exercise timeline node
// ---------------------------------------------------------------------------

interface ExerciseNodeProps {
  exercise: Exercise;
  kind: ExerciseKind;
  index: number; // 1-based for sequential
  isLast: boolean;
  programAccent: string;
  programStatus: ItemStatus;
}

function ExerciseNode({ exercise, kind, index, isLast, programAccent }: ExerciseNodeProps) {
  const isComplete = exercise.status === 'complete';
  const isProgress = exercise.status === 'progress';
  const isLocked = exercise.status === 'locked';
  const isNotStarted = exercise.status === 'notstarted';

  return (
    <div className="relative flex flex-col items-center">
      {/* Node row */}
      <div className="relative flex items-center w-full gap-4">
        {/* Left: step indicator / open marker */}
        <div className="w-16 shrink-0 flex justify-end">
          {kind === 'sequential' ? (
            <span
              className={cn(
                'text-[10px] font-bold tabular-nums w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                isComplete
                  ? 'bg-success-light text-success-dark'
                  : isProgress
                    ? 'text-white'
                    : 'bg-surface-tertiary text-content-tertiary',
              )}
              style={
                isProgress
                  ? { backgroundColor: programAccent }
                  : undefined
              }
            >
              {index}
            </span>
          ) : (
            <div
              className={cn(
                'w-2 h-2 rounded-full shrink-0 mt-1',
                isComplete ? 'bg-success-dark/40' : 'bg-border-muted',
              )}
            />
          )}
        </div>

        {/* Center spine dot — small exercise node */}
        <div className="flex flex-col items-center shrink-0 z-10">
          <div
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-moderate',
              isComplete && 'bg-success-light border-2 border-success-dark/30',
              isProgress && 'bg-subject-code-light border-2 border-subject-code/50 ring-2 ring-subject-code/10',
              isNotStarted && 'bg-surface-card border-2 border-border-muted',
              isLocked && 'bg-surface-tertiary border-2 border-border-subtle opacity-60',
            )}
          >
            {isComplete && <Icon name="CircleCheck" size={14} className="text-success-dark" />}
            {isProgress && <Icon name="Play" size={12} className="text-subject-code-dark" />}
            {isNotStarted && <Icon name="Circle" size={12} className="text-content-tertiary" />}
            {isLocked && <Icon name="Lock" size={12} className="text-content-tertiary" />}
          </div>
        </div>

        {/* Right: exercise card */}
        <div
          className={cn(
            'flex-1 min-w-0 rounded-2xl border transition-all duration-moderate',
            isLocked && 'opacity-60',
            isComplete && 'bg-surface-card border-border-subtle',
            isProgress && 'bg-surface-card border-subject-code/20 shadow-soft',
            isNotStarted && 'bg-surface-card border-border-subtle hover:shadow-soft cursor-pointer',
            isLocked && 'bg-surface-tertiary border-border-subtle cursor-not-allowed',
          )}
        >
          <div className="flex items-center gap-3 p-4">
            {/* Illustration */}
            {exercise.illustration && (
              <div
                className={cn(
                  'shrink-0 rounded-xl overflow-hidden',
                  isLocked && 'grayscale opacity-50',
                  isComplete && 'opacity-70',
                )}
              >
                <Illustration name={exercise.illustration} size="sm" />
              </div>
            )}

            {/* Body */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <Text
                  size="sm"
                  weight="semibold"
                  color={isLocked ? 'tertiary' : isComplete ? 'secondary' : 'primary'}
                  className="block leading-snug"
                >
                  {exercise.name}
                </Text>

                {/* Kind badge */}
                {kind === 'open' && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-surface-tertiary text-[9px] font-semibold text-content-tertiary uppercase tracking-wide shrink-0">
                    <Icon name="Shuffle" size={8} />
                    open
                  </span>
                )}

                {/* Proctored badge */}
                {exercise.proctored && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-warning-light text-[9px] font-semibold text-warning-dark uppercase tracking-wide shrink-0">
                    <Icon name="ShieldCheck" size={8} />
                    proctored
                  </span>
                )}
              </div>

              <Text size="xs" color="tertiary" className="block leading-relaxed line-clamp-1">
                {exercise.desc}
              </Text>

              {/* Bottom meta */}
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <div className="flex items-center gap-1">
                  <Icon name="Clock" size={11} className="text-content-tertiary" />
                  <Text size="xs" color="tertiary">
                    {exercise.time}
                  </Text>
                </div>

                {isProgress && exercise.pct > 0 && (
                  <div className="flex items-center gap-2 flex-1 min-w-[80px]">
                    <div className="flex-1">
                      <ProgressBar
                        percent={exercise.pct}
                        type="line"
                        size="xs"
                        strokeColor={programAccent}
                        showInfo={false}
                      />
                    </div>
                    <Text size="xs" weight="bold" color="primary" className="shrink-0">
                      {exercise.pct}%
                    </Text>
                  </div>
                )}
              </div>
            </div>

            {/* Right action/status */}
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              {isComplete && exercise.hasReport && (
                <Button variant="ghost" size="sm" className="!text-xs !h-7 !px-2.5">
                  Report
                </Button>
              )}
              {isProgress && (
                <Button variant="primary" size="sm" subjectColor="code" className="!rounded-full !text-xs !h-7 !px-3">
                  Continue
                </Button>
              )}
              {isNotStarted && (
                <Button variant="secondary" size="sm" className="!rounded-full !text-xs !h-7 !px-3">
                  Start
                </Button>
              )}
              {isLocked && (
                <Icon name="Lock" size="sm" className="text-content-tertiary mt-1" />
              )}
            </div>
          </div>

          {/* Completion stripe at bottom for complete items */}
          {isComplete && (
            <div className="h-0.5 w-full bg-success-dark/20 rounded-b-2xl" />
          )}

          {/* Progress stripe at bottom for in-progress items */}
          {isProgress && (
            <div className="h-0.5 w-full rounded-b-2xl overflow-hidden bg-border-subtle">
              <div
                className="h-full rounded-b-2xl transition-all duration-moderate"
                style={{ width: `${exercise.pct}%`, backgroundColor: programAccent }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom connector to next node */}
      {!isLast && (
        <ConnectorLine
          status={exercise.status}
          dashed={exercise.status === 'locked' || exercise.status === 'notstarted'}
          short
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section label (sequential / open divider)
// ---------------------------------------------------------------------------

interface SectionLabelProps {
  icon: IconName;
  label: string;
  kind: 'sequential' | 'open';
}

function SectionLabel({ icon, label, kind }: SectionLabelProps) {
  return (
    <div className="relative flex items-center w-full gap-4 my-1">
      {/* Left spacer aligns with step number column */}
      <div className="w-16 shrink-0" />

      {/* Spine alignment spacer */}
      <div className="w-7 shrink-0" />

      {/* Label */}
      <div
        className={cn(
          'flex items-center gap-1.5 px-3 py-1 rounded-full border',
          kind === 'sequential'
            ? 'bg-subject-code-light border-subject-code/20'
            : 'bg-surface-tertiary border-border-muted',
        )}
      >
        <Icon
          name={icon}
          size={11}
          className={kind === 'sequential' ? 'text-subject-code-dark' : 'text-content-tertiary'}
        />
        <Overline
          color="tertiary"
          className={cn(
            '!text-[10px]',
            kind === 'sequential' && '!text-subject-code-dark',
          )}
        >
          {label}
        </Overline>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Programme block — milestone + exercises
// ---------------------------------------------------------------------------

interface ProgrammeBlockProps {
  program: Program;
  programIndex: number;
  isLastProgram: boolean;
}

function ProgrammeBlock({ program, programIndex, isLastProgram }: ProgrammeBlockProps) {
  const hasSeq = program.seqExercises.length > 0;
  const hasOpen = program.openExercises.length > 0;
  return (
    <div className="flex flex-col items-center">
      {/* Programme milestone node */}
      <ProgrammeMilestone
        program={program}
        programIndex={programIndex}
        isLast={!hasSeq && !hasOpen && isLastProgram}
      />

      {/* Sequential exercises */}
      {hasSeq && (
        <>
          <SectionLabel
            icon="ArrowRight"
            label="Sequential — complete in order"
            kind="sequential"
          />
          <ConnectorLine status={program.status} short />
          {program.seqExercises.map((ex, i) => (
            <ExerciseNode
              key={ex.id}
              exercise={ex}
              kind="sequential"
              index={i + 1}
              isLast={i === program.seqExercises.length - 1 && !hasOpen}
              programAccent={program.accent}
              programStatus={program.status}
            />
          ))}
        </>
      )}

      {/* Open exercises */}
      {hasOpen && (
        <>
          <SectionLabel
            icon="Shuffle"
            label="Open — complete anytime"
            kind="open"
          />
          <ConnectorLine status={program.status} dashed short />
          {program.openExercises.map((ex, i) => (
            <ExerciseNode
              key={ex.id}
              exercise={ex}
              kind="open"
              index={i + 1}
              isLast={i === program.openExercises.length - 1}
              programAccent={program.accent}
              programStatus={program.status}
            />
          ))}
        </>
      )}

      {/* Inter-programme connector */}
      {!isLastProgram && (
        <div className="flex flex-col items-center gap-1 my-4">
          {/* Decorative "next programme" separator */}
          <div className="relative flex items-center w-full gap-4">
            <div className="w-16 shrink-0" />
            <div className="w-7 shrink-0 flex flex-col items-center gap-1">
              <div className="w-0.5 h-4 bg-border-subtle" />
              <div className="w-2 h-2 rounded-full border-2 border-border-muted bg-surface-card" />
              <div className="w-0.5 h-4 bg-border-subtle" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-card border border-border-subtle shadow-soft">
              <Icon name="ChevronsDown" size={11} className="text-content-tertiary" />
              <Text size="xs" color="tertiary">
                Next programme
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Legend
// ---------------------------------------------------------------------------

function TimelineLegend() {
  const items: { label: string; element: React.ReactNode }[] = [
    {
      label: 'Complete',
      element: (
        <div className="w-5 h-5 rounded-full bg-success-light border-2 border-success-dark/30 flex items-center justify-center">
          <Icon name="CircleCheck" size={11} className="text-success-dark" />
        </div>
      ),
    },
    {
      label: 'In Progress',
      element: (
        <div className="w-5 h-5 rounded-full bg-subject-code-light border-2 border-subject-code/50 flex items-center justify-center">
          <Icon name="Play" size={9} className="text-subject-code-dark" />
        </div>
      ),
    },
    {
      label: 'Not Started',
      element: (
        <div className="w-5 h-5 rounded-full bg-surface-card border-2 border-border-muted flex items-center justify-center">
          <Icon name="Circle" size={9} className="text-content-tertiary" />
        </div>
      ),
    },
    {
      label: 'Locked',
      element: (
        <div className="w-5 h-5 rounded-full bg-surface-tertiary border-2 border-border-subtle opacity-60 flex items-center justify-center">
          <Icon name="Lock" size={9} className="text-content-tertiary" />
        </div>
      ),
    },
    {
      label: 'Sequential',
      element: (
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-subject-code-light">
          <Icon name="ArrowRight" size={9} className="text-subject-code-dark" />
        </div>
      ),
    },
    {
      label: 'Open anytime',
      element: (
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-tertiary">
          <Icon name="Shuffle" size={9} className="text-content-tertiary" />
        </div>
      ),
    },
    {
      label: 'Proctored',
      element: <Icon name="ShieldCheck" size={14} className="text-warning-dark" />,
    },
  ];

  return (
    <div className="rounded-2xl bg-surface-card border border-border-subtle px-5 py-4 mb-8">
      <Overline className="block mb-3">Legend</Overline>
      <div className="flex flex-wrap gap-x-5 gap-y-2.5">
        {items.map(({ label, element }) => (
          <div key={label} className="flex items-center gap-1.5">
            {element}
            <Text size="xs" color="tertiary">
              {label}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spine background — the decorative vertical line behind all nodes
// ---------------------------------------------------------------------------

function SpineBackground() {
  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none"
      aria-hidden="true"
      // Aligned to the center of the node column:
      // left padding = 16px (page px-4) + 64px (w-16 left col) + 14px (half of w-7 center col) = ~94px
      // But since this is inside a max-w-[800px] centered container, we position relative to the flex layout
      style={{ left: 'calc(64px + 16px + 13px)', width: 2, zIndex: 0 }}
    >
      <div className="w-full h-full bg-border-subtle opacity-60" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Finish line
// ---------------------------------------------------------------------------

function FinishLine() {
  const overall = overallProgress(programList);
  const isAllDone = overall === 100;

  return (
    <div className="relative flex items-center w-full gap-4 mt-2">
      <div className="w-16 shrink-0" />
      <div className="w-7 shrink-0 flex flex-col items-center">
        <div className="w-0.5 h-5 bg-border-subtle" />
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center shadow-soft',
            isAllDone
              ? 'bg-success-light border-2 border-success-dark/40'
              : 'bg-surface-card border-2 border-border-subtle',
          )}
        >
          <Icon
            name={isAllDone ? 'Trophy' : 'Flag'}
            size="md"
            className={isAllDone ? 'text-success-dark' : 'text-content-tertiary'}
          />
        </div>
      </div>
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-2xl border',
          isAllDone
            ? 'bg-success-light border-success-dark/20'
            : 'bg-surface-card border-border-subtle shadow-soft',
        )}
      >
        <Text
          size="sm"
          weight="semibold"
          color={isAllDone ? 'success' : 'tertiary'}
        >
          {isAllDone ? 'All programmes complete!' : `Journey ${overall}% complete`}
        </Text>
        {!isAllDone && (
          <Text size="xs" color="tertiary">
            · Keep going
          </Text>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function TimelineProgrammesPage() {
  return (
    <main className="max-w-[800px] mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-6">
        <Overline className="block mb-1.5">Learning Path</Overline>
        <Title level={2} weight="bold" color="primary" className="!mb-1">
          Your Journey
        </Title>
        <Text size="sm" color="secondary">
          Programmes and exercises shown as a sequential learning path.
        </Text>
      </header>

      {/* Overall progress banner */}
      <OverallProgressBanner programs={programList} />

      {/* Legend */}
      <TimelineLegend />

      {/* Timeline */}
      <div className="relative">
        <SpineBackground />

        <div className="relative flex flex-col">
          {programList.map((program, i) => (
            <ProgrammeBlock
              key={program.id}
              program={program}
              programIndex={i}
              isLastProgram={i === programList.length - 1}
            />
          ))}

          {/* Finish line */}
          <FinishLine />
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-16" aria-hidden="true" />
    </main>
  );
}
