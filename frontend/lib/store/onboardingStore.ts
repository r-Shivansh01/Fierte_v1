import { create } from 'zustand';
import { Habit } from '../types';

interface OnboardingState {
  goal: string;
  setGoal: (goal: string) => void;
  proposedHabits: Partial<Habit>[];
  setProposedHabits: (habits: Partial<Habit>[]) => void;
  isThinking: boolean;
  setIsThinking: (isThinking: boolean) => void;
  step: 1 | 2 | 3;
  setStep: (step: 1 | 2 | 3) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  goal: '',
  setGoal: (goal) => set({ goal }),
  proposedHabits: [],
  setProposedHabits: (proposedHabits) => set({ proposedHabits }),
  isThinking: false,
  setIsThinking: (isThinking) => set({ isThinking }),
  step: 1,
  setStep: (step) => set({ step }),
  error: null,
  setError: (error) => set({ error }),
}));
