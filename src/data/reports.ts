/** Mock report and insights data extracted from prototype. */

import type { Report, Competency } from '@/types/report';

import { colors } from '@/forge/tokens';

const navy = colors.navy.DEFAULT;
const teal = colors.teal.DEFAULT;
const purple = colors.purple.DEFAULT;

export const reports: Report[] = [
  {
    id: 'hogan-report',
    name: 'Hogan Leadership Profile',
    desc: 'Comprehensive personality profiling covering ambition, sociability, interpersonal sensitivity, prudence, and learning approach scales.',
    program: 'leadership',
    assessments: ['hogan'],
    available: true,
    pages: 12,
    thumbnail: 'https://picsum.photos/seed/report-personality/300/400',
  },
  {
    id: 'thriving-report',
    name: 'Thriving Index Report',
    desc: 'Personal wellbeing, resilience, and engagement scores with benchmarks against your industry and role level.',
    program: 'leadership',
    assessments: ['thriving'],
    available: true,
    pages: 8,
    thumbnail: 'https://picsum.photos/seed/report-cognitive/300/400',
  },
  {
    id: 'cognitive-report',
    name: 'Cognitive Ability Summary',
    desc: 'Verbal, numerical, and abstract reasoning scores with percentile rankings and development recommendations.',
    program: 'leadership',
    assessments: ['cognitive'],
    available: false,
    pages: 6,
    thumbnail: 'https://picsum.photos/seed/report-wellbeing/300/400',
  },
  {
    id: 'integrated-report',
    name: 'Integrated Leadership Report',
    desc: 'Holistic view combining Hogan personality, cognitive ability, and video interview data into a single leadership potential score.',
    program: 'leadership',
    assessments: ['hogan', 'cognitive', 'interview'],
    available: false,
    pages: 24,
    thumbnail: 'https://picsum.photos/seed/report-simulation/300/400',
  },
  {
    id: 'sim-report',
    name: 'Business Simulation Debrief',
    desc: 'Detailed assessor feedback on strategic thinking, communication, and crisis management performance during the simulation.',
    program: 'leadership',
    assessments: ['sim'],
    available: false,
    pages: 10,
    thumbnail: 'https://picsum.photos/seed/report-leadership/300/400',
  },
  {
    id: '360-report',
    name: '360° Feedback Report',
    desc: 'Consolidated multi-rater feedback with self-other comparison, blind spots, and strengths across leadership competencies.',
    program: '360',
    assessments: ['self360', 'nominate', 'track'],
    available: false,
    pages: 18,
    thumbnail: 'https://picsum.photos/seed/report-360/300/400',
  },
];

/** Competency scores used in the development/insights views. */
export const competencies: Competency[] = [
  { label: 'Strategic Thinking', score: 85, color: navy, type: 'behavioral' },
  { label: 'Influence & Communication', score: 72, color: teal, type: 'behavioral' },
  { label: 'Team Development', score: 68, color: purple, type: 'behavioral' },
  { label: 'Resilience', score: 91, color: '#1a8a42', type: 'behavioral' },
  { label: 'Decision Making', score: 76, color: navy, type: 'behavioral' },
  { label: 'Data & Analytics', score: 64, color: teal, type: 'technical' },
  { label: 'Product & Platform Fluency', score: 70, color: purple, type: 'technical' },
];
