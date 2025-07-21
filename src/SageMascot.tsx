import React from 'react';

export default function SageMascot({ state, message, inline=false }: {
  state: 'base'|'thinking'|'excited'|'celebrating',
  message?: string,
  inline?: boolean
}) {
  const anim =
    state==='thinking'   ? 'animate-pulse'  :
    state==='celebrating'? 'animate-spin'   : '';
  const wrapper = inline ? 'inline-flex items-center space-x-3' : 'flex flex-col items-center space-y-2';

  return (
    <div className={wrapper}>
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600
                      flex items-center justify-center ${anim} transition`}>
        <div className="text-white text-2xl">🦅</div>
      </div>
      {message && (
        <div className="bg-white rounded-lg shadow p-3 text-sm border border-gray-200">
          {message}
        </div>
      )}
    </div>
  );
}
