import fs from 'fs';
import { NextResponse } from 'next/server';
import nigeria from '../../../../../../../index';

export async function GET(request, { params }) {
  try {
    const slug = params.slug;
    const logoPath = nigeria.getLogoPath(slug);

    if (!logoPath || !fs.existsSync(logoPath)) {
      return NextResponse.json({ error: 'Logo not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(logoPath);
    const contentType = logoPath.endsWith('.svg') ? 'image/svg+xml' : 'image/png';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
