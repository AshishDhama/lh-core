import { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Illustration } from '@/forge/primitives/Illustration';
import { Icon } from '@/forge/primitives/Icon';
import { Button } from '@/forge/primitives/Button';
import { programList } from '@/data/programs';

import type { Program } from '@/types/program';
import type { ItemStatus } from '@/types/common';
import type { IconName } from '@/forge/primitives/Icon';

export const Route = createFileRoute('/brilliant/programmes/table')({
  component: TableProgrammesPage,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FilterStatus = 'all' | ItemStatus;

type SortKey = 'row' | 'name' | 'programme' | 'type' | 'duration' | 'status' | 'progress';
type SortDir = 'asc' | 'desc';

interface FlatRow {
  rowNum: number;
  exerciseId: string;
  exerciseName: string;
  exerciseDesc: string;
  illustration: string;
  time: string;
  status: ItemStatus;
  pct: number;
  proctored: boolean;
  hasReport: boolean;
  type: 'sequential' | 'open';
  programId: string;
  programName: string;
  programAccent: string;
  programDue: string;
  programDaysLeft: number;
}

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

function buildFlatRows(programs: Program[]): FlatRow[] {
  const rows: FlatRow[] = [];
  let rowNum = 0;

  for (const program of programs) {
    for (const ex of program.seqExercises) {
      rowNum += 1;
      rows.push({
        rowNum,
        exerciseId: `${program.id}-${ex.id}`,
        exerciseName: ex.name,
        exerciseDesc: ex.desc,
        illustration: ex.illustration ?? 'assessment',
        time: ex.time,
        status: ex.status,
        pct: ex.pct,
        proctored: ex.proctored,
        hasReport: ex.hasReport,
        type: 'sequential',
        programId: program.id,
        programName: program.name,
        programAccent: program.accent,
        programDue: program.due,
        programDaysLeft: program.daysLeft,
      });
    }
    for (const ex of program.openExercises) {
      rowNum += 1;
      rows.push({
        rowNum,
        exerciseId: `${program.id}-${ex.id}`,
        exerciseName: ex.name,
        exerciseDesc: ex.desc,
        illustration: ex.illustration ?? 'assessment',
        time: ex.time,
        status: ex.status,
        pct: ex.pct,
        proctored: ex.proctored,
        hasReport: ex.hasReport,
        type: 'open',
        programId: program.id,
        programName: program.name,
        programAccent: program.accent,
        programDue: program.due,
        programDaysLeft: program.daysLeft,
      });
    }
  }

  return rows;
}

const STATUS_ORDER: Record<ItemStatus, number> = {
  progress: 0,
  notstarted: 1,
  complete: 2,
  locked: 3,
};

function sortRows(rows: FlatRow[], key: SortKey, dir: SortDir): FlatRow[] {
  const multiplier = dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case 'row':
        cmp = a.rowNum - b.rowNum;
        break;
      case 'name':
        cmp = a.exerciseName.localeCompare(b.exerciseName);
        break;
      case 'programme':
        cmp = a.programName.localeCompare(b.programName);
        break;
      case 'type':
        cmp = a.type.localeCompare(b.type);
        break;
      case 'duration':
        // Sort dashes last
        if (a.time === '—' && b.time !== '—') return multiplier;
        if (b.time === '—' && a.time !== '—') return -multiplier;
        cmp = a.time.localeCompare(b.time);
        break;
      case 'status':
        cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        break;
      case 'progress':
        cmp = a.pct - b.pct;
        break;
    }
    return cmp * multiplier;
  });
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

interface StatusConfig {
  label: string;
  icon: IconName;
  badgeBg: string;
  badgeText: string;
  actionLabel: string;
  actionVariant: 'primary' | 'secondary' | 'ghost';
  strokeColor: string;
}

