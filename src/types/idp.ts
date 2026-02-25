/** Individual Development Plan (IDP) type definitions. */

import type { Comment } from './user';

export type SkillType = 'behavioral' | 'technical' | 'other';
export type LearningType = '70' | '20' | '10';
export type TipSource = 'ai' | 'library';
export type LearningCategory = 'experience' | 'social' | 'course' | 'reading';
export type PlanStatus = 'draft' | 'under-review' | 'approved';

export interface DevelopmentTip {
  id: string;
  type: LearningType;
  title: string;
  desc: string;
  source: TipSource;
  category: LearningCategory;
  startDate: string;
  endDate: string;
  success: string;
  insight: string;
  provider?: string;
  duration?: string;
  courseImg?: string;
  courseLink?: string;
  seats?: number | null;
}

export interface IDPSkill {
  name: string;
  desc: string;
  private: boolean;
  skillType: SkillType;
  tips: DevelopmentTip[];
}

export interface TipProgress {
  start: string;
  end: string;
  pct: number;
}

export interface DevelopmentPlan {
  skills: IDPSkill[];
  status: PlanStatus;
  comments: Record<string, Comment[]>;
  tipProgress: Record<string, TipProgress>;
}

export interface ChatQuestion {
  q: string;
  suggestions: string[];
}

export interface SkillOption {
  name: string;
  desc: string;
  skillType: SkillType;
}

export interface SkillLibrary {
  behavioral: SkillOption[];
  technical: SkillOption[];
  other: SkillOption[];
}
