import { NextResponse } from 'next/server';
import nigeria from '../../../../index';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination params
    const pageVal = searchParams.get('page');
    const limitVal = searchParams.get('limit');
    let page = parseInt(pageVal, 10);
    let limit = parseInt(limitVal, 10);
    
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 50;
    if (limit > 100) limit = 100; // Cap limit at 100

    // Filter params
    const country = searchParams.get('country');
    const searchVal = searchParams.get('search');
    const code = searchParams.get('code');
    const slug = searchParams.get('slug');

    // Get all banks from library
    let filteredBanks = nigeria.allBanks();

    // 1. Country Filter
    if (country) {
      const countryParam = country.toLowerCase();
      filteredBanks = filteredBanks.filter(bank => {
        const bankCountry = (bank.country || '').toLowerCase();
        // Match ng, nig, or nigeria to Nigeria
        if (countryParam === 'ng' || countryParam === 'nig' || countryParam === 'nigeria') {
          return bankCountry === 'nigeria';
        }
        return bankCountry.includes(countryParam);
      });
    }

    // 2. Exact Code Filter
    if (code) {
      filteredBanks = filteredBanks.filter(bank => bank.code === code);
    }

    // 3. Exact Slug Filter
    if (slug) {
      filteredBanks = filteredBanks.filter(bank => bank.slug === slug);
    }

    // 4. Substring Search Filter
    if (searchVal) {
      const searchParam = searchVal.toLowerCase();
      filteredBanks = filteredBanks.filter(bank => {
        return (
          (bank.name && bank.name.toLowerCase().includes(searchParam)) ||
          (bank.code && bank.code.toLowerCase().includes(searchParam)) ||
          (bank.slug && bank.slug.toLowerCase().includes(searchParam)) ||
          (bank.ussd && bank.ussd.toLowerCase().includes(searchParam))
        );
      });
    }

    // Pagination slice
    const total = filteredBanks.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredBanks.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      total,
      page,
      limit,
      pages: totalPages,
      data: paginatedData
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
