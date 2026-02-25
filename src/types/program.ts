/** Program, exercise, and activity type definitions. */

import type { ItemStatus } from './common';

export interface Exercise {
  id: string;
  name: string;
  desc: string;
  time: string;
  status: ItemStatus;
  pct: number;
  color: string;
  proctored: boolean;
  hasReport: boolean;
}

export interface Activity {
  id: string;
  name: string;
  desc: string;
  time: string;
  status: ItemStatus;
  pct: number;
}

export interface AssessmentCenter {
  id: string;
  name: string;
  desc: string;
  time: string;
  status: ItemStatus;
  color: string;
  proctored: boolean;
  activities?: Activity[];
  location?: string;
  duration?: string;
}

export interface Program {
  id: string;
  icon: string;
  accent: string;
  name: string;
  status: ItemStatus;
  due: string;
  daysLeft: number;
  pct: number;
  desc: string;
  video: string;
  instructions: string[];
  centers: AssessmentCenter[];
  seqExercises: Exercise[];
  openExercises: Exercise[];
}
