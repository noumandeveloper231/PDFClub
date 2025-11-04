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
      const originalPages = pdfDoc.getPages();

      if (originalPages.length === 0) {
        return NextResponse.json(
          { error: 'PDF has no pages' },
          { status: 400 }
        );
      }

      const { pages = [] } = options;

      if (pages.length === 0) {
        return NextResponse.json(
          { error: 'No pages specified for organization' },
          { status: 400 }
        );
      }

      // Create a new PDF document
      const newPdfDoc = await PDFDocument.create();

      // Process each page according to the organization options
      for (const pageOption of pages) {
        const { originalIndex, rotation = 0 } = pageOption;
        
        // Convert to 0-based index
        const pageIndex = originalIndex - 1;
        
        if (pageIndex >= 0 && pageIndex < originalPages.length) {
          // Copy the page from original document
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex]);
          
          // Apply rotation if specified
          if (rotation !== 0) {
            copiedPage.setRotation(degrees(rotation));
          }
          
          // Add the page to the new document
          newPdfDoc.addPage(copiedPage);
        }
      }

      // Generate the organized PDF bytes
      const organizedPdfBytes = await newPdfDoc.save();

      // Return the organized PDF
      return new NextResponse(organizedPdfBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="organized_${file.name}"`,
          'Content-Length': organizedPdfBytes.length.toString(),
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
    console.error('Error organizing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to organize PDF. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to organize PDFs.' },
    { status: 405 }
  );
}