const STATUS_CONFIG: Record<ItemStatus, StatusConfig> = {
  complete: {
    label: 'Completed',
    icon: 'CircleCheckBig',
    badgeBg: 'bg-success-light',
    badgeText: 'text-success-dark',
    actionLabel: 'Review',
    actionVariant: 'ghost',
    strokeColor: '#22c55e',
  },
  progress: {
    label: 'In Progress',
    icon: 'CircleDot',
    badgeBg: 'bg-subject-code-light',
    badgeText: 'text-subject-code-dark',
    actionLabel: 'Continue',
    actionVariant: 'primary',
    strokeColor: '#8B5CF6',
  },
  notstarted: {
    label: 'Not Started',
    icon: 'Circle',
    badgeBg: 'bg-surface-tertiary',
    badgeText: 'text-content-secondary',
    actionLabel: 'Start',
    actionVariant: 'secondary',
    strokeColor: '#94a3b8',
  },
  locked: {
    label: 'Locked',
    icon: 'Lock',
    badgeBg: 'bg-surface-tertiary',
    badgeText: 'text-content-tertiary',
    actionLabel: 'Locked',
    actionVariant: 'ghost',
    strokeColor: '#cbd5e1',
  },
};

// ---------------------------------------------------------------------------
// Stat counts
// ---------------------------------------------------------------------------

interface ExerciseCounts {
  total: number;
  complete: number;
  progress: number;
  notstarted: number;
  locked: number;
}

function computeCounts(rows: FlatRow[]): ExerciseCounts {
  return {
    total: rows.length,
    complete: rows.filter((r) => r.status === 'complete').length,
    progress: rows.filter((r) => r.status === 'progress').length,
    notstarted: rows.filter((r) => r.status === 'notstarted').length,
    locked: rows.filter((r) => r.status === 'locked').length,
  };
}

// ---------------------------------------------------------------------------
// Filter pill
// ---------------------------------------------------------------------------

interface FilterPillProps {
  label: string;
  count: number;
  active: boolean;
  dotClass?: string;
  onClick: () => void;
}

function FilterPill({ label, count, active, dotClass, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-fast',
        active
          ? 'bg-content-primary text-white border-transparent'
          : 'bg-surface-card border-border-subtle text-content-secondary hover:border-border-muted hover:text-content-primary',
      )}
    >
      {dotClass && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotClass)} />
      )}
      {label}
      <span
        className={cn(
          'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold leading-none',
          active
            ? 'bg-white/20 text-white'
            : 'bg-surface-tertiary text-content-tertiary',
        )}
      >
        {count}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Sort header cell
// ---------------------------------------------------------------------------

interface SortHeaderProps {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  currentDir: SortDir;
  onClick: (key: SortKey) => void;
  className?: string;
}

function SortHeader({ label, sortKey, currentKey, currentDir, onClick, className }: SortHeaderProps) {
  const isActive = currentKey === sortKey;
  return (
    <th
      className={cn(
        'px-3 py-2.5 text-left cursor-pointer select-none whitespace-nowrap group',
        'hover:bg-surface-warm transition-colors duration-fast',
        className,
      )}
      onClick={() => onClick(sortKey)}
    >
      <div className="flex items-center gap-1">
        <Overline
          color={isActive ? 'primary' : 'tertiary'}
          className={cn('!text-[10px]', isActive && '!text-content-primary')}
        >
          {label}
        </Overline>
        <Icon
          name="ArrowUpDown"
          size={10}
          className={cn(
            'transition-opacity duration-fast',
            isActive ? 'opacity-100 text-content-primary' : 'opacity-0 group-hover:opacity-40 text-content-tertiary',
          )}
        />
        {isActive && (
          <Icon
            name={currentDir === 'asc' ? 'ChevronUp' : 'ChevronDown'}
            size={10}
            className="text-content-primary"
          />
        )}
      </div>
    </th>
  );
}

// ---------------------------------------------------------------------------
// Programme group header row
// ---------------------------------------------------------------------------

interface GroupHeaderRowProps {
  programName: string;
  programAccent: string;
  programDue: string;
  programDaysLeft: number;
  rows: FlatRow[];
}

