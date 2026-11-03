import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const feedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      rating: body.rating || 5,
      category: body.category || 'General',
      comment: body.comment || '',
      name: body.name || 'Valued Mehfil Guest',
      contact: body.contact || '',
      recommend: body.recommend,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Royal feedback received successfully. Shukriya!',
      data: feedback,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid feedback data' },
      { status: 400 }
    );
  }
}

