import React, { useState } from 'react';
import OnboardingFlow from './OnboardingFlow';
import Dashboard from './Dashboard';
import CelebrationOverlay from './CelebrationOverlay';

// Use environment variable for API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

export default function App() {
  const [view, setView] = useState<'onboarding'|'dashboard'>('onboarding');
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
  const [searching, setSearching] = useState(false);
  const [sageState, setSageState] = useState<'base'|'thinking'|'excited'|'celebrating'>('base');
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState<string>('');

  const generateCurriculum = async (topic: string) => {
    if (!topic.trim()) return;
    
    setSearching(true);
    setSageState('thinking');
    setError('');

    const enhancedPrompt = `You are my personal Course Mentor—an elite educator and coach with 20+ years' experience on Coursera, Udemy, edX, MIT OCW, etc. 

When I name any skill, design a ₹1,00,000+ worth, 100% free weekly curriculum for 1–2 hrs/day:

1. **Weeks → Modules → Lessons:**
   • Goals for each week and module
   • Daily plan (watch/read/practice)
   • Assignments or mini-projects

2. **Resources Only:** Free YouTube channels, educational blogs, MIT/Harvard OCW, GitHub repositories, PDFs—no paywalls or login required

3. **Motivation & Coaching:**
   • Why this skill matters in today's market
   • Consistency tips and study habits
   • Weekly checkpoints/assessments

4. **Outcome Focus:**
   • Clear end goal (job readiness, portfolio projects)
   • Resume/CV improvement suggestions
   • Showcase/portfolio recommendations

**Constraints:**
• Use only GitHub & Vercel for any code deployment
• Focus on practical, industry-relevant skills
• Include real-world project ideas

**Topic:** ${topic}

Please respond with a detailed JSON curriculum in this exact format:
{
  "title": "Master ${topic} in 8 Weeks",
  "description": "Professional-grade curriculum",
  "totalWeeks": 8,
  "dailyHours": "1-2 hours",
  "marketValue": "₹1,00,000+",
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week title",
      "goals": ["Goal 1", "Goal 2"],
      "modules": [
        {
          "title": "Module title",
          "lessons": [
            {
              "day": 1,
              "title": "Lesson title",
              "duration": "60 mins",
              "activities": [
                {
                  "type": "watch",
                  "title": "Video title",
                  "url": "https://youtube.com/...",
                  "duration": "20 mins"
                },
                {
                  "type": "read",
                  "title": "Article/Doc title", 
                  "url": "https://...",
                  "duration": "15 mins"
                },
                {
                  "type": "practice",
                  "title": "Exercise title",
                  "description": "What to do",
                  "duration": "25 mins"
                }
              ]
            }
          ]
        }
      ],
      "assignment": {
        "title": "Week assignment",
        "description": "Detailed description",
        "deliverable": "What to create/submit",
        "resources": ["Resource 1", "Resource 2"]
      },
      "checkpoint": "Assessment criteria"
    }
  ],
  "finalProject": {
    "title": "Capstone project",
    "description": "Major project description",
    "skills": ["Skill 1", "Skill 2"],
    "portfolio": "How to showcase this"
  },
  "careerImpact": {
    "jobTitles": ["Job 1", "Job 2"],
    "resumePoints": ["Achievement 1", "Achievement 2"],
    "salaryRange": "Expected range"
  }
}`;

    try {
      const payload = {
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }]
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
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
          generateCurriculum={generateCurriculum}
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
