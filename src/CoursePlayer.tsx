// src/CoursePlayer.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Play, CheckCircle, Award, Star, BookOpen, Clock, Users, Zap, Trophy } from 'lucide-react';

interface Activity {
  type: 'watch' | 'practice' | 'read';
  title: string;
  url: string;
  duration: string;
  completionMessage: string;
}

interface Lesson {
  day: number;
  title: string;
  description: string;
  duration: string;
  xpPoints: number;
  difficulty: string;
  activities: Activity[];
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Week {
  weekNumber: number;
  title: string;
  goals: string[];
  totalWeekXP: number;
  modules: Module[];
  assignment?: {
    title: string;
    description: string;
    deliverable: string;
    xpReward: number;
    completionMessage: string;
  };
  checkpoint?: string;
}

interface CurriculumData {
  title: string;
  description: string;
  totalWeeks: number;
  dailyHours: string;
  marketValue: string;
  totalXP: number;
  weeks: Week[];
  finalProject?: any;
  careerImpact?: any;
  motivationalMessages?: string[];
}

interface CoursePlayerProps {
  courseData: CurriculumData;
  onBackToDashboard: () => void;
  profile: {
    name: string;
    interests: string[];
    level: string;
    streak: number;
    totalPoints: number;
    currentLevel: number;
  };
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  setShowCelebration: (show: boolean) => void;
}

export default function CoursePlayer({
  courseData,
  onBackToDashboard,
  profile,
  setProfile,
  setShowCelebration,
}: CoursePlayerProps) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [showCompletionMessage, setShowCompletionMessage] = useState<string | null>(null);

