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

      // Parse numbering options
      const {
        position = 'bottom-center',
        format = 'number',
        startNumber = 1,
        fontSize = 12,
        margin = 20,
        includeFirstPage = true
      } = options;

      const totalPages = pages.length;

      // Helper function to convert number to roman numerals
      const toRoman = (num, uppercase = false) => {
        const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        const symbols = uppercase 
          ? ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
          : ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i'];
        
        let result = '';
        for (let i = 0; i < values.length; i++) {
          while (num >= values[i]) {
            result += symbols[i];
            num -= values[i];
          }
        }
        return result;
      };

      // Helper function to format page number
      const formatPageNumber = (pageNum, totalPages) => {
        switch (format) {
          case 'roman':
            return toRoman(pageNum, false);
          case 'roman-upper':
            return toRoman(pageNum, true);
          case 'page-of-total':
            return `Page ${pageNum} of ${totalPages}`;
          case 'number':
          default:
            return pageNum.toString();
        }
      };

      // Add page numbers to each page
      pages.forEach((page, index) => {
        const pageNumber = startNumber + index;
        
        // Skip first page if not included
        if (!includeFirstPage && index === 0) {
          return;
        }

        const { width, height } = page.getSize();
        const numberText = formatPageNumber(pageNumber, totalPages);
        
        // Calculate position
        let x, y;
        switch (position) {
          case 'top-left':
            x = margin;
            y = height - margin;
            break;
          case 'top-center':
            x = width / 2;
            y = height - margin;
            break;
          case 'top-right':
            x = width - margin;
            y = height - margin;
            break;
          case 'bottom-left':
            x = margin;
            y = margin;
            break;
          case 'bottom-center':
            x = width / 2;
            y = margin;
            break;
          case 'bottom-right':
            x = width - margin;
            y = margin;
            break;
          default:
            x = width / 2;
            y = margin;
            break;
        }

        // Draw the page number
        page.drawText(numberText, {
          x,
          y,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
      });

      // Generate the numbered PDF bytes
      const numberedPdfBytes = await pdfDoc.save();

      // Return the numbered PDF
      return new NextResponse(numberedPdfBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="numbered_${file.name}"`,
          'Content-Length': numberedPdfBytes.length.toString(),
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
    console.error('Error adding page numbers to PDF:', error);
    return NextResponse.json(
      { error: 'Failed to add page numbers to PDF. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to add page numbers to PDFs.' },
    { status: 405 }
  );
}
