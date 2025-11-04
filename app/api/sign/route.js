import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';

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
      const pages = pdfDoc.getPages();

      if (pages.length === 0) {
        return NextResponse.json(
          { error: 'PDF has no pages' },
          { status: 400 }
        );
      }

      // Parse signature options
      const {
        type = 'text',
        text = 'Signature',
        fontSize = 24,
        position = 'bottom-right',
        page = 1,
        x = 400,
        y = 50
      } = options;

      // Get the target page (convert to 0-based index)
      const pageIndex = Math.max(0, Math.min(page - 1, pages.length - 1));
      const targetPage = pages[pageIndex];
      const { width, height } = targetPage.getSize();
      
      // Calculate position based on preset
      let signX, signY;
      switch (position) {
        case 'top-left':
          signX = 50;
          signY = height - 50;
          break;
        case 'top-right':
          signX = width - 200;
          signY = height - 50;
          break;
        case 'bottom-left':
          signX = 50;
          signY = 50;
          break;
        case 'bottom-right':
          signX = width - 200;
          signY = 50;
          break;
        case 'center':
          signX = width / 2;
          signY = height / 2;
          break;
        default:
          signX = x || width - 200;
          signY = y || 50;
          break;
      }

      if (type === 'text' && text.trim()) {
        // Add text signature
        targetPage.drawText(text, {
          x: signX,
          y: signY,
          size: fontSize,
          color: rgb(0, 0, 0), // Black signature
        });
      }

      // Generate the signed PDF bytes
      const signedPdfBytes = await pdfDoc.save();

      // Return the signed PDF
      return new NextResponse(signedPdfBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="signed_${file.name}"`,
          'Content-Length': signedPdfBytes.length.toString(),
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
    console.error('Error signing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to sign PDF. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to sign PDFs.' },
    { status: 405 }
  );
}
