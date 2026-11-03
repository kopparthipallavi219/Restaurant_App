import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderCode = `MEHFIL-ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    return NextResponse.json({
      success: true,
      data: {
        orderCode,
        status: 'received',
        createdAt: new Date().toISOString(),
        orderSummary: body,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid order request' },
      { status: 400 }
    );
  }
}

