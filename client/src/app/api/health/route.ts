import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    brand: 'Mehfil Restaurant - Hyderabadi Culinary Institution',
    timestamp: new Date().toISOString(),
    platform: 'Vercel Serverless',
  });
}
