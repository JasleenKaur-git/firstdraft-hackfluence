import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { topic, platform, angle } = await request.json();

    if (!topic || topic.trim().length < 3) {
      return NextResponse.json(
        { error: 'Please enter a valid topic with at least 3 characters.' },
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
        { error: 'Please describe your personal angle with at least 3 characters.' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert content strategist and YouTube/social media coach who has helped thousands of creators build audiences from zero. You understand what makes content actually work — not in theory, but in practice. You know the difference between a hook that stops the scroll and one that gets skipped. You write with specificity, not generality. You never use filler phrases like 'in today's video' or 'don't forget to like and subscribe' or 'welcome back'. You understand that the best content comes from a creator's real, specific experience — not a polished, textbook version of events.

Your job is to give a creator an exact, usable starting point for their content. Not inspiration. Not advice. Actual words they can use or adapt immediately.

Rules you always follow:
- Hooks must be specific to the topic and angle given, never generic
- The first line must feel human and real, not like a YouTube script template
- The outline must reflect the creator's personal angle, not a Wikipedia summary
- Titles must be platform-appropriate — punchy for Shorts/Reels, searchable for YouTube Long-form, professional for LinkedIn
- Never use the word 'journey' in hooks or titles
- Never start a hook with 'Have you ever...'
- Avoid em dashes in output

Respond ONLY in this exact JSON format with no extra text or markdown backticks:
{
  "hooks": [
    { "type": "Curiosity", "text": "..." },
    { "type": "Relatability", "text": "..." },
    { "type": "Controversy", "text": "..." }
  ],
  "firstLine": "...",
  "outline": [
    { "title": "Section Title", "description": "What to cover here" }
  ],
  "titles": ["Title 1", "Title 2", "Title 3"]
}`;

    const userPrompt = `Generate a starting point package for this creator:

Topic: ${topic}
Platform: ${platform}
Creator's personal angle: ${angle}

Make every output specific to THIS creator's angle and THIS topic. 
The hooks, first line, outline and titles must feel like they were written 
FOR this specific person, not copy-pasted from a generic template.
For the outline, structure it around the creator's personal experience and angle,
not just the topic in general.`;

    const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1000,
        temperature: 0.8,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub Models API error response:", errorText);
      throw new Error("Failed to fetch starting point from model API.");
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to generate starting point:', error);
    return NextResponse.json(
      { error: 'Failed to generate starting point. Please try again.' }, 
      { status: 500 }
    );
  }
}
