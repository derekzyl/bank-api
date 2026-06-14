import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { getLogoPath } from '../../../../../../../index';

interface RouteContext {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const slug = params.slug;
    const logoPath = getLogoPath(slug);

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
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
