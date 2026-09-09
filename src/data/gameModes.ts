import { GameModeInfo } from '../types';

export const CATEGORY_GAME_MODE: GameModeInfo = {
  id: 'categories',
  title: 'حسب التصنيف',
  subtitle: 'اختر مجالك المفضل',
  description: '13 تصنيفاً متخصصاً: كأس العالم، دوري الأبطال، الكرة التونسية، الأساطير، التكتيك، والقوانين.',
  iconName: 'Grid',
  badgeText: '13 تصنيف',
  questionCount: 10,
  hasTimer: true,
  timePerQuestion: 20,
  hasLives: true,
  initialLives: 3,
};

export const GAME_MODES: GameModeInfo[] = [
  {
    id: 'ten_questions',
    title: '10 أسئلة سريعة',
    subtitle: 'جولة مكثفة وخاطفة',
    description: '10 أسئلة منوعة لاختبار تركيزك وسرعة بديهتك في دقائق معدودة.',
    iconName: 'Zap',
    badgeText: 'سريع وممتع',
    questionCount: 10,
    hasTimer: true,
    timePerQuestion: 15,
    hasLives: false,
  },
  {
    id: 'twenty_questions',
    title: 'تحدي الـ 20 سؤالاً',
    subtitle: 'امتحان كروي شامل',
    description: '20 سؤالاً كروياً من شتى الميادين والبطولات لاكتشاف رتبتك الكروية الحقيقية.',
    iconName: 'Medal',
    badgeText: 'شامل',
    questionCount: 20,
    hasTimer: true,
    timePerQuestion: 20,
    hasLives: false,
  },
  {
    id: 'random',
    title: 'عشوائي بلا حدود',
    subtitle: 'مغامرة مفتوحة من 500 سؤال',
    description: 'رحلة لا تنتهي عبر بنك الأسئلة الشامل (500 سؤال) بدون توقف لاختبار شغفك اللامحدود.',
    iconName: 'Shuffle',
    badgeText: 'بلا حدود',
    hasTimer: true,
    timePerQuestion: 25,
    hasLives: true,
    initialLives: 5,
  },
];
