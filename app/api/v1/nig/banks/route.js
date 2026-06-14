import { NextResponse } from 'next/server';
import nigeria from '../../../../../index';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const slug = searchParams.get('slug');
    const searchVal = searchParams.get('search');

    if (code) {
      const bank = nigeria.getByCode(code);
      if (!bank) {
        return NextResponse.json({ error: 'Bank not found with specified code' }, { status: 404 });
      }
      return NextResponse.json(bank);
    }

    if (slug) {
      const bank = nigeria.getBySlug(slug);
      if (!bank) {
        return NextResponse.json({ error: 'Bank not found with specified slug' }, { status: 404 });
      }
      return NextResponse.json(bank);
    }

    if (searchVal) {
      const results = nigeria.search(searchVal);
      return NextResponse.json(results);
    }

    const banks = nigeria.allBanks();
    return NextResponse.json(banks);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
