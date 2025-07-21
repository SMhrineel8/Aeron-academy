function OnboardingFlow({
  step,
  setStep,
  profile,
  setProfile,
  finish
}: {
  step: number,
  setStep: (n: number) => void,
  profile: any,
  setProfile: any,
  finish: () => void
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    if (step === 1 && nameRef.current) nameRef.current.focus();
  }, [step]);

  const interests = [
    'Programming', 'Design', 'Data Science', 'Marketing', 'Business',
    'Languages', 'Music', 'Art', 'Finance', 'Health', 'Writing', 'Photography'
  ];

  const levels = [
    { id: 'beginner', title: 'Beginner', desc: 'Just starting out' },
    { id: 'intermediate', title: 'Intermediate', desc: 'Some experience' },
    { id: 'advanced', title: 'Advanced', desc: 'Experienced learner' }
  ];

  const learningStyles = [
    { id: 'visual', title: 'Visual', desc: 'Learn through images, diagrams, and videos', icon: '👁️' },
    { id: 'auditory', title: 'Auditory', desc: 'Learn through listening and discussion', icon: '🎧' },
    { id: 'kinesthetic', title: 'Hands-on', desc: 'Learn through practice and doing', icon: '✋' },
    { id: 'reading', title: 'Reading', desc: 'Learn through text and written materials', icon: '📚' }
  ];

  const toggleInterest = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(newInterests);
    setProfile({ ...profile, interests: newInterests });
  };

  const steps = [
    {
      title: "Welcome to Aeron Academy!",
      subtitle: "Your AI-powered learning companion",
      icon: <User className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-6">
          <SageMascot state="excited" message="Hi! I'm Eagle, your personal learning mentor. Let's get started!" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What's your name?</label>
            <input
              ref={nameRef}
              type="text"
              placeholder="Enter your name"
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              onFocus={e => e.currentTarget.select()}
            />
          </div>
        </div>
      )
    },
    {
      title: "What interests you?",
      subtitle: "Select topics you'd like to learn",
      icon: <Target className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <SageMascot state="base" message="Choose what sparks your curiosity!" />
          <div className="grid grid-cols-2 gap-3">
            {interests.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                  selectedInterests.includes(interest)
                    ? 'border-purple-400 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "What's your level?",
      subtitle: "Help us personalize your experience",
      icon: <BookOpen className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <SageMascot state="base" message="No worries about your current level - we'll help you grow!" />
          <div className="space-y-3">
            {levels.map(level => (
              <button
                key={level.id}
                onClick={() => setProfile({ ...profile, level: level.id })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  profile.level === level.id
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{level.title}</div>
                <div className="text-sm text-gray-600">{level.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "How do you learn best?",
      subtitle: "Choose your preferred learning style",
      icon: <Zap className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <SageMascot state="thinking" message="Understanding your learning style helps me teach you better!" />
          <div className="space-y-3">
            {learningStyles.map(style => (
              <button
                key={style.id}
                onClick={() => setProfile({ ...profile, learningStyle: style.id })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  profile.learningStyle === style.id
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{style.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{style.title}</div>
                    <div className="text-sm text-gray-600">{style.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    }
  ];

  const canProceed = () => {
    switch (step) {
      case 1: return profile.name.length > 0;
      case 2: return selectedInterests.length > 0;
      case 3: return profile.level.length > 0;
      case 4: return profile.learningStyle.length > 0;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      finish();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const currentStepData = steps[step - 1];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {currentStepData.icon}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{currentStepData.title}</h1>
                  <p className="text-sm text-gray-600">{currentStepData.subtitle}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">{step}/{steps.length}</div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / steps.length) * 100}%` }}
              />
            </div>

            {currentStepData.content}
          </div>

          <div className="px-8 py-4 bg-gray-50 flex justify-between">
            <button
              onClick={handleBack}
              className={`px-4 py-2 rounded-lg font-medium ${
                step === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              disabled={step === 1}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                canProceed()
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>{step === steps.length ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ profile }: { profile: any }) {
  const [activeTab, setActiveTab] = useState('courses');

  const courses = [
    { id: 1, title: 'Introduction to React', progress: 75, duration: '4h 30m', difficulty: 'Beginner', rating: 4.8 },
    { id: 2, title: 'Advanced JavaScript', progress: 45, duration: '6h 15m', difficulty: 'Intermediate', rating: 4.9 },
    { id: 3, title: 'UI/UX Design Fundamentals', progress: 20, duration: '5h 45m', difficulty: 'Beginner', rating: 4.7 },
    { id: 4, title: 'Data Visualization', progress: 0, duration: '3h 20m', difficulty: 'Intermediate', rating: 4.6 }
  ];

  const achievements = [
    { id: 1, title: 'First Course Completed', icon: '🎓', earned: true },
    { id: 2, title: '7-Day Streak', icon: '🔥', earned: true },
    { id: 3, title: 'Quick Learner', icon: '⚡', earned: false },
    { id: 4, title: 'Knowledge Seeker', icon: '🔍', earned: true }
  ];

  const stats = [
    { label: 'Courses Completed', value: '12', icon: Trophy },
    { label: 'Hours Learned', value: '48', icon: Clock },
    { label: 'Current Streak', value: '7', icon: Zap },
    { label: 'Certificates', value: '3', icon: Award }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-purple-600">Aeron Academy</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Welcome back, {profile.name}!</div>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <nav className="space-y-2">
                {[
                  { id: 'courses', label: 'My Courses', icon: Book },
                  { id: 'progress', label: 'Progress', icon: BarChart3 },
                  { id: 'achievements', label: 'Achievements', icon: Trophy },
                  { id: 'community', label: 'Community', icon: Users }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <stat.icon className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Content based on active tab */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                    Browse Catalog
                  </button>
                </div>

                <div className="grid gap-6">
                  {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {course.duration}
                              </span>
                              <span>{course.difficulty}</span>
                              <span className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                {course.rating}
                              </span>
                            </div>
                          </div>
                          <button className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                            <Play className="w-4 h-4" />
                            <span>{course.progress > 0 ? 'Continue' : 'Start'}</span>
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        achievement.earned
                          ? 'border-yellow-300 bg-yellow-50'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      {achievement.earned ? (
                        <p className="text-sm text-green-600 mt-1">Earned!</p>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">Keep learning to unlock</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Learning Progress</h2>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <SageMascot 
                    state="encouraging" 
                    message={`Great progress, ${profile.name}! You've completed 3 courses this month. Keep up the amazing work!`} 
                  />
                </div>
              </div>
            )}

            {activeTab === 'community' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Community</h2>
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect with Fellow Learners</h3>
                  <p className="text-gray-600 mb-4">Join discussions, share insights, and learn together with our community.</p>
                  <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                    Join Community
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
interface UserProfile {
  name: string;
  interests: string[];
  level: string;
  learningStyle: string;
  isOnboarded: boolean;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    interests: [],
    level: '',
    learningStyle: '',
    isOnboarded: false
  });

  const finishOnboarding = () => {
    setUserProfile(prev => ({ ...prev, isOnboarded: true }));
  };

  if (!userProfile.isOnboarded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <OnboardingFlow
          step={currentStep}
          setStep={setCurrentStep}
          profile={userProfile}
          setProfile={setUserProfile}
          finish={finishOnboarding}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Dashboard profile={userProfile} />
    </div>
  );
}
