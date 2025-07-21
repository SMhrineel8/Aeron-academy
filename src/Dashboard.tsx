import React, { useState } from 'react';
import { Search, Volume2, VolumeX, Flame, Trophy, Clock, Target, Award, ChevronDown, ChevronRight, ExternalLink, Calendar, BookOpen, Play } from 'lucide-react';
import SageMascot from './SageMascot';

export default function Dashboard({
  profile,
  curriculum,
  generateCurriculum,
  searching,
  sageState,
  setShowCelebration,
  error,
  setError
}: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      generateCurriculum(searchQuery);
    }
  };

  const toggleWeek = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

  const toggleLessonComplete = (lessonId: string) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
      // Show celebration for completing lessons
      if (Math.random() > 0.7) {
        setShowCelebration(true);
      }
    }
    setCompletedLessons(newCompleted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-purple-100">
        <div className="max-w-6xl mx-auto flex items-center space-x-4 p-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Learnly
            </h1>
            <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
              Pro
            </span>
          </div>
          
          <SageMascot state={sageState} />
          
          <div className="flex-1 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter any skill (e.g., React, Python, Digital Marketing, Data Science)..."
              className="w-full pl-12 pr-12 py-3 border-2 border-purple-100 rounded-2xl bg-white/70 backdrop-blur-sm focus:border-purple-300 focus:outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full" />
            )}
          </div>

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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
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

        {!curriculum && !searching && (
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Master Any Skill with AI-Powered Curriculum
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Get a ₹1,00,000+ worth professional curriculum for free. Just enter any skill above!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: '8-Week Structure', desc: 'Organized weekly modules', icon: Calendar },
                  { title: 'Free Resources', desc: 'YouTube, MIT OCW, GitHub', icon: BookOpen },
                  { title: 'Career Ready', desc: 'Portfolio & resume boost', icon: Award }
                ].map(({ title, desc, icon: Icon }, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                    <Icon className="w-8 h-8 text-purple-500 mb-3" />
                    <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {curriculum && (
          <div className="space-y-8">
            {/* Curriculum Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold mb-4">{curriculum.title}</h1>
                <p className="text-xl opacity-90 mb-6">{curriculum.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5" />
                      <span className="font-semibold">Duration</span>
                    </div>
                    <p>{curriculum.totalWeeks} weeks</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">Daily Time</span>
                    </div>
                    <p>{curriculum.dailyHours}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5" />
                      <span className="font-semibold">Value</span>
                    </div>
                    <p>{curriculum.marketValue}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-5 h-5" />
                      <span className="font-semibold">Progress</span>
                    </div>
                    <p>{Math.round((completedLessons.size / (curriculum.weeks?.reduce((acc: number, week: any) => acc + week.modules?.reduce((macc: number, module: any) => macc + (module.lessons?.length || 0), 0), 0) || 1)) * 100)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Curriculum */}
            <div className="space-y-6">
              {curriculum.weeks?.map((week: any, weekIdx: number) => (
                <div key={weekIdx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                          {week.modules?.reduce((acc: number, module: any) => 
                            acc + (module.lessons?.length || 0), 0)} lessons
                        </div>
                      </div>
                    </div>
                  </div>

                  {expandedWeeks.has(week.weekNumber) && (
                    <div className="border-t border-gray-100">
                      {/* Modules */}
                      {week.modules?.map((module: any, moduleIdx: number) => (
                        <div key={moduleIdx} className="p-6 border-b border-gray-50 last:border-b-0">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            📚 {module.title}
                          </h3>
                          
                          {/* Lessons */}
                          <div className="space-y-4">
                            {module.lessons?.map((lesson: any, lessonIdx: number) => {
                              const lessonId = `${week.weekNumber}-${moduleIdx}-${lessonIdx}`;
                              const isCompleted = completedLessons.has(lessonId);
                              
                              return (
                                <div 
                                  key={lessonIdx} 
                                  className={`border rounded-xl p-4 transition-all ${
                                    isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <button
                                        onClick={() => toggleLessonComplete(lessonId)}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                          isCompleted ? 
                                          'bg-green-500 border-green-500 text-white' : 
                                          'border-gray-300 hover:border-purple-400'
                                        }`}
                                      >
                                        {isCompleted && <span className="text-xs">✓</span>}
                                      </button>
                                      <div>
                                        <h4 className="font-semibold text-gray-800">
                                          Day {lesson.day}: {lesson.title}
                                        </h4>
                                        <p className="text-sm text-gray-500">{lesson.duration}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Activities */}
                                  <div className="grid gap-3 ml-9">
                                    {lesson.activities?.map((activity: any, activityIdx: number) => (
                                      <div key={activityIdx} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                          activity.type === 'watch' ? 'bg-red-100 text-red-600' :
                                          activity.type === 'read' ? 'bg-blue-100 text-blue-600' :
                                          'bg-green-100 text-green-600'
                                        }`}>
                                          {activity.type === 'watch' ? <Play className="w-4 h-4" /> :
                                           activity.type === 'read' ? <BookOpen className="w-4 h-4" /> :
                                           <Target className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2">
                                            <span className="font-medium text-gray-800">{activity.title}</span>
                                            {activity.url && (
                                              <a
                                                href={activity.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-600 hover:text-purple-800"
                                              >
                                                <ExternalLink className="w-4 h-4" />
                                              </a>
                                            )}
                                          </div>
                                          <p className="text-sm text-gray-600">
                                            {activity.description || activity.duration}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
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
            <div className="grid md:grid-cols-2 gap-6">
              {curriculum.finalProject && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <h3 className="text-2xl font-bold text-green-800 mb-4">🎯 Final Project</h3>
                  <h4 className="font-semibold text-green-700 mb-2">{curriculum.finalProject.title}</h4>
                  <p className="text-green-700 mb-4">{curriculum.finalProject.description}</p>
                  <div className="space-y-2">
                    <p className="font-medium text-green-800">Skills Demonstrated:</p>
                    <div className="flex flex-wrap gap-2">
                      {curriculum.finalProject.skills?.map((skill: string, idx: number) => (
                        <span key={idx} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {curriculum.careerImpact && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">💼 Career Impact</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-blue-800 mb-2">Job Opportunities:</p>
                      <p className="text-blue-700">{curriculum.careerImpact.jobTitles?.join(' • ')}</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800 mb-2">Resume Points:</p>
                      <ul className="space-y-1">
                        {curriculum.careerImpact.resumePoints?.map((point: string, idx: number) => (
                          <li key={idx} className="text-blue-700 text-sm">• {point}</li>
                        ))}
                      </ul>
                    </div>
                    {curriculum.careerImpact.salaryRange && (
                      <div>
                        <p className="font-medium text-blue-800">Expected Salary:</p>
                        <p className="text-blue-700">{curriculum.careerImpact.salaryRange}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
