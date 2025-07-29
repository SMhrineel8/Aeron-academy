// src/components/CourseDetailView.tsx
import React from 'react';
import { ChevronLeft, Play, Clock, Trophy, Star, Users } from 'lucide-react'; // Added Star, Users if they were used for rating/students
import { Course } from '../App'; // Import the Course type from App.tsx

interface CourseDetailViewProps {
    course: Course;
    onStartLearning: (course: Course) => void;
    onBack: () => void;
}

const CourseDetailView: React.FC<CourseDetailViewProps> = ({ course, onStartLearning, onBack }) => {

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

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Back Button */}
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <button
                        onClick={onBack}
                        className="flex items-center text-purple-600 hover:text-purple-800 font-semibold"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Dashboard
                    </button>
                </div>

                {/* Course Header/Hero Section */}
                <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <img
                        src={course.imageUrl || "https://via.placeholder.com/200"}
                        alt={course.title}
                        className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover shadow-md flex-shrink-0"
                    />
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{course.title}</h1>
                        <p className="text-lg text-gray-700 mb-4">{course.description}</p>

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(course.level)}`}>
                                {course.level}
                            </span>
                            <div className="flex items-center text-gray-600 text-sm">
                                <Clock className="w-4 h-4 mr-1 text-blue-500" />
                                <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                                <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                                <span>Total XP: {course.totalXP || 'N/A'}</span>
                            </div>
                            {/* You can add more meta-info like rating/students if your Course data supports it */}
                            {/* {course.rating && (
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                                    <span>{course.rating} ({course.students ? `${course.students} students` : ''})</span>
                                </div>
                            )} */}
                        </div>

                        <button
                            onClick={() => onStartLearning(course)}
                            className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto md:mx-0"
                        >
                            <Play className="w-5 h-5 mr-2" /> Start Learning
                        </button>
                    </div>
                </div>

                {/* Course Curriculum/Weeks Overview (Initial placeholder) */}
                <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Curriculum</h2>
                    {course.weeks && course.weeks.length > 0 ? (
                        <div className="space-y-4">
                            {course.weeks.map((week, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <h3 className="text-xl font-semibold text-purple-700 mb-2">
                                        Week {week.weekNumber}: {week.title}
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700">
                                        {week.goals.map((goal, goalIndex) => (
                                            <li key={goalIndex}>{goal}</li>
                                        ))}
                                    </ul>
                                    {/* You can expand this to show modules/lessons here or in LearningView */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No detailed curriculum available yet for this course. Start learning to explore!</p>
                    )}
                </div>

                {/* Career Impact / Final Project (Optional) */}
                {(course.finalProject || course.careerImpact) && (
                    <div className="p-6 sm:p-8 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">What You'll Achieve</h2>
                        {course.finalProject && (
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Final Project: {course.finalProject.title}</h3>
                                <p className="text-gray-600 mb-2">{course.finalProject.description}</p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Skills:</span> {course.finalProject.skills.join(', ')}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">XP Reward:</span> {course.finalProject.xpReward}
                                </p>
                            </div>
                        )}
                        {course.careerImpact && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Career Impact</h3>
                                <p className="text-gray-600 mb-2">
                                    <span className="font-medium">Job Titles:</span> {course.careerImpact.jobTitles.join(', ')}
                                </p>
                                <p className="text-gray-600 mb-2">
                                    <span className="font-medium">Resume Points:</span> {course.careerImpact.resumePoints.join('; ')}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Salary Range:</span> <span className="text-blue-700">{course.careerImpact.salaryRange}</span>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetailView;
