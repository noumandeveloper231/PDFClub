import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const method = formData.get('method');
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
      // Load the original PDF
      const originalPdf = await PDFDocument.load(uint8Array);
      const totalPages = originalPdf.getPageCount();
      
      let splitRanges = [];

      // Determine split ranges based on method
      switch (method) {
        case 'pages':
          splitRanges = parsePageRanges(options.pageRanges, totalPages);
          break;
        case 'range':
          splitRanges = createFixedRanges(totalPages, options.pagesPerFile);
          break;
        case 'size':
          // For size-based splitting, we'll approximate based on pages
          // This is a simplified approach - real implementation would need more sophisticated size calculation
          const avgPagesPerSizeMB = Math.max(1, Math.floor(totalPages * options.maxSizeMB / (file.size / (1024 * 1024))));
          splitRanges = createFixedRanges(totalPages, avgPagesPerSizeMB);
          break;
        default:
          throw new Error('Invalid split method');
      }

      if (splitRanges.length === 0) {
        return NextResponse.json(
          { error: 'No valid page ranges specified' },
          { status: 400 }
        );
      }

      // Create split PDFs
      const splitPdfs = [];
      
      for (let i = 0; i < splitRanges.length; i++) {
        const range = splitRanges[i];
        const newPdf = await PDFDocument.create();
        
        // Copy pages for this range
        const pageIndices = [];
        for (let pageNum = range.start; pageNum <= range.end; pageNum++) {
          if (pageNum >= 1 && pageNum <= totalPages) {
            pageIndices.push(pageNum - 1); // Convert to 0-based index
          }
        }
        
        if (pageIndices.length > 0) {
          const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
          copiedPages.forEach(page => newPdf.addPage(page));
          
          const pdfBytes = await newPdf.save();
          splitPdfs.push(pdfBytes);
        }
      }

      // Create temporary files and return URLs
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const fileUrls = [];
      const timestamp = Date.now();
      
      for (let i = 0; i < splitPdfs.length; i++) {
        const fileName = `split_${timestamp}_${i + 1}.pdf`;
        const filePath = path.join(tempDir, fileName);
        fs.writeFileSync(filePath, splitPdfs[i]);
        fileUrls.push(`/api/download-temp/${fileName}`);
      }

      return NextResponse.json({
        success: true,
        files: fileUrls,
        count: splitPdfs.length
      });

    } catch (error) {
      console.error('Error processing PDF:', error);
      return NextResponse.json(
        { error: `Failed to process PDF: ${error.message}` },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error splitting PDF:', error);
    return NextResponse.json(
      { error: 'Failed to split PDF. Please try again.' },
      { status: 500 }
    );
  }
}

function parsePageRanges(rangeString, totalPages) {
  if (!rangeString || !rangeString.trim()) {
    return [];
  }

  const ranges = [];
  const parts = rangeString.split(',').map(s => s.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      // Range like "1-5"
      const [start, end] = part.split('-').map(s => parseInt(s.trim()));
      if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= totalPages) {
        ranges.push({ start, end });
      }
    } else {
      // Single page like "3"
      const page = parseInt(part.trim());
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        ranges.push({ start: page, end: page });
      }
    }
  }

  return ranges;
}

function createFixedRanges(totalPages, pagesPerFile) {
  const ranges = [];
  let currentPage = 1;

  while (currentPage <= totalPages) {
    const endPage = Math.min(currentPage + pagesPerFile - 1, totalPages);
    ranges.push({ start: currentPage, end: endPage });
    currentPage = endPage + 1;
  }

  return ranges;
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to split PDFs.' },
    { status: 405 }
  );
}
