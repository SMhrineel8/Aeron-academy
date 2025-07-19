import React, { useState, useEffect } from 'react';
import { Search, Play, BookOpen, Award, Flame, Star, Users, Target, ChevronRight, Heart, Bookmark, Share2, TrendingUp, Brain, Zap, Trophy, Calendar, Clock, Volume2, VolumeX } from 'lucide-react';

const YOUTUBE_API_KEY = 'AIzaSyC5byWjFtXMQL5hhLw65I0q5zJTlFPEcnE';

const LearnlyApp = () => {
  const [currentView, setCurrentView] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [userProfile, setUserProfile] = useState({
    name: '',
    interests: [],
    level: 'beginner',
    learningStyle: 'visual',
    streak: 7,
    totalPoints: 2450,
    currentLevel: 12
  });
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [sageState, setSageState] = useState('base');
  const [showCelebration, setShowCelebration] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sage the AI Mascot Component
  const SageMascot = ({ state, message, className = "" }) => {
    const getSageAnimation = () => {
      switch(state) {
        case 'excited':
          return 'animate-bounce';
        case 'thinking':
          return 'animate-pulse';
        case 'celebrating':
          return 'animate-spin';
        default:
          return 'animate-float';
      }
    };

    return (
      <div className={`relative ${className}`}>
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center ${getSageAnimation()} transition-all duration-300`}>
          <div className="text-white text-2xl">🦉</div>
          {state === 'thinking' && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          )}
          {state === 'excited' && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse opacity-20"></div>
          )}
        </div>
        {message && (
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 max-w-xs text-sm border border-gray-200">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
            {message}
          </div>
        )}
      </div>
    );
  };

  // Celebration Animation Component
  const CelebrationOverlay = ({ show, type = 'achievement' }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        <div className="relative">
          {/* Confetti particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}px`,
                top: `${Math.random() * 100}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
          
          {/* Main celebration message */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl transform scale-110 animate-celebration">
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

  // YouTube Content Search
  const searchYouTubeContent = async (query) => {
    setIsSearching(true);
    setSageState('thinking');
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' tutorial')}&type=video&videoDuration=medium&relevanceLanguage=en&maxResults=10&key=${YOUTUBE_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.items) {
        const formattedCourses = data.items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          channel: item.snippet.channelTitle,
          type: 'video',
          duration: '10-15 min',
          difficulty: userProfile.level,
          rating: (4.0 + Math.random() * 1.0).toFixed(1),
          views: Math.floor(Math.random() * 100000) + 10000,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));
        
        setCourses(formattedCourses);
      }
    } catch (error) {
      console.error('Error searching YouTube:', error);
      // Fallback mock data
      setCourses([
        {
          id: '1',
          title: 'Complete Python Beginner Course',
          description: 'Learn Python from scratch with hands-on examples',
          thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop',
          channel: 'CodeMaster',
          type: 'video',
          duration: '45 min',
          difficulty: 'beginner',
          rating: '4.8',
          views: 125000,
          url: 'https://youtube.com/watch?v=example'
        }
      ]);
    }
    
    setIsSearching(false);
    setSageState('excited');
  };

  // Onboarding Component
  const OnboardingFlow = () => {
    const steps = [
      {
        title: "Welcome to Learnly!",
        subtitle: "Ready to unlock your potential?",
        content: (
          <div className="text-center space-y-6">
            <SageMascot state="excited" message="Ready to unlock your potential? I'm Sage, your learning companion!" />
            <div className="space-y-4">
              <input
                type="text"
                placeholder="What's your name?"
                className="w-full p-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none transition-all"
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
              />
            </div>
          </div>
        )
      },
      {
        title: "What interests you?",
        subtitle: "Choose your learning adventure",
        content: (
          <div className="space-y-6">
            <SageMascot state="base" message="Amazing choice! I can already see your future success." />
            <div className="grid grid-cols-2 gap-4">
              {['Programming', 'Design', 'Business', 'Science', 'Arts', 'Languages'].map(interest => (
                <div
                  key={interest}
                  onClick={() => {
                    const newInterests = userProfile.interests.includes(interest)
                      ? userProfile.interests.filter(i => i !== interest)
                      : [...userProfile.interests, interest];
                    setUserProfile({...userProfile, interests: newInterests});
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    userProfile.interests.includes(interest)
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{interest === 'Programming' ? '💻' : interest === 'Design' ? '🎨' : interest === 'Business' ? '💼' : interest === 'Science' ? '🔬' : interest === 'Arts' ? '🎭' : '🌍'}</div>
                    <div className="font-medium">{interest}</div>
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
            <SageMascot state="base" message="Perfect! I'll curate content that challenges but never overwhelms." />
            <div className="space-y-4">
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <div
                  key={level}
                  onClick={() => setUserProfile({...userProfile, level})}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    userProfile.level === level
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                    <div className="capitalize font-medium">{level}</div>
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
            <SageMascot state="base" message="I love visual learners! Get ready for some beautiful insights." />
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: 'visual', icon: '👁️', title: 'Visual', desc: 'Charts, diagrams, videos' },
                { type: 'auditory', icon: '👂', title: 'Auditory', desc: 'Podcasts, lectures, music' },
                { type: 'kinesthetic', icon: '✋', title: 'Hands-on', desc: 'Practice, experiments' },
                { type: 'reading', icon: '📚', title: 'Reading', desc: 'Articles, books, text' }
              ].map(style => (
                <div
                  key={style.type}
                  onClick={() => setUserProfile({...userProfile, learningStyle: style.type})}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    userProfile.learningStyle === style.type
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{style.icon}</div>
                    <div className="font-medium">{style.title}</div>
                    <div className="text-sm text-gray-600">{style.desc}</div>
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
              <div className="text-lg font-bold text-purple-800 mb-2">Welcome, {userProfile.name}! 🎉</div>
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

    const currentStepData = steps[onboardingStep - 1];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-600">Step {onboardingStep} of 5</div>
              <div className="text-sm font-medium text-purple-600">{Math.round((onboardingStep / 5) * 100)}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(onboardingStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentStepData.title}</h1>
              <p className="text-gray-600">{currentStepData.subtitle}</p>
            </div>

            {currentStepData.content}

            {/* Navigation */}
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

  // Course Card Component
  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
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
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{course.rating}</span>
            </div>
            <div className="text-gray-400">•</div>
            <div className="text-sm text-gray-600">{course.views.toLocaleString()} views</div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Bookmark className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">{course.channel}</div>
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

  // Dashboard Component
  const Dashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userProfile.name}! 🎉</h1>
              <p className="text-purple-100 mb-6">Ready to continue your learning journey?</p>
              
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.streak}</div>
                  <div className="text-sm text-purple-200">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.currentLevel}</div>
                  <div className="text-sm text-purple-200">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.totalPoints}</div>
                  <div className="text-sm text-purple-200">Total Points</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Continue Learning', icon: Play, color: 'purple', action: () => searchYouTubeContent('javascript basics') },
            { title: 'Practice Skills', icon: Target, color: 'blue', action: () => searchYouTubeContent('coding practice') },
            { title: 'Join Study Group', icon: Users, color: 'green', action: () => alert('Study groups coming soon!') },
            { title: 'View Progress', icon: TrendingUp, color: 'orange', action: () => alert('Progress tracking coming soon!') }
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-${action.color}-200`}
            >
              <action.icon className={`w-8 h-8 text-${action.color}-500 mb-3`} />
              <div className="font-medium text-gray-800">{action.title}</div>
            </button>
          ))}
        </div>

        {/* Course Results */}
        {courses.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {searchQuery ? `Results for "${searchQuery}"` : 'Recommended for You'}
              </h2>
              <button 
                onClick={() => searchYouTubeContent(searchQuery || 'programming')}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <span>Refresh</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        {/* Daily Challenge */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Daily Challenge</h3>
                <p className="text-gray-600">Complete today's challenge to earn bonus points!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">+500</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
            <h4 className="font-bold text-lg mb-2">Build a Simple Calculator</h4>
            <p className="text-gray-600 mb-4">Create a basic calculator using HTML, CSS, and JavaScript. Include addition, subtraction, multiplication, and division.</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">30 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Beginner</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 3000);
              }}
              className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
            >
              Start Challenge
            </button>
          </div>
        </div>

        {/* Learning Path */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Learning Path</h3>
          
          <div className="space-y-6">
            {[
              { title: 'HTML Fundamentals', progress: 100, status: 'completed' },
              { title: 'CSS Styling', progress: 75, status: 'active' },
              { title: 'JavaScript Basics', progress: 30, status: 'active' },
              { title: 'React Framework', progress: 0, status: 'locked' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  item.status === 'completed' ? 'bg-green-100' : 
                  item.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {item.status === 'completed' ? (
                    <Award className="w-6 h-6 text-green-600" />
                  ) : item.status === 'active' ? (
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-400"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'active' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{item.progress}%</span>
                  </div>
                </div>
                
                <button 
                  disabled={item.status === 'locked'}
                  onClick={() => {
                    if (item.status !== 'locked') {
                      searchYouTubeContent(item.title);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    item.status === 'locked' 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transform hover:scale-105'
                  }`}
                >
                  {item.status === 'completed' ? 'Review' : 
                   item.status === 'active' ? 'Continue' : 'Locked'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <CelebrationOverlay show={showCelebration} />
    </div>
  );

  // Main App Render
  if (currentView === 'onboarding') {
    return <OnboardingFlow />;
  }
  
  return <Dashboard />;
};

// CSS Animations for custom effects
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes confetti {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }
  
  @keyframes celebration {
    0% { transform: scale(0.8) rotate(-5deg); }
    50% { transform: scale(1.1) rotate(2deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-confetti {
    animation: confetti 3s ease-out forwards;
  }
  
  .animate-celebration {
    animation: celebration 0.6s ease-out;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export default function App() {
  return (
    <>
      <style>{styles}</style>
      <LearnlyApp />
    </>
  );
}