export interface User {
  uid: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface TaskItem {
  id: string | number;
  task: string;
  completed: boolean;
}

export interface DailyLog {
  id: string; // YYYY-MM-DD
  userId: string;
  date: string; // YYYY-MM-DD
  emotionLevel?: number; // 20 to 700
  checklist: TaskItem[];
  intention?: string;
  learned?: string;
}

export interface WheelOfLife {
  id: string;
  userId: string;
  createdAt: Date;
  scores: Record<string, number>; // social, spirituality, intellectual, physical
  feedback?: string;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  isActive: boolean;
  daysOfWeek: number[];
}

export interface HabitTracking {
  id: string; // habitId_YYYY-MM-DD
  userId: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface FinanceRecord {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date;
  monthYear: string;
}
