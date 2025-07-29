// src/components/LearningView.tsx
import React from 'react';
import { Course, UserProgress, Activity } from '../App'; // Import types from App.tsx
import { ChevronLeft } from 'lucide-react'; // Example icon

interface LearningViewProps {
    course: Course;
    userProgress: UserProgress;
    setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
    onActivityComplete: (courseId: string, weekIndex: number, moduleIndex: number, lessonIndex: number, activityIndex: number, xpPoints: number, completionMessage: string) => void;
    onBack: () => void;
    triggerCelebration: (message: string) => void;
}

const LearningView: React.FC<LearningViewProps> = ({ course, userProgress, setUserProgress, onActivityComplete, onBack, triggerCelebration }) => {
    // For now, this is a basic placeholder. We will build out its functionality later.
    // It will display the current lesson/activity and allow marking completion.

    // A simple placeholder to show course title and a back button
    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-purple-600 hover:text-purple-800 font-semibold mb-6"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back to Course
                </button>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title} - Learning in Progress</h1>
                <p className="text-gray-600 mb-6">This is where your learning journey unfolds!</p>

                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
                    <p className="font-bold">Coming Soon!</p>
                    <p>The detailed lesson content and interactive activities will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default LearningView;
