// src/components/CoursesSection.tsx
import React, { useState } from 'react';
import { Search, Play, Trophy, Clock } from 'lucide-react';
import CourseCard from './CourseCard'; // New import

export default function CoursesSection({
    profile,
    curriculum,
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

    // Placeholder for trending courses - you would fetch these from an API
    const trendingCourses = [
        {
            id: 'py101',
            title: 'Mastering Python for Data Science',
            category: 'Programming',
            description: 'Learn Python from scratch and apply it to data analysis.',
            progress: 75,
            level: 'Beginner',
            duration: '8 weeks',
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png' // Python icon
        },
        {
            id: 'cf201',
            title: 'Corporate Finance Essentials',
            category: 'Finance',
            description: 'Understand financial statements, valuation, and investment decisions.',
            progress: 40,
            level: 'Intermediate',
            duration: '6 weeks',
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/2920/2920197.png' // Finance icon
        },
        {
            id: 'uiux301',
            title: 'Advanced UI/UX Design with Figma',
            category: 'Design',
            description: 'Dive deep into user experience and interface design principles.',
            progress: 90,
            level: 'Advanced',
            duration: '10 weeks',
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/10002/10002061.png' // Design icon
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
                    placeholder="Search for courses (e.g., React, Python, Digital Marketing)..."
                    className="w-full pl-12 pr-12 py-3 border-2 border-purple-100 rounded-2xl bg-white focus:border-purple-300 focus:outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
                {searching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full" />
                )}
            </div>

            {/* Trending Courses */}
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">🔥 Trending Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>

            {/* Generated Curriculum (from previous search) */}
            {curriculum && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-800">Your Generated Curriculum: {curriculum.title}</h3>
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-6 text-white">
                        <p className="text-lg opacity-90 mb-4">{curriculum.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                                <span className="font-semibold">Progress:</span> 0% (Placeholder)
                            </div>
                        </div>
                        <button className="mt-4 w-full bg-white text-purple-700 font-bold py-2 px-4 rounded-xl hover:bg-purple-50 transition-colors">
                            View Full Curriculum
                        </button>
                    </div>
                    {/* Note: The detailed weekly curriculum view is currently integrated within Dashboard.tsx.
                        For a cleaner structure, you might move the detailed rendering logic into this component
                        or a child component of this section. For now, it will appear below this summary if `curriculum` is present.*/}
                </div>
            )}

            {/* The detailed curriculum display from before will implicitly show up here
                if you uncomment or move the curriculum rendering logic from Dashboard.tsx's main render.
                For this current setup, the full curriculum content (weeks, modules etc.)
                is expected to be handled by the main Dashboard component's render logic
                or a more deeply nested component.
            */}
        </div>
    );
}
