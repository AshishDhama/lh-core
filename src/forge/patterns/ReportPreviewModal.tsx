import { Modal } from 'antd';
import { BarChart3, Download, FileText, Star, TrendingUp } from 'lucide-react';

import { Button, Text, Title } from '@/forge/primitives';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';
import type { Report } from '@/types/report';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReportPreviewModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
}

interface CompetencyRow {
  name: string;
  score: number;
}

// ─── Mock data helpers ────────────────────────────────────────────────────────

const MOCK_COMPETENCIES: CompetencyRow[] = [
  { name: 'Strategic Thinking', score: 4.2 },
  { name: 'Influence & Communication', score: 3.6 },
  { name: 'Team Development', score: 3.4 },
  { name: 'Resilience & Adaptability', score: 4.5 },
  { name: 'Decision Making', score: 3.8 },
];

const MOCK_STRENGTHS = [
  'Demonstrates consistently strong strategic vision, connecting day-to-day decisions to long-term organisational goals.',
  'Shows exceptional resilience under pressure, maintaining composure and effectiveness in ambiguous or high-stakes situations.',
  'Builds authentic relationships across levels, earning trust through transparency and follow-through.',
];

const MOCK_DEVELOPMENT_AREAS = [
  'Opportunities to deepen team coaching capability, particularly around structured feedback conversations and accountability frameworks.',
  'Continued growth in data-driven storytelling — translating analytical insight into compelling executive narratives.',
  'Expanding cross-functional influence through deliberate stakeholder mapping and proactive relationship cultivation.',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CompetencyBar({ name, score }: CompetencyRow) {
  const pct = (score / 5) * 100;
  let barColor: string;
  if (score < 2) {
    barColor = colors.error.DEFAULT;
  } else if (score <= 3) {
    barColor = colors.warning.DEFAULT;
  } else {
    barColor = colors.teal.DEFAULT;
  }

  let scoreLabel: string;
  if (score < 2) {
    scoreLabel = 'Developing';
  } else if (score <= 3) {
    scoreLabel = 'Progressing';
  } else {
    scoreLabel = 'Strong';
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Text size="sm" weight="medium" color="primary">
          {name}
        </Text>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              'text-xs font-medium px-1.5 py-0.5 rounded-full',
              score < 2 && 'bg-error/10 text-error-dark',
              score > 2 && score <= 3 && 'bg-warning/10 text-warning-dark',
              score > 3 && 'bg-teal/10 text-teal-700',
            )}
          >
            {scoreLabel}
          </span>
          <Text size="sm" weight="bold" color="primary">
            {score.toFixed(1)}<Text size="xs" color="tertiary" className="font-normal"> / 5</Text>
          </Text>
        </div>
      </div>
      <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ReportPreviewModal({ report, open, onClose }: ReportPreviewModalProps) {
  if (!report) return null;

  function handleDownload() {
    // Placeholder — real implementation would trigger PDF download
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      centered
      className="report-preview-modal"
      styles={{
        body: { padding: 0 },
        root: { borderRadius: 16, overflow: 'hidden' },
      }}
    >
      <div className="flex flex-col max-h-[85vh] overflow-y-auto">

        {/* ── Cover page header ─────────────────────────────────────────────── */}
        <div
          className="relative px-8 pt-8 pb-6 flex flex-col gap-3"
          style={{
            background: `linear-gradient(135deg, ${colors.navy.DEFAULT} 0%, ${colors.navy[400]} 100%)`,
          }}
        >
          {/* Gradient accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, ${colors.teal.DEFAULT}, ${colors.purple.DEFAULT})`,
            }}
          />

          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              <FileText size={24} color={colors.content.inverse} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <Title
                level={3}
                className="!mb-0 !text-white !font-bold leading-snug"
              >
                {report.name}
              </Title>
              <Text size="sm" className="text-white/70">
                Leadership Assessment 2026
              </Text>
              <Text size="xs" className="text-white/50 mt-1">
                {report.assessments.join(' · ')} · {report.pages} pages
              </Text>
            </div>
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 p-8">

          {/* Executive summary */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{ color: colors.navy.DEFAULT }} />
              <Title level={4} className="!mb-0 !text-sm !font-semibold !text-content-primary">
                Executive Summary
              </Title>
            </div>
            <div className="rounded-xl border border-border bg-surface-secondary p-4">
              <Text size="sm" color="secondary" className="leading-relaxed">
                {report.desc} Based on this assessment cycle, the participant demonstrates a high-performance profile characterised by strategic acuity and interpersonal strength. Data suggests above-average readiness for expanded leadership scope. Development focus areas have been identified to support continued growth and sustainable high performance across the organisation.
              </Text>
            </div>
          </section>

          {/* Competency breakdown */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} style={{ color: colors.navy.DEFAULT }} />
              <Title level={4} className="!mb-0 !text-sm !font-semibold !text-content-primary">
                Competency Breakdown
              </Title>
            </div>
            <div className="rounded-xl border border-border bg-surface-primary p-4 flex flex-col gap-4">
              {MOCK_COMPETENCIES.map((comp) => (
                <CompetencyBar key={comp.name} {...comp} />
              ))}
              <div className="flex items-center gap-4 pt-1 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.error.DEFAULT }} />
                  <Text size="xs" color="tertiary">Developing (&lt; 2)</Text>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.warning.DEFAULT }} />
                  <Text size="xs" color="tertiary">Progressing (2–3)</Text>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.teal.DEFAULT }} />
                  <Text size="xs" color="tertiary">Strong (&gt; 3)</Text>
                </div>
              </div>
            </div>
          </section>

          {/* Key strengths */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Star size={16} style={{ color: colors.navy.DEFAULT }} />
              <Title level={4} className="!mb-0 !text-sm !font-semibold !text-content-primary">
                Key Strengths
              </Title>
            </div>
            <ul className="flex flex-col gap-2">
              {MOCK_STRENGTHS.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: colors.teal.DEFAULT }}
                  >
                    {idx + 1}
                  </span>
                  <Text size="sm" color="secondary" className="leading-relaxed">
                    {strength}
                  </Text>
                </li>
              ))}
            </ul>
          </section>

          {/* Development areas */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{ color: colors.purple.DEFAULT }} />
              <Title level={4} className="!mb-0 !text-sm !font-semibold !text-content-primary">
                Development Areas
              </Title>
            </div>
            <ul className="flex flex-col gap-2">
              {MOCK_DEVELOPMENT_AREAS.map((area, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: colors.purple.DEFAULT }}
                  >
                    {idx + 1}
                  </span>
                  <Text size="sm" color="secondary" className="leading-relaxed">
                    {area}
                  </Text>
                </li>
              ))}
            </ul>
          </section>

          {/* Download button */}
          <div className="flex justify-end pt-2 border-t border-border">
            <Button
              variant="primary"
              icon={<Download size={15} />}
              onClick={handleDownload}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
