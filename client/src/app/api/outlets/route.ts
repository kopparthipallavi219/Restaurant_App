import { NextResponse } from 'next/server';
import { INITIAL_OUTLETS } from '@/lib/seedData';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: INITIAL_OUTLETS.length,
    data: INITIAL_OUTLETS,
  });
}
