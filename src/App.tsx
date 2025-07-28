// src/App.tsx

import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';

interface UserProfile {
  name: string;
  level: number;
  xp: number;
  streak: number;
  totalPoints: number;
  completedCourses: number;
  badges: string[];
}

export default function App() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex',
    level: 5,
    xp: 2450,
    streak: 12,
    totalPoints: 8750,
    completedCourses: 3,
    badges: ['Early Bird', 'Streak Master', 'Quiz Champion']
  });

  const [curriculum, setCurriculum] = useState(null);
  const [activeGeneratedCourse, setActiveGeneratedCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [searching, setSearching] = useState(false);
  const [sageState, setSageState] = useState<'idle' | 'thinking' | 'excited'>('idle');
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState('');

  // Enhanced course generation with Gemini API
  const generateCurriculum = async (topic: string, userLevel: string = 'beginner') => {
    setSearching(true);
    setSageState('thinking');
    setError('');

    try {
      const response = await fetch('/api/generate-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          userLevel
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate course');
      }

      if (data.success && data.course) {
        setCurriculum(data.course);
        setSageState('excited');
        
        // Show success message
        setTimeout(() => {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }, 500);
      } else {
        throw new Error('Invalid course data received');
      }

    } catch (error) {
      console.error('Error generating curriculum:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate course');
      setSageState('idle');
    } finally {
      setSearching(false);
      // Reset sage state after animation
      setTimeout(() => setSageState('idle'), 3000);
    }
  };

  // Enhanced quiz generation
  const generateQuiz = async (topic: string, difficulty: string = 'medium') => {
    setSearching(true);
    setSageState('thinking');
    setError('');

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          difficulty,
          questionCount: 10
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      if (data.success && data.quiz) {
        setQuizzes(prev => [...prev, data.quiz]);
        setSageState('excited');
        
        // Update user stats
        setProfile(prev => ({
          ...prev,
          totalPoints: prev.totalPoints + 100 // Bonus for generating quiz
        }));
      } else {
        throw new Error('Invalid quiz data received');
      }

    } catch (error) {
      console.error('Error generating quiz:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate quiz');
      setSageState('idle');
    } finally {
      setSearching(false);
      setTimeout(() => setSageState('idle'), 3000);
    }
  };

  // Handle course completion and progress updates
  const handleCourseProgress = (courseId: string, progress: number, xpGained: number) => {
    setProfile(prev => ({
      ...prev,
      xp: prev.xp + xpGained,
      totalPoints: prev.totalPoints + xpGained,
      // Level up logic
      level: Math.floor((prev.xp + xpGained) / 1000) + 1
    }));

    // Check for achievements
    checkAchievements(progress, xpGained);
  };

  const checkAchievements = (progress: number, xpGained: number) => {
    const achievements = [];

    // Progress-based achievements
    if (progress >= 0.25 && !profile.badges.includes('Quarter Master')) {
      achievements.push('Quarter Master');
    }
    if (progress >= 0.5 && !profile.badges.includes('Halfway Hero')) {
      achievements.push('Halfway Hero');
    }
    if (progress >= 1.0 && !profile.badges.includes('Course Conqueror')) {
      achievements.push('Course Conqueror');
    }

    // XP-based achievements
    if (profile.totalPoints + xpGained >= 10000 && !profile.badges.includes('XP Master')) {
      achievements.push('XP Master');
    }

    // Streak-based achievements
    if (profile.streak >= 30 && !profile.badges.includes('Dedication Legend')) {
      achievements.push('Dedication Legend');
    }

    if (achievements.length > 0) {
      setProfile(prev => ({
        ...prev,
        badges: [...prev.badges, ...achievements]
      }));

      // Show celebration for new achievements
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  // Simulate daily streak updates
  useEffect(() => {
    const updateStreak = () => {
      const lastActive = localStorage.getItem('lastActiveDate');
      const today = new Date().toDateString();
      
      if (lastActive !== today) {
        localStorage.setItem('lastActiveDate', today);
        
        // Simple streak logic - in real app, you'd want more sophisticated tracking
        if (lastActive && new Date(lastActive).getTime() === new Date(today).getTime() - 86400000) {
          setProfile(prev => ({ ...prev, streak: prev.streak + 1 }));
        }
      }
    };

    updateStreak();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-purple-600 mb-2">Awesome!</h2>
            <p className="text-gray-600">You're making incredible progress!</p>
          </div>
        </div>
      )}

      <Dashboard
        profile={profile}
        curriculum={curriculum}
        activeGeneratedCourse={activeGeneratedCourse}
        setActiveGeneratedCourse={setActiveGeneratedCourse}
        quizzes={quizzes}
        generateCurriculum={generateCurriculum}
        generateQuiz={generateQuiz}
        searching={searching}
        sageState={sageState}
        setShowCelebration={setShowCelebration}
        error={error}
        setError={setError}
        onCourseProgress={handleCourseProgress}
      />
    </div>
  );
}
