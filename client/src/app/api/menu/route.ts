import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_MENU_ITEMS } from '@/lib/seedData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const isVeg = searchParams.get('isVeg');
  const search = searchParams.get('search');

  let items = [...INITIAL_MENU_ITEMS];

  if (category && category !== 'all') {
    items = items.filter((item) => item.categorySlug === category);
  }

  if (isVeg !== null && isVeg !== undefined) {
    const vegBool = isVeg === 'true';
    items = items.filter((item) => item.isVeg === vegBool);
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    count: items.length,
    data: items,
  });
}
