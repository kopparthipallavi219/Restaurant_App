import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const enquiryCode = `MEHFIL-CAT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    return NextResponse.json({
      success: true,
      message: 'Catering enquiry submitted successfully. Our Nizami banquet team will contact you shortly.',
      data: {
        enquiryCode,
        status: 'Received',
        ...body,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid catering enquiry request' },
      { status: 400 }
    );
  }
}
