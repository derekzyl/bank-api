import { NextRequest, NextResponse } from 'next/server';
import { allBanks, getByCode, getBySlug, search } from '../../../../../index';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const slug = searchParams.get('slug');
    const searchVal = searchParams.get('search');

    if (code) {
      const bank = getByCode(code);
      if (!bank) {
        return NextResponse.json({ error: 'Bank not found with specified code' }, { status: 404 });
      }
      return NextResponse.json(bank);
    }

    if (slug) {
      const bank = getBySlug(slug);
      if (!bank) {
        return NextResponse.json({ error: 'Bank not found with specified slug' }, { status: 404 });
      }
      return NextResponse.json(bank);
    }

    if (searchVal) {
      const results = search(searchVal);
      return NextResponse.json(results);
    }

    const banks = allBanks();
    return NextResponse.json(banks);
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
