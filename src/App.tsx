// src/App.tsx
import React, { useState } from 'react';
import OnboardingFlow from './OnboardingFlow';
import Dashboard from './Dashboard';
import CelebrationOverlay from './CelebrationOverlay';

// Use environment variable for API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

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
    const [curriculum, setCurriculum] = useState<any>(null); // This will hold the generated curriculum
    const [activeGeneratedCourse, setActiveGeneratedCourse] = useState<any>(null); // New state to hold the course actively being viewed/taken
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const [sageState, setSageState] = useState<'base' | 'thinking' | 'excited' | 'celebrating'>('base');
    const [showCelebration, setShowCelebration] = useState(false);
    const [error, setError] = useState<string>('');

    const generateCurriculum = async (topic: string) => {
        if (!topic.trim()) return;

        setSearching(true);
        setSageState('thinking');
        setError('');
        setCurriculum(null); // Clear previous curriculum
        setActiveGeneratedCourse(null); // Clear active course

        const gamifiedPrompt = `You are an elite AI-powered learning companion, designed to create highly engaging, gamified, Duolingo-style learning experiences.
Your goal is to design a comprehensive, 8-week, 1-2 hours/day curriculum for "${topic}", focusing on free, high-quality online resources.

Key Requirements for the Curriculum:

1. Gamified Structure:
    * Each lesson should have a clear "XP" (experience points) value.
    * Include "dopamine-tapping" motivational messages after completing a lesson or a daily set of activities (e.g., "Fantastic! Ready for the next challenge?", "You're on fire! Keep going!").
    * Suggest mini-challenges or quizzes within modules.

2. Resource Compilation (Crucial):
    * Search and Curate: Act as a super-intelligent search engine. For each lesson, find the best, most relevant, and completely free resources. Prioritize:
        * YouTube Playlists/Videos: Search YouTube for comprehensive playlists or highly-rated individual videos. Provide direct YouTube URLs.
        * Google Search: Find high-quality, free articles, blogs, official documentation, or open-courseware (e.g., MIT OpenCourseWare, Harvard CS50, freeCodeCamp, GeeksforGeeks, W3Schools). Provide direct URLs.
        * No Paywalls/Logins: Absolutely no resources requiring payment, subscription, or login.
    * Specificity: For YouTube, try to find specific videos within playlists if a playlist is too long, or suggest a starting point.

3. Curriculum Format:
    * Weeks → Modules → Days → Lessons:
        * Each lesson has a \`title\`, \`description\`, \`duration\`, \`xpPoints\`, and \`activities\`.
        * \`activities\` array contains objects with \`type\` (watch, read, practice), \`title\`, \`url\`, \`duration\`, and \`completionMessage\` (for gamification).
    * Weekly Assignments/Projects: Short, practical assignments.
    * Weekly Checkpoints/Quizzes: To reinforce learning.
    * Final Project: A significant capstone project.
    * Career Impact: Relevant job titles, resume points.

Example of desired JSON structure:
{
    "title": "Master ${topic} in 8 Weeks",
    "description": "A gamified, professional-grade curriculum designed to boost your skills and dopamine!",
    "totalWeeks": 8,
    "dailyHours": "1-2 hours",
    "marketValue": "₹1,00,000+",
    "weeks": [
        {
            "weekNumber": 1,
            "title": "Week 1: Introduction to ${topic}",
            "goals": ["Understand basics", "Set up environment"],
            "modules": [
                {
                    "title": "Module 1.1: Core Concepts",
                    "lessons": [
                        {
                            "day": 1,
                            "title": "What is ${topic}?",
                            "description": "Explore the fundamental ideas and applications.",
                            "duration": "60 mins",
                            "xpPoints": 50,
                            "activities": [
                                {
                                    "type": "watch",
                                    "title": "Introduction to ${topic} (Crash Course)",
                                    "url": "https://www.youtube.com/watch?v=EXAMPLE_VIDEO_ID",
                                    "duration": "20 mins",
                                    "completionMessage": "Great start! You've unlocked the basics. Ready for more!"
                                },
                                {
                                    "type": "read",
                                    "title": "Official ${topic} Documentation: Getting Started",
                                    "url": "https://docs.example.com/getting-started",
                                    "duration": "30 mins",
                                    "completionMessage": "Excellent! Reading is power. Keep building that knowledge!"
                                },
                                {
                                    "type": "practice",
                                    "title": "First Code Challenge: Hello World in ${topic}",
                                    "description": "Write a simple program to display 'Hello World'.",
                                    "duration": "10 mins",
                                    "completionMessage": "Boom! First challenge conquered! Feeling that XP boost?"
                                }
                            ]
                        }
                        // ... more lessons for Day 2, Day 3 etc.
                    ]
                }
            ],
            "assignment": {
                "title": "Week 1 Mini-Project: ${topic} Basics",
                "description": "Create a simple interactive program demonstrating core concepts.",
                "deliverable": "GitHub repository link",
                "resources": ["Resource A", "Resource B"]
            },
            "checkpoint": "Self-assessment quiz on Week 1 topics."
        }
        // ... more weeks
    ],
    "finalProject": {
        "title": "Capstone Project: Advanced ${topic} Application",
        "description": "Build a full-stack application using ${topic}.",
        "skills": ["Skill 1", "Skill 2"],
        "portfolio": "Deploy on Vercel/GitHub Pages."
    },
    "careerImpact": {
        "jobTitles": ["Junior ${topic} Developer", "${topic} Analyst"],
        "resumePoints": ["Developed a gamified learning platform", "Curated 100+ free online resources"],
        "salaryRange": "₹5,00,000 - ₹10,00,000 per annum"
    }
}
`;

        try {
            const payload = {
                contents: [{
                    parts: [{
                        text: gamifiedPrompt
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
                setCurriculum(curriculumData); // Store the generated curriculum
                setSageState('excited');
            } else {
                throw new Error('Invalid response format: Could not parse JSON.');
            }

        } catch (error) {
            console.error('Error generating curriculum:', error);
            setError('Failed to generate curriculum. Please check your API key and try again.');
            setSageState('base');
        } finally {
            setSearching(false);
        }
    };

    const generateQuiz = async (topic: string) => {
        setSearching(true);
        setSageState('thinking');
        setError('');

        const quizPrompt = `Generate a short, multiple-choice quiz (5 questions) about "${topic}".
Each question should have 4 options and indicate the correct answer.
Respond in JSON format:
{
    "title": "Quiz on ${topic}",
    "description": "Test your knowledge!",
    "questions": [
        {
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option A"
        }
    ]
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
                    curriculum={curriculum} // Pass the generated curriculum
                    activeGeneratedCourse={activeGeneratedCourse} // Pass the active course
                    setActiveGeneratedCourse={setActiveGeneratedCourse} // Pass setter for active course
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
