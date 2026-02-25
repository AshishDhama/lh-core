/** Zustand store for IDP (Individual Development Plan) state. */

import { create } from 'zustand';

import { mockIdpPlan } from '@/data/idp';
import type { IDPSkill, DevelopmentPlan } from '@/types/idp';
import type { ChatMessage } from '@/types/user';

interface IdpStore {
  /** The current IDP plan (skills, status, comments, tip progress). */
  plan: DevelopmentPlan;
  /** Chat messages from the IDP onboarding flow. */
  chatMessages: ChatMessage[];
  /** Index of the currently selected skill/goal, or null if none. */
  selectedGoalIndex: number | null;

  /** Add a new skill to the plan. */
  addGoal: (skill: IDPSkill) => void;
  /** Update an existing skill by index. */
  updateGoal: (index: number, skill: IDPSkill) => void;
  /** Remove a skill from the plan by index. */
  deleteGoal: (index: number) => void;
  /** Append a new chat message to the IDP chat history. */
  addMessage: (message: ChatMessage) => void;
  /** Set or clear the selected skill/goal index. */
  setSelectedGoal: (index: number | null) => void;
  /** Update plan status. */
  setPlanStatus: (status: DevelopmentPlan['status']) => void;
  /** Reset chat messages. */
  clearMessages: () => void;
}

export const useIdpStore = create<IdpStore>((set) => ({
  plan: mockIdpPlan,
  chatMessages: [],
  selectedGoalIndex: null,

  addGoal: (skill) =>
    set((state) => ({
      plan: {
        ...state.plan,
        skills: [...state.plan.skills, skill],
      },
    })),

  updateGoal: (index, skill) =>
    set((state) => {
      const skills = [...state.plan.skills];
      skills[index] = skill;
      return { plan: { ...state.plan, skills } };
    }),

  deleteGoal: (index) =>
    set((state) => ({
      plan: {
        ...state.plan,
        skills: state.plan.skills.filter((_, i) => i !== index),
      },
      selectedGoalIndex:
        state.selectedGoalIndex === index
          ? null
          : state.selectedGoalIndex !== null && state.selectedGoalIndex > index
            ? state.selectedGoalIndex - 1
            : state.selectedGoalIndex,
    })),

  addMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  setSelectedGoal: (index) => set({ selectedGoalIndex: index }),

  setPlanStatus: (status) =>
    set((state) => ({
      plan: { ...state.plan, status },
    })),

  clearMessages: () => set({ chatMessages: [] }),
}));
