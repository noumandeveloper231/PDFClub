import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const compressionLevel = formData.get('compressionLevel') || 'medium';

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
    const originalSize = file.size;
    
    try {
      // Load the PDF
      const pdf = await PDFDocument.load(uint8Array);
      
      // Apply compression based on level
      let compressionOptions = {};
      
      switch (compressionLevel) {
        case 'low':
          compressionOptions = {
            useObjectStreams: false,
            addDefaultPage: false,
            objectsPerTick: 50
          };
          break;
        case 'medium':
          compressionOptions = {
            useObjectStreams: true,
            addDefaultPage: false,
            objectsPerTick: 100
          };
          break;
        case 'high':
          compressionOptions = {
            useObjectStreams: true,
            addDefaultPage: false,
            objectsPerTick: 200,
            updateFieldAppearances: false
          };
          break;
      }

      // Save with compression options
      const compressedBytes = await pdf.save(compressionOptions);
      const compressedSize = compressedBytes.length;
      
      // Calculate compression ratio
      const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);

      // Create temporary file
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const timestamp = Date.now();
      const fileName = `compressed_${timestamp}.pdf`;
      const filePath = path.join(tempDir, fileName);
      
      fs.writeFileSync(filePath, compressedBytes);

      return NextResponse.json({
        success: true,
        downloadUrl: `/api/download-temp/${fileName}`,
        originalSize,
        compressedSize,
        compressionRatio: Math.max(0, compressionRatio) // Ensure non-negative
      });

    } catch (error) {
      console.error('Error processing PDF:', error);
      return NextResponse.json(
        { error: `Failed to process PDF: ${error.message}` },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error compressing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to compress PDF. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to compress PDFs.' },
    { status: 405 }
  );
}
