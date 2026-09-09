import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Check, BookOpen, Filter } from 'lucide-react';
import { allQuestions, quizCategories, isCategoryMatch, normalizeArabic } from '../data/questions';
import { playTapSound } from '../utils/audio';

export const EncyclopediaScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;

  const filteredQuestions = useMemo(() => {
    const normSearch = normalizeArabic(searchQuery);
    return allQuestions.filter(q => {
      const matchCat = isCategoryMatch(q.category, selectedCategory);
      if (!matchCat) return false;
      if (!normSearch) return true;

      const normQuestion = normalizeArabic(q.question);
      const normExplanation = normalizeArabic(q.explanation);
      const normOptions = q.options.some(opt => normalizeArabic(opt).includes(normSearch));

      return (
        normQuestion.includes(normSearch) ||
        normExplanation.includes(normSearch) ||
        normOptions
      );
    });
  }, [searchQuery, selectedCategory]);

  const displayedQuestions = useMemo(() => {
    return filteredQuestions.slice(0, page * PAGE_SIZE);
  }, [filteredQuestions, page]);

  const arabicLetters = ['أ', 'ب', 'ج', 'د'];

  return (
    <div className="flex-1 flex flex-col p-4 pb-6 overflow-y-auto">
      {/* Title */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white">موسوعة الـ 500 سؤال</h2>
        </div>
        <p className="text-xs text-slate-400">
          تصفح وراجع جميع الأسئلة الـ 500 وإجاباتها النموذجية وشروحاتها التوثيقية
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          placeholder="ابحث في نص السؤال أو الخيارات (مثال: ريال مدريد، ميسي، تونس...)"
          className="w-full py-2.5 pr-10 pl-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
        <button
          onClick={() => { playTapSound(); setSelectedCategory('all'); setPage(1); }}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          الكل (500)
        </button>
        {quizCategories.slice(1).map(cat => (
          <button
            key={cat.id}
            onClick={() => { playTapSound(); setSelectedCategory(cat.name); setPage(1); }}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              selectedCategory === cat.name
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3 px-1">
        <span>عرض {displayedQuestions.length} من {filteredQuestions.length} سؤالاً</span>
        {filteredQuestions.length === 0 && <span className="text-rose-400">لا توجد نتائج مطابقة</span>}
      </div>

      {/* Questions Accordion List */}
      <div className="flex flex-col gap-2.5 mb-4">
        {displayedQuestions.map((q) => {
          const isExpanded = expandedId === q.id;
          return (
            <div
              key={q.id}
              className="rounded-2xl bg-slate-800/60 border border-slate-700/60 overflow-hidden transition-all"
            >
              <button
                onClick={() => {
                  playTapSound();
                  setExpandedId(isExpanded ? null : q.id);
                }}
                className="w-full p-3.5 text-right flex items-start justify-between gap-3 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {q.id}
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {q.question}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 font-medium">
                        {q.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        صعوبة: {q.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="p-3.5 pt-0 border-t border-slate-700/60 bg-slate-850/50">
                  <div className="grid grid-cols-1 gap-1.5 my-2">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctIndex;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-xl text-xs flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 font-bold'
                              : 'bg-slate-900/60 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${
                              isCorrect ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {arabicLetters[optIdx]}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isCorrect && (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                              <Check className="w-3.5 h-3.5" />
                              <span>الإجابة النموذجية</span>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 text-xs text-slate-300 leading-relaxed border border-slate-800">
                    <span className="font-bold text-amber-400 block mb-0.5">💡 معلومة توثيقية:</span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {displayedQuestions.length < filteredQuestions.length && (
        <button
          onClick={() => {
            playTapSound();
            setPage(p => p + 1);
          }}
          className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-all"
        >
          تحميل 25 سؤالاً إضافياً...
        </button>
      )}
    </div>
  );
};
