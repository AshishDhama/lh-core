/** Report and insights type definitions. */

import type { CompetencyType } from './common';

export interface Report {
  id: string;
  name: string;
  desc: string;
  program: string;
  assessments: string[];
  available: boolean;
  pages: number;
  thumbnail: string;
}

export interface Competency {
  label: string;
  score: number;
  color: string;
  type: CompetencyType;
}
