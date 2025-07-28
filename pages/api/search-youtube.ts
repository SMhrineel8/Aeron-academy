// pages/api/search-youtube.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, maxResults = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    
    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }

    // Search for videos
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}&order=relevance&videoDuration=medium`
    );

    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    
    // Get video details for duration and stats
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    const detailsData = await detailsResponse.json();

    // Combine search results with video details
    const enhancedVideos = searchData.items.map((item: any, index: number) => {
      const details = detailsData.items[index];
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: details?.contentDetails?.duration || 'PT0S',
        viewCount: details?.statistics?.viewCount || '0',
        likeCount: details?.statistics?.likeCount || '0'
      };
    });

    // Filter for quality videos (basic quality checks)
    const qualityVideos = enhancedVideos.filter((video: any) => {
      const viewCount = parseInt(video.viewCount);
      const likeCount = parseInt(video.likeCount);
      
      // Basic quality filters
      return viewCount > 1000 && // At least 1k views
             likeCount > 10 && // At least 10 likes
             !video.title.toLowerCase().includes('shorts') && // Exclude YouTube shorts
             video.description.length > 50; // Has substantial description
    });

    return res.status(200).json({
      success: true,
      videos: qualityVideos.slice(0, 5), // Return top 5 quality videos
      totalResults: qualityVideos.length
    });

  } catch (error) {
    console.error('YouTube search error:', error);
    return res.status(500).json({
      error: 'Failed to search YouTube',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Alternative: App Router version (app/api/search-youtube/route.ts)
/*
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, maxResults = 10 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
    }

    // Same implementation as above...
    
  } catch (error) {
    console.error('YouTube search error:', error);
    return NextResponse.json({
      error: 'Failed to search YouTube',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
*/
