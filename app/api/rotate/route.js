import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, degrees } from 'pdf-lib';

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
      const totalPages = pages.length;

      if (totalPages === 0) {
        return NextResponse.json(
          { error: 'PDF has no pages' },
          { status: 400 }
        );
      }

      const rotationAngle = options.angle || 90;
      const pagesOption = options.pages || 'all';

      // Determine which pages to rotate
      let pagesToRotate = [];
      
      switch (pagesOption) {
        case 'all':
          pagesToRotate = Array.from({ length: totalPages }, (_, i) => i);
          break;
        case 'odd':
          pagesToRotate = Array.from({ length: totalPages }, (_, i) => i).filter(i => (i + 1) % 2 === 1);
          break;
        case 'even':
          pagesToRotate = Array.from({ length: totalPages }, (_, i) => i).filter(i => (i + 1) % 2 === 0);
          break;
        case 'first':
          pagesToRotate = [0];
          break;
        case 'last':
          pagesToRotate = [totalPages - 1];
          break;
        default:
          pagesToRotate = Array.from({ length: totalPages }, (_, i) => i);
      }

      // Rotate the specified pages
      pagesToRotate.forEach(pageIndex => {
        if (pageIndex >= 0 && pageIndex < totalPages) {
          const page = pages[pageIndex];
          page.setRotation(degrees(rotationAngle));
        }
      });

      // Generate the rotated PDF bytes
      const rotatedPdfBytes = await pdfDoc.save();

      // Return the rotated PDF
      return new NextResponse(rotatedPdfBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="rotated_${file.name}"`,
          'Content-Length': rotatedPdfBytes.length.toString(),
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
    console.error('Error rotating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to rotate PDF. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to rotate PDFs.' },
    { status: 405 }
  );
}
