import React, { useState } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { HomeScreen } from './components/HomeScreen';
import { CategoriesScreen } from './components/CategoriesScreen';
import { EncyclopediaScreen } from './components/EncyclopediaScreen';
import { StatsScreen } from './components/StatsScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { GameModeInfo, QuizSessionSummary } from './types';
import { saveSessionSummary } from './utils/storage';
import { GAME_MODES } from './data/gameModes';

type AppView = 'main' | 'quiz' | 'result';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('main');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedMode, setSelectedMode] = useState<GameModeInfo>(GAME_MODES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [lastSummary, setLastSummary] = useState<QuizSessionSummary | null>(null);

  const handleStartGame = (mode: GameModeInfo, categoryName?: string) => {
    setSelectedMode(mode);
    setSelectedCategory(categoryName);
    setActiveView('quiz');
  };

  const handleFinishQuiz = (summary: QuizSessionSummary) => {
    saveSessionSummary(summary);
    setLastSummary(summary);
    setActiveView('result');
  };

  const handlePlayAgain = () => {
    setActiveView('quiz');
  };

  const handleGoHome = () => {
    setActiveView('main');
    setActiveTab('home');
  };

  return (
    <AndroidFrame>
      {activeView === 'main' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto flex flex-col">
            {activeTab === 'home' && (
              <HomeScreen
                onStartGame={handleStartGame}
                onNavigateToCategories={() => setActiveTab('categories')}
                onNavigateToEncyclopedia={() => setActiveTab('encyclopedia')}
                onNavigateToStats={() => setActiveTab('stats')}
              />
            )}
            {activeTab === 'categories' && (
              <CategoriesScreen onSelectCategory={handleStartGame} />
            )}
            {activeTab === 'encyclopedia' && (
              <EncyclopediaScreen />
            )}
            {activeTab === 'stats' && (
              <StatsScreen />
            )}
          </div>

          <BottomNavBar
            currentTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        </div>
      )}

      {activeView === 'quiz' && (
        <QuizScreen
          mode={selectedMode}
          selectedCategoryName={selectedCategory}
          onFinishQuiz={handleFinishQuiz}
          onExitQuiz={handleGoHome}
        />
      )}

      {activeView === 'result' && lastSummary && (
        <ResultScreen
          summary={lastSummary}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      )}
    </AndroidFrame>
  );
}