function GroupHeaderRow({ programName, programAccent, programDue, programDaysLeft, rows }: GroupHeaderRowProps) {
  const complete = rows.filter((r) => r.status === 'complete').length;
  const total = rows.length;
  const pct = total > 0 ? Math.round((complete / total) * 100) : 0;
  const isUrgent = programDaysLeft <= 7;

  return (
    <tr className="border-t-2 border-border-muted">
      <td
        colSpan={10}
        className="px-3 py-2"
        style={{ borderLeftWidth: 3, borderLeftColor: programAccent }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          {/* Accent dot + name */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: programAccent }}
            />
            <Text size="sm" weight="semibold" color="primary" className="leading-none">
              {programName}
            </Text>
          </div>

          {/* Exercise count */}
          <span className="text-[10px] font-semibold text-content-tertiary bg-surface-tertiary px-2 py-0.5 rounded-full">
            {complete}/{total} exercises
          </span>

          {/* Mini progress bar */}
          <div className="w-24 shrink-0">
            <ProgressBar
              percent={pct}
              type="line"
              size="xs"
              showInfo={false}
              strokeColor={programAccent}
            />
          </div>
          <span className="text-[10px] font-bold tabular-nums" style={{ color: programAccent }}>
            {pct}%
          </span>

          {/* Deadline */}
          <div className="flex items-center gap-1 ml-auto">
            <Icon
              name="Calendar"
              size={11}
              className={isUrgent ? 'text-error-dark' : 'text-content-tertiary'}
            />
            <Text
              size="xs"
              weight="medium"
              color={isUrgent ? 'error' : 'tertiary'}
            >
              Due {programDue}
            </Text>
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ml-0.5',
                isUrgent ? 'bg-error-light text-error-dark' : 'bg-surface-tertiary text-content-tertiary',
              )}
            >
              {programDaysLeft}d
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Table row
// ---------------------------------------------------------------------------

interface TableRowProps {
  row: FlatRow;
  globalIndex: number;
  isEven: boolean;
}

