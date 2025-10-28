import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { fileId } = await params;
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const downloadsDir = path.join(process.cwd(), 'downloads');
    
    const inputPath = path.join(uploadsDir, `${fileId}.pdf`);
    const outputPath = path.join(downloadsDir, `${fileId}.docx`);
    
    const inputExists = existsSync(inputPath);
    const outputExists = existsSync(outputPath);
    
    let status = 'not_found';
    if (inputExists && outputExists) {
      status = 'completed';
    } else if (inputExists) {
      status = 'uploaded';
    }
    
    return NextResponse.json({
      fileId: fileId,
      status: status,
      inputExists: inputExists,
      outputExists: outputExists
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}
