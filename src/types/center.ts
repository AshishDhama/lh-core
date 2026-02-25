/** Assessment center type definitions (for center detail view). */

import type { Activity, AssessmentCenter } from './program';

export type { Activity, AssessmentCenter };

export type CenterStatus = 'upcoming' | 'in-progress' | 'completed';

export interface CenterDetail extends AssessmentCenter {
  centerStatus: CenterStatus;
  scheduledDate?: string;
  scheduledTime?: string;
}
