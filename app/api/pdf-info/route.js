import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    try {
      // Load the PDF to get information
      const pdf = await PDFDocument.load(uint8Array);
      const pageCount = pdf.getPageCount();
      
      // Get file size
      const fileSize = file.size;
      
      // Calculate approximate size per page
      const avgPageSize = Math.round(fileSize / pageCount);

      return NextResponse.json({
        pageCount,
        fileSize,
        avgPageSize,
        fileName: file.name
      });

    } catch (error) {
      console.error('Error loading PDF:', error);
      return NextResponse.json(
        { error: 'Invalid PDF file or corrupted PDF' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error getting PDF info:', error);
    return NextResponse.json(
      { error: 'Failed to get PDF information' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to get PDF info.' },
    { status: 405 }
  );
}
