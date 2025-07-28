// src/services/geminiCourseGenerator.ts

interface YouTubeVideo {
  title: string;
  url: string;
  duration: string;
  channel: string;
  description: string;
}

interface CourseResource {
  type: 'video' | 'article' | 'practice' | 'quiz';
  title: string;
  url: string;
  duration: string;
  description: string;
  source: string;
}

interface GamifiedActivity {
  type: 'watch' | 'read' | 'practice';
  title: string;
  url: string;
  duration: string;
  completionMessage: string;
  xpReward: number;
}

interface GamifiedLesson {
  day: number;
  title: string;
  description: string;
  duration: string;
  xpPoints: number;
  activities: GamifiedActivity[];
  motivationalMessage: string;
}

export class GeminiCourseGenerator {
  private apiKey: string;
  private youtubeApiKey: string;

  constructor(geminiApiKey: string, youtubeApiKey: string) {
    this.apiKey = geminiApiKey;
    this.youtubeApiKey = youtubeApiKey;
  }

  async generateGamifiedCourse(topic: string, userLevel: string = 'beginner'): Promise<any> {
    try {
      // Step 1: Use Gemini to create course structure
      const courseStructure = await this.generateCourseStructure(topic, userLevel);
      
      // Step 2: Search for relevant YouTube videos and resources
      const resources = await this.searchCourseResources(topic, courseStructure);
      
      // Step 3: Create gamified course with dopamine triggers
      const gamifiedCourse = await this.createGamifiedCourse(courseStructure, resources);
      
      return gamifiedCourse;
    } catch (error) {
      console.error('Error generating course:', error);
      throw error;
    }
  }

  private async generateCourseStructure(topic: string, userLevel: string): Promise<any> {
    const prompt = `
    Create a comprehensive 8-week learning curriculum for "${topic}" at ${userLevel} level.
    
    Requirements:
    - Each week should have 3-4 modules
    - Each module should have 2-3 daily lessons
    - Include practical projects and assignments
    - Add skill checkpoints for each week
    - Include career impact and job opportunities
    - Estimate market value of the skills
    - Include XP points for gamification (100-500 XP per lesson)
    
    Format the response as JSON with this structure:
    {
      "title": "Course Title",
      "description": "Course description",
      "totalWeeks": 8,
      "dailyHours": "1-2 hours",
      "marketValue": "₹50,000-₹100,000",
      "weeks": [
        {
          "weekNumber": 1,
          "title": "Week Title",
          "goals": ["Goal 1", "Goal 2"],
          "modules": [
            {
              "title": "Module Title",
              "lessons": [
                {
                  "day": 1,
                  "title": "Lesson Title",
                  "description": "Lesson description",
                  "duration": "45 minutes",
                  "xpPoints": 150,
                  "topics": ["Topic 1", "Topic 2"]
                }
              ]
            }
          ],
          "assignment": {
            "title": "Assignment Title",
            "description": "Assignment description",
            "deliverable": "What to submit"
          }
        }
      ],
      "finalProject": {
        "title": "Final Project Title",
        "description": "Project description",
        "skills": ["Skill 1", "Skill 2"]
      },
      "careerImpact": {
        "jobTitles": ["Job 1", "Job 2"],
        "salaryRange": "₹8-15 LPA",
        "resumePoints": ["Point 1", "Point 2"]
      }
    }
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse course structure from Gemini response');
  }

  private async searchCourseResources(topic: string, courseStructure: any): Promise<CourseResource[]> {
    const resources: CourseResource[] = [];
    
    // Search YouTube for educational content
    const youtubeVideos = await this.searchYouTubeVideos(topic);
    
    // Search for additional resources using Gemini
    const additionalResources = await this.searchAdditionalResources(topic);
    
    // Combine and categorize resources
    resources.push(...youtubeVideos);
    resources.push(...additionalResources);
    
    return resources;
  }

  private async searchYouTubeVideos(topic: string): Promise<CourseResource[]> {
    try {
      const searchQuery = encodeURIComponent(`${topic} tutorial course free`);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&videoDuration=medium&order=relevance&maxResults=20&key=${this.youtubeApiKey}`
      );
      
      const data = await response.json();
      
      if (!data.items) {
        return [];
      }
      
      const videos: CourseResource[] = data.items.map((item: any) => ({
        type: 'video' as const,
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        duration: 'Varies', // YouTube API v3 doesn't provide duration in search
        description: item.snippet.description,
        source: item.snippet.channelTitle
      }));
      
