// src/App.tsx
import React, { useState, useEffect } from 'react';
import OnboardingFlow from './OnboardingFlow';
import Dashboard from './Dashboard';
import CelebrationOverlay from './CelebrationOverlay';
import CourseDetailView from './components/CourseDetailView'; // Import CourseDetailView
import LearningView from './components/LearningView'; // This component will be created next

// Define common interfaces for Course and Activity based on GeminiCourseGenerator schema
// These interfaces are crucial for type safety across frontend components
export interface Activity {
    type: 'watch' | 'read' | 'practice';
    title: string;
    url: string; // Will contain the actual YouTube/Google link
    duration: string; // e.g., "15 mins", "1 hour"
    completionMessage?: string;
}

export interface Lesson {
    day: number;
    title: string;
    description: string;
    duration: string;
    xpPoints: number;
    difficulty?: string; // Added from prompt
    activities: Activity[];
}

export interface Module {
    title: string;
    lessons: Lesson[];
}

export interface Week {
    weekNumber: number;
    title: string;
    goals: string[];
    totalWeekXP?: number; // Added from prompt
    modules: Module[];
    assignment?: {
        title: string;
        description: string;
        deliverable: string;
        xpReward?: number; // Added from prompt
        resources: string[];
        completionMessage?: string; // Added from prompt
    };
    checkpoint?: string;
}

export interface Course {
    id: string; // Add ID for easier selection and React keys
    title: string;
    description: string;
    category: string; // Added for CourseCard
    level: string; // Added for CourseCard
    duration: string; // Derived from totalWeeks/dailyHours for CourseCard
    imageUrl: string; // Added for CourseCard
    totalWeeks: number;
    dailyHours: string;
    marketValue: string;
    totalXP?: number; // Added from prompt
    weeks: Week[];
    finalProject?: { // Refined based on prompt
        title: string;
        description: string;
        skills: string[];
        xpReward: number;
        portfolio: string;
    };
    careerImpact?: { // Refined based on prompt
        jobTitles: string[];
        resumePoints: string[];
        salaryRange: string;
    };
    motivationalMessages?: string[]; // Added from prompt
    progress?: number; // Used for CourseCard if you decide to show overall course progress
}

// User Progress Interface
export interface UserProgress {
    streak: number;
    totalXP: number;
    level: number;
    hearts: number;
    // Store unique IDs for completed items to prevent re-adding XP
    completedActivities: Set<string>; // e.g., 'courseId-weekIndex-moduleIndex-lessonIndex-activityIndex'
    completedLessons: Set<string>;   // e.g., 'courseId-weekIndex-moduleIndex-lessonIndex'
    completedModules: Set<string>;   // e.g., 'courseId-weekIndex-moduleIndex'
    completedWeeks: Set<string>;     // e.g., 'courseId-weekIndex'
}