  const currentWeek = courseData.weeks[currentWeekIndex];
  const currentModule = currentWeek?.modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];
  const currentActivity = currentLesson?.activities[currentActivityIndex];

  // Logic to handle activity completion
  const handleActivityComplete = () => {
    if (!currentActivity || !currentLesson) return;

    // Update XP and potentially streak
    setProfile((prev: any) => ({
      ...prev,
      totalPoints: prev.totalPoints + currentLesson.xpPoints, // Add XP from the lesson
      streak: prev.streak + 1, // Increment streak for each activity completion
      // You might add logic for level up here based on totalPoints
    }));

    setShowCompletionMessage(currentActivity.completionMessage);
    setShowCelebration(true); // Trigger global celebration overlay

    setTimeout(() => {
      setShowCompletionMessage(null);
      setShowCelebration(false); // Hide global celebration overlay after a delay
      // Move to the next activity or lesson
      if (currentActivityIndex < currentLesson.activities.length - 1) {
        setCurrentActivityIndex(prev => prev + 1);
      } else if (currentLessonIndex < currentModule.lessons.length - 1) {
        // Move to next lesson
        setCurrentLessonIndex(prev => prev + 1);
        setCurrentActivityIndex(0); // Reset activity index
      } else if (currentModuleIndex < currentWeek.modules.length - 1) {
        // Move to next module
        setCurrentModuleIndex(prev => prev + 1);
        setCurrentLessonIndex(0); // Reset lesson index
        setCurrentActivityIndex(0); // Reset activity index
      } else if (currentWeekIndex < courseData.weeks.length - 1) {
        // Move to next week
        setCurrentWeekIndex(prev => prev + 1);
        setCurrentModuleIndex(0); // Reset module index
        setCurrentLessonIndex(0); // Reset lesson index
        setCurrentActivityIndex(0); // Reset activity index
      } else {
        // Course completed!
        alert('Congratulations! You have completed the course!');
        onBackToDashboard();
      }
    }, 2000); // Show message for 2 seconds
  };

  if (!currentActivity) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Course Completed!</h2>
        <p className="text-xl text-gray-600 mb-8">You've mastered "{courseData.title}". What's next?</p>
        <button
          onClick={onBackToDashboard}
          className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Calculate overall progress (simplified)
  const totalActivities = courseData.weeks.reduce((acc, week) =>
    acc + week.modules.reduce((modAcc, module) =>
      modAcc + module.lessons.reduce((lessonAcc, lesson) =>
        lessonAcc + lesson.activities.length, 0), 0), 0);

  let completedActivities = 0;
  for (let w = 0; w <= currentWeekIndex; w++) {
    for (let m = 0; m <= (w === currentWeekIndex ? currentModuleIndex : courseData.weeks[w].modules.length - 1); m++) {
      for (let l = 0; l <= (w === currentWeekIndex && m === currentModuleIndex ? currentLessonIndex : currentModule.lessons.length - 1); l++) {
        completedActivities += (w === currentWeekIndex && m === currentModuleIndex && l === currentLessonIndex)
          ? currentActivityIndex
          : currentLesson.activities.length;
      }
    }
  }

  const progressPercentage = (completedActivities / totalActivities) * 100;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Header Bar */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
        <div className="flex-1 mx-8">
            <h1 className="text-xl font-bold text-gray-800 text-center truncate">
                {courseData.title}
            </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Streak: {profile.streak}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Trophy className="w-5 h-5 text-blue-500" />
            <span>XP: {profile.totalPoints}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-6 py-8 flex">
        {/* Course Navigation/Progress Sidebar */}
        <aside className="w-1/4 bg-white rounded-xl shadow-sm p-6 mr-6 h-full overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Course Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mb-6">{progressPercentage.toFixed(0)}% Complete</p>

          <nav>
            {courseData.weeks.map((week, wIdx) => (
              <div key={wIdx} className="mb-4">
                <h3 className={`font-semibold text-lg mb-2 ${wIdx <= currentWeekIndex ? 'text-purple-700' : 'text-gray-500'}`}>
                  Week {week.weekNumber}: {week.title}
                  {wIdx < currentWeekIndex && <CheckCircle className="w-4 h-4 ml-2 inline-block text-green-500" />}
                </h3>
                {wIdx === currentWeekIndex && (
                  <ul className="pl-4 border-l-2 border-purple-200">
                    {week.modules.map((module, mIdx) => (
                      <li key={mIdx} className="mb-2">
                        <span className={`font-medium ${mIdx <= currentModuleIndex ? 'text-gray-800' : 'text-gray-500'}`}>
                          {module.title}
                          {wIdx === currentWeekIndex && mIdx < currentModuleIndex && <CheckCircle className="w-4 h-4 ml-2 inline-block text-green-500" />}
                        </span>
                        {mIdx === currentModuleIndex && (
                          <ul className="pl-4 text-sm">
                            {module.lessons.map((lesson, lIdx) => (
                              <li
                                key={lIdx}
                                className={`flex items-center py-1 ${lIdx === currentLessonIndex ? 'text-purple-600 font-bold' : 'text-gray-600'}`}
                              >
                                {lIdx < currentLessonIndex ? (
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                                ) : (
                                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0" />
                                )}
                                {lesson.title} ({lesson.xpPoints} XP)
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Current Lesson/Activity Content */}
        <section className="flex-1 bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center relative">
          {showCompletionMessage && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
              <div className="text-center p-8 bg-purple-100 rounded-xl shadow-xl border border-purple-300">
                <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-3xl font-bold text-purple-800 mb-3">{showCompletionMessage}</h3>
                <p className="text-lg text-gray-700">You earned {currentLesson?.xpPoints || 0} XP!</p>
              </div>
            </div>
          )}

          {!currentActivity ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Loading course content...</h2>
              <p className="text-lg text-gray-600">If this persists, there might be an issue with the generated curriculum structure.</p>
            </div>
          ) : (
            <>
              <span className="text-sm text-purple-600 font-semibold mb-2 uppercase">
                Week {currentWeek.weekNumber} &bull; {currentModule.title}
              </span>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {currentLesson.title}
              </h2>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl">
                {currentActivity.title}
              </p>

              {/* Activity Type Indicator */}
              <div className="flex items-center space-x-2 text-md text-gray-500 mb-6">
                {currentActivity.type === 'watch' && <Play className="w-5 h-5" />}
                {currentActivity.type === 'read' && <BookOpen className="w-5 h-5" />}
                {currentActivity.type === 'practice' && <Users className="w-5 h-5" />}
                <span>{currentActivity.type.toUpperCase()} &bull; {currentActivity.duration}</span>
                <span className="text-green-600 font-bold ml-4">+ {currentLesson.xpPoints} XP</span>
              </div>

              {/* Action Button for the Activity */}
              {currentActivity.type === 'watch' && (
                <a
                  href={currentActivity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white font-semibold py-4 px-10 rounded-full text-xl hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center group-hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Watch Video
                </a>
              )}
              {currentActivity.type === 'read' && (
                <a
                  href={currentActivity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white font-semibold py-4 px-10 rounded-full text-xl hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center group-hover:shadow-xl transform hover:-translate-y-1"
                >
                  <BookOpen className="w-6 h-6 mr-3" />
                  Read Document
                </a>
              )}
              {currentActivity.type === 'practice' && (
                <a
                  href={currentActivity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white font-semibold py-4 px-10 rounded-full text-xl hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center group-hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Trophy className="w-6 h-6 mr-3" />
                  Start Challenge
                </a>
              )}

              <button
                onClick={handleActivityComplete}
                className="mt-8 bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
              >
                Mark as Complete & Next
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
