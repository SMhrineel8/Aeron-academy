import { useState, useEffect, useRef } from 'react';
import {
  User, Target, BookOpen, Zap, ArrowRight,
  Trophy, Clock, Award, BarChart3, Users,
  Book, Star, Play
} from 'lucide-react';

// Placeholder: import your actual SageMascot component here
import SageMascot from './SageMascot';// Make sure this path is correct

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

function OnboardingFlow({
  step,
  setStep,
  profile,
  setProfile,
  finish
}: {
  step: number,
  setStep: (n: number) => void,
  profile: UserProfile,
  setProfile: (p: UserProfile) => void,
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
