import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    // For now, keep it as mock response until we get real API key
    return NextResponse.json({
      text: `🚀 AI PROPOSAL FOR: ${prompt}\n\n• Timeline: 6 months\n• Budget: Competitive pricing\n• Experience: 10+ years in construction\n• Team: Certified engineers & workers\n• Quality: ISO 9001 certified processes\n\nWe guarantee timely completion with highest quality standards!`
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}