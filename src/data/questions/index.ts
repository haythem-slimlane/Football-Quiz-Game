import { Question } from '../../types';
import { worldCupQuestions } from './part1_worldCup';
import { championsLeagueQuestions } from './part2_championsLeague';
import { legendsQuestions } from './part3_legends';
import { clubsAndTeamsQuestions } from './part4_clubsAndNationalTeams';
import { coachesAndTacticsQuestions } from './part5_coachesAndTactics';
import { africanFootballQuestions } from './part6_africanFootball';
import { tunisianFootballQuestions } from './part7_tunisianFootball';
import { arabFootballQuestions } from './part8_arabFootball';
import { europeanLeaguesQuestions } from './part9_europeanLeagues';
import { ballonDorAndAwardsQuestions } from './part10_ballonDorAndAwards';
import { rulesAndRefereesQuestions } from './part11_rulesAndReferees';
import { stadiumsAndHistoryQuestions } from './part12_stadiumsAndHistory';
import { modernFootballAndRecordsQuestions } from './part13_modernFootballAndRecords';

export const allQuestions: Question[] = [
  ...worldCupQuestions,               // 1-45 (45)
  ...championsLeagueQuestions,        // 46-90 (45)
  ...legendsQuestions,                // 91-135 (45)
  ...clubsAndTeamsQuestions,          // 136-180 (45)
  ...coachesAndTacticsQuestions,      // 181-220 (40)
  ...africanFootballQuestions,        // 221-260 (40)
  ...tunisianFootballQuestions,       // 261-300 (40)
  ...arabFootballQuestions,           // 301-335 (35)
  ...europeanLeaguesQuestions,        // 336-375 (40)
  ...ballonDorAndAwardsQuestions,     // 376-410 (35)
  ...rulesAndRefereesQuestions,       // 411-445 (35)
  ...stadiumsAndHistoryQuestions,     // 446-475 (30)
  ...modernFootballAndRecordsQuestions // 476-500 (25)
];

// All distinct categories
export const quizCategories = [
  { id: 'all', name: 'جميع الأسئلة', count: 500, icon: 'Trophy' },
  { id: 'كأس العالم', name: 'كأس العالم', count: 45, icon: 'Globe' },
  { id: 'دوري أبطال أوروبا', name: 'دوري أبطال أوروبا', count: 45, icon: 'Sparkles' },
  { id: 'أساطير الكرة', name: 'أساطير الكرة', count: 45, icon: 'Crown' },
  { id: 'أندية ومنتخبات', name: 'أندية ومنتخبات', count: 45, icon: 'Shield' },
  { id: 'مدربون وتكتيك', name: 'مدربون وتكتيك', count: 40, icon: 'Target' },
  { id: 'كرة القدم الإفريقية', name: 'كرة القدم الإفريقية', count: 40, icon: 'Flame' },
  { id: 'كرة القدم التونسية', name: 'كرة القدم التونسية', count: 40, icon: 'Star' },
  { id: 'بطولات عربية', name: 'بطولات عربية', count: 35, icon: 'Compass' },
  { id: 'دوريات أوروبية', name: 'دوريات أوروبية', count: 40, icon: 'Award' },
  { id: 'الكرة الذهبية والجوائز', name: 'الكرة الذهبية والجوائز', count: 35, icon: 'Medal' },
  { id: 'قوانين وتحكيم', name: 'قوانين وتحكيم', count: 35, icon: 'CheckCircle2' },
  { id: 'ملاعب وتاريخ', name: 'ملاعب وتاريخ', count: 30, icon: 'Landmark' },
  { id: 'أرقام قياسية وكرة حديثة', name: 'أرقام قياسية وكرة حديثة', count: 25, icon: 'Zap' },
];
