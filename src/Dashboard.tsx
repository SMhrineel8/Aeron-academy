import React from 'react';
import { Search, Volume2, VolumeX, Flame, Trophy } from 'lucide-react';
import SageMascot from './SageMascot';
import CourseCard from './CourseCard';

export default function Dashboard({
  profile, courses, searchCourse, searching, sageState, setShowCelebration
}: any) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <header className="bg-white shadow sticky top-0">
        <div className="max-w-3xl mx-auto flex items-center space-x-4 p-4">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Learnly
          </h1>
          <SageMascot state={sageState}/>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              type="text"
              placeholder="Search a course topic…"
              className="w-full pl-10 pr-4 py-2 border rounded"
              onKeyDown={e=> e.key==='Enter'&&searchCourse((e.target as HTMLInputElement).value)}
            />
            {searching && <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-5 w-5 border-b-2 border-purple-500 rounded-full"/>}
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-4 grid gap-6">
        {courses.map(c=> <CourseCard key={c.id} course={c}/>)}
      </main>
    </div>
  );
}
