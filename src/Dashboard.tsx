// src/Dashboard.tsx (Partial/Example - you'll integrate this into your existing Dashboard)
import React, { useState } from 'react';
import CourseCard from './components/CourseCard'; // Assuming CourseCard is in a 'components' folder
import { Users, BookOpen, BarChart, Trophy, Zap } from 'lucide-react'; // Example icons
import SageMascot from './SageMascot'; // Assuming you have this or similar for your sage
import React, { useState } from 'react';
import CourseCard from './components/CourseCard';
import CoursePlayer from './CoursePlayer'

// Define a Course type to match what CourseCard expects
interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  progress?: number;
  level: string;
  duration: string;
  rating?: number;
  students?: number;
  imageUrl: string;
}

interface DashboardProps {
  profile: {
    name: string;
    interests: string[];
    level: string;
    streak: number;
    totalPoints: number;
    currentLevel: number;
  };
  curriculum: any; // The generated curriculum from Gemini
  quizzes: any[];
  generateCurriculum: (topic: string) => void;
  generateQuiz: (topic: string) => void;
  searching: boolean;
  sageState: 'base' | 'thinking' | 'excited' | 'celebrating';
  setShowCelebration: (show: boolean) => void;
  error: string;
  setError: (error: string) => void;
}

export default function Dashboard({
  profile,
  curriculum,
  quizzes,
  generateCurriculum,
  generateQuiz,
  searching,
  sageState,
  setShowCelebration,
  error,
  setError,
}: DashboardProps) {
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [activeCourse, setActiveCourse] = useState<any>(null); // To store the course being played

  // Dummy courses for initial display or when no curriculum is generated
  // You can expand this list or fetch from a predefined static list
  const popularCourses: Course[] = [
    {
      id: '1',
      title: 'Introduction to JavaScript',
      category: 'Programming',
      description: 'Learn the fundamentals of JavaScript from scratch. Build interactive web pages and understand core programming concepts.',
      level: 'beginner',
      duration: '40 hours',
      rating: 4.8,
      students: 15000,
      imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg'
    },
    {
      id: '2',
      title: 'Digital Marketing Fundamentals',
      category: 'Marketing',
      description: 'Master the basics of digital marketing, including SEO, social media, content marketing, and analytics.',
      level: 'intermediate',
      duration: '30 hours',
      rating: 4.5,
      students: 8000,
      imageUrl: 'https://www.svgrepo.com/show/473722/marketing-fill.svg'
    },
    {
      id: '3',
      title: 'Data Science with Python',
      category: 'Data Science',
      description: 'Dive into data science using Python, covering data analysis, visualization, and machine learning basics.',
      level: 'advanced',
      duration: '60 hours',
      rating: 4.9,
      students: 12000,
      imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-plain.svg'
    },
    {
        id: '4',
        title: 'Corporate Finance Basics',
        category: 'Finance',
        description: 'Understand the core principles of corporate finance, investment decisions, and financial management.',
        level: 'beginner',
        duration: '25 hours',
        rating: 4.7,
        students: 7500,
        imageUrl: 'https://www.svgrepo.com/show/472535/wallet-alt.svg'
    },
    {
        id: '5',
        title: 'User Interface Design',
        category: 'Design',
        description: 'Learn to create intuitive and appealing user interfaces (UI) using modern design principles and tools.',
        level: 'intermediate',
        duration: '35 hours',
        rating: 4.6,
        students: 6000,
        imageUrl: 'https://www.svgrepo.com/show/521748/design-tool.svg'
    },
    {
        id: '6',
        title: 'Cloud Computing with AWS',
        category: 'Cloud',
        description: 'Get started with Amazon Web Services (AWS) and understand cloud infrastructure, services, and deployment.',
        level: 'beginner',
        duration: '45 hours',
        rating: 4.8,
        students: 9000,
        imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg'
    }
  ];

  // Function to handle "Start Course" click
  const handleStartCourse = (courseId: string, courseData: any = null) => {
    // If courseData is provided, it's a dynamically generated course
    if (courseData) {
      setActiveCourse(courseData);
    } else {
      // Find the course from popularCourses if it's a static one
      const selectedCourse = popularCourses.find(c => c.id === courseId);
      if (selectedCourse) {
        // Here, you would ideally transform the static course into a gamified structure
        // For simplicity, let's create a dummy gamified structure for static courses
        const dummyGamifiedCourse = {
          title: selectedCourse.title,
          description: selectedCourse.description,
          totalWeeks: 1, // Example: treat static courses as 1 week for now
          dailyHours: "1-2 hours",
          totalXP: 500,
          weeks: [{
            weekNumber: 1,
            title: `${selectedCourse.title} - Fundamentals`,
            goals: ["Understand basics"],
            totalWeekXP: 500,
            modules: [{
              title: "Module 1.1: Introduction",
              lessons: [{
                day: 1,
                title: `${selectedCourse.title} Overview`,
                description: selectedCourse.description,
                duration: "60 mins",
                xpPoints: 50,
                difficulty: "easy",
                activities: [{
                  type: "watch",
                  title: `Watch: ${selectedCourse.title} Intro`,
                  url: "https://www.youtube.com/watch?v=N91AXV7LMrg", // Example YouTube link for finance
                  duration: "30 mins",
                  completionMessage: "Great start! Ready for your first challenge?"
                }]
              }]
            }]
          }],
          // ... add other gamification elements if needed for static courses
        };
        setActiveCourse(dummyGamifiedCourse);
      }
    }
  };

  const handleSearchAndGenerate = () => {
    if (courseSearchQuery.trim()) {
      generateCurriculum(courseSearchQuery);
    } else {
      setError('Please enter a course topic to generate.');
    }
  };


  // If an active course is set, render the CoursePlayer
  if (activeCourse) {
    return (
      <CoursePlayer
        courseData={activeCourse}
        onBackToDashboard={() => setActiveCourse(null)}
        profile={profile} // Pass profile for progress tracking
        setProfile={setProfile} // Pass setProfile to update user's XP, streak etc.
        setShowCelebration={setShowCelebration} // To show celebration on lesson/module completion
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-7 h-7 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Learnify</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Streak: {profile.streak}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Trophy className="w-5 h-5 text-blue-500" />
            <span>XP: {profile.totalPoints}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <BarChart className="w-5 h-5 text-green-500" />
            <span>Level: {profile.currentLevel}</span>
          </div>
          <span className="font-semibold text-purple-600">{profile.name}</span>
          {/* User profile icon/avatar would go here */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-8">
        {/* Sage AI Section */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8 flex items-center space-x-6">
          <div className="w-24 h-24 flex-shrink-0">
            <SageAnimation state={sageState} /> {/* Your Sage AI animation component */}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {sageState === 'base' && "What do you want to learn today?"}
              {sageState === 'thinking' && "Sage is thinking... Generating your personalized curriculum!"}
              {sageState === 'excited' && "🎉 Amazing! Your custom learning path is ready!"}
              {sageState === 'celebrating' && "🥳 Wow! You're crushing it! Keep up the great work!"}
            </h2>
            <p className="text-gray-600 mb-4">
              {sageState === 'base' && "Enter a topic, and Sage will craft a gamified course just for you."}
              {sageState === 'thinking' && "This might take a moment. Sage is consulting the digital libraries of the universe."}
              {sageState === 'excited' && "Dive into your tailor-made journey. Get ready to level up!"}
              {sageState === 'celebrating' && "You've earned some serious XP! What's next on your learning adventure?"}
            </p>
            <div className="flex space-x-3">
              <input
                type="text"
                value={courseSearchQuery}
                onChange={(e) => setCourseSearchQuery(e.target.value)}
                placeholder="e.g., Corporate Finance, Python for Data Science"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={searching}
              />
              <button
                onClick={handleSearchAndGenerate}
                className="bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                disabled={searching}
              >
                {searching ? 'Generating...' : 'Generate Course'}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </section>

        {/* Display Generated Curriculum or Popular Courses */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            {curriculum ? 'Your Personalized Curriculum' : 'Popular Courses'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculum ? (
              // Display the generated curriculum as a single "course card"
              // The wireframe implies a single "Start Course" button on a dashboard.
              // We'll treat the entire generated curriculum as one large course.
              <CourseCard
                course={{
                  id: curriculum.title, // Use title as ID for now
                  title: curriculum.title,
                  category: profile.interests[0] || 'Learning Path', // Use first interest or default
                  description: curriculum.description,
                  level: profile.level, // Based on user's profile
                  duration: `${curriculum.totalWeeks} Weeks`,
                  rating: 5.0, // Assume perfect rating for generated course
                  students: 1, // Only this user is taking it
                  imageUrl: 'https://www.svgrepo.com/show/530685/books.svg' // Generic icon for learning path
                }}
                onStartCourse={() => handleStartCourse(curriculum.title, curriculum)}
              />
            ) : (
              // Display popular courses if no curriculum generated
              popularCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onStartCourse={handleStartCourse} // Pass the handler
                />
              ))
            )}
          </div>
        </section>

        {/* Other Dashboard sections (e.g., Recent Activity, Quizzes, etc.) */}
        {/* This is where you'd integrate the quiz display if you have it */}
        {quizzes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Quizzes for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <button
                    onClick={() => console.log('Start Quiz:', quiz.title)}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start Quiz ({quiz.xpReward} XP)
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
