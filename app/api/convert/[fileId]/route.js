import { NextRequest, NextResponse } from 'next/server';
import { existsSync, createReadStream, createWriteStream, readFileSync } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

// Convert API Service using fetch with proper FormData handling
class ConvertApiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://v2.convertapi.com';
  }

  async convertPdfToDocx(inputFilePath, outputFilePath) {
    try {
      // Read the file as buffer for proper FormData handling
      const fileBuffer = readFileSync(inputFilePath);
      const fileName = path.basename(inputFilePath);
      
      // Use native FormData (not form-data package)
      const formData = new FormData();
      formData.append('File', new Blob([fileBuffer], { type: 'application/pdf' }), fileName);
      formData.append('StoreFile', 'true');

      console.log('Sending request to ConvertAPI...');
      const response = await fetch(
        `${this.baseUrl}/convert/pdf/to/docx?Secret=${this.apiKey}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('ConvertAPI response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('ConvertAPI error response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data && data.Files && data.Files.length > 0) {
        const fileUrl = data.Files[0].Url;
        
        // Download the converted file
        const fileResponse = await fetch(fileUrl);
        
        if (!fileResponse.ok) {
          throw new Error('Failed to download converted file');
        }

        // Save the file
        const arrayBuffer = await fileResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        return new Promise((resolve, reject) => {
          const writer = createWriteStream(outputFilePath);
          writer.write(buffer);
          writer.end();
          
          writer.on('finish', () => resolve({
            success: true,
            outputPath: outputFilePath,
            fileUrl: fileUrl
          }));
          writer.on('error', reject);
        });
      } else {
        throw new Error('No converted file received from API');
      }
    } catch (error) {
      console.error('Convert API Error:', error.message);
      throw new Error(`Conversion failed: ${error.message}`);
    }
  }
}

export async function POST(request, { params }) {
  try {
    const { fileId } = await params;
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const downloadsDir = path.join(process.cwd(), 'downloads');
    
    const inputPath = path.join(uploadsDir, `${fileId}.pdf`);
    
    // Check if input file exists
    if (!existsSync(inputPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Create downloads directory if it doesn't exist
    if (!existsSync(downloadsDir)) {
      await mkdir(downloadsDir, { recursive: true });
    }

    const outputPath = path.join(downloadsDir, `${fileId}.docx`);
    
    // Initialize Convert API service
    const apiKey = process.env.CONVERT_API_PRODUCTION_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Convert API key not configured' }, { status: 500 });
    }

    const convertApi = new ConvertApiService(apiKey);
    
    // Convert using Convert API
    const result = await convertApi.convertPdfToDocx(inputPath, outputPath);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'File converted successfully',
        fileId: fileId,
        downloadUrl: `/api/download/${fileId}`
      });
    } else {
      return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json({ 
      error: error.message || 'Conversion failed' 
    }, { status: 500 });
  }
}