      return videos;
    } catch (error) {
      console.error('Error searching YouTube:', error);
      return [];
    }
  }

  private async searchAdditionalResources(topic: string): Promise<CourseResource[]> {
    const prompt = `
    Find the best free educational resources for learning "${topic}". Include:
    - Free courses from MIT OpenCourseWare, Coursera, edX
    - Documentation and official guides
    - Interactive coding platforms
    - GitHub repositories with tutorials
    - Blog posts and articles
    
    Format as JSON array:
    [
      {
        "type": "article",
        "title": "Resource Title",
        "url": "https://example.com",
        "duration": "30 minutes",
        "description": "Description",
        "source": "Source Name"
      }
    ]
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return [];
    } catch (error) {
      console.error('Error searching additional resources:', error);
      return [];
    }
  }

  private async createGamifiedCourse(courseStructure: any, resources: CourseResource[]): Promise<any> {
    // Dopamine-triggering messages for different achievements
    const completionMessages = [
      "🎉 Amazing! You're on fire! Ready for the next challenge?",
      "💪 Incredible progress! You're becoming unstoppable!",
      "🚀 Boom! Another skill unlocked! Keep the momentum going!",
      "⭐ Outstanding! You're crushing it like a pro!",
      "🔥 Fantastic work! Your future self will thank you!",
      "🎯 Perfect! You're building something incredible!",
      "💎 Brilliant! You're one step closer to mastery!",
      "🌟 Exceptional! Your dedication is paying off!",
      "🏆 Superb! You're writing your success story!",
      "⚡ Electrifying progress! Ready to level up again?"
    ];

    const motivationalMessages = [
      "Today's lesson will unlock a new superpower! 🚀",
      "Ready to blow your own mind? Let's dive in! 🤯",
      "This is where the magic happens! ✨",
      "You're about to level up in 3... 2... 1... 🔥",
      "Plot twist: You're more capable than you think! 💪",
      "Today we're turning you into a legend! 🌟",
      "Warning: This lesson may cause sudden confidence boost! ⚡",
      "Your future self is cheering you on right now! 🎉",
      "Let's make today's you proud of yesterday's you! 🏆",
      "Time to add another skill to your arsenal! ⚔️"
    ];

    // Enhance course structure with gamification
    const gamifiedCourse = {
      ...courseStructure,
      weeks: courseStructure.weeks.map((week: any, weekIndex: number) => ({
        ...week,
        modules: week.modules.map((module: any, moduleIndex: number) => ({
          ...module,
          lessons: module.lessons.map((lesson: any, lessonIndex: number) => {
            // Match resources to lesson topics
            const relevantResources = this.matchResourcesToLesson(lesson, resources);
            
            return {
              ...lesson,
              motivationalMessage: motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
              activities: relevantResources.map((resource, activityIndex) => ({
                type: resource.type === 'video' ? 'watch' : resource.type === 'article' ? 'read' : 'practice',
                title: resource.title,
                url: resource.url,
                duration: resource.duration,
                completionMessage: completionMessages[Math.floor(Math.random() * completionMessages.length)],
                xpReward: Math.floor(lesson.xpPoints / relevantResources.length)
              }))
            };
          })
        }))
      }))
    };

    return gamifiedCourse;
  }

  private matchResourcesToLesson(lesson: any, resources: CourseResource[]): CourseResource[] {
    // Simple matching algorithm - can be enhanced with AI
    const lessonKeywords = [
      ...lesson.title.toLowerCase().split(' '),
      ...lesson.description.toLowerCase().split(' '),
      ...(lesson.topics || []).join(' ').toLowerCase().split(' ')
    ].filter(word => word.length > 3);

    const scoredResources = resources.map(resource => {
      const resourceText = `${resource.title} ${resource.description}`.toLowerCase();
      const score = lessonKeywords.reduce((acc, keyword) => {
        return acc + (resourceText.includes(keyword) ? 1 : 0);
      }, 0);

      return { resource, score };
    });

    // Sort by relevance and take top 3
    return scoredResources
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.resource);
  }

  // Method to generate motivational streaks and achievements
  async generateAchievements(completedActivities: number, totalActivities: number): Promise<any[]> {
    const achievements = [
      {
        id: 'first_step',
        title: 'First Step',
        description: 'Completed your first activity!',
        icon: '🎯',
        unlocked: completedActivities >= 1,
        xpBonus: 50
      },
      {
        id: 'on_fire',
        title: 'On Fire!',
        description: 'Completed 5 activities in a row!',
        icon: '🔥',
        unlocked: completedActivities >= 5,
        xpBonus: 100
      },
      {
        id: 'unstoppable',
        title: 'Unstoppable',
        description: 'Completed 25% of the course!',
        icon: '🚀',
        unlocked: (completedActivities / totalActivities) >= 0.25,
        xpBonus: 200
      },
      {
        id: 'halfway_hero',
        title: 'Halfway Hero',
        description: 'Reached the halfway point!',
        icon: '⭐',
        unlocked: (completedActivities / totalActivities) >= 0.5,
        xpBonus: 300
      },
      {
        id: 'almost_there',
        title: 'Almost There',
        description: 'Completed 75% of the course!',
        icon: '💪',
        unlocked: (completedActivities / totalActivities) >= 0.75,
        xpBonus: 400
      },
      {
        id: 'course_master',
        title: 'Course Master',
        description: 'Completed the entire course!',
        icon: '🏆',
        unlocked: (completedActivities / totalActivities) >= 1.0,
        xpBonus: 1000
      }
    ];

    return achievements;
  }

  // Method to generate personalized encouragement based on progress
  async generatePersonalizedEncouragement(progress: number, streak: number): Promise<string> {
    let encouragement = '';

    if (progress < 0.1) {
      encouragement = "Every master was once a beginner. You've got this! 🌱";
    } else if (progress < 0.25) {
      encouragement = "Look at you go! The momentum is building! 🚀";
    } else if (progress < 0.5) {
      encouragement = "You're absolutely crushing it! Keep the energy up! ⚡";
    } else if (progress < 0.75) {
      encouragement = "Incredible progress! You're in the zone now! 🔥";
    } else if (progress < 1.0) {
      encouragement = "So close to mastery! The finish line is in sight! 🏁";
    } else {
      encouragement = "LEGEND! You've conquered this skill! What's next? 👑";
    }

    // Add streak bonus messages
    if (streak >= 7) {
      encouragement += " Your 7-day streak is PHENOMENAL! 🌟";
    } else if (streak >= 3) {
      encouragement += ` Your ${streak}-day streak is impressive! 💪`;
    }

    return encouragement;
  }
}
