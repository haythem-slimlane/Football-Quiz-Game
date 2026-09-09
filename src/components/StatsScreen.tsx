import React, { useState } from 'react';
import { 
  Trophy, Medal, Flame, Check, Clock, RotateCcw, 
  Award, Star, Trash2, AlertCircle 
} from 'lucide-react';
import { getUserStats, getSessionHistory, clearHistory, UserStats } from '../utils/storage';
import { playTapSound } from '../utils/audio';

export const StatsScreen: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [history, setHistory] = useState(getSessionHistory());
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const totalAnswered = stats.totalQuestionsAnswered || 1;
  const globalAccuracy = Math.round((stats.totalCorrectAnswers / totalAnswered) * 100);

  const allBadges = [
    {
      id: 'welcome',
      title: 'الانطلاقة الأولى',
      desc: 'بدء أول رحلة في عالم كويز كووورة',
      icon: '⚽',
      unlocked: true,
    },
    {
      id: 'first_match',
      title: 'صافرة البداية',
      desc: 'إكمال أول مباراة كاملة في التطبيق',
      icon: '🏁',
      unlocked: stats.unlockedBadges.includes('first_match'),
    },
    {
      id: 'sharp_shooter',
      title: 'قناص الشباك',
      desc: 'الإجابة على 10 أسئلة صحيحة في جولة واحدة',
      icon: '🎯',
      unlocked: stats.unlockedBadges.includes('sharp_shooter'),
    },
    {
      id: 'combo_master',
      title: 'سلسلة الملوك',
      desc: 'تحقيق 5 إجابات صحيحة متتالية',
      icon: '🔥',
      unlocked: stats.unlockedBadges.includes('combo_master'),
    },
    {
      id: 'legendary_streak',
      title: 'سلسلة أسطورية',
      desc: 'تحقيق 10 إجابات صحيحة متتالية دون انقطاع',
      icon: '⚡',
      unlocked: stats.unlockedBadges.includes('legendary_streak'),
    },
    {
      id: 'flawless_victory',
      title: 'العلامة الكاملة',
      desc: 'إنهاء جولة من 10 أسئلة على الأقل دون أي خطأ',
      icon: '👑',
      unlocked: stats.unlockedBadges.includes('flawless_victory'),
    },
    {
      id: 'scholar_50',
      title: 'باحث كروي',
      desc: 'الإجابة على 50 سؤالاً من بنك الأسئلة',
      icon: '📚',
      unlocked: stats.unlockedBadges.includes('scholar_50'),
    },
    {
      id: 'encyclopedia_100',
      title: 'موسوعة كروية حية',
      desc: 'الإجابة على 100 سؤال من بنك الأسئلة',
      icon: '🏆',
      unlocked: stats.unlockedBadges.includes('encyclopedia_100'),
    },
  ];

  const handleReset = () => {
    playTapSound();
    clearHistory();
    setStats(getUserStats());
    setHistory([]);
    setShowConfirmReset(false);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-8 overflow-y-auto">
      {/* Confirm Reset Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">تصفير الإحصائيات؟</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              سيتم حذف جميع إحصائياتك وسجل المباريات والميداليات المكتسبة. هل تود المتابعة؟
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white mb-0.5">سجل الإنجازات والإحصائيات</h2>
          <p className="text-xs text-slate-400">تتبع مسيرتك الكروية ومستواك المعرفي</p>
        </div>

        <button
          onClick={() => setShowConfirmReset(true)}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-colors"
          title="تصفير الإحصائيات"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Lifetime Stats Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">المباريات الملعوبة</span>
          <span className="text-2xl font-bold text-white font-mono">{stats.gamesPlayed}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">نسبة الدقة الكلية</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">
            {stats.totalQuestionsAnswered > 0 ? `${globalAccuracy}%` : '0%'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">أعلى نتيجة مسجلة</span>
          <span className="text-2xl font-bold text-amber-400 font-mono">{stats.bestScore}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">أفضل سلسلة متتالية</span>
          <span className="text-2xl font-bold text-rose-400 font-mono flex items-center justify-center gap-1">
            🔥 {stats.bestStreak}
          </span>
        </div>
      </div>

      {/* Badges and Medals Gallery */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Medal className="w-4 h-4 text-amber-400" />
            <span>ميداليات التميز الكروي</span>
          </h3>
          <span className="text-xs text-emerald-400 font-medium">
            {stats.unlockedBadges.length} من {allBadges.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {allBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-2xl border transition-all ${
                badge.unlocked
                  ? 'bg-slate-800/80 border-amber-500/30 text-white'
                  : 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-40'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <h4 className="text-xs font-bold leading-tight">{badge.title}</h4>
                  <span className="text-[10px] text-amber-400/90 font-medium">
                    {badge.unlocked ? 'مكتسبة ✓' : 'مقفلة'}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {badge.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Match History List */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>سجل آخر المباريات ({history.length})</span>
          </h3>
        </div>

        {history.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-850/60 border border-slate-800 text-center text-xs text-slate-400">
            لم تلعب أي مباريات بعد. انطلق الآن في أحد أوضاع اللعب!
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map((sess, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white mb-0.5">{sess.mode.title}</h4>
                  <span className="text-[11px] text-slate-400">
                    {sess.correctAnswersCount} من {sess.totalQuestions} صحيحة ({Math.round((sess.correctAnswersCount / (sess.totalQuestions || 1)) * 100)}%)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-400 font-mono block">
                    +{sess.score} نقطة
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(sess.completedAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
