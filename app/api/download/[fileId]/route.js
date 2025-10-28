import { NextRequest, NextResponse } from 'next/server';
import { existsSync, statSync, createReadStream } from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { fileId } = await params;
    const downloadsDir = path.join(process.cwd(), 'downloads');
    const filePath = path.join(downloadsDir, `${fileId}.docx`);
    
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Converted file not found' }, { status: 404 });
    }

    const stats = statSync(filePath);
    const fileStream = createReadStream(filePath);
    
    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of fileStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileId}.docx"`,
        'Content-Length': stats.size.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
