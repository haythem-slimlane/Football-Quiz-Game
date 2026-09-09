import { QuizSessionSummary } from '../types';

export interface UserStats {
  gamesPlayed: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  bestScore: number;
  bestStreak: number;
  totalScore: number;
  unlockedBadges: string[];
}

const DEFAULT_STATS: UserStats = {
  gamesPlayed: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  bestScore: 0,
  bestStreak: 0,
  totalScore: 0,
  unlockedBadges: ['welcome'],
};

const STATS_KEY = 'kooora_quiz_user_stats';
const HISTORY_KEY = 'kooora_quiz_sessions_history';

export function getUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveSessionSummary(summary: QuizSessionSummary): UserStats {
  const currentStats = getUserStats();

  const newGamesPlayed = currentStats.gamesPlayed + 1;
  const newQuestionsAnswered = currentStats.totalQuestionsAnswered + summary.answers.length;
  const newCorrectAnswers = currentStats.totalCorrectAnswers + summary.correctAnswersCount;
  const newBestScore = Math.max(currentStats.bestScore, summary.score);
  const newBestStreak = Math.max(currentStats.bestStreak, summary.streakBest);
  const newTotalScore = currentStats.totalScore + summary.score;

  // Badges evaluation
  const badges = new Set(currentStats.unlockedBadges);
  badges.add('first_match');
  if (summary.correctAnswersCount >= 10) badges.add('sharp_shooter');
  if (summary.streakBest >= 5) badges.add('combo_master');
  if (summary.streakBest >= 10) badges.add('legendary_streak');
  if (newQuestionsAnswered >= 50) badges.add('scholar_50');
  if (newQuestionsAnswered >= 100) badges.add('encyclopedia_100');
  if (summary.wrongAnswersCount === 0 && summary.totalQuestions >= 10) badges.add('flawless_victory');

  const updatedStats: UserStats = {
    gamesPlayed: newGamesPlayed,
    totalQuestionsAnswered: newQuestionsAnswered,
    totalCorrectAnswers: newCorrectAnswers,
    bestScore: newBestScore,
    bestStreak: newBestStreak,
    totalScore: newTotalScore,
    unlockedBadges: Array.from(badges),
  };

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));

    // Save history (last 20 sessions)
    const rawHistory = localStorage.getItem(HISTORY_KEY);
    const history: QuizSessionSummary[] = rawHistory ? JSON.parse(rawHistory) : [];
    history.unshift(summary);
    if (history.length > 20) history.pop();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Ignore storage quota errors
  }

  return updatedStats;
}

export function getSessionHistory(): QuizSessionSummary[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore
  }
}
