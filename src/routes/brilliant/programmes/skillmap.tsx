import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { Title, Text } from '@/forge/primitives/Typography';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Icon } from '@/forge/primitives/Icon';
import { Button } from '@/forge/primitives/Button';
import { programList } from '@/data/programs';
import { cn } from '@/forge/utils';

import type { Program, Exercise } from '@/types/program';
import type { ItemStatus } from '@/types/common';
import type { IconName } from '@/forge/primitives/Icon';

export const Route = createFileRoute('/brilliant/programmes/skillmap')({
  component: SkillMapProgrammesPage,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NodePosition {
  x: number;
  y: number;
}

interface LayoutNode {
  id: string;
  exercise: Exercise;
  pos: NodePosition;
  isSeq: boolean;
  seqIndex?: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// Node radii (px) by status
const NODE_RADIUS: Record<ItemStatus, number> = {
  progress: 52,
  complete: 44,
  notstarted: 36,
  locked: 28,
};

// Center hub radius
const HUB_RADIUS = 64;

// Orbit distances
const SEQ_ORBIT_BASE = 190;
const SEQ_ORBIT_STEP = 130;
const OPEN_ORBIT = 220;

// Canvas padding
const CANVAS_PAD = 80;

// Status config
const STATUS_CFG: Record<
  ItemStatus,
  { icon: IconName; label: string; glowColor: string; ringColor: string; dimmed: boolean }
> = {
  complete: {
    icon: 'CircleCheckBig',
    label: 'Completed',
    glowColor: 'rgba(34,197,94,0.15)',
    ringColor: 'var(--color-success)',
    dimmed: false,
  },
  progress: {
    icon: 'CircleDot',
    label: 'In Progress',
    glowColor: 'rgba(139,92,246,0.18)',
    ringColor: 'var(--color-subject-code)',
    dimmed: false,
  },
  notstarted: {
    icon: 'Circle',
    label: 'Not Started',
    glowColor: 'rgba(0,0,0,0.03)',
    ringColor: 'var(--color-border-muted)',
    dimmed: true,
  },
  locked: {
    icon: 'Lock',
    label: 'Locked',
    glowColor: 'rgba(0,0,0,0.02)',
    ringColor: 'var(--color-border)',
    dimmed: true,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function overallProgress(programs: Program[]): number {
  if (!programs.length) return 0;
  return Math.round(programs.reduce((s, p) => s + p.pct, 0) / programs.length);
}

function allExerciseCounts(programs: Program[]) {
  let total = 0;
  let complete = 0;
  for (const p of programs) {
    const all = [...p.seqExercises, ...p.openExercises];
    total += all.length;
    complete += all.filter((e) => e.status === 'complete').length;
  }
  return { total, complete };
}

function nearestDeadline(programs: Program[]): Program | undefined {
  return [...programs].sort((a, b) => a.daysLeft - b.daysLeft)[0];
}

/** Compute the SVG canvas size and node positions for one programme cluster */
function computeClusterLayout(program: Program): {
  nodes: LayoutNode[];
  hub: NodePosition;
  canvasW: number;
  canvasH: number;
} {
  const seq = program.seqExercises;
  const open = program.openExercises;

  // Sequential chain: arc from left side, going rightward/downward
  const seqNodes: LayoutNode[] = seq.map((ex, i) => {
    // Chain flows right from hub: angle starts at 180° (left) sweeping to ~20°
    const totalSeq = seq.length;
    // Spread from 160° down to 20° on the left/bottom arc
    const startAngle = 160;
    const endAngle = 20;
    const angleDeg =
      totalSeq === 1
        ? 90
        : startAngle - ((startAngle - endAngle) / (totalSeq - 1)) * i;
    const angle = (angleDeg * Math.PI) / 180;
    const dist = SEQ_ORBIT_BASE + i * SEQ_ORBIT_STEP * 0.3;
    return {
      id: ex.id,
      exercise: ex,
      pos: {
        x: Math.cos(angle) * dist,
        y: -Math.sin(angle) * dist,
      },
      isSeq: true,
      seqIndex: i,
    };
  });

  // Open nodes: arc on the right side
  const openNodes: LayoutNode[] = open.map((ex, i) => {
    const totalOpen = open.length;
    const startAngle = -30;
    const endAngle = -150;
    const angleDeg =
      totalOpen === 1
        ? -90
        : startAngle + ((endAngle - startAngle) / (totalOpen - 1)) * i;
    const angle = (angleDeg * Math.PI) / 180;
    return {
      id: ex.id,
      exercise: ex,
      pos: {
        x: Math.cos(angle) * OPEN_ORBIT,
        y: -Math.sin(angle) * OPEN_ORBIT,
      },
      isSeq: false,
    };
  });

  const allNodes = [...seqNodes, ...openNodes];

  // Find min/max extent
  let minX = -HUB_RADIUS;
  let maxX = HUB_RADIUS;
  let minY = -HUB_RADIUS;
  let maxY = HUB_RADIUS;

  for (const n of allNodes) {
    const r = NODE_RADIUS[n.exercise.status];
    minX = Math.min(minX, n.pos.x - r - 8);
    maxX = Math.max(maxX, n.pos.x + r + 8);
    minY = Math.min(minY, n.pos.y - r - 8);
    maxY = Math.max(maxY, n.pos.y + r + 8);
  }

  const offsetX = CANVAS_PAD - minX;
  const offsetY = CANVAS_PAD - minY;

  const canvasW = maxX - minX + CANVAS_PAD * 2;
  const canvasH = maxY - minY + CANVAS_PAD * 2;

  const hub: NodePosition = { x: offsetX, y: offsetY };

  const positioned = allNodes.map((n) => ({
    ...n,
    pos: { x: n.pos.x + offsetX, y: n.pos.y + offsetY },
  }));

  return { nodes: positioned, hub, canvasW, canvasH };
}

// ---------------------------------------------------------------------------
// SVG connector
// ---------------------------------------------------------------------------

interface ConnectorProps {
  from: NodePosition;
  to: NodePosition;
  isSeq: boolean;
  toStatus: ItemStatus;
  accentColor: string;
}

function Connector({ from, to, isSeq, toStatus, accentColor }: ConnectorProps) {
  const isLocked = toStatus === 'locked';
  const isComplete = toStatus === 'complete';

  const dx = to.x - from.x;
  // Cubic bezier control points for a nice curve
  const cx1 = from.x + dx * 0.5;
  const cy1 = from.y;
  const cx2 = from.x + dx * 0.5;
  const cy2 = to.y;

  const pathD = `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;

  if (!isSeq) {
    // Dashed line for open exercises (satellite-style)
    return (
      <path
        d={pathD}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={1}
        strokeDasharray="4 6"
        strokeLinecap="round"
      />
    );
  }

  // Sequential connector — solid, colored when active
  const strokeColor = isLocked
    ? 'var(--color-border-muted)'
    : isComplete
      ? 'var(--color-success)'
      : accentColor;
  const opacity = isLocked ? 0.4 : 0.6;

  return (
    <>
      {/* Glow layer */}
      {!isLocked && (
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={6}
          opacity={0.10}
          strokeLinecap="round"
        />
      )}
      {/* Main line */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isComplete ? 2 : 1.5}
        opacity={opacity}
        strokeLinecap="round"
        strokeDasharray={isLocked ? '4 5' : undefined}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Exercise node (SVG foreignObject + pure HTML inside)
// ---------------------------------------------------------------------------

interface ExerciseNodeProps {
  node: LayoutNode;
  accentColor: string;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (exercise: Exercise) => void;
}

function ExerciseNode({ node, accentColor, isHovered, onHover, onClick }: ExerciseNodeProps) {
  const { exercise, pos, isSeq, seqIndex } = node;
  const cfg = STATUS_CFG[exercise.status];
  const r = NODE_RADIUS[exercise.status];
  const isLocked = exercise.status === 'locked';
  const isComplete = exercise.status === 'complete';
  const isInProgress = exercise.status === 'progress';

  const nodeColor = isComplete
    ? '#dcfce7'
    : isInProgress
      ? 'var(--color-subject-code-light)'
      : isLocked
        ? 'var(--color-surface-tertiary)'
        : 'var(--color-surface-card)';

  const borderColor = isComplete
    ? 'var(--color-success)'
    : isInProgress
      ? accentColor
      : cfg.ringColor;

  const translateY = isHovered && !isLocked ? -6 : 0;

  return (
    <g
      style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => !isLocked && onClick(exercise)}
    >
      {/* Glow pulse ring for in-progress */}
      {isInProgress && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={r + 10}
          fill="none"
          stroke={accentColor}
          strokeWidth={2}
          opacity={isHovered ? 0.5 : 0.2}
          style={{ transition: 'opacity 0.25s ease' }}
        />
      )}

      {/* Outer glow when hovered */}
      {isHovered && !isLocked && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={r + 6}
          fill={cfg.glowColor}
          style={{ filter: 'blur(6px)' }}
        />
      )}

      {/* Main circle */}
      <circle
        cx={pos.x}
        cy={pos.y + translateY}
        r={r}
        fill={nodeColor}
        stroke={borderColor}
        strokeWidth={isInProgress ? 2.5 : isComplete ? 2 : 1}
        opacity={isLocked ? 0.5 : cfg.dimmed && !isHovered ? 0.75 : 1}
        style={{ transition: 'all 0.2s ease' }}
      />

      {/* Illustration inside — use foreignObject for img */}
      {exercise.illustration && !isLocked && (
        <foreignObject
          x={pos.x - 14}
          y={pos.y + translateY - 26}
          width={28}
          height={28}
          style={{ pointerEvents: 'none', transition: 'all 0.2s ease' }}
        >
          <img
            src={`/illustrations/${exercise.illustration}.svg`}
            width={28}
            height={28}
            style={{ objectFit: 'contain', opacity: isHovered ? 1 : 0.85 }}
            draggable={false}
          />
        </foreignObject>
      )}

      {/* Lock icon for locked nodes */}
      {isLocked && (
        <text
          x={pos.x}
          y={pos.y + translateY + 5}
          textAnchor="middle"
          fontSize={14}
          fill="var(--color-content-tertiary)"
          style={{ pointerEvents: 'none' }}
        >
          🔒
        </text>
      )}

      {/* Status icon badge — bottom right of circle */}
      <circle
        cx={pos.x + r * 0.67}
        cy={pos.y + translateY + r * 0.67}
        r={9}
        fill="var(--color-surface-secondary)"
        stroke={borderColor}
        strokeWidth={1.5}
        style={{ transition: 'all 0.2s ease' }}
      />

      {/* Sequential step number badge — top left */}
      {isSeq && seqIndex !== undefined && (
        <>
          <circle
            cx={pos.x - r * 0.67}
            cy={pos.y + translateY - r * 0.67}
            r={9}
            fill="var(--color-surface-secondary)"
            stroke="var(--color-border)"
            strokeWidth={1}
          />
          <text
            x={pos.x - r * 0.67}
            y={pos.y + translateY - r * 0.67 + 4}
            textAnchor="middle"
            fontSize={9}
            fontWeight="700"
            fill="var(--color-content-secondary)"
            style={{ pointerEvents: 'none' }}
          >
            {seqIndex + 1}
          </text>
        </>
      )}

      {/* Exercise name label below the node */}
      <text
        x={pos.x}
        y={pos.y + translateY + r + 16}
        textAnchor="middle"
        fontSize={11}
        fontWeight={isInProgress ? '700' : '500'}
        fill={
          isLocked
            ? 'var(--color-content-tertiary)'
            : isComplete
              ? 'var(--color-success-dark)'
              : isInProgress
                ? 'var(--color-content-primary)'
                : 'var(--color-content-secondary)'
        }
        style={{ pointerEvents: 'none', transition: 'all 0.2s ease' }}
      >
        {exercise.name.length > 18 ? exercise.name.slice(0, 17) + '…' : exercise.name}
      </text>

      {/* Time label */}
      <text
        x={pos.x}
        y={pos.y + translateY + r + 30}
        textAnchor="middle"
        fontSize={9}
        fill="var(--color-content-tertiary)"
        style={{ pointerEvents: 'none' }}
      >
        {exercise.time}
      </text>

      {/* Proctored dot */}
      {exercise.proctored && !isLocked && (
        <circle
          cx={pos.x - r * 0.67}
          cy={pos.y + translateY + r * 0.67}
          r={4}
          fill="var(--color-subject-code)"
          opacity={0.9}
        />
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Programme hub node (central)
// ---------------------------------------------------------------------------

interface HubNodeProps {
  program: Program;
  pos: NodePosition;
  isHovered: boolean;
  onHover: (v: boolean) => void;
}

function HubNode({ program, pos, isHovered, onHover }: HubNodeProps) {
  const r = HUB_RADIUS;
  const isComplete = program.status === 'complete';
  const isInProgress = program.status === 'progress';

  const accentHex = program.accent;

  return (
    <g
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{ cursor: 'default' }}
    >
      {/* Outer atmospheric glow */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={r + 22}
        fill="none"
        stroke={accentHex}
        strokeWidth={1}
        opacity={isHovered ? 0.15 : 0.06}
        style={{ transition: 'opacity 0.3s ease' }}
      />
      <circle
        cx={pos.x}
        cy={pos.y}
        r={r + 38}
        fill="none"
        stroke={accentHex}
        strokeWidth={0.5}
        opacity={isHovered ? 0.08 : 0.03}
        strokeDasharray="3 8"
        style={{ transition: 'opacity 0.3s ease' }}
      />

      {/* Hub fill */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={r}
        fill="var(--color-surface-card)"
        stroke={accentHex}
        strokeWidth={isInProgress ? 3 : 2}
        opacity={1}
      />

      {/* Progress ring using SVG arc */}
      {program.pct > 0 && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={r - 4}
          fill="none"
          stroke={isComplete ? 'var(--color-success)' : accentHex}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={`${((program.pct / 100) * 2 * Math.PI * (r - 4)).toFixed(1)} ${(2 * Math.PI * (r - 4)).toFixed(1)}`}
          strokeDashoffset={`${((90 / 360) * 2 * Math.PI * (r - 4)).toFixed(1)}`}
          opacity={0.85}
          style={{ transform: `rotate(-90deg)`, transformOrigin: `${pos.x}px ${pos.y}px` }}
        />
      )}

      {/* Hub icon area — programme illustration */}
      <foreignObject x={pos.x - 22} y={pos.y - 30} width={44} height={44} style={{ pointerEvents: 'none' }}>
        <img
          src={`/illustrations/leadership.svg`}
          width={44}
          height={44}
          style={{ objectFit: 'contain', opacity: 0.9 }}
          draggable={false}
        />
      </foreignObject>

      {/* Pct text */}
      <text
        x={pos.x}
        y={pos.y + 20}
        textAnchor="middle"
        fontSize={14}
        fontWeight="700"
        fill={isComplete ? 'var(--color-success-dark)' : 'var(--color-content-primary)'}
        style={{ pointerEvents: 'none' }}
      >
        {program.pct}%
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Constellation cluster (one programme)
// ---------------------------------------------------------------------------

interface ClusterProps {
  program: Program;
}

function ConstellationCluster({ program }: ClusterProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hubHovered, setHubHovered] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const { nodes, hub, canvasW, canvasH } = computeClusterLayout(program);

  const seqNodes = nodes.filter((n) => n.isSeq);
  const openNodes = nodes.filter((n) => !n.isSeq);

  const isUrgent = program.daysLeft <= 7;
  const accentColor = program.status === 'complete' ? '#22c55e' : program.accent;

  const statusCfg = STATUS_CFG[program.status];

  return (
    <section
      className="relative rounded-3xl overflow-hidden bg-surface-card border border-border-subtle shadow-soft"
    >
      {/* Programme header strip */}
      <div className="relative px-7 pt-6 pb-5 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          {/* Accent orb */}
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}25`,
            }}
          >
            <Icon name="Orbit" size="md" style={{ color: accentColor }} />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold !mb-0 text-content-primary">
                {program.name}
              </h3>
              <span
                className={cn(
                  'flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0',
                  program.status === 'complete'
                    ? 'bg-success-light text-success-dark'
                    : program.status === 'progress'
                      ? 'bg-subject-code-light text-subject-code-dark'
                      : 'bg-surface-tertiary text-content-tertiary',
                )}
              >
                <Icon name={statusCfg.icon} size={11} />
                <span className="ml-1">{statusCfg.label}</span>
              </span>
            </div>
            <span className="text-sm block text-content-tertiary">
              {program.desc}
            </span>
          </div>
        </div>

        {/* Right meta */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <Icon
              name="Calendar"
              size="sm"
              className={isUrgent ? 'text-error-dark' : 'text-content-tertiary'}
            />
            <span
              className={cn(
                'text-sm font-semibold',
                isUrgent ? 'text-error-dark' : 'text-content-secondary',
              )}
            >
              {program.due}
            </span>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-bold',
                isUrgent
                  ? 'bg-error-light text-error-dark'
                  : 'bg-surface-tertiary text-content-tertiary',
              )}
            >
              {program.daysLeft}d
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="!rounded-full"
          >
            {program.status === 'complete' ? 'View Report' : 'Continue'}
          </Button>
        </div>
      </div>

      {/* Legend row */}
      <div className="px-7 pb-4 flex items-center gap-5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <svg width={20} height={8}>
            <line x1={0} y1={4} x2={20} y2={4} stroke={accentColor} strokeWidth={1.5} opacity={0.7} />
            <circle cx={20} cy={4} r={3} fill={accentColor} opacity={0.8} />
          </svg>
          <span className="text-xs text-content-tertiary">
            Sequential chain
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width={20} height={8}>
            <line x1={0} y1={4} x2={20} y2={4} stroke="var(--color-border)" strokeWidth={1} strokeDasharray="3 4" />
            <circle cx={20} cy={4} r={3} fill="var(--color-border)" />
          </svg>
          <span className="text-xs text-content-tertiary">
            Open (anytime)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full bg-subject-code"
          />
          <span className="text-xs text-content-tertiary">
            Proctored
          </span>
        </div>
      </div>

      {/* Main SVG constellation */}
      <div className="w-full overflow-x-auto">
        <svg
          width={canvasW}
          height={canvasH}
          viewBox={`0 0 ${canvasW} ${canvasH}`}
          className="block mx-auto"
          style={{ minWidth: Math.min(canvasW, 320), maxWidth: '100%' }}
        >
          {/* Sequential connectors: hub -> seq[0] -> seq[1] -> ... */}
          {seqNodes.map((node, i) => {
            const fromPos = i === 0 ? hub : seqNodes[i - 1].pos;
            return (
              <Connector
                key={`seq-conn-${node.id}`}
                from={fromPos}
                to={node.pos}
                isSeq={true}
                toStatus={node.exercise.status}
                accentColor={accentColor}
              />
            );
          })}

          {/* Open exercise connectors: hub -> open node (dashed) */}
          {openNodes.map((node) => (
            <Connector
              key={`open-conn-${node.id}`}
              from={hub}
              to={node.pos}
              isSeq={false}
              toStatus={node.exercise.status}
              accentColor={accentColor}
            />
          ))}

          {/* Hub */}
          <HubNode
            program={program}
            pos={hub}
            isHovered={hubHovered}
            onHover={setHubHovered}
          />

          {/* Exercise nodes */}
          {nodes.map((node) => (
            <ExerciseNode
              key={node.id}
              node={node}
              accentColor={accentColor}
              isHovered={hoveredNode === node.id}
              onHover={setHoveredNode}
              onClick={setSelectedExercise}
            />
          ))}
        </svg>
      </div>

      {/* Exercise detail drawer (slides up on click) */}
      {selectedExercise && (
        <ExerciseDrawer
          exercise={selectedExercise}
          accentColor={accentColor}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {/* Bottom spacer */}
      <div className="h-5" />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Exercise detail drawer
// ---------------------------------------------------------------------------

interface ExerciseDrawerProps {
  exercise: Exercise;
  accentColor: string;
  onClose: () => void;
}

function ExerciseDrawer({ exercise, accentColor, onClose }: ExerciseDrawerProps) {
  const cfg = STATUS_CFG[exercise.status];
  const isComplete = exercise.status === 'complete';
  const isInProgress = exercise.status === 'progress';
  const isLocked = exercise.status === 'locked';

  const statusClasses = isComplete
    ? 'bg-success-light text-success-dark'
    : isInProgress
      ? 'bg-subject-code-light text-subject-code-dark'
      : 'bg-surface-tertiary text-content-tertiary';

  return (
    <div
      className="mx-4 mb-4 rounded-2xl p-5 flex flex-col gap-4 bg-surface-warm border border-border-subtle shadow-soft"
    >
      <div className="flex items-start gap-4">
        {/* Illustration */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}25` }}
        >
          {exercise.illustration ? (
            <img
              src={`/illustrations/${exercise.illustration}.svg`}
              width={36}
              height={36}
              style={{ objectFit: 'contain', opacity: isLocked ? 0.4 : 0.9 }}
              draggable={false}
            />
          ) : (
            <Icon name="BookOpen" size="md" style={{ color: accentColor, opacity: 0.7 }} />
          )}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-base font-bold block text-content-primary">
              {exercise.name}
            </span>
            <span
              className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', statusClasses)}
            >
              <Icon name={cfg.icon} size={10} />
              <span className="ml-0.5">{cfg.label}</span>
            </span>
          </div>
          <span className="text-sm block leading-relaxed text-content-tertiary">
            {exercise.desc}
          </span>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors bg-surface-tertiary text-content-tertiary"
          aria-label="Close"
        >
          <Icon name="X" size={14} />
        </button>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Icon name="Clock" size={13} className="text-content-tertiary" />
          <span className="text-xs text-content-secondary">
            {exercise.time}
          </span>
        </div>
        {exercise.proctored && (
          <div className="flex items-center gap-1.5">
            <Icon name="ShieldCheck" size={13} className="text-subject-code-dark" />
            <span className="text-xs text-subject-code-dark">
              Proctored
            </span>
          </div>
        )}
        {exercise.hasReport && isComplete && (
          <div className="flex items-center gap-1.5">
            <Icon name="FileText" size={13} className="text-success-dark" />
            <span className="text-xs text-success-dark">
              Report available
            </span>
          </div>
        )}
      </div>

      {/* Progress bar if in progress */}
      {isInProgress && exercise.pct > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-content-tertiary">
              Progress
            </span>
            <span className="text-xs font-bold text-subject-code-dark">
              {exercise.pct}%
            </span>
          </div>
          <ProgressBar
            percent={exercise.pct}
            type="line"
            size="xs"
            showInfo={false}
            strokeColor={accentColor}
            trailColor="rgba(0,0,0,0.06)"
          />
        </div>
      )}

      {/* Action */}
      {!isLocked && (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="!rounded-full"
          >
            {isComplete ? 'Review' : isInProgress ? 'Continue' : 'Start'}
          </Button>
          {exercise.hasReport && isComplete && (
            <Button variant="secondary" size="sm" className="!rounded-full">
              View Report
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary stats header
// ---------------------------------------------------------------------------

function SkillMapSummary({ programs }: { programs: Program[] }) {
  const overall = overallProgress(programs);
  const { total: exTotal, complete: exComplete } = allExerciseCounts(programs);
  const nearest = nearestDeadline(programs);
  const isUrgent = nearest && nearest.daysLeft <= 7;
  const progComplete = programs.filter((p) => p.status === 'complete').length;
  const progInProgress = programs.filter((p) => p.status === 'progress').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
      {[
        {
          icon: 'Orbit' as IconName,
          label: 'Programmes',
          value: String(programs.length),
          sub: `${progComplete} done · ${progInProgress} active`,
          glowColor: '#8B5CF6',
        },
        {
          icon: 'Zap' as IconName,
          label: 'Overall Progress',
          value: `${overall}%`,
          sub: 'across all programmes',
          glowColor: '#002C77',
        },
        {
          icon: 'ListChecks' as IconName,
          label: 'Exercises',
          value: `${exComplete}/${exTotal}`,
          sub: 'completed',
          glowColor: '#008575',
        },
        {
          icon: 'Calendar' as IconName,
          label: 'Next Deadline',
          value: nearest ? nearest.due : '—',
          sub: nearest ? `${nearest.daysLeft}d · ${nearest.name}` : 'No deadlines',
          glowColor: isUrgent ? '#ef4444' : '#334155',
          urgent: !!isUrgent,
        },
      ].map((s) => (
        <div
          key={s.label}
          className="rounded-2xl px-5 py-4 flex items-start gap-3 bg-surface-card border border-border-subtle shadow-soft"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: `${s.glowColor}12`,
              border: `1px solid ${s.glowColor}20`,
            }}
          >
            <Icon name={s.icon} size="sm" className={s.urgent ? 'text-error-dark' : undefined} style={s.urgent ? undefined : { color: s.glowColor }} />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider block mb-0.5 text-content-tertiary">
              {s.label}
            </span>
            <div
              className={cn(
                'text-xl font-bold leading-tight',
                s.urgent ? 'text-error-dark' : 'text-content-primary',
              )}
            >
              {s.value}
            </div>
            <div className="text-xs mt-0.5 truncate text-content-tertiary">
              {s.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function SkillMapProgrammesPage() {
  return (
    <main
      className="max-w-[1100px] mx-auto px-6 py-8"
      style={{ minHeight: '100vh' }}
    >
      {/* Page header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center bg-subject-code-light border border-subject-code/20"
          >
            <Icon name="Orbit" size={14} className="text-subject-code" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-subject-code-dark">Skill Map</span>
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <Title level={2} weight="bold" color="primary" className="!mb-1">
              Constellation Map
            </Title>
            <Text size="sm" color="secondary">
              Your assessment universe — each node is an exercise, chains show dependencies
            </Text>
          </div>
        </div>
      </header>

      {/* Summary stats */}
      <SkillMapSummary programs={programList} />

      {/* Constellation clusters */}
      <div className="space-y-8">
        {programList.map((program) => (
          <ConstellationCluster key={program.id} program={program} />
        ))}
      </div>

      {/* Legend card */}
      <div
        className="mt-8 rounded-2xl px-6 py-5 flex items-center gap-8 flex-wrap bg-surface-card border border-border-subtle shadow-soft"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-content-tertiary">Node size &amp; glow = status</span>
        {[
          {
            color: 'var(--color-subject-code)',
            glow: true,
            label: 'In Progress',
            size: 14,
          },
          {
            color: 'var(--color-success)',
            glow: false,
            label: 'Complete',
            size: 11,
          },
          {
            color: '#cbd5e1',
            glow: false,
            label: 'Not Started',
            size: 9,
          },
          {
            color: 'var(--color-border)',
            glow: false,
            label: 'Locked',
            size: 7,
          },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <svg width={item.size * 2 + 4} height={item.size * 2 + 4}>
              {item.glow && (
                <circle
                  cx={item.size + 2}
                  cy={item.size + 2}
                  r={item.size + 4}
                  fill={item.color}
                  opacity={0.2}
                />
              )}
              <circle
                cx={item.size + 2}
                cy={item.size + 2}
                r={item.size}
                fill={item.color}
                stroke={item.color}
                strokeWidth={1}
                opacity={item.glow ? 1 : 0.7}
              />
            </svg>
            <span className="text-xs text-content-tertiary">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="h-16" aria-hidden="true" />
    </main>
  );
}
