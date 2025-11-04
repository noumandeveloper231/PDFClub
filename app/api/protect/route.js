import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const options = JSON.parse(formData.get('options') || '{}');

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
      // Load the PDF
      const pdfDoc = await PDFDocument.load(uint8Array);

      const {
        userPassword = '',
        ownerPassword = '',
        permissions = {}
      } = options;

      if (!userPassword.trim()) {
        return NextResponse.json(
          { error: 'User password is required' },
          { status: 400 }
        );
      }

      // Set up encryption options
      const encryptionOptions = {
        userPassword: userPassword,
        ownerPassword: ownerPassword || userPassword,
        permissions: {
          printing: permissions.printing !== false,
          modifying: permissions.modifying === true,
          copying: permissions.copying === true,
          annotating: permissions.annotating !== false,
        }
      };

      // Generate the protected PDF bytes with encryption
      const protectedPdfBytes = await pdfDoc.save({
        ...encryptionOptions
      });

      // Return the protected PDF
      return new NextResponse(protectedPdfBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="protected_${file.name}"`,
          'Content-Length': protectedPdfBytes.length.toString(),
        },
      });

    } catch (error) {
      console.error('Error processing PDF:', error);
      return NextResponse.json(
        { error: `Failed to process PDF: ${error.message}` },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error protecting PDF:', error);
    return NextResponse.json(
      { error: 'Failed to protect PDF. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to protect PDFs.' },
    { status: 405 }
  );
}
