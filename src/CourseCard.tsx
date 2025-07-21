import React from 'react';
import { Play, Star } from 'lucide-react';

export default function CourseCard({ course }: any) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 space-y-3">
      <h2 className="font-bold">{course.title}</h2>
      <p className="text-sm text-gray-600">{course.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Play className="w-4 h-4 text-purple-500"/>
          <a href={course.url} target="_blank" rel="noopener noreferrer" className="text-purple-600">
            Watch
          </a>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400"/>
          <span>{course.rating}</span>
        </div>
      </div>
    </div>
  );
}
