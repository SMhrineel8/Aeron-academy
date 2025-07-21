import React, { useState } from 'react';
import OnboardingFlow from './OnboardingFlow';
import Dashboard from './Dashboard';
import CelebrationOverlay from './CelebrationOverlay';

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';

export default function App() {
  const [view, setView] = useState<'onboarding'|'dashboard'>('onboarding');
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '', interests: [] as string[],
    level: 'beginner', learningStyle: 'visual',
    streak: 7, totalPoints: 2450, currentLevel: 12
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [sageState, setSageState] = useState<'base'|'thinking'|'excited'|'celebrating'>('base');
  const [showCelebration, setShowCelebration] = useState(false);

  const searchWithGemini = async(topic: string) => {
    setSearching(true);
    setSageState('thinking');

    const payload = {
      model: 'gemini-pro',
      prompt: {
        context: `You are my personal Course Mentor—an elite-level educator with 20+ years of experience across top platforms.  
Your job is to give a 100% free, practical, career-relevant learning path for any skill I choose.  
Design a gamified course like it’s worth ₹1,00,000+, but costs ₹0.  
Break it into modules and lessons, assign free YouTube URLs, MIT OCW, GitHub repos, PDFs.  
Suggest daily tasks for 1–2 hr/day and mini-projects. Output a JSON array of courses:
[{"id":"1","title":"…","description":"…","url":"…"},…]`,
        messages: [{ role:'user', content: topic }]
      },
      temperature: 0.7
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      }
    );
    const json = await res.json();
    const text = json.candidates[0]?.content.trim() || '[]';
    try {
      setCourses(JSON.parse(text));
    } catch {
      setCourses([]);
    }

    setSearching(false);
    setSageState('excited');
  };

  return (
    <>
      {view === 'onboarding'
        ? <OnboardingFlow
            step={step}
            setStep={setStep}
            profile={profile}
            setProfile={setProfile}
            finish={() => setView('dashboard')}
          />
        : <Dashboard
            profile={profile}
            courses={courses}
            searchCourse={searchWithGemini}
            searching={searching}
            sageState={sageState}
            setShowCelebration={setShowCelebration}
          />
      }
      <CelebrationOverlay show={showCelebration}/>
    </>
  );
}
