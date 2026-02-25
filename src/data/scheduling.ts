/** Scheduling mock data — programs, assessment centers, and time slots. */

import type { SchedulingProgram } from '@/types/schedule';

export const schedulingData: SchedulingProgram[] = [
  {
    programId: 'leadership',
    programName: 'Leadership Potential Assessment 2026',
    accent: '#002C77',
    centers: [
      {
        id: 'sim-sched',
        name: 'Business Simulation Center',
        desc: 'Strategic decision-making: market analysis, presentation, and crisis response. Live facilitators and observers present.',
        location: 'Virtual — Zoom',
        duration: '90 min',
        icon: 'Monitor',
        color: '#002C77',
        slots: [
          { id: 'sl1', date: 'Mar 10, 2026', day: 'Monday', time: '9:00 AM – 10:30 AM', tz: 'GST (UTC+4)', total: 12, remaining: 4, cancellation: true, cancelBefore: '48 hours' },
          { id: 'sl2', date: 'Mar 10, 2026', day: 'Monday', time: '2:00 PM – 3:30 PM', tz: 'GST (UTC+4)', total: 12, remaining: 8, cancellation: true, cancelBefore: '48 hours' },
          { id: 'sl3', date: 'Mar 12, 2026', day: 'Wednesday', time: '9:00 AM – 10:30 AM', tz: 'GST (UTC+4)', total: 12, remaining: 1, cancellation: false },
          { id: 'sl4', date: 'Mar 14, 2026', day: 'Friday', time: '11:00 AM – 12:30 PM', tz: 'GST (UTC+4)', total: 15, remaining: 15, cancellation: true, cancelBefore: '24 hours' },
          { id: 'sl5', date: 'Mar 18, 2026', day: 'Tuesday', time: '9:00 AM – 10:30 AM', tz: 'GST (UTC+4)', total: 12, remaining: 6, cancellation: true, cancelBefore: '48 hours' },
        ],
      },
      {
        id: 'lac-sched',
        name: 'Leadership Assessment Center',
        desc: 'Full-day group assessment: group exercises, role plays, and case study presentations with trained observers.',
        location: 'In-Person — Marsh Dubai Office, DIFC',
        duration: '4 hours',
        icon: 'Users',
        color: '#7B61FF',
        slots: [
          { id: 'sl6', date: 'Mar 15, 2026', day: 'Saturday', time: '9:00 AM – 1:00 PM', tz: 'GST (UTC+4)', total: 8, remaining: 2, cancellation: false },
          { id: 'sl7', date: 'Mar 22, 2026', day: 'Saturday', time: '9:00 AM – 1:00 PM', tz: 'GST (UTC+4)', total: 8, remaining: 5, cancellation: true, cancelBefore: '72 hours' },
          { id: 'sl8', date: 'Mar 29, 2026', day: 'Saturday', time: '9:00 AM – 1:00 PM', tz: 'GST (UTC+4)', total: 8, remaining: 8, cancellation: true, cancelBefore: '72 hours' },
        ],
      },
    ],
  },
  {
    programId: '360',
    programName: '360° Perspective Feedback',
    accent: '#7B61FF',
    centers: [
      {
        id: 'cal-sched',
        name: 'Calibration Session',
        desc: 'Live calibration session with your manager and HR to discuss 360° feedback results and development priorities.',
        location: 'Virtual — Microsoft Teams',
        duration: '60 min',
        icon: 'Users',
        color: '#008575',
        slots: [
          { id: 'sl9', date: 'Apr 2, 2026', day: 'Wednesday', time: '10:00 AM – 11:00 AM', tz: 'GST (UTC+4)', total: 6, remaining: 3, cancellation: true, cancelBefore: '24 hours' },
          { id: 'sl10', date: 'Apr 5, 2026', day: 'Saturday', time: '11:00 AM – 12:00 PM', tz: 'GST (UTC+4)', total: 6, remaining: 6, cancellation: true, cancelBefore: '24 hours' },
        ],
      },
    ],
  },
];
