import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const password = formData.get('password');

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

    if (!password || !password.trim()) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    try {
      // Try to load the PDF with the provided password
      const pdfDoc = await PDFDocument.load(uint8Array, { 
        password: password.trim(),
        ignoreEncryption: false 
      });

      // Generate the unlocked PDF bytes (without encryption)
      const unlockedPdfBytes = await pdfDoc.save();

      // Return the unlocked PDF
      return new NextResponse(unlockedPdfBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="unlocked_${file.name}"`,
          'Content-Length': unlockedPdfBytes.length.toString(),
        },
      });

    } catch (error) {
      console.error('Error processing PDF:', error);
      
      // Check if it's a password-related error
      if (error.message.includes('password') || error.message.includes('decrypt') || error.message.includes('encrypted')) {
        return NextResponse.json(
          { error: 'Incorrect password. Please check your password and try again.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to process PDF: ${error.message}` },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error unlocking PDF:', error);
    return NextResponse.json(
      { error: 'Failed to unlock PDF. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to unlock PDFs.' },
    { status: 405 }
  );
}
