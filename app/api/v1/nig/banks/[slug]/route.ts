import { NextRequest, NextResponse } from 'next/server';
import { getBySlug } from '../../../../../../index';

interface RouteContext {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const slug = params.slug;
    const bank = getBySlug(slug);

    if (!bank) {
      return NextResponse.json({ error: `Bank not found with slug: ${slug}` }, { status: 404 });
    }

    return NextResponse.json(bank);
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
