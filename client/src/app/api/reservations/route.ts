import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reservationCode = `MEHFIL-RES-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      message: 'Table reserved successfully at Mehfil Restaurant.',
      data: {
        reservationCode,
        status: 'Confirmed',
        ...body,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid reservation request' },
      { status: 400 }
    );
  }
}
