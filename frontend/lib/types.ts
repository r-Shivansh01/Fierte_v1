export interface User {
  id: string;
  email: string;
  username: string;
  goal_statement?: string;
  is_onboarded: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  target_value: number;
  target_unit: string;
  current_level: number;
  difficulty_multiplier: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  log_date: string;
  completed: boolean;
  logged_value?: number;
  notes?: string;
  created_at: string;
}

export interface Evaluation {
  id: string;
  user_id: string;
  evaluation_date: string;
  overall_verdict: 'PASS' | 'FAIL' | 'PERFECT';
  completion_rate: number;
  ai_message: string;
  habits_overloaded?: string[];
  created_at: string;
}

export interface HeatmapData {
  habit_id: string;
  year: number;
  data: {
    date: string;
    completed: boolean;
    value?: number;
  }[];
  current_streak: number;
  longest_streak: number;
  completion_rate: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface WSMessage {
  type: 'goal' | 'thinking' | 'habits_proposal' | 'accept' | 'modify' | 'contract_sealed' | 'error' | 'ping';
  content?: any;
  habits?: any[];
}
