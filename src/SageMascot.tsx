import React from 'react';

interface SageMascotProps {
  state: 'excited' | 'thinking' | 'happy' | 'encouraging' | string;
  message: string;
}

export default function SageMascot({ state, message }: SageMascotProps) {
  const getEmoji = () => {
    switch (state) {
      case 'excited':
        return '🦅';
      case 'thinking':
        return '🤔';
      case 'happy':
        return '😊';
      case 'encouraging':
        return '💪';
      default:
        return '🦅';
    }
  };

  return (
    <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="text-3xl">{getEmoji()}</div>
      <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
}
