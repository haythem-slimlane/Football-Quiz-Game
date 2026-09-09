export type Difficulty = 'سهل' | 'متوسط' | 'صعب';

export interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, 3
  category: string;
  difficulty: Difficulty;
  explanation: string;
}

export type GameModeId =
  | 'classic'
  | 'ten_questions'
  | 'twenty_questions'
  | 'challenge'
  | 'categories'
  | 'random';

export interface GameModeInfo {
  id: GameModeId;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  badgeText: string;
  questionCount?: number;
  hasTimer: boolean;
  timePerQuestion?: number; // seconds
  hasLives: boolean;
  initialLives?: number;
  difficultyFilter?: Difficulty;
}

export interface UserAnswer {
  questionId: number;
  question: Question;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizSessionSummary {
  mode: GameModeInfo;
  category?: string;
  totalQuestions: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  score: number;
  streakBest: number;
  totalTimeSeconds: number;
  answers: UserAnswer[];
  completedAt: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  iconName: string;
  count: number;
  description: string;
  accentColor: string;
}
