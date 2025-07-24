// src/Dashboard.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, Flame, Trophy, Menu, X, BookOpen, FileText, BarChart3, HelpCircle } from 'lucide-react';
import SageMascot from './SageMascot';
import Sidebar from './components/Sidebar';
import CoursesSection from './components/CoursesSection';
import QuizSection from './components/QuizSection';
import RankingsSection from './components/RankingsSection';
import CourseDetailView from './components/CourseDetailView'; // New import

export default function Dashboard({
    profile,
    curriculum, // The latest generated curriculum
    activeGeneratedCourse, // The curriculum currently being viewed/taken
    setActiveGeneratedCourse, // Setter for activeGeneratedCourse
    quizzes,
    generateCurriculum,
    generateQuiz,
    searching,
    sageState,
    setShowCelebration,
    error,
    setError
}: any) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<'courses' | 'quiz' | 'rankings'>('courses');
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Close sidebar when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsSidebarOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarRef]);

    const renderContent = () => {
        if (activeGeneratedCourse && activeSection === 'courses') {
            // If a generated course is active, show its detail view
            return (
                <CourseDetailView
                    course={activeGeneratedCourse}
                    setActiveGeneratedCourse={setActiveGeneratedCourse} // Allow navigating back
                    setShowCelebration={setShowCelebration}
                />
            );
        }

        switch (activeSection) {
            case 'courses':
                return (
                    <CoursesSection
                        profile={profile}
                        curriculum={curriculum} // Pass the latest generated curriculum
                        setActiveGeneratedCourse={setActiveGeneratedCourse} // Pass setter to start course
                        generateCurriculum={generateCurriculum}
                        searching={searching}
                        sageState={sageState}
                        error={error}
                        setError={setError}
                    />
                );
            case 'quiz':
                return (
                    <QuizSection
                        quizzes={quizzes}
                        generateQuiz={generateQuiz}
                        searching={searching}
                        sageState={sageState}
                        error={error}
                        setError={setError}
                    />
                );
            case 'rankings':
                return <RankingsSection profile={profile} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onNavigate={(section: 'courses' | 'quiz' | 'rankings') => {
                    setActiveSection(section);
                    setIsSidebarOpen(false);
                    setActiveGeneratedCourse(null); // Reset active course when changing sections
                }}
                activeSection={activeSection}
                sidebarRef={sidebarRef}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-purple-100 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <div className="flex items-center space-x-2">
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                                Learnly
                            </h1>
                            <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                Pro
                            </span>
                        </div>
                    </div>

                    <SageMascot state={sageState} message={searching ? "Generating your content..." : "Ready to help!"} />

                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-orange-600 bg-orange-50 px-3 py-2 rounded-full">
                            <Flame className="w-4 h-4" />
                            <span className="font-bold">{profile.streak}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-purple-600 bg-purple-50 px-3 py-2 rounded-full">
                            <Trophy className="w-4 h-4" />
                            <span className="font-bold">{profile.totalPoints}</span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center space-x-2 text-red-700">
                                <span className="font-semibold">Error:</span>
                                <span>{error}</span>
                            </div>
                            <button
                                onClick={() => setError('')}
                                className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
