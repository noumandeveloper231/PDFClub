import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');
    
    if (!filename) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
    }

    const thumbnailPath = path.join(process.cwd(), 'temp', 'thumbnails', filename);
    
    if (!fs.existsSync(thumbnailPath)) {
      return NextResponse.json({ error: 'Thumbnail not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(thumbnailPath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error serving thumbnail:', error);
    return NextResponse.json(
      { error: 'Failed to serve thumbnail' },
      { status: 500 }
    );
  }
}
