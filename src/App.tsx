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
  const anim =
    state === 'excited'    ? 'animate-bounce' :
    state === 'thinking'   ? 'animate-pulse'  :
    state === 'celebrating'? 'animate-spin'   :
                             'animate-float';

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
        description: 'Learn Python from scratch with hands-on examples',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop',
        channel: 'CodeMaster',
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
      {
        title: "What interests you?",
        subtitle: "Choose your learning adventure",
        content: (
          <div className="space-y-6">
            <SageMascot
              state="base"
              message="Amazing choice! I can already see your future success."
              inline
            />
            <div className="grid grid-cols-2 gap-4">
              {['Programming','Design','Business','Science','Arts','Languages'].map(i => (
                <div
                  key={i}
                  onClick={() => {
                    const ints = userProfile.interests.includes(i)
                      ? userProfile.interests.filter(x=>x!==i)
                      : [...userProfile.interests, i];
                    setUserProfile({ ...userProfile, interests: ints });
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                    userProfile.interests.includes(i)
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {i==='Programming'?'💻':i==='Design'?'🎨':i==='Business'?'💼':i==='Science'?'🔬':i==='Arts'?'🎭':'🌍'}
                    </div>
                    <div className="font-medium">{i}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        title: "Your Experience Level",
        subtitle: "Help me personalize your journey",
        content: (
          <div className="space-y-6">
            <SageMascot state="base" message="Perfect! I'll curate content that challenges but never overwhelms." inline />
            <div className="space-y-4">
              {['beginner','intermediate','advanced'].map(l => (
                <div
                  key={l}
                  onClick={() => setUserProfile({ ...userProfile, level: l })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                    userProfile.level === l
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                    <div className="capitalize font-medium">{l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        title: "Learning Style",
        subtitle: "How do you learn best?",
        content: (
          <div className="space-y-6">
            <SageMascot state="base" message="I love visual learners! Get ready for some beautiful insights." inline />
            <div className="grid grid-cols-2 gap-4">
              {[
                { type:'visual', icon:'👁️', title:'Visual', desc:'Charts, diagrams, videos' },
                { type:'auditory', icon:'👂', title:'Auditory', desc:'Podcasts, lectures, music' },
                { type:'kinesthetic', icon:'✋', title:'Hands-on', desc:'Practice, experiments' },
                { type:'reading', icon:'📚', title:'Reading', desc:'Articles, books, text' }
              ].map(s => (
                <div
                  key={s.type}
                  onClick={() => setUserProfile({ ...userProfile, learningStyle: s.type })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                    userProfile.learningStyle === s.type
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm text-gray-600">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        title: "You're All Set!",
        subtitle: "Your learning sanctuary is ready",
        content: (
          <div className="text-center space-y-6">
            <SageMascot state="celebrating" message="Your learning sanctuary is ready! Let's make magic happen." />
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-2xl">
              <div className="text-lg font-bold text-purple-800 mb-2">
                Welcome, {userProfile.name}! 🎉
              </div>
              <div className="text-gray-600 mb-4">
                Ready to explore {userProfile.interests.join(', ')} at {userProfile.level} level
              </div>
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userProfile.streak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userProfile.totalPoints}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userProfile.currentLevel}</div>
                  <div className="text-sm text-gray-600">Level</div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ];

    const current = steps[onboardingStep - 1];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-600">
                Step {onboardingStep} of 5
              </div>
              <div className="text-sm font-medium text-purple-600">
                {Math.round((onboardingStep / 5) * 100)}%
              </div>
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {current.title}
              </h1>
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
      <div className="relative">
        <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-sm">
          {course.duration}
        </div>
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium">
          {course.difficulty}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{course.rating}</span>
          </div>
          <div className="text-sm text-gray-600">{course.views.toLocaleString()} views</div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{course.channel}</span>
          <button
            onClick={() => window.open(course.url, '_blank')}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            <Play className="w-4 h-4" />
            <span>Watch</span>
          </button>
        </div>
      </div>
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
              <SageMascot state={sageState} className="hidden sm:block" />
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
        {/* Welcome, Quick Actions, Course Results, Daily Challenge, Learning Path */}
      </main>
      <CelebrationOverlay show={showCelebration} />
    </div>
  );

  return currentView === 'onboarding' ? <OnboardingFlow /> : <Dashboard />;
};

export default function App() {
  return <LearnlyApp />;
}
