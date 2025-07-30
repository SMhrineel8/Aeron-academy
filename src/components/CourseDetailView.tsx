import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, ChevronRight, Play, BookOpen, Target, CheckCircle, Award, Sparkles } from 'lucide-react';

interface Activity {
    type: 'watch' | 'read' | 'practice';
    title: string;
    url: string;
    duration: string;
    completionMessage?: string;
}

interface Lesson {
    day: number;
    title: string;
    description: string;
    duration: string;
    xpPoints: number;
    activities: Activity[];
}

interface Module {
    title: string;
    lessons: Lesson[];
}

interface Week {
    weekNumber: number;
    title: string;
    goals: string[];
    modules: Module[];
    assignment?: {
        title: string;
        description: string;
        deliverable: string;
        resources: string[];
    };
    checkpoint?: string;
}

interface Course {
    title: string;
    description: string;
    totalWeeks: number;
    dailyHours: string;
    marketValue: string;
    weeks: Week[];
    finalProject?: any;
    careerImpact?: any;
}

interface CourseDetailViewProps {
    course: Course;
    setActiveGeneratedCourse: (course: any) => void;
    setShowCelebration: (show: boolean) => void;
}

export default function CourseDetailView({ course, setActiveGeneratedCourse, setShowCelebration }: CourseDetailViewProps) {
    const [completedActivities, setCompletedActivities] = useState<Set<string>>(() => new Set());
    const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(() => new Set([1])); // Start with Week 1 expanded
    const [latestDopamineMessage, setLatestDopamineMessage] = useState<string | null>(null);
    const [totalXp, setTotalXp] = useState(0);

    // Calculate initial total XP from completed activities
    useEffect(() => {
        let currentXp = 0;
        course.weeks.forEach(week => {
            week.modules.forEach(module => {
                module.lessons.forEach(lesson => {
                    lesson.activities.forEach((activity, activityIdx) => {
                        const activityId = `${week.weekNumber}-${module.title}-${lesson.day}-${lesson.title}-${activityIdx}`;
                        if (completedActivities.has(activityId)) {
                            currentXp += lesson.xpPoints / lesson.activities.length; // Distribute XP per activity
                        }
                    });
                });
            });
        });
        setTotalXp(Math.round(currentXp));
    }, [completedActivities, course]);


    const toggleWeek = (weekNumber: number) => {
        const newExpanded = new Set(expandedWeeks);
        if (newExpanded.has(weekNumber)) {
            newExpanded.delete(weekNumber);
        } else {
            newExpanded.add(weekNumber);
        }
        setExpandedWeeks(newExpanded);
    };

    const handleActivityComplete = (weekNumber: number, moduleTitle: string, lessonDay: number, lessonTitle: string, activityIndex: number, xpPoints: number, completionMessage?: string) => {
        const activityId = `${weekNumber}-${moduleTitle}-${lessonDay}-${lessonTitle}-${activityIndex}`;
        if (!completedActivities.has(activityId)) {
            const newCompleted = new Set(completedActivities);
            newCompleted.add(activityId);
            setCompletedActivities(newCompleted);

            // Add XP for this activity
            // Distribute lesson XP evenly among its activities
            const lesson = course.weeks.find(w => w.weekNumber === weekNumber)?.modules.find(m => m.title === moduleTitle)?.lessons.find(l => l.day === lessonDay && l.title === lessonTitle);
            if (lesson && lesson.activities.length > 0) {
                setTotalXp(prev => prev + (xpPoints / lesson.activities.length));
            }


            if (completionMessage) {
                setLatestDopamineMessage(completionMessage);
                setShowCelebration(true);
                setTimeout(() => {
                    setLatestDopamineMessage(null);
                    setShowCelebration(false);
                }, 3000); // Show message for 3 seconds
            }
        }
    };

    const calculateOverallProgress = () => {
        let totalActivities = 0;
        course.weeks.forEach(week => {
            week.modules.forEach(module => {
                module.lessons.forEach(lesson => {
                    totalActivities += lesson.activities.length;
                });
            });
        });
        return totalActivities > 0 ? (completedActivities.size / totalActivities) * 100 : 0;
    };

    return (
        <div className="space-y-8">
            <button
                onClick={() => setActiveGeneratedCourse(null)}
                className="flex items-center text-purple-600 hover:text-purple-800 font-medium mb-6"
            >
                <ChevronLeft className="w-5 h-5 mr-2" /> Back to Courses
            </button>

            {/* Course Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-lg">
                <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
                <p className="text-xl opacity-90 mb-6">{course.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Award className="w-5 h-5" />
                            <span className="font-semibold">XP Earned</span>
                        </div>
                        <p className="text-2xl font-bold">{Math.round(totalXp)}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Sparkles className="w-5 h-5" />
                            <span className="font-semibold">Progress</span>
                        </div>
                        <p className="text-2xl font-bold">{calculateOverallProgress().toFixed(1)}%</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-5 h-5" />
                            <span className="font-semibold">Daily Time</span>
                        </div>
                        <p>{course.dailyHours}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Trophy className="w-5 h-5" />
                            <span className="font-semibold">Market Value</span>
                        </div>
                        <p>{course.marketValue}</p>
                    </div>
                </div>
                {latestDopamineMessage && (
                    <div className="mt-6 p-3 bg-yellow-100 text-yellow-800 rounded-xl text-center font-semibold animate-pulse">
                        {latestDopamineMessage}
                    </div>
                )}
            </div>

            {/* Weekly Curriculum */}
            <div className="space-y-6">
                {course.weeks?.map((week: Week) => (
                    <div key={week.weekNumber} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div
                            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleWeek(week.weekNumber)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {expandedWeeks.has(week.weekNumber) ?
                                        <ChevronDown className="w-5 h-5 text-purple-500" /> :
                                        <ChevronRight className="w-5 h-5 text-purple-500" />
                                    }
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Week {week.weekNumber}: {week.title}
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            Goals: {week.goals?.join(' • ')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-purple-600">
                                        XP for Week: {week.modules?.reduce((macc, module) => macc + module.lessons.reduce((lacc, lesson) => lacc + lesson.xpPoints, 0), 0)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {expandedWeeks.has(week.weekNumber) && (
                            <div className="border-t border-gray-100">
                                {/* Modules */}
                                {week.modules && week.modules.length > 0 && week.modules.map((module: Module, moduleIdx: number) => (
                                    <div key={moduleIdx} className="p-6 border-b border-gray-50 last:border-b-0">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            📚 {module.title}
                                        </h3>

                                        {/* Lessons */}
                                        <div className="space-y-4">
                                            {module.lessons?.map((lesson: Lesson, lessonIdx: number) => (
                                                <div
                                                    key={lessonIdx}
                                                    className={`border rounded-xl p-4 transition-all ${
                                                        lesson.activities.every((_, idx) => completedActivities.has(`${week.weekNumber}-${module.title}-${lesson.day}-${lesson.title}-${idx}`)) ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-800">
                                                                    Day {lesson.day}: {lesson.title}
                                                                </h4>
                                                                <p className="text-sm text-gray-500">{lesson.description}</p>
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    {lesson.duration} • {lesson.xpPoints} XP
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Activities */}
                                                    <div className="grid gap-3 ml-0 md:ml-9 mt-4">
                                                        {lesson.activities?.map((activity: Activity, activityIdx: number) => {
                                                            const activityId = `${week.weekNumber}-${module.title}-${lesson.day}-${lesson.title}-${activityIdx}`;
                                                            const isActivityCompleted = completedActivities.has(activityId);
                                                            return (
                                                                <div key={activityIdx} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                                                    <button
                                                                        onClick={() => handleActivityComplete(week.weekNumber, module.title, lesson.day, lesson.title, activityIdx, lesson.xpPoints, activity.completionMessage)}
                                                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0
                                                                            ${isActivityCompleted ?
                                                                                'bg-green-500 border-green-500 text-white' :
                                                                                'border-gray-300 hover:border-purple-400 text-gray-500'
                                                                            }`}
                                                                    >
                                                                        {isActivityCompleted ? <CheckCircle className="w-4 h-4" /> :
                                                                            activity.type === 'watch' ? <Play className="w-4 h-4" /> :
                                                                                activity.type === 'read' ? <BookOpen className="w-4 h-4" /> :
                                                                                    <Target className="w-4 h-4" />}
                                                                    </button>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center space-x-2">
                                                                            <span className="font-medium text-gray-800">{activity.title}</span>
                                                                            {activity.url && (
                                                                                <a
                                                                                    href={activity.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-purple-600 hover:text-purple-800 text-sm"
                                                                                >
                                                                                    (Link)
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-sm text-gray-600">
                                                                            {activity.duration}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Week Assignment */}
                                        {week.assignment && (
                                            <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                                                <h4 className="font-semibold text-purple-800 mb-2">
                                                    📝 Week Assignment: {week.assignment.title}
                                                </h4>
                                                <p className="text-purple-700 mb-3">{week.assignment.description}</p>
                                                <div className="text-sm">
                                                    <p className="font-medium text-purple-800">Deliverable:</p>
                                                    <p className="text-purple-700">{week.assignment.deliverable}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Final Project & Career Impact */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
                {course.finalProject && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                        <h3 className="text-2xl font-bold text-green-800 mb-4">🎯 Final Project</h3>
                        <h4 className="font-semibold text-green-700 mb-2">{course.finalProject.title}</h4>
                        <p className="text-green-700 mb-4">{course.finalProject.description}</p>
                        <div className="space-y-2">
                            <p className="font-medium text-green-800">Skills Demonstrated:</p>
                            <div className="flex flex-wrap gap-2">
                                {course.finalProject.skills?.map((skill: string, idx: number) => (
                                    <span key={idx} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {course.careerImpact && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                        <h3 className="text-2xl font-bold text-blue-800 mb-4">💼 Career Impact</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium text-blue-800 mb-2">Job Opportunities:</p>
                                <p className="text-blue-700">{course.careerImpact.jobTitles?.join(' • ')}</p>
                            </div>
                            <div>
                                <p className="font-medium text-blue-800 mb-2">Resume Points:</p>
                                <ul className="space-y-1">
                                    {course.careerImpact.resumePoints?.map((point: string, idx: number) => (
                                        <li key={idx} className="text-blue-700 text-sm">• {point}</li>
                                    ))}
                                </ul>
                            </div>
                            {course.careerImpact.salaryRange && (
                                <div>
                                    <p className="font-medium text-blue-800">Expected Salary:</p>
                                    <p className="text-blue-700">{course.careerImpact.salaryRange}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
