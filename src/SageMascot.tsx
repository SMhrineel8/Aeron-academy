// SageMascot.tsx
import React from 'react';
import { Sparkles, Brain, Zap, Heart } from 'lucide-react';

interface SageMascotProps {
  state: 'base' | 'thinking' | 'excited' | 'celebrating';
  message: string;
}

export default function SageMascot({ state, message }: SageMascotProps) {
  const getMascotEmoji = () => {
    switch (state) {
      case 'thinking':
        return '🤔';
      case 'excited':
        return '🤩';
      case 'celebrating':
        return '🎉';
      default:
        return '🧠';
    }
  };

  const getMascotAnimation = () => {
    switch (state) {
      case 'thinking':
        return 'animate-pulse';
      case 'excited':
        return 'animate-bounce';
      case 'celebrating':
        return 'animate-ping';
      default:
        return '';
    }
  };

  const getMessageColor = () => {
    switch (state) {
      case 'thinking':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'excited':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'celebrating':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (state) {
      case 'thinking':
        return <Brain className="w-4 h-4" />;
      case 'excited':
        return <Zap className="w-4 h-4" />;
      case 'celebrating':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Mascot Avatar */}
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xl shadow-lg ${getMascotAnimation()}`}>
        {getMascotEmoji()}
      </div>

      {/* Message Bubble */}
      <div className={`relative max-w-xs px-4 py-2 rounded-2xl border ${getMessageColor()} shadow-sm`}>
        {/* Speech bubble arrow */}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 ${getMessageColor().split(' ')[1]}`}></div>
        
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
}
