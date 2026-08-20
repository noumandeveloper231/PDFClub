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
      // Load PDF to get basic info
      const pdfDoc = await PDFDocument.load(uint8Array);
      const pageCount = pdfDoc.getPageCount();

      // Return PDF data as base64 for client-side rendering
      const base64Data = Buffer.from(arrayBuffer).toString('base64');

      return NextResponse.json({
        success: true,
        pageCount,
        pdfData: `data:application/pdf;base64,${base64Data}`
      });

    } catch (error) {
      console.error('Error processing PDF:', error);
      return NextResponse.json(
        { error: `Failed to process PDF: ${error.message}` },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error processing PDF preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF preview. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate PDF previews.' },
    { status: 405 }
  );
}