function TableRow({ row, globalIndex, isEven }: TableRowProps) {
  const config = STATUS_CONFIG[row.status];
  const isLocked = row.status === 'locked';
  const isComplete = row.status === 'complete';

  return (
    <tr
      className={cn(
        'group border-b border-border-subtle transition-colors duration-fast',
        isEven ? 'bg-surface-primary' : 'bg-surface-card',
        isLocked ? 'opacity-55' : 'hover:bg-surface-warm',
      )}
    >
      {/* # */}
      <td className="px-3 py-2 w-10 shrink-0 text-center">
        <Text size="xs" color="tertiary" className="tabular-nums leading-none">
          {globalIndex}
        </Text>
      </td>

      {/* Exercise name + illustration */}
      <td className="px-3 py-2 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Illustration — capped at 28px */}
          <div className="shrink-0 w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center bg-surface-tertiary/50">
            <Illustration
              name={row.illustration}
              size="sm"
              className={cn('scale-[0.58] origin-center', isLocked && 'grayscale opacity-60')}
            />
          </div>

          <div className="min-w-0 flex-1">
            <Text
              size="sm"
              weight="semibold"
              color={isLocked ? 'tertiary' : 'primary'}
              className="block leading-snug truncate"
            >
              {row.exerciseName}
            </Text>
            <Text size="xs" color="tertiary" className="block leading-tight truncate max-w-[260px]">
              {row.exerciseDesc}
            </Text>
          </div>
        </div>
      </td>

      {/* Programme tag */}
      <td className="px-3 py-2 whitespace-nowrap">
        <span
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold leading-none max-w-[180px] truncate"
          style={{ backgroundColor: row.programAccent + '18', color: row.programAccent }}
          title={row.programName}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: row.programAccent }}
          />
          <span className="truncate">{row.programName}</span>
        </span>
      </td>

      {/* Type badge */}
      <td className="px-3 py-2 whitespace-nowrap">
        {row.type === 'sequential' ? (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-subject-code-light text-subject-code-dark text-[10px] font-semibold leading-none">
            <Icon name="ArrowRight" size={9} className="text-subject-code-dark shrink-0" />
            Seq
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-surface-tertiary text-content-secondary text-[10px] font-semibold leading-none">
            <Icon name="Shuffle" size={9} className="text-content-tertiary shrink-0" />
            Open
          </span>
        )}
      </td>

      {/* Duration */}
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <Icon name="Clock" size={11} className="text-content-tertiary shrink-0" />
          <Text size="xs" color="secondary" className="tabular-nums">
            {row.time}
          </Text>
        </div>
      </td>

      {/* Status badge */}
      <td className="px-3 py-2 whitespace-nowrap">
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold leading-none',
            config.badgeBg,
            config.badgeText,
          )}
        >
          <Icon name={config.icon} size={10} className="shrink-0" />
          {config.label}
        </span>
      </td>

      {/* Progress bar */}
      <td className="px-3 py-2 w-32">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-[60px]">
            {row.status === 'locked' ? (
              <div className="h-1 rounded-full bg-border-subtle" />
            ) : (
              <ProgressBar
                percent={isComplete ? 100 : row.pct}
                type="line"
                size="xs"
                showInfo={false}
                strokeColor={config.strokeColor}
              />
            )}
          </div>
          <Text
            size="xs"
            color={isLocked ? 'tertiary' : 'secondary'}
            className="tabular-nums w-7 text-right shrink-0 leading-none"
          >
            {isLocked ? '—' : `${isComplete ? 100 : row.pct}%`}
          </Text>
        </div>
      </td>

      {/* Proctored */}
      <td className="px-3 py-2 text-center w-16">
        {row.proctored ? (
          <div className="inline-flex items-center justify-center" title="Proctored">
            <Icon name="ShieldCheck" size={14} className="text-warning-dark" />
          </div>
        ) : (
          <Text size="xs" color="tertiary" className="leading-none">
            —
          </Text>
        )}
      </td>

      {/* Report */}
      <td className="px-3 py-2 text-center w-16">
        {row.hasReport && isComplete ? (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-success-dark hover:underline leading-none"
          >
            <Icon name="FileText" size={11} className="text-success-dark shrink-0" />
            View
          </button>
        ) : (
          <Text size="xs" color="tertiary" className="leading-none">
            —
          </Text>
        )}
      </td>

      {/* Action */}
      <td className="px-3 py-2 text-right whitespace-nowrap w-24">
        {isLocked ? (
          <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-surface-tertiary">
            <Icon name="Lock" size={12} className="text-content-tertiary" />
          </div>
        ) : (
          <Button
            variant={config.actionVariant}
            size="sm"
            className="!text-xs !h-7 !px-2.5 !rounded-lg"
            icon={
              row.status === 'progress'
                ? <Icon name="Play" size={10} />
                : row.status === 'complete'
                  ? <Icon name="ArrowRight" size={10} />
                  : undefined
            }
            iconPlacement="start"
          >
            {config.actionLabel}
          </Button>
        )}
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Top stats bar
// ---------------------------------------------------------------------------

interface StatsBarProps {
  counts: ExerciseCounts;
}

