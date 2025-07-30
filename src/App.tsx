// App.tsx
import React, { useState } from 'react';
import OnboardingFlow from './OnboardingFlow';
import Dashboard from './Dashboard';
import CelebrationOverlay from './CelebrationOverlay';

// Use environment variable for API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY';

export default function App() {
  const [view, setView] = useState<'onboarding' | 'dashboard'>('onboarding');
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '',
    interests: [] as string[],
    level: 'beginner',
    learningStyle: 'visual',
    streak: 7,
    totalPoints: 2450,
    currentLevel: 12
  });

  const [curriculum, setCurriculum] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [sageState, setSageState] = useState<'base' | 'thinking' | 'excited' | 'celebrating'>('base');
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState<string>('');

  // YouTube API search function
  const searchYouTube = async (query: string, maxResults: number = 5) => {
    try {
      const response = await fetch(
        https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}
      );
      
      if (!response.ok) {
        throw new Error('YouTube API request failed');
      }
      
      const data = await response.json();
      return data.items.map((item: any) => ({
        title: item.snippet.title,
        url: https://www.youtube.com/watch?v=${item.videoId},
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url
      }));
    } catch (error) {
      console.error('YouTube search error:', error);
      // Fallback to manual curated links if API fails
      return [
        {
          title: ${query} - Complete Tutorial,
          url: 'https://www.youtube.com/watch?v=example',
          description: 'Comprehensive tutorial covering all aspects',
          thumbnail: 'https://img.youtube.com/vi/example/mqdefault.jpg'
        }
      ];
    }
  };

  const generateCurriculum = async (topic: string) => {
    if (!topic.trim()) return;

    setSearching(true);
    setSageState('thinking');
    setError('');

    try {
      // First, search for YouTube videos related to the topic
      const youtubeVideos = await searchYouTube(${topic} tutorial complete course);
      
      const enhancedPrompt = `You are an elite gamified learning companion, designed to create highly engaging, Duolingo-style learning experiences that tap into dopamine reward systems.

Create a comprehensive, 8-week, 1-2 hours/day curriculum for "${topic}" using ONLY free resources.

CRITICAL REQUIREMENTS:

1. GAMIFICATION & DOPAMINE TRIGGERS:
   - Each lesson has XP points (25-100 XP per lesson)
   - Motivational completion messages that create excitement
   - Progressive difficulty with clear achievements
   - Streak tracking and reward systems
   - Mini-challenges between lessons

2. RESOURCE CURATION:
   Use these YouTube videos I found: ${JSON.stringify(youtubeVideos.slice(0, 3))}
   
   Also include:
   - Free documentation sites
   - Interactive coding platforms (CodePen, JSFiddle, Repl.it)
   - GitHub repositories with tutorials
   - MIT OpenCourseWare, freeCodeCamp, W3Schools
   - NO paywalls or login requirements

3. DOPAMINE-DRIVEN STRUCTURE:
   - Start each day with a quick win (5-10 min easy task)
   - Build complexity gradually
   - Include celebration moments
   - Progress bars and achievement unlocks

Respond with this EXACT JSON structure:

{
  "title": "Master ${topic} in 8 Weeks",
  "description": "A gamified, dopamine-driven curriculum designed for maximum engagement",
  "totalWeeks": 8,
  "dailyHours": "1-2 hours",
  "marketValue": "₹1,00,000+",
  "totalXP": 4000,
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week 1: ${topic} Foundations",
      "goals": ["Understand core concepts", "Set up environment", "Build first project"],
      "totalWeekXP": 500,
      "modules": [
        {
          "title": "Module 1.1: Quick Start",
          "lessons": [
            {
              "day": 1,
              "title": "Your First ${topic} Victory",
              "description": "Get an immediate win to build confidence",
              "duration": "60 mins",
              "xpPoints": 50,
              "difficulty": "easy",
              "activities": [
                {
                  "type": "watch",
                  "title": "What is ${topic}? (5-min overview)",
                  "url": "${youtubeVideos[0]?.url || 'https://www.youtube.com/results?search_query=' + encodeURIComponent(topic)}",
                  "duration": "15 mins",
                  "completionMessage": "🎉 Amazing start! You're already ahead of 90% of people. Ready for more?"
                },
                {
                  "type": "practice",
                  "title": "5-Minute Challenge: Your First ${topic} Hello World",
                  "description": "Create something simple but functional",
                  "duration": "20 mins",
                  "completionMessage": "🚀 BOOM! You just created your first ${topic} program. You're officially a ${topic} developer now!"
                },
                {
                  "type": "read",
                  "title": "${topic} Cheat Sheet & Quick Reference",
                  "url": "https://www.google.com/search?q=${encodeURIComponent(topic + ' cheat sheet PDF free')}",
                  "duration": "25 mins",
                  "completionMessage": "💪 Knowledge absorbed! Your brain is now 10% more powerful. Keep going!"
                }
              ]
            }
          ]
        }
      ],
      "assignment": {
        "title": "Week 1 Victory Project",
        "description": "Build a simple but impressive ${topic} project that you can show off",
        "deliverable": "Working project + GitHub link",
        "xpReward": 100,
        "completionMessage": "🏆 INCREDIBLE! You've completed your first week. You're officially in the top 10% of learners!"
      },
      "checkpoint": "Quick quiz to lock in your knowledge and earn bonus XP"
    }
  ],
  "finalProject": {
    "title": "Ultimate ${topic} Portfolio Project",
    "description": "Build a complete application that showcases all your new skills",
    "skills": ["Core ${topic} concepts", "Best practices", "Real-world application"],
    "xpReward": 500,
    "portfolio": "Deploy on Vercel/GitHub Pages for maximum impact"
  },
  "careerImpact": {
    "jobTitles": ["${topic} Developer", "${topic} Specialist", "Full-Stack Developer"],
    "resumePoints": ["Built complete ${topic} application", "Mastered ${topic} in 8 weeks", "Self-taught ${topic} expert"],
    "salaryRange": "₹5,00,000 - ₹15,00,000 per annum"
  },
  "motivationalMessages": [
    "You're becoming a ${topic} expert, one lesson at a time! 🌟",
    "Every expert was once a beginner. You're making amazing progress! 💪",
    "Your future ${topic} career starts with this next lesson! 🚀"
  ]
}

IMPORTANT: Generate a complete 8-week curriculum with detailed daily lessons, not just Week 1.`;

      const payload = {
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }]
      };

      const response = await fetch(
        https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY},
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(API Error: ${response.status});
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const curriculumData = JSON.parse(jsonMatch[0]);
        setCurriculum(curriculumData);
        setSageState('excited');
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Error generating curriculum:', error);
      setError('Failed to generate curriculum. Please check your API key and try again.');
      setSageState('base');
    } finally {
      setSearching(false);
    }
  };

  // Enhanced quiz generation
  const generateQuiz = async (topic: string) => {
    setSearching(true);
    setSageState('thinking');
    setError('');

    const quizPrompt = `Generate an engaging, gamified quiz about "${topic}" with exactly 5 multiple-choice questions.

Make it challenging but fair, with interesting explanations for correct answers.

Respond in JSON format:

{
  "title": "🧠 ${topic} Knowledge Challenge",
  "description": "Test your skills and earn XP!",
  "xpReward": 100,
  "passingScore": 80,
  "questions": [
    {
      "question": "What is the most important concept in ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Option A is correct because...",
      "difficulty": "medium",
      "xpPoints": 20
    }
  ],
  "completionMessage": "🏆 Quiz conquered! Your ${topic} knowledge is growing stronger!"
}`;

    try {
      const payload = {
        contents: [{
          parts: [{
            text: quizPrompt
          }]
        }]
      };

      const response = await fetch(
        https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY},
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(API Error: ${response.status});
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const quizData = JSON.parse(jsonMatch[0]);
        setQuizzes(prev => [...prev, quizData]);
        setSageState('excited');
      } else {
        throw new Error('Invalid quiz response format');
      }

    } catch (error) {
      console.error('Error generating quiz:', error);
      setError('Failed to generate quiz. Please try again.');
      setSageState('base');
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      {view === 'onboarding' ? (
        <OnboardingFlow
          step={step}
          setStep={setStep}
          profile={profile}
          setProfile={setProfile}
          finish={() => setView('dashboard')}
        />
      ) : (
        <Dashboard
          profile={profile}
          curriculum={curriculum}
          quizzes={quizzes}
          generateCurriculum={generateCurriculum}
          generateQuiz={generateQuiz}
          searching={searching}
          sageState={sageState}
          setShowCelebration={setShowCelebration}
          error={error}
          setError={setError}
        />
      )}
      <CelebrationOverlay show={showCelebration} setShow={setShowCelebration} />
    </>
  );
}
