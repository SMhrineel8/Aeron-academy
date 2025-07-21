import React from 'react';

export default function CelebrationOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div className="relative">
        {[...Array(20)].map((_,i)=>(
          <div key={i}
               className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-confetti"
               style={{
                 left: `${Math.random()*100}px`,
                 top:  `${Math.random()*100}px`,
                 animationDelay: `${Math.random()*2}s`,
                 animationDuration: `${2+Math.random()*2}s`
               }}/>
        ))}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4
                        rounded-2xl shadow transform scale-110 animate-celebration">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-xl font-bold">Amazing Progress!</div>
            <div className="text-sm opacity-90">Keep going!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
