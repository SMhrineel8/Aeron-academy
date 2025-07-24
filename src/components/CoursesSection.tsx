// src/components/CoursesSection.tsx
import React, { useState, useMemo } from 'react'; // Import useMemo
import { Search, Play, Trophy, Clock, Loader2 } from 'lucide-react';
import CourseCard from './CourseCard';

export default function CoursesSection({
    profile,
    curriculum, // The latest generated curriculum from App.tsx
    setActiveGeneratedCourse, // Function to set the active course
    generateCurriculum,
    searching,
    sageState,
    error,
    setError
}: any) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            generateCurriculum(searchQuery);
        }
    };

    // Calculate total XP potential using useMemo for efficiency
    const totalXpPotential = useMemo(() => {
        if (!curriculum || !curriculum.weeks) return 0;
        let xp = 0;
        curriculum.weeks.forEach((week: any) => {
            if (week.modules) {
                week.modules.forEach((module: any) => {
                    if (module.lessons) {
                        module.lessons.forEach((lesson: any) => {
                            xp += lesson.xpPoints || 0;
                        });
                    }
                });
            }
        });
        return xp;
    }, [curriculum]); // Recalculate only when curriculum changes


    // More Placeholder for trending courses
    const trendingCourses = [
        {
            id: 'py101',
            title: 'Mastering Python for Data Science',
            category: 'Programming',
            description: 'Learn Python from scratch and apply it to data analysis and machine learning.',
            progress: 0, // Initial progress for trending courses
            level: 'Beginner',
            duration: '8 weeks',
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png' // Python icon
        },
        {
            id: 'cf201',
            title: 'Corporate Finance Essentials',
            category: 'Finance',
            description: 'Understand financial statements, valuation, investment decisions, and capital budgeting.',
            progress: 0,
            level: 'Intermediate',
            duration: '6 weeks',
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/2920/2920197.png' // Finance icon
        },
        {
            id: 'uiux301',
            title: 'Advanced UI/UX Design with Figma',
            category: 'Design',
            description: 'Dive deep into user experience and interface design principles, prototyping, and testing.',
            progress: 0,
            level: 'Advanced',
            duration: '10 weeks',
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/10002/10002061.png' // Design icon
        },
        {
            id: 'js401',
            title: 'Modern JavaScript Development',
            category: 'Programming',
            description: 'Master ES6+, React, Node.js, and build dynamic web applications.',
            progress: 0,
            level: 'Intermediate',
            duration: '7 weeks',
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png' // JavaScript icon
        },
        {
            id: 'dm101',
            title: 'Digital Marketing Fundamentals',
            category: 'Marketing',
            description: 'Learn SEO, SEM, social media marketing, and content strategy.',
            progress: 0,
            level: 'Beginner',
            duration: '5 weeks',
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/2942/2942704.png' // Marketing icon
        },
        {
            id: 'ds501',
            title: 'Deep Learning with TensorFlow',
            category: 'Data Science',
            description: 'Explore neural networks, CNNs, RNNs, and build AI models.',
            progress: 0,
            level: 'Advanced',
            duration: '9 weeks',
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/6073/6073873.png' // AI/ML icon
        },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Courses</h2>

            {/* Course Search */}
            <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search for any skill (e.g., React, Python, Digital Marketing)..."
                    className="w-full pl-12 pr-12 py-3 border-2 border-purple-100 rounded-2xl bg-white focus:border-purple-300 focus:outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
                {searching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full" />
                )}
            </div>

            {/* Display Generated Curriculum Summary if available */}
            {curriculum && !searching && (
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-6 text-white text-center shadow-lg">
                    <h3 className="text-3xl font-bold mb-3">{curriculum.title}</h3>
                    <p className="text-lg opacity-90 mb-6">{curriculum.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/10 rounded-xl p-3 text-sm">
                            <span className="font-semibold">Duration:</span> {curriculum.totalWeeks} weeks
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 text-sm">
                            <span className="font-semibold">Daily Time:</span> {curriculum.dailyHours}
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 text-sm">
                            <span className="font-semibold">Value:</span> {curriculum.marketValue}
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 text-sm">
                            <span className="font-semibold">XP Potential:</span> {Math.round(totalXpPotential)}
                        </div>
                    </div>
                    <button
                        onClick={() => setActiveGeneratedCourse(curriculum)}
                        className="w-full md:w-auto bg-white text-purple-700 font-bold py-3 px-8 rounded-full hover:bg-purple-50 transition-colors text-lg flex items-center justify-center mx-auto"
                    >
                        <Play className="w-5 h-5 mr-2" /> Start Course Now!
                    </button>
                </div>
            )}

            {/* Loading / No Curriculum State */}
            {!curriculum && searching && (
                <div className="text-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-700">Generating your personalized, gamified course...</h3>
                    <p className="text-gray-500">This might take a moment as Eagle searches for the best resources.</p>
                </div>
            )}

            {!curriculum && !searching && (
                <div className="text-center py-20">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Master Any Skill with AI-Powered Curriculum
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Get a ₹1,00,000+ worth professional curriculum for free. Just enter any skill above!
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: '8-Week Structure', desc: 'Organized weekly modules', icon: Clock },
                            { title: 'Free Resources', desc: 'YouTube, MIT OCW, GitHub', icon: BookOpen },
                            { title: 'Gamified Progress', desc: 'XP, streaks, and motivation', icon: Trophy }
                        ].map(({ title, desc, icon: Icon }, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                                <Icon className="w-8 h-8 text-purple-500 mb-3" />
                                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                                <p className="text-sm text-gray-600">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* Trending Courses */}
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">🔥 Trending Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
}