function StatsBar({ counts }: StatsBarProps) {
  const overallPct = counts.total > 0
    ? Math.round((counts.complete / counts.total) * 100)
    : 0;

  const stats: { icon: IconName; label: string; value: string | number; accent?: string }[] = [
    { icon: 'LayoutList', label: 'Total', value: counts.total },
    { icon: 'CircleCheckBig', label: 'Completed', value: counts.complete, accent: 'text-success-dark' },
    { icon: 'CircleDot', label: 'In Progress', value: counts.progress, accent: 'text-subject-code-dark' },
    { icon: 'Circle', label: 'Not Started', value: counts.notstarted },
    { icon: 'Lock', label: 'Locked', value: counts.locked },
  ];

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-card border border-border-subtle',
            i > 0 && 'border-l',
          )}
        >
          <Icon
            name={s.icon}
            size={12}
            className={s.accent ?? 'text-content-tertiary'}
          />
          <Text size="xs" color="tertiary" className="leading-none">
            {s.label}
          </Text>
          <Text size="xs" weight="bold" color="primary" className="leading-none tabular-nums">
            {s.value}
          </Text>
        </div>
      ))}

      {/* Overall progress */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-subject-code-light border border-transparent ml-1">
        <ProgressBar
          percent={overallPct}
          type="circle"
          size="xs"
          strokeColor="#8B5CF6"
          showInfo={false}
        />
        <Text size="xs" weight="bold" color="primary" className="leading-none tabular-nums">
          {overallPct}% overall
        </Text>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({ filter }: { filter: FilterStatus }) {
  const label =
    filter === 'complete' ? 'completed'
      : filter === 'progress' ? 'in-progress'
        : filter === 'notstarted' ? 'not-started'
          : filter === 'locked' ? 'locked'
            : '';

  return (
    <tr>
      <td colSpan={10}>
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Icon name="Inbox" size="xl" className="text-content-tertiary" />
          <Text size="sm" color="tertiary">
            No {label} exercises found
          </Text>
        </div>
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function TableProgrammesPage() {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('row');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const allRows = useMemo(() => buildFlatRows(programList), []);
  const counts = useMemo(() => computeCounts(allRows), [allRows]);

  const filteredRows = useMemo(() => {
    let rows = allRows;

    if (filter !== 'all') {
      rows = rows.filter((r) => r.status === filter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.exerciseName.toLowerCase().includes(q) ||
          r.exerciseDesc.toLowerCase().includes(q) ||
          r.programName.toLowerCase().includes(q),
      );
    }

    return sortRows(rows, sortKey, sortDir);
  }, [allRows, filter, search, sortKey, sortDir]);

  // Group rows by programme for group headers
  const groupedRows = useMemo(() => {
    const groups: { programId: string; programName: string; programAccent: string; programDue: string; programDaysLeft: number; rows: FlatRow[] }[] = [];
    const seen = new Map<string, number>();

    for (const row of filteredRows) {
      if (!seen.has(row.programId)) {
        seen.set(row.programId, groups.length);
        groups.push({
          programId: row.programId,
          programName: row.programName,
          programAccent: row.programAccent,
          programDue: row.programDue,
          programDaysLeft: row.programDaysLeft,
          rows: [],
        });
      }
      const idx = seen.get(row.programId)!;
      groups[idx].rows.push(row);
    }

    return groups;
  }, [filteredRows]);

  // Determine if grouping should be shown: only when not sorted by a field
  // that breaks grouping (i.e., only when sorted by 'row' or 'programme')
  const showGroups = sortKey === 'row' || sortKey === 'programme';

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const filterPills: { status: FilterStatus; label: string; count: number; dotClass?: string }[] = [
    { status: 'all', label: 'All', count: counts.total },
    { status: 'complete', label: 'Completed', count: counts.complete, dotClass: 'bg-success-dark' },
    { status: 'progress', label: 'In Progress', count: counts.progress, dotClass: 'bg-subject-code' },
    { status: 'notstarted', label: 'Not Started', count: counts.notstarted, dotClass: 'bg-content-tertiary' },
    { status: 'locked', label: 'Locked', count: counts.locked, dotClass: 'bg-border-muted' },
  ];

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">

      {/* Page header */}
      <header className="mb-5">
        <Overline className="block mb-1.5" color="tertiary">
          All Exercises — Spreadsheet View
        </Overline>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <Title level={2} weight="bold" color="primary" className="!mb-0">
            Programmes &amp; Exercises
          </Title>
          <StatsBar counts={counts} />
        </div>
      </header>

      {/* Controls row: filter pills + search */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        {/* Filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {filterPills.map((pill) => (
            <FilterPill
              key={pill.status}
              label={pill.label}
              count={pill.count}
              active={filter === pill.status}
              dotClass={pill.dotClass}
              onClick={() => setFilter(pill.status)}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="relative flex items-center">
          <Icon
            name="Search"
            size={13}
            className="absolute left-2.5 text-content-tertiary pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className={cn(
              'pl-7 pr-3 py-1.5 rounded-xl border border-border-subtle bg-surface-card text-xs',
              'text-content-primary placeholder:text-content-tertiary',
              'focus:outline-none focus:ring-2 focus:ring-subject-code/30 focus:border-subject-code/50',
              'transition-all duration-fast w-48',
            )}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 text-content-tertiary hover:text-content-primary transition-colors duration-fast"
            >
              <Icon name="X" size={12} />
            </button>
          )}
        </div>

        {/* Results count */}
        <Text size="xs" color="tertiary" className="whitespace-nowrap">
          {filteredRows.length} of {allRows.length} exercises
        </Text>
      </div>

      {/* Table wrapper — sticky header via overflow scroll container */}
      <div className="rounded-2xl border border-border-subtle shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            {/* Sticky header */}
            <thead>
              <tr className="bg-surface-tertiary border-b border-border-muted">
                <SortHeader
                  label="#"
                  sortKey="row"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onClick={handleSort}
                  className="w-10 text-center"
                />
                <SortHeader
                  label="Exercise"
                  sortKey="name"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onClick={handleSort}
                  className="min-w-[240px]"
                />
                <SortHeader
                  label="Programme"
                  sortKey="programme"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onClick={handleSort}
                  className="min-w-[160px]"
                />
                <SortHeader
                  label="Type"
                  sortKey="type"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onClick={handleSort}
                  className="w-20"
                />
                <SortHeader
                  label="Duration"
                  sortKey="duration"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onClick={handleSort}
                  className="w-24"
                />
                <SortHeader
                  label="Status"
                  sortKey="status"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onClick={handleSort}
                  className="w-28"
                />
                <SortHeader
                  label="Progress"
                  sortKey="progress"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onClick={handleSort}
                  className="w-36"
                />
                <th className="px-3 py-2.5 text-center w-16">
                  <div className="flex items-center justify-center gap-1">
                    <Overline color="tertiary" className="!text-[10px]">Proctored</Overline>
                  </div>
                </th>
                <th className="px-3 py-2.5 text-center w-16">
                  <Overline color="tertiary" className="!text-[10px]">Report</Overline>
                </th>
                <th className="px-3 py-2.5 text-right w-24">
                  <Overline color="tertiary" className="!text-[10px]">Action</Overline>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.length === 0 ? (
                <EmptyState filter={filter} />
              ) : showGroups ? (
                /* Grouped by programme */
                groupedRows.map((group) => (
                  <>
                    <GroupHeaderRow
                      key={`group-${group.programId}`}
                      programName={group.programName}
                      programAccent={group.programAccent}
                      programDue={group.programDue}
                      programDaysLeft={group.programDaysLeft}
                      rows={group.rows}
                    />
                    {group.rows.map((row, i) => (
                      <TableRow
                        key={row.exerciseId}
                        row={row}
                        globalIndex={row.rowNum}
                        isEven={i % 2 === 0}
                      />
                    ))}
                  </>
                ))
              ) : (
                /* Flat sorted list */
                filteredRows.map((row, i) => (
                  <TableRow
                    key={row.exerciseId}
                    row={row}
                    globalIndex={i + 1}
                    isEven={i % 2 === 0}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {filteredRows.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-tertiary/50 border-t border-border-subtle">
            <Text size="xs" color="tertiary">
              Showing {filteredRows.length} exercise{filteredRows.length !== 1 ? 's' : ''}
              {filter !== 'all' && (
                <> · filtered by <span className="font-semibold text-content-secondary">{filterPills.find((p) => p.status === filter)?.label}</span></>
              )}
              {search && (
                <> · matching <span className="font-semibold text-content-secondary">&ldquo;{search}&rdquo;</span></>
              )}
            </Text>
            <div className="flex items-center gap-1.5">
              <Icon name="ArrowUpDown" size={11} className="text-content-tertiary" />
              <Text size="xs" color="tertiary">
                Sorted by <span className="font-semibold text-content-secondary">{sortKey}</span> ({sortDir})
              </Text>
              {(sortKey !== 'row' || sortDir !== 'asc') && (
                <button
                  type="button"
                  className="text-[10px] font-semibold text-subject-code-dark hover:underline ml-1"
                  onClick={() => { setSortKey('row'); setSortDir('asc'); }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom spacer */}
      <div className="h-12" aria-hidden="true" />
    </main>
  );
}
