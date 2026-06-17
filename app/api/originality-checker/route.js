import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { topic, platform, angle } = await request.json();

    // Input Validation
    if (!topic || topic.trim().length < 3) {
      return NextResponse.json(
        { error: 'Please enter a valid content topic or idea with at least 3 characters.' },
        { status: 400 }
      );
    }
    if (!platform || platform.trim() === '') {
      return NextResponse.json(
        { error: 'Please choose a platform.' },
        { status: 400 }
      );
    }
    if (!angle || angle.trim().length < 3) {
      return NextResponse.json(
        { error: 'Please describe your unique angle with at least 3 characters.' },
        { status: 400 }
      );
    }

    // STEP 1 — Try YouTube API
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const searchQuery = encodeURIComponent(topic);
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=50&key=${YOUTUBE_API_KEY}`;

    let videoCount = null;
    let usedFallback = false;

    try {
      const youtubeRes = await fetch(youtubeUrl);
      const youtubeData = await youtubeRes.json();

      if (youtubeData.error || !youtubeData.items || youtubeData.items.length === 0) {
        videoCount = null;
        usedFallback = true;
      } else {
        videoCount = youtubeData.pageInfo?.totalResults ?? youtubeData.items.length;
        usedFallback = false;
      }
    } catch (err) {
      console.error("YouTube API failure, falling back silently:", err);
      videoCount = null;
      usedFallback = true;
    }

    // STEP 2 — Call GitHub Models gpt-4o
    const systemPrompt = `You are an expert content strategist and market analyst who specializes in helping creators find their unique space in crowded content markets. You have deep knowledge of YouTube, Instagram, LinkedIn and other platforms. You understand what makes content stand out — not through gimmicks, but through genuine differentiation, specific storytelling, and authentic positioning.

You never give generic advice like 'be authentic' or 'find your niche'. Every suggestion you make is specific, actionable, and tailored to the exact topic and angle provided. You understand that the best differentiator is almost always the creator's specific lived experience, not a content format trick.

Respond ONLY in this exact JSON format with no extra text or markdown backticks:
{
  "saturationScore": number between 0-100,
  "saturationLevel": "Low" or "Medium" or "High" or "Oversaturated",
  "angleScore": number between 0-100,
  "angleSummary": "one sentence explaining the angle score",
  "suggestions": [
    {
      "title": "specific suggestion title",
      "explanation": "2-3 sentences on exactly how to execute this",
      "whyItWorks": "one short phrase"
    },
    ... 3 suggestions total
  ],
  "verdict": "one punchy sentence summarizing everything"
}`;

    let userPrompt = '';
    if (!usedFallback) {
      userPrompt = `Analyze the originality of this content idea:

Topic: ${topic}
Platform: ${platform}
Creator's unique angle: ${angle}
YouTube search results: ${videoCount} videos found on this topic

Based on the YouTube data showing ${videoCount} videos, calculate an accurate saturation score. Then analyze the creator's specific angle and give 3 concrete, specific suggestions for how to stand out. The suggestions must directly reference the creator's angle — not generic tips.
Make the verdict punchy and honest.`;
    } else {
      userPrompt = `Analyze the originality of this content idea using your knowledge:

Topic: ${topic}
Platform: ${platform}  
Creator's unique angle: ${angle}

Based on your knowledge of content trends and platform saturation, estimate an accurate saturation score for this topic. Then analyze the creator's specific angle and give 3 concrete, specific suggestions for how to stand out.
The suggestions must directly reference the creator's angle — not generic tips.
Make the verdict punchy and honest.`;
    }

    const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub Models API error details:", errorText);
      throw new Error("Failed to call Azure GitHub Models API");
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return NextResponse.json({
      ...result,
      videoCount: videoCount,
      usedFallback: usedFallback
    });

  } catch (error) {
    console.error('Originality check error:', error);
    return NextResponse.json(
      { error: 'Originality check failed. Please try again.' },
      { status: 500 }
    );
  }
}
