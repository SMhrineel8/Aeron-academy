// components/CoursesSection.tsx
import React, { useState } from 'react';
import { Search, Play, Trophy, Clock, Star, Users, ChevronLeft, ChevronRight, CheckCircle, Target, BookOpen } from 'lucide-react';

export default function CoursesSection({
  profile,
  curriculum,
  activeCourse,
  generateCurriculum,
  searching,
  sageState,
  error,
  setError,
  onStartCourse,
  setActiveCourse
}: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [userXP, setUserXP] = useState(0);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      generateCurriculum(searchQuery);
    }
  };

  // Enhanced trending courses with more variety
  const trendingCourses = [
    {
      id: 'py101',
      title: 'Python for AI & Machine Learning',
      category: 'Programming',
      description: 'Master Python and dive into AI/ML with hands-on projects and real datasets.',
      level: 'Beginner',
      duration: '8 weeks',
      rating: 4.8,
      students: 15420,
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png',
      isNew: true
    },
    {
      id: 'react201',
      title: 'Modern React Development',
      category: 'Web Development',
      description: 'Build modern web applications with React, Next.js, and TypeScript.',
      level: 'Intermediate',
      duration: '10 weeks',
      rating: 4.9,
      students: 12300,
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/1126/1126012.png',
      isPopular: true
    },
    {
      id: 'design301',
      title: 'UI/UX Design Mastery',
      category: 'Design',
      description: 'Create stunning user interfaces and experiences with Figma and design principles.',
      level: 'Advanced',
      duration: '12 weeks',
      rating: 4.7,
      students: 8900,
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/10002/10002061.png'
    },
    {
      id: 'blockchain401',
      title: 'Blockchain & Web3 Development',
      category: 'Technology',
      description: 'Build decentralized applications with Solidity and interact with smart contracts.',
      level: 'Advanced',
      duration: '14 weeks',
      rating: 4.6,
      students: 5600,
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/6001/6001527.png',
      isHot: true
    },
    {
      id: 'data501',
      title: 'Data Science with Python',
      category: 'Data Science',
      description: 'Analyze data, create visualizations, and build machine learning models.',
      level: 'Intermediate',
      duration: '16 weeks',
      rating: 4.8,
      students: 11200,
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/2103/2103665.png'
    },
    {
      id: 'mobile601',
      title: 'React Native Mobile Development',
      category: 'Mobile Development',
      description: 'Build cross-platform mobile apps with React Native and Expo.',
      level: 'Intermediate',
      duration: '12 weeks',
      rating: 4.5,
      students: 7800,
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/919/919851.png'
    }
  ];

  const CourseCard = ({ course }: { course: any }) => {
    const getLevelColor = (level: string) => {
      switch (level.toLowerCase()) {
        case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
        case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'advanced': return 'text-red-600 bg-red-50 border-red-200';
        default: return 'text-gray-600 bg-gray-50 border-gray-200';
      }
    };

    const getCategoryColor = (category: string) => {
      const colors = {
        'Programming': 'bg-blue-100 text-blue-800',
        'Web Development': 'bg-green-100 text-green-800',
        'Design': 'bg-purple-100 text-purple-800',
        'Technology': 'bg-indigo-100 text-indigo-800',
        'Data Science': 'bg-orange-100 text-orange-800',
        'Mobile Development': 'bg-pink-100 text-pink-800',
      };
      return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 group relative">
        {/* Badge for special courses */}
        {course.isNew && (
          <div className="absolute top-4 right-4 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            NEW
          </div>
        )}
        {course.isPopular && (
          <div className="absolute top-4 right-4 z-10 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            POPULAR
          </div>
        )}
        {course.isHot && (
          <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            🔥 HOT
          </div>
        )}

        {/* Course Image and Category */}
        <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="absolute top-4 left-4">
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
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{course.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{course.students.toLocaleString()}</span>
              </div>
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
              onClick={() => onStartCourse(course)}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center group-hover:shadow-lg transform group-hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Course
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Activity completion handler
  const handleActivityComplete = (activityId: string, xpPoints: number, message: string) => {
    if (!completedActivities.has(activityId)) {
      setCompletedActivities(prev => new Set([...prev, activityId]));
      setUserXP(prev => prev + xpPoints);
      // Show celebration message
      alert(message);
    }
  };

  // Render active course view
  if (activeCourse && activeCourse.weeks) {
    return (
      <div className="space-y-8">
        <button
          onClick={() => setActiveCourse(null)}
          className="flex items-center text-purple-600 hover:text-purple-800 font-medium mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-2" /> Back to Courses
        </button>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold mb-3
