import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { idea } = await request.json()

    if (!idea || idea.trim().length < 10) {
      return NextResponse.json({ error: 'Please describe your idea in at least 10 characters' }, { status: 400 })
    }

    const prompt = `You are a content strategy expert. Analyze this raw content idea and return a structured brief.

Raw idea: "${idea}"

Return ONLY a valid JSON object with no markdown, no backticks, no explanation. Just the JSON:
{
  "title": "catchy content title",
  "hook": "one punchy opening line that grabs attention",
  "audience": "specific target audience description",
  "format": "one of: YouTube Long-form, YouTube Short, Instagram Reel, Instagram Carousel, Twitter Thread, LinkedIn Post, Podcast Episode, Blog Post",
  "tone": "one of: Educational, Entertaining, Inspiring, Conversational, Analytical, Storytelling",
  "effort": "one of: Low, Medium, High",
  "why": "one sentence on why this idea is worth making right now"
}`

    const response = await fetch(
      "https://models.inference.ai.azure.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 500
        })
      }
    );
    const data = await response.json();
    const text = data.choices[0].message.content;

    const clean = text.replace(/```json|```/g, '').trim()
    const brief = JSON.parse(clean)

    return NextResponse.json({ brief })
  } catch (error) {
    console.error('Brief generation error:', error)
    return NextResponse.json({ error: 'Failed to generate brief. Please try again.' }, { status: 500 })
  }
}