import React, { useState, useEffect } from 'react';
import { 
  Trophy, RotateCcw, Home, Share2, Check, X, 
  ChevronDown, ChevronUp, Star, Award, Clock, Flame 
} from 'lucide-react';
import { QuizSessionSummary } from '../types';
import { playTapSound, playFanfareSound } from '../utils/audio';

interface ResultScreenProps {
  summary: QuizSessionSummary;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  summary,
  onPlayAgain,
  onGoHome,
}) => {
  const [showReview, setShowReview] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    playFanfareSound();
  }, []);

  const total = summary.totalQuestions || 1;
  const accuracy = Math.round((summary.correctAnswersCount / total) * 100);

  let title = 'محاولة جيدة!';
  let subtitle = 'واصل التدريب لتصبح خبيراً كروياً لا يشق له غبار!';
  let stars = 1;

  if (accuracy >= 85) {
    title = 'أداء أسطوري مذهل! 🏆';
    subtitle = 'أنت موسوعة كروية حقيقية وتستحق رتبة أسطورة الملاعب!';
    stars = 3;
  } else if (accuracy >= 60) {
    title = 'أداء كروي رائع جداً! ⚽';
    subtitle = 'معلوماتك الكروية ممتازة وتنافس أقوى المحللين!';
    stars = 2;
  }

  const handleShare = async () => {
    playTapSound();
    const shareText = `حصدت ${summary.score} نقطة بنسبة دقة ${accuracy}% في تطبيق كويز كووورة (تحدي الـ 500 سؤال)! ⚽🏆 هل تستطيع التغلب علي؟`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'كويز كووورة - نتيجة التحدي',
          text: shareText,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const arabicLetters = ['أ', 'ب', 'ج', 'د'];

  return (
    <div className="flex-1 flex flex-col p-4 pb-8 overflow-y-auto">
      {/* Top Trophy Banner */}
      <div className="text-center py-4 mb-3">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto flex items-center justify-center shadow-xl shadow-amber-500/20 border-2 border-amber-200 mb-3 animate-bounce">
          <Trophy className="w-10 h-10 text-slate-950" />
        </div>

        {/* Stars rating */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-6 h-6 ${
                idx < stars
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_#f59e0b]'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {/* Score */}
        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">مجموع النقاط</span>
          <span className="text-2xl font-bold text-amber-400 font-mono">{summary.score}</span>
        </div>

        {/* Accuracy */}
        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">نسبة الدقة</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">{accuracy}%</span>
        </div>

        {/* Correct Answers */}
        <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">إجابات صحيحة</span>
            <span className="text-sm font-bold text-emerald-300">
              {summary.correctAnswersCount} من {summary.totalQuestions}
            </span>
          </div>
        </div>

        {/* Wrong Answers */}
        <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <X className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">إجابات خاطئة</span>
            <span className="text-sm font-bold text-rose-300">
              {summary.wrongAnswersCount}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Highlights */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 mb-5 text-xs text-slate-300">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-rose-500" />
          <span>أفضل سلسلة: </span>
          <span className="font-bold text-white">{summary.streakBest} متتالية</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>الوقت: </span>
          <span className="font-bold text-white">{summary.totalTimeSeconds} ثانية</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 mb-5">
        <button
          id="play-again-btn"
          onClick={() => {
            playTapSound();
            onPlayAgain();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة المحاولة في هذا الوضع</span>
        </button>

        <div className="flex gap-2">
          <button
            id="share-result-btn"
            onClick={handleShare}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{copied ? 'تم نسخ النتيجة!' : 'مشاركة النتيجة'}</span>
          </button>

          <button
            id="go-home-btn"
            onClick={() => {
              playTapSound();
              onGoHome();
            }}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs"
          >
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>الرئيسية</span>
          </button>
        </div>
      </div>

      {/* Answers Review Accordion */}
      <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => {
            playTapSound();
            setShowReview(!showReview);
          }}
          className="w-full p-4 flex items-center justify-between text-right text-xs font-bold text-slate-200 hover:bg-slate-850 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>مراجعة جميع أسئلة هذه الجولة ({summary.answers.length})</span>
          </span>
          {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showReview && (
          <div className="p-3 pt-0 flex flex-col gap-3 border-t border-slate-800/80">
            {summary.answers.map((ans, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border text-xs ${
                  ans.isCorrect 
                    ? 'bg-emerald-950/20 border-emerald-500/30' 
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-bold text-white">
                    {idx + 1}. {ans.question.question}
                  </span>
                  {ans.isCorrect ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0">
                      صحيح
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold shrink-0">
                      خاطئ
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-slate-300 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">الإجابة الصحيحة:</span>
                    <span className="font-semibold text-emerald-300">
                      {arabicLetters[ans.question.correctIndex]}. {ans.question.options[ans.question.correctIndex]}
                    </span>
                  </div>
                  {!ans.isCorrect && ans.selectedOptionIndex >= 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">إجابتك:</span>
                      <span className="font-semibold text-rose-300">
                        {arabicLetters[ans.selectedOptionIndex]}. {ans.question.options[ans.selectedOptionIndex]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-2 rounded-lg bg-slate-900/80 text-[11px] text-slate-300 leading-relaxed">
                  💡 {ans.question.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
