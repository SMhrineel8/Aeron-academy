// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Play, BookOpen, Award, Flame, Star, Users, Target,
  ChevronRight, Bookmark, Share2, TrendingUp, Brain, Zap,
  Trophy, Calendar, Clock, Volume2, VolumeX
} from 'lucide-react';

const YOUTUBE_API_KEY = 'AIzaSyC5byWjFtXMQL5hhLw65I0q5zJTlFPEcnE';

const SageMascot = ({
  state,
  message,
  inline = false,
  className = ''
}: {
  state: 'base' | 'thinking' | 'excited' | 'celebrating',
  message?: string,
  inline?: boolean,
  className?: string
}) => {
  // only ‘thinking’ and ‘celebrating’ animate
  const anim =
    state === 'thinking'   ? 'animate-pulse'  :
    state === 'celebrating'? 'animate-spin'   :
                             '';

  if (inline) {
    return (
      <div className={`inline-flex items-center space-x-3 ${className}`}>
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600
            flex items-center justify-center ${anim} transition-all duration-300`}
        >
          <div className="text-white text-2xl">🦅</div>
        </div>
        {message && (
          <div className="bg-white rounded-lg shadow-lg p-3 text-sm border border-gray-200">
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div
        className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600
          flex items-center justify-center ${anim} transition-all duration-300`}
      >
        <div className="text-white text-2xl">🦅</div>
      </div>
      {message && (
        <div className="bg-white rounded-lg shadow-lg p-3 text-sm border border-gray-200">
          {message}
        </div>
      )}
    </div>
  );
};

const CelebrationOverlay = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="relative">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500
              rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}px`,
              top: `${Math.random() * 100}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white
          px-8 py-4 rounded-2xl shadow-2xl transform scale-110 animate-celebration">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-xl font-bold">Amazing Progress!</div>
            <div className="text-sm opacity-90">Keep up the great work!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LearnlyApp = () => {
  const [currentView, setCurrentView] = useState<'onboarding' | 'dashboard'>('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [userProfile, setUserProfile] = useState({
    name: '',
    interests: [] as string[],
    level: 'beginner',
    learningStyle: 'visual',
    streak: 7,
    totalPoints: 2450,
    currentLevel: 12
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sageState, setSageState] = useState<'base'|'thinking'|'excited'|'celebrating'>('base');
  const [showCelebration, setShowCelebration] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentView === 'onboarding' && onboardingStep === 1 && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [currentView, onboardingStep]);

  const searchYouTubeContent = async (query: string) => {
    setIsSearching(true);
    setSageState('thinking');
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' tutorial')}&type=video&videoDuration=medium&maxResults=10&key=${YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      if (data.items) {
        setCourses(data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          channel: item.snippet.channelTitle,
          duration: '10-15 min',
          difficulty: userProfile.level,
          rating: (4.0 + Math.random()).toFixed(1),
          views: Math.floor(Math.random() * 100000) + 10000,
          url: `https://youtube.com/watch?v=${item.id.videoId}`
        })));
      }
    } catch {
      setCourses([{
        id: '1',
        title: 'Complete Python Beginner Course',
        description: 'Learn Python from scratch',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop',
        channel: 'CodeMaster',
        duration: '45 min',
        difficulty: 'beginner',
        rating: '4.8',
        views: 125000,
        url: 'https://youtube.com/watch?v=example'
      }]);
    }
    setIsSearching(false);
    setSageState('excited');
  };

  const OnboardingFlow = () => {
    const steps = [
      {
        title: "Welcome to Learnly!",
        subtitle: "Ready to unlock your potential?",
        content: (
          <div className="max-w-md mx-auto space-y-6">
            <SageMascot
              state="excited"
              message="Ready to unlock your potential? I'm Eagle, your learning companion!"
              inline
            />
            <input
              ref={nameInputRef}
              type="text"
              placeholder="What's your name?"
              className="w-full p-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none transition-all"
              value={userProfile.name}
              onChange={e => setUserProfile({ ...userProfile, name: e.target.value })}
              onFocus={e => e.currentTarget.select()}
            />
          </div>
        )
      },
      // steps 2–5 unchanged (use the same content definitions from your doc)
    ];

    const current = steps[onboardingStep - 1];
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-600">Step {onboardingStep} of 5</div>
              <div className="text-sm font-medium text-purple-600">{Math.round((onboardingStep / 5) * 100)}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(onboardingStep / 5) * 100}%` }}
              />
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{current.title}</h1>
              <p className="text-gray-600">{current.subtitle}</p>
            </div>
            {current.content}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setOnboardingStep(Math.max(1, onboardingStep - 1))}
                disabled={onboardingStep === 1}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (onboardingStep === 5) {
                    setCurrentView('dashboard');
                    setShowCelebration(true);
                    setTimeout(() => setShowCelebration(false), 3000);
                  } else {
                    setOnboardingStep(onboardingStep + 1);
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {onboardingStep === 5 ? 'Start Learning!' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CourseCard = ({ course }: any) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* same card JSX from your doc */}
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Learnly
              </div>
              {/* static eagle, no bounce */}
              <SageMascot state="base" className="hidden sm:block" />
            </div>
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="What would you like to learn today?"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      searchYouTubeContent(searchQuery);
                    }
                  }}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5 text-gray-600" /> : <VolumeX className="w-5 h-5 text-gray-600" />}
              </button>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-2 rounded-full">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-orange-600">{userProfile.streak}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-2 rounded-full">
                <Trophy className="w-5 h-5 text-purple-500" />
                <span className="font-bold text-purple-600">{userProfile.totalPoints}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* rest of dashboard JSX from your doc */}
      </main>
      <CelebrationOverlay show={showCelebration} />
    </div>
  );

  return currentView === 'onboarding' ? <OnboardingFlow /> : <Dashboard />;
};

export default function App() {
  return <LearnlyApp />;
}
