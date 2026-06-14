import { NextResponse } from 'next/server';
import nigeria from '../../../../../../index';

export async function GET(request, { params }) {
  try {
    const slug = params.slug;
    const bank = nigeria.getBySlug(slug);

    if (!bank) {
      return NextResponse.json({ error: `Bank not found with slug: ${slug}` }, { status: 404 });
    }

    return NextResponse.json(bank);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