export default function App() {
    // Current view state: 'onboarding' | 'dashboard' | 'course-detail' | 'learning'
    const [view, setView] = useState<'onboarding' | 'dashboard' | 'course-detail' | 'learning'>('onboarding');
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState({
        name: '',
        interests: [] as string[],
        level: 'beginner',
        learningStyle: 'visual',
        streak: 7,
        totalPoints: 2450,
        currentLevel: 12
    });

    // State for generated courses (list of courses on dashboard)
    const [generatedCourses, setGeneratedCourses] = useState<Course[]>([]);
    // State for the currently selected course (to view details or start learning)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    // State for overall user progress (across all courses, or the active one)
    const [userProgress, setUserProgress] = useState<UserProgress>({
        streak: profile.streak, // Initialize from profile or 0
        totalXP: profile.totalPoints, // Initialize from profile or 0
        level: profile.currentLevel, // Initialize from profile or 1
        hearts: 5, // Example initial hearts, can be dynamic
        completedActivities: new Set(),
        completedLessons: new Set(),
        completedModules: new Set(),
        completedWeeks: new Set(),
    });

    const [searching, setSearching] = useState(false);
    const [sageState, setSageState] = useState<'base' | 'thinking' | 'excited' | 'celebrating'>('base');
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationMessage, setCelebrationMessage] = useState('');
    const [error, setError] = useState<string>('');

    // Function to generate a new course via the backend API
    const generateCourse = async (topic: string, userLevel: string) => {
        if (!topic.trim()) return;

        setSearching(true);
        setSageState('thinking');
        setError('');

        try {
            // Call your backend API route for course generation
            const response = await fetch('/api/generate-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, userLevel }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to generate course: ${errorData.error}`);
            }

            const data = await response.json();
            const newCourse: Course = {
                ...data.course,
                id: crypto.randomUUID(), // Assign a unique ID for React keys and tracking
                // Add default/placeholder values for CourseCard specific props if API doesn't return them directly
                category: data.course.category || "General",
                imageUrl: data.course.imageUrl || "https://via.placeholder.com/150", // Placeholder image
                duration: data.course.dailyHours ? `${data.course.totalWeeks} weeks (${data.course.dailyHours}/day)` : `${data.course.totalWeeks} weeks`,
                level: userLevel,
            };
            
            // Add the new course to the list of generated courses
            setGeneratedCourses(prevCourses => [...prevCourses, newCourse]);
            setSageState('excited');
            setView('dashboard'); // Go to dashboard to see the new course

        } catch (err: any) {
            console.error('Error generating course:', err);
            setError(err.message || 'Failed to generate course. Please try again.');
            setSageState('base');
        } finally {
            setSearching(false);
        }
    };

    // Function to handle selecting a course from the dashboard
    const handleSelectCourse = (course: Course) => {
        setSelectedCourse(course);
        setView('course-detail');
    };

    // Function to handle starting a course (from detail view)
    const handleStartLearning = (course: Course) => {
        setSelectedCourse(course); // Ensure it's set for LearningView
        setView('learning');
    };

    // Function to handle activity completion (passed to LearningView)
    const handleActivityComplete = (
        courseId: string,
        weekIndex: number,
        moduleIndex: number,
        lessonIndex: number,
        activityIndex: number,
        xpPoints: number,
        completionMessage: string
    ) => {
        setUserProgress(prevProgress => {
            const activityId = `${courseId}-${weekIndex}-${moduleIndex}-${lessonIndex}-${activityIndex}`;
            const newCompletedActivities = new Set(prevProgress.completedActivities);
            let newTotalXP = prevProgress.totalXP;
            let currentLevel = prevProgress.level;

            if (!newCompletedActivities.has(activityId)) {
                newCompletedActivities.add(activityId);
                newTotalXP += xpPoints; // Add XP
                
                // Example: Level up every 200 XP
                const calculatedLevel = Math.floor(newTotalXP / 200);
                if (calculatedLevel > currentLevel) {
                    currentLevel = calculatedLevel;
                    triggerCelebration(`LEVEL UP! You're now Level ${currentLevel}! Keep going!`);
                } else {
                    triggerCelebration(completionMessage); // Regular completion message
                }

                // --- Check for lesson completion ---
                const currentLesson = selectedCourse?.weeks[weekIndex]?.modules[moduleIndex]?.lessons[lessonIndex];
                if (currentLesson) {
                    const lessonId = `${courseId}-${weekIndex}-${moduleIndex}-${lessonIndex}`;
                    if (!prevProgress.completedLessons.has(lessonId)) {
                        const allActivitiesCompletedInLesson = currentLesson.activities.every((_, idx) => 
                            newCompletedActivities.has(`${courseId}-${weekIndex}-${moduleIndex}-${lessonIndex}-${idx}`)
                        );
                        if (allActivitiesCompletedInLesson) {
                            prevProgress.completedLessons.add(lessonId);
                            triggerCelebration("LESSON COMPLETE! You crushed it! 🎉");
                            // Add bonus XP for lesson completion, if desired
                            newTotalXP += 50; 
                        }
                    }
                }

                // --- Check for module completion ---
                const currentModule = selectedCourse?.weeks[weekIndex]?.modules[moduleIndex];
                if (currentModule) {
                    const moduleId = `${courseId}-${weekIndex}-${moduleIndex}`;
                    if (!prevProgress.completedModules.has(moduleId)) {
                        const allLessonsCompletedInModule = currentModule.lessons.every((lesson, lIdx) => 
                            prevProgress.completedLessons.has(`${courseId}-${weekIndex}-${moduleIndex}-${lIdx}`)
                        );
                        if (allLessonsCompletedInModule) {
                            prevProgress.completedModules.add(moduleId);
                            triggerCelebration("MODULE MASTERED! Unstoppable! 🏆");
                            newTotalXP += 100;
                        }
                    }
                }

                // --- Check for week completion ---
                const currentWeek = selectedCourse?.weeks[weekIndex];
                if (currentWeek) {
                    const weekId = `${courseId}-${weekIndex}`;
                    if (!prevProgress.completedWeeks.has(weekId)) {
                        const allModulesCompletedInWeek = currentWeek.modules.every((module, mIdx) => 
                            prevProgress.completedModules.has(`${courseId}-${weekIndex}-${mIdx}`)
                        );
                        if (allModulesCompletedInWeek) {
                            prevProgress.completedWeeks.add(weekId);
                            triggerCelebration("WEEK CONQUERED! You're on fire! 🔥");
                            newTotalXP += 200;
                        }
                    }
                }
            }

            return {
                ...prevProgress,
                totalXP: newTotalXP,
                level: currentLevel,
                completedActivities: newCompletedActivities,
            };
        });
    };

    // Function to trigger celebration overlay
    const triggerCelebration = (message: string) => {
        setCelebrationMessage(message);
        setShowCelebration(true);
        // Hide celebration after a short delay
        setTimeout(() => {
            setShowCelebration(false);
            setCelebrationMessage('');
        }, 3000); // 3 seconds
    };

    // Simulate initial courses or fetch them if already generated
    // This provides some courses on the dashboard when the app first loads
    useEffect(() => {
        const sampleCourses: Course[] = [
            {
                id: 'sample-react',
                title: 'Introduction to React.js',
                category: 'Web Development',
                description: 'Learn the fundamentals of React for building modern user interfaces. This course will take you from zero to hero!',
                level: 'Beginner',
                duration: '4 weeks (2 hours/day)',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
                totalWeeks: 4,
                dailyHours: '2 hours',
                marketValue: '$70,000+',
                totalXP: 2000,
                weeks: [], // Content will be loaded when selected or generated
            },
            {
                id: 'sample-finance',
                title: 'Corporate Finance Essentials',
                category: 'Finance',
                description: 'Understand key financial concepts like valuation, investment, and capital budgeting.',
                level: 'Intermediate',
                duration: '6 weeks (1.5 hours/day)',
                imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-4sX8JgS-w5uQ6p1b2k7w2g0u9g5p2b5Q&s', // Placeholder
                totalWeeks: 6,
                dailyHours: '1.5 hours',
                marketValue: '$90,000+',
                totalXP: 3000,
                weeks: [], // Content will be loaded when selected or generated
            },
        ];
        setGeneratedCourses(sampleCourses);
    }, []); // Run once on component mount

    // Render logic based on the 'view' state
    return (
        <>
            {view === 'onboarding' ? (
                <OnboardingFlow
                    step={step}
                    setStep={setStep}
                    profile={profile}
                    setProfile={setProfile}
                    finish={() => setView('dashboard')}
                />
            ) : view === 'dashboard' ? (
                <Dashboard
                    profile={profile}
                    courses={generatedCourses} // Pass generated courses
                    generateCourse={generateCourse} // Pass the new generateCourse function
                    handleSelectCourse={handleSelectCourse} // Pass handler for selecting a course
                    searching={searching}
                    sageState={sageState}
                    setShowCelebration={setShowCelebration} // Still pass to dashboard for other celebrations
                    error={error}
                    setError={setError}
                />
            ) : view === 'course-detail' && selectedCourse ? (
                <CourseDetailView
                    course={selectedCourse}
                    onStartLearning={handleStartLearning} // Pass handler to start learning
                    onBack={() => setView('dashboard')} // Allow going back to dashboard
                />
            ) : view === 'learning' && selectedCourse ? (
                <LearningView
                    course={selectedCourse}
                    userProgress={userProgress}
                    setUserProgress={setUserProgress}
                    onActivityComplete={handleActivityComplete}
                    onBack={() => setView('course-detail')} // Go back to course detail from learning
                    triggerCelebration={triggerCelebration}
                />
            ) : (
                // Fallback or loading state if `view` is not recognized or `selectedCourse` is null when expected
                <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
                    Loading application...
                </div>
            )}
            <CelebrationOverlay show={showCelebration} message={celebrationMessage} setShow={setShowCelebration} />
        </>
    );
}
