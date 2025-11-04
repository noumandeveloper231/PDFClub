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
      // Load and validate the PDF
      const pdfDoc = await PDFDocument.load(uint8Array);
      const pages = pdfDoc.getPages();
      
      // Initialize validation result
      const validationResult = {
        isValid: true,
        errors: [],
        warnings: [],
        info: {}
      };

      // Basic PDF information
      validationResult.info = {
        pageCount: pages.length,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        title: pdfDoc.getTitle() || 'Not specified',
        author: pdfDoc.getAuthor() || 'Not specified',
        subject: pdfDoc.getSubject() || 'Not specified',
        creator: pdfDoc.getCreator() || 'Not specified',
        producer: pdfDoc.getProducer() || 'Not specified',
        creationDate: pdfDoc.getCreationDate()?.toISOString().split('T')[0] || 'Not specified',
        modificationDate: pdfDoc.getModificationDate()?.toISOString().split('T')[0] || 'Not specified'
      };

      // Validation checks
      
      // Check if PDF has pages
      if (pages.length === 0) {
        validationResult.errors.push({
          type: 'error',
          message: 'PDF contains no pages',
          details: 'A valid PDF must contain at least one page'
        });
        validationResult.isValid = false;
      }

      // Check page dimensions
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        
        if (width <= 0 || height <= 0) {
          validationResult.errors.push({
            type: 'error',
            message: `Invalid page dimensions on page ${index + 1}`,
            details: `Width: ${width}, Height: ${height}. Dimensions must be positive.`
          });
          validationResult.isValid = false;
        }

        // Check for very small pages (might be an issue)
        if (width < 72 || height < 72) { // Less than 1 inch
          validationResult.warnings.push({
            type: 'warning',
            message: `Very small page dimensions on page ${index + 1}`,
            details: `Width: ${width.toFixed(2)}pt, Height: ${height.toFixed(2)}pt. This might cause display issues.`
          });
        }

        // Check for very large pages
        if (width > 14400 || height > 14400) { // Larger than 200 inches
          validationResult.warnings.push({
            type: 'warning',
            message: `Very large page dimensions on page ${index + 1}`,
            details: `Width: ${width.toFixed(2)}pt, Height: ${height.toFixed(2)}pt. This might cause performance issues.`
          });
        }
      });

      // Check file size warnings
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 50) {
        validationResult.warnings.push({
          type: 'warning',
          message: 'Large file size',
          details: `File size is ${fileSizeMB.toFixed(2)} MB. Large files may have performance issues.`
        });
      }

      // Check for encrypted PDFs (basic check)
      try {
        // Try to access form fields to check if PDF is encrypted
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        
        if (fields.length > 0) {
          validationResult.info.formFields = fields.length;
        }
      } catch (error) {
        if (error.message.includes('encrypted') || error.message.includes('password')) {
          validationResult.warnings.push({
            type: 'warning',
            message: 'PDF may be encrypted or password protected',
            details: 'Some features may not be accessible due to encryption.'
          });
        }
      }

      // Additional validation checks
      if (!validationResult.info.title || validationResult.info.title === 'Not specified') {
        validationResult.warnings.push({
          type: 'warning',
          message: 'Missing document title',
          details: 'PDF does not have a title set in its metadata.'
        });
      }

      // Success message if no issues
      if (validationResult.errors.length === 0 && validationResult.warnings.length === 0) {
        validationResult.info.status = 'All validation checks passed successfully';
      }

      return NextResponse.json(validationResult);

    } catch (error) {
      console.error('Error validating PDF:', error);
      
      // Return validation result with error
      return NextResponse.json({
        isValid: false,
        errors: [{
          type: 'error',
          message: 'Failed to parse PDF file',
          details: error.message
        }],
        warnings: [],
        info: {
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          status: 'Validation failed'
        }
      });
    }

  } catch (error) {
    console.error('Error in PDF validation:', error);
    return NextResponse.json(
      { error: 'Failed to validate PDF. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to validate PDFs.' },
    { status: 405 }
  );
}
