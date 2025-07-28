// pages/api/generate-course.ts (or app/api/generate-course/route.ts for App Router)

import { NextApiRequest, NextApiResponse } from 'next';
import { GeminiCourseGenerator } from '../../src/services/geminiCourseGenerator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, userLevel = 'beginner' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Initialize the course generator with API keys
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;

    if (!geminiApiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    if (!youtubeApiKey) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }

    const courseGenerator = new GeminiCourseGenerator(geminiApiKey, youtubeApiKey);
    
    // Generate the gamified course
    const course = await courseGenerator.generateGamifiedCourse(topic, userLevel);
    
    return res.status(200).json({
      success: true,
      course
    });

  } catch (error) {
    console.error('Error generating course:', error);
    return res.status(500).json({ 
      error: 'Failed to generate course',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Alternative: App Router version (app/api/generate-course/route.ts)
/*
import { NextRequest, NextResponse } from 'next/server';
import { GeminiCourseGenerator } from '../../../src/services/geminiCourseGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, userLevel = 'beginner' } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;

    if (!geminiApiKey || !youtubeApiKey) {
      return NextResponse.json({ error: 'API keys not configured' }, { status: 500 });
    }

    const courseGenerator = new GeminiCourseGenerator(geminiApiKey, youtubeApiKey);
    const course = await courseGenerator.generateGamifiedCourse(topic, userLevel);
    
    return NextResponse.json({
      success: true,
      course
    });

  } catch (error) {
    console.error('Error generating course:', error);
    return NextResponse.json({ 
      error: 'Failed to generate course',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
*/
