import React from 'react';
import { Play, Trophy, Clock, Star, Users, Award } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    category: string;
    description: string;
    progress?: number; // Optional, won't be displayed initially
    level: string;
    duration: string;
    rating?: number; // New field for course rating
    students?: number; // New field for student count
    imageUrl: string;
  };
  onStartCourse?: (courseId: string) => void; // Optional callback for starting course
}

export default function CourseCard({ course, onStartCourse }: CourseCardProps) {
  const handleStartCourse = () => {
    if (onStartCourse) {
      onStartCourse(course.id);
    }
  };

  const formatStudentCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'advanced':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Programming': 'bg-blue-100 text-blue-800',
      'Finance': 'bg-green-100 text-green-800',
      'Design': 'bg-purple-100 text-purple-800',
      'Marketing': 'bg-pink-100 text-pink-800',
      'Data Science': 'bg-indigo-100 text-indigo-800',
      'Technology': 'bg-cyan-100 text-cyan-800',
      'Security': 'bg-red-100 text-red-800',
      'AI & ML': 'bg-orange-100 text-orange-800',
      'Business': 'bg-emerald-100 text-emerald-800',
      'Cloud': 'bg-sky-100 text-sky-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 group">
      {/* Course Image and Category */}
      <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
            {course.category}
          </span>
        </div>
        
        <div className="flex flex-col items-center">
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-16 h-16 object-contain mb-4 group-hover:scale-110 transition-transform duration-300" 
          />
          
          {/* Rating and Students */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {course.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{course.rating}</span>
              </div>
            )}
            {course.students && (
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{formatStudentCount(course.students)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
          {course.description}
        </p>

        {/* Course Meta Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1 text-blue-500" />
              <span>{course.duration}</span>
            </div>
            
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(course.level)}`}>
              {course.level}
            </div>
          </div>

          {/* Start Course Button */}
          <button 
            onClick={handleStartCourse}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center group-hover:shadow-lg transform group-hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 mr-2" /> 
            Start Course
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none rounded-xl" />
    </div>
  );
}
Improve
Explain
