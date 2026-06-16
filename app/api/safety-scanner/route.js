import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    const caption = formData.get('caption');
    const metadataStr = formData.get('metadata');

    // Build user content array for the LLM
    const userContent = [];

    if (image && image instanceof File) {
      const arrayBuffer = await image.arrayBuffer();
      const base64string = Buffer.from(arrayBuffer).toString('base64');
      const mediaType = image.type;
      userContent.push({
        type: "image_url",
        image_url: {
          url: `data:${mediaType};base64,${base64string}`
        }
      });
    }

    if (caption) {
      userContent.push({
        type: "text",
        text: `Caption or post text: ${caption}`
      });
    }

    if (metadataStr) {
      userContent.push({
        type: "text",
        text: `Image metadata extracted before stripping: ${metadataStr}`
      });
    }

    userContent.push({
      type: "text",
      text: "Analyze all provided content for privacy risks and respond in the required JSON format."
    });

    const systemPrompt = `You are a privacy and content safety expert. Analyze the provided content (image and/or caption text and/or metadata) for privacy risks that could expose the creator's identity, location, daily routine, home address, workplace, or other sensitive personal information. 

Respond ONLY in this exact JSON format with no extra text or markdown:
{
  "riskLevel": "Low" or "Medium" or "High",
  "risksFound": ["risk 1", "risk 2", ...],
  "recommendations": ["fix 1", "fix 2", ...]
}

If no risks are found, return riskLevel as Low and empty arrays.`;

    // Verify token exists
    if (!process.env.GITHUB_TOKEN) {
      console.error("Missing GITHUB_TOKEN in environment variables.");
      return NextResponse.json({ error: 'GitHub Token is not configured.' }, { status: 500 });
    }

    // Call GitHub Models API
    const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub Models API returned an error:", response.status, errorText);
      return NextResponse.json({ error: 'Scan failed. Please try again.' }, { status: 500 });
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    
    // Clean and parse JSON response
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return NextResponse.json({ ...result, metadataStripped: true });
  } catch (error) {
    console.error("Error in safety-scanner API route:", error);
    return NextResponse.json({ error: 'Scan failed. Please try again.' }, { status: 500 });
  }
}
