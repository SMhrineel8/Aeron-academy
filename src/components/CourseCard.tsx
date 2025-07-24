// src/components/CourseCard.tsx
import React from 'react';
import { Play, Trophy, Clock, ChevronRight } from 'lucide-react';

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        category: string;
        description: string;
        progress: number; // Still exists, but won't be displayed on card initially
        level: string;
        duration: string;
        imageUrl: string;
    };
}

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="relative p-5">
                <img src={course.imageUrl} alt={course.title} className="w-16 h-16 object-contain mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>Level: {course.level}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1 text-blue-500" />
                    <span>Duration: {course.duration}</span>
                </div>
            </div>

            <div className="px-5 py-4 bg-gray-50 mt-auto">
                {/* Progress bar removed from initial card view as per request */}
                <button className="mt-2 w-full bg-purple-500 text-white font-semibold py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center">
                    <Play className="w-4 h-4 mr-2" /> Start Course
                </button>
            </div>
        </div>
    );
}
