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
      const pages = pdfDoc.getPages();

      if (pages.length === 0) {
        return NextResponse.json(
          { error: 'PDF has no pages' },
          { status: 400 }
        );
      }

      // Parse crop options
      const {
        top = 0,
        bottom = 0,
        left = 0,
        right = 0,
        unit = 'points'
      } = options;

      // Convert units to points (PDF uses points as base unit)
      const convertToPoints = (value, unit) => {
        switch (unit) {
          case 'inches':
            return value * 72; // 72 points per inch
          case 'mm':
            return value * 2.834645669; // ~2.83 points per mm
          case 'points':
          default:
            return value;
        }
      };

      const topPoints = convertToPoints(top, unit);
      const bottomPoints = convertToPoints(bottom, unit);
      const leftPoints = convertToPoints(left, unit);
      const rightPoints = convertToPoints(right, unit);

      // Apply cropping to all pages
      pages.forEach(page => {
        const { width, height } = page.getSize();
        
        // Calculate new dimensions
        const newWidth = width - leftPoints - rightPoints;
        const newHeight = height - topPoints - bottomPoints;
        
        // Ensure dimensions are positive
        if (newWidth > 0 && newHeight > 0) {
          // Set the crop box (media box defines the visible area)
          page.setMediaBox(leftPoints, bottomPoints, newWidth, newHeight);
          
          // Also set crop box for better compatibility
          page.setCropBox(leftPoints, bottomPoints, newWidth, newHeight);
        }
      });

      // Generate the cropped PDF bytes
      const croppedPdfBytes = await pdfDoc.save();

      // Return the cropped PDF
      return new NextResponse(croppedPdfBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="cropped_${file.name}"`,
          'Content-Length': croppedPdfBytes.length.toString(),
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
    console.error('Error cropping PDF:', error);
    return NextResponse.json(
      { error: 'Failed to crop PDF. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to crop PDFs.' },
    { status: 405 }
  );
}
