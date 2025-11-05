import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const pageCount = pdfDoc.getPageCount();
    
    // Create thumbnails directory if it doesn't exist
    const thumbnailsDir = path.join(process.cwd(), 'temp', 'thumbnails');
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
    }

    const thumbnails = [];
    const timestamp = Date.now();

    // Generate thumbnails for each page (limit to first 20 pages for performance)
    const maxPages = Math.min(pageCount, 20);
    
    for (let i = 0; i < maxPages; i++) {
      try {
        // Create a new PDF with just this page
        const singlePagePdf = await PDFDocument.create();
        const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [i]);
        singlePagePdf.addPage(copiedPage);
        
        const singlePageBytes = await singlePagePdf.save();
        
        // Convert PDF page to image using pdf2pic would be ideal, but we'll use a simpler approach
        // For now, we'll create a placeholder system that works with the existing infrastructure
        const thumbnailFilename = `thumbnail_${timestamp}_page_${i + 1}.pdf`;
        const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);
        
        // Save the single page PDF as thumbnail
        fs.writeFileSync(thumbnailPath, singlePageBytes);
        
        thumbnails.push({
          pageNumber: i + 1,
          thumbnailUrl: `/api/serve-thumbnail?file=${thumbnailFilename}`,
          width: copiedPage.getWidth(),
          height: copiedPage.getHeight()
        });
      } catch (pageError) {
        console.error(`Error processing page ${i + 1}:`, pageError);
        // Continue with other pages even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      pageCount,
      thumbnails,
      fileSize: bytes.byteLength
    });

  } catch (error) {
    console.error('Error generating thumbnails:', error);
    return NextResponse.json(
      { error: 'Failed to generate thumbnails' },
      { status: 500 }
    );
  }
}
