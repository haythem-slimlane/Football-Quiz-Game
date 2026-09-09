import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Heart, Flame, Clock, X, Check, ArrowLeft, 
  HelpCircle, Sparkles, Volume2, VolumeX, AlertCircle 
} from 'lucide-react';
import { Question, GameModeInfo, UserAnswer, QuizSessionSummary } from '../types';
import { allQuestions, isCategoryMatch } from '../data/questions';
import { 
  playCorrectSound, playWrongSound, playTapSound, 
  playTickSound, playLifelineSound, isSoundEnabled, toggleSound 
} from '../utils/audio';

interface QuizScreenProps {
  mode: GameModeInfo;
  selectedCategoryName?: string;
  onFinishQuiz: (summary: QuizSessionSummary) => void;
  onExitQuiz: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  mode,
  selectedCategoryName,
  onFinishQuiz,
  onExitQuiz,
}) => {
  // 1. Prepare questions for this session
  const questionsList = useMemo(() => {
    let pool = [...allQuestions];
    if (selectedCategoryName && selectedCategoryName !== 'جميع الأسئلة' && selectedCategoryName !== 'all') {
      const filtered = pool.filter(q => isCategoryMatch(q.category, selectedCategoryName));
      if (filtered.length > 0) {
        pool = filtered;
      }
    }
    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    // Limit count based on mode
    if (mode.id === 'ten_questions') return shuffled.slice(0, 10);
    if (mode.id === 'twenty_questions') return shuffled.slice(0, 20);
    if (mode.id === 'classic') return shuffled.slice(0, 15);
    if (mode.id === 'categories') return shuffled.slice(0, 10);
    if (mode.id === 'challenge') return shuffled; // Sudden death: continuous
    if (mode.id === 'random') return shuffled; // Infinite mode
    return shuffled.slice(0, 15);
  }, [mode, selectedCategoryName]);

  // Session state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(mode.hasLives ? (mode.initialLives ?? 3) : 999);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Lifelines availability
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedPlusTime, setUsedPlusTime] = useState(false);
  const [usedSkip, setUsedSkip] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);

  // Timer state
  const defaultTimer = mode.timePerQuestion || 20;
  const [timeLeft, setTimeLeft] = useState(defaultTimer);
  const [timerActive, setTimerActive] = useState(true);
  const [sessionStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion: Question | undefined = questionsList[currentIndex];

  const handleFinish = useCallback((finalAnswers: UserAnswer[], finalScore: number, finalStreakBest: number) => {
    const totalTimeSeconds = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
    const correctCount = finalAnswers.filter(a => a.isCorrect).length;
    const wrongCount = finalAnswers.length - correctCount;

    const summary: QuizSessionSummary = {
      mode,
      category: selectedCategoryName,
      totalQuestions: finalAnswers.length,
      correctAnswersCount: correctCount,
      wrongAnswersCount: wrongCount,
      score: finalScore,
      streakBest: finalStreakBest,
      totalTimeSeconds,
      answers: finalAnswers,
      completedAt: new Date().toISOString(),
    };
    onFinishQuiz(summary);
  }, [mode, selectedCategoryName, sessionStartTime, onFinishQuiz]);

  // Handle Question Answer
  const handleSelectOption = useCallback((optionIndex: number, isTimeout: boolean = false) => {
    if (isAnswered || !currentQuestion) return;

    setTimerActive(false);
    setIsAnswered(true);
    setSelectedOption(optionIndex);

    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    const isCorrect = !isTimeout && optionIndex === currentQuestion.correctIndex;

    let newStreak = streak;
    let newBest = bestStreak;
    let newLives = lives;
    let pointsEarned = 0;

    if (isCorrect) {
      playCorrectSound();
      newStreak = streak + 1;
      newBest = Math.max(bestStreak, newStreak);
      setStreak(newStreak);
      setBestStreak(newBest);

      // Points formula: 100 base + remaining seconds * 5 + streak bonus
      const streakMultiplier = newStreak >= 5 ? 2.0 : newStreak >= 3 ? 1.5 : 1.0;
      pointsEarned = Math.round((100 + timeLeft * 5) * streakMultiplier);
      setScore(prev => prev + pointsEarned);
    } else {
      playWrongSound();
      newStreak = 0;
      setStreak(0);
      if (mode.hasLives) {
        newLives = lives - 1;
        setLives(newLives);
      }
    }

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion,
      selectedOptionIndex: optionIndex,
      isCorrect,
      timeSpentSeconds: timeSpent,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // If out of lives, end quiz immediately after short delay
    if (mode.hasLives && newLives <= 0) {
      setTimeout(() => {
        handleFinish(updatedAnswers, score + pointsEarned, newBest);
      }, 1600);
    }
  }, [
    isAnswered, currentQuestion, questionStartTime, streak, bestStreak, 
    lives, mode.hasLives, timeLeft, answers, score, handleFinish
  ]);

  // Timer Tick
  useEffect(() => {
    if (!timerActive || isAnswered || !mode.hasTimer) return;

    if (timeLeft <= 0) {
      handleSelectOption(-1, true); // Timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 4 && prev > 1) {
          playTickSound();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, isAnswered, timeLeft, mode.hasTimer, handleSelectOption]);

  // Advance to next question
  const handleNextQuestion = () => {
    playTapSound();
    if (currentIndex + 1 >= questionsList.length) {
      // Completed all questions
      handleFinish(answers, score, bestStreak);
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setHiddenOptions([]);
      setTimeLeft(defaultTimer);
      setTimerActive(true);
      setQuestionStartTime(Date.now());
    }
  };

  // Lifeline: 50:50
  const handleFiftyFifty = () => {
    if (usedFiftyFifty || isAnswered || !currentQuestion) return;
    playLifelineSound();
    setUsedFiftyFifty(true);

    const wrongIndexes = [0, 1, 2, 3].filter(idx => idx !== currentQuestion.correctIndex);
    // Shuffle and pick 2 to eliminate
    const toHide = wrongIndexes.sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(toHide);
  };

  // Lifeline: +15 Seconds
  const handlePlusTime = () => {
    if (usedPlusTime || isAnswered || !mode.hasTimer) return;
    playLifelineSound();
    setUsedPlusTime(true);
    setTimeLeft(prev => prev + 15);
  };

  // Lifeline: Skip Question
  const handleSkipQuestion = () => {
    if (usedSkip || isAnswered || !currentQuestion) return;
    playLifelineSound();
    setUsedSkip(true);
    // Proceed directly to next question without penalty
    if (currentIndex + 1 >= questionsList.length) {
      handleFinish(answers, score, bestStreak);
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setHiddenOptions([]);
      setTimeLeft(defaultTimer);
      setTimerActive(true);
      setQuestionStartTime(Date.now());
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <p className="text-sm text-slate-300">جارٍ تجهيز الأسئلة...</p>
      </div>
    );
  }

  // Timer percentage and color
  const timerPercentage = Math.max(0, (timeLeft / defaultTimer) * 100);
  const timerColor = timeLeft > 10 ? 'bg-emerald-400' : timeLeft > 5 ? 'bg-amber-400' : 'bg-rose-500 animate-pulse';

  const arabicLetterLabels = ['أ', 'ب', 'ج', 'د'];

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto relative">
      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">مغادرة الاختبار؟</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              هل أنت متأكد من رغبتك في التوقف الآن؟ سيتم حفظ إحصائيات الأسئلة التي أجبت عليها.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  playTapSound();
                  setShowExitConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                مواصلة اللعب
              </button>
              <button
                onClick={() => {
                  playTapSound();
                  setShowExitConfirm(false);
                  onExitQuiz();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                تأكيد الخروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80">
        <button
          onClick={() => {
            playTapSound();
            setShowExitConfirm(true);
          }}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          title="خروج"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/60">
            {mode.title}
          </span>
          {streak >= 2 && (
            <div className="flex items-center gap-1 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-xl animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current text-rose-500" />
              <span>x{streak >= 5 ? '3' : streak >= 3 ? '2' : '1.5'}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block leading-none">النقاط</span>
            <span className="text-sm font-bold text-amber-400 font-mono">{score}</span>
          </div>
          <button
            onClick={() => {
              const updated = toggleSound();
              setSoundOn(updated);
              if (updated) playTapSound();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Question Progress & Lives Row */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-200">
            السؤال {currentIndex + 1}
          </span>
          {mode.questionCount && (
            <span className="text-xs text-slate-500">
              / {mode.questionCount}
            </span>
          )}
        </div>

        {/* Lives Display */}
        {mode.hasLives && (
          <div className="flex items-center gap-1">
            {Array.from({ length: mode.initialLives ?? 3 }).map((_, idx) => (
              <Heart
                key={idx}
                className={`w-4 h-4 transition-all duration-300 ${
                  idx < lives
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-700 fill-slate-800 scale-90 opacity-40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Animated Countdown Progress Bar */}
      {mode.hasTimer && (
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${timerColor}`}
            style={{ width: `${timerPercentage}%` }}
          ></div>
        </div>
      )}

      {/* Lifelines Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        <button
          id="lifeline-fifty-fifty"
          disabled={usedFiftyFifty || isAnswered}
          onClick={handleFiftyFifty}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
            usedFiftyFifty
              ? 'opacity-30 border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed'
              : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 active:scale-95'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>50:50</span>
        </button>

        {mode.hasTimer && (
          <button
            id="lifeline-plus-time"
            disabled={usedPlusTime || isAnswered}
            onClick={handlePlusTime}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
              usedPlusTime
                ? 'opacity-30 border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 active:scale-95'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>+15 ث</span>
          </button>
        )}

        <button
          id="lifeline-skip"
          disabled={usedSkip || isAnswered}
          onClick={handleSkipQuestion}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
            usedSkip
              ? 'opacity-30 border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 active:scale-95'
          }`}
        >
          <ArrowLeft className="w-3 h-3" />
          <span>تخطي</span>
        </button>
      </div>

      {/* Main Question Card */}
      <div className="w-full bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-3xl p-5 shadow-xl mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
            {currentQuestion.category}
          </span>
          <span className="text-slate-400 font-sans text-[11px]">
            {mode.hasTimer ? `${timeLeft} ثانية` : 'بدون وقت'}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed tracking-wide">
          {currentQuestion.question}
        </h2>
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 gap-2.5 mb-4">
        {currentQuestion.options.map((option, index) => {
          const isHidden = hiddenOptions.includes(index);
          if (isHidden) {
            return (
              <div 
                key={index} 
                className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/40 opacity-20 pointer-events-none text-slate-600 text-sm"
              >
                ---
              </div>
            );
          }

          const isSelected = selectedOption === index;
          const isCorrect = index === currentQuestion.correctIndex;

          let btnStyles = 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/70 text-slate-100';

          if (isAnswered) {
            if (isCorrect) {
              btnStyles = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950';
            } else if (isSelected) {
              btnStyles = 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-md shadow-rose-950';
            } else {
              btnStyles = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={index}
              id={`option-btn-${index}`}
              disabled={isAnswered}
              onClick={() => handleSelectOption(index)}
              className={`w-full p-3.5 rounded-2xl border text-right transition-all duration-200 flex items-center justify-between active:scale-[0.99] font-medium text-sm leading-snug ${btnStyles}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isAnswered && isCorrect 
                    ? 'bg-emerald-500 text-slate-950'
                    : isAnswered && isSelected
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-700/60 text-slate-300'
                }`}>
                  {arabicLetterLabels[index]}
                </span>
                <span>{option}</span>
              </div>

              {isAnswered && isCorrect && (
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mr-2" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <X className="w-5 h-5 text-rose-400 shrink-0 mr-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation & Next Button Card */}
      {isAnswered && (
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              معلومة كروية موثقة
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {currentQuestion.explanation}
          </p>

          <button
            id="next-question-btn"
            onClick={handleNextQuestion}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>السؤال التالي</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
