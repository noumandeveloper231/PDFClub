import { NextRequest, NextResponse } from 'next/server';
import { existsSync, createWriteStream, readFileSync } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

// FreeConvert API Service
class FreeConvertService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.freeconvert.com/v1';
  }

  async convertPdfToDocx(inputFilePath, outputFilePath) {
    const startTime = Date.now();
    
    try {
      // Read file as buffer
      const fileBuffer = readFileSync(inputFilePath);
      const fileName = path.basename(inputFilePath);
      
      console.log('Starting FreeConvert upload...');
      
      // Step 1: Create upload task
      const uploadResponse = await fetch(`${this.baseUrl}/process/import/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('FreeConvert upload task creation error:', errorText);
        throw new Error(`Upload task creation failed: ${uploadResponse.status} - ${errorText}`);
      }

      const uploadData = await uploadResponse.json();
      console.log('Upload response:', JSON.stringify(uploadData, null, 2));
      
      // FreeConvert returns task object directly (no data wrapper)
      const uploadTaskId = uploadData.id;
      const uploadFormData = uploadData.result?.form;
      
      if (!uploadTaskId || !uploadFormData) {
        throw new Error('Invalid upload response structure');
      }
      
      const uploadUrl = uploadFormData.url;
      const uploadParams = uploadFormData.parameters;
      
      console.log('Upload task created:', uploadTaskId);

      // Step 2: Upload the file using multipart form data
      const multipartForm = new FormData();
      
      // Add all the required parameters from FreeConvert
      Object.keys(uploadParams).forEach(key => {
        multipartForm.append(key, uploadParams[key]);
      });
      
      // Add the file
      const blob = new Blob([fileBuffer], { type: 'application/pdf' });
      multipartForm.append('file', blob, fileName);

      const fileUploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: multipartForm
      });

      if (!fileUploadResponse.ok) {
        const errorText = await fileUploadResponse.text();
        console.error('FreeConvert file upload error:', errorText);
        throw new Error(`File upload failed: ${fileUploadResponse.status} - ${errorText}`);
      }

      console.log('File uploaded, creating conversion task...');

      // Step 3: Create conversion task
      const convertPayload = {
        input: uploadTaskId,
        input_format: 'pdf',
        output_format: 'docx'
      };

      const convertResponse = await fetch(`${this.baseUrl}/process/convert`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(convertPayload)
      });

      if (!convertResponse.ok) {
        const errorText = await convertResponse.text();
        console.error('FreeConvert conversion error:', errorText);
        throw new Error(`Conversion failed: ${convertResponse.status} - ${errorText}`);
      }

      const convertData = await convertResponse.json();
      console.log('Convert response:', JSON.stringify(convertData, null, 2));
      const convertTaskId = convertData.id;
      
      console.log('Conversion task created:', convertTaskId);

      // Step 4: Create export task
      const exportPayload = {
        input: convertTaskId
      };

      const exportResponse = await fetch(`${this.baseUrl}/process/export/url`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(exportPayload)
      });

      if (!exportResponse.ok) {
        const errorText = await exportResponse.text();
        console.error('FreeConvert export error:', errorText);
        throw new Error(`Export failed: ${exportResponse.status} - ${errorText}`);
      }

      const exportData = await exportResponse.json();
      console.log('Export response:', JSON.stringify(exportData, null, 2));
      const exportTaskId = exportData.id;
      
      console.log('Export task created:', exportTaskId);

      // Step 5: Wait for export task completion and get download URL
      let attempts = 0;
      const maxAttempts = 30; // 30 attempts with 2 second intervals = 1 minute max wait
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        const statusResponse = await fetch(`${this.baseUrl}/process/tasks/${exportTaskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json'
          }
        });

        if (!statusResponse.ok) {
          throw new Error(`Status check failed: ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        console.log('Status response:', JSON.stringify(statusData, null, 2));
        
        if (statusData.status === 'completed') {
          console.log('Export task completed, downloading file...');
          
          const downloadUrl = statusData.result.url;
          
          // Step 6: Download the converted file
          const fileResponse = await fetch(downloadUrl);
          
          if (!fileResponse.ok) {
            throw new Error('Failed to download converted file');
          }

          // Save file
          const arrayBuffer = await fileResponse.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          return new Promise((resolve, reject) => {
            const writer = createWriteStream(outputFilePath);
            writer.write(buffer);
            writer.end();
            
            writer.on('finish', () => {
              const totalTime = Date.now() - startTime;
              console.log(`FreeConvert conversion completed in ${totalTime}ms`);
              resolve({
                success: true,
                outputPath: outputFilePath,
                processingTime: totalTime
              });
            });
            writer.on('error', reject);
          });
        } else if (statusData.status === 'failed') {
          throw new Error(`Conversion failed: ${statusData.message || 'Unknown error'}`);
        }
        
        attempts++;
        console.log(`Waiting for conversion... (${attempts}/${maxAttempts})`);
      }
      
      throw new Error('Conversion timeout - task did not complete within expected time');

    } catch (error) {
      console.error('FreeConvert Error:', error.message);
      throw new Error(`Conversion failed: ${error.message}`);
    }
  }
}

export async function POST(request, { params }) {
  const startTime = Date.now();
  
  try {
    const { fileId } = await params;
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const downloadsDir = path.join(process.cwd(), 'downloads');
    
    const inputPath = path.join(uploadsDir, `${fileId}.pdf`);
    const outputPath = path.join(downloadsDir, `${fileId}.docx`);
    
    // Check if input file exists
    if (!existsSync(inputPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Create downloads directory if it doesn't exist
    if (!existsSync(downloadsDir)) {
      await mkdir(downloadsDir, { recursive: true });
    }

    // Check if converted file already exists (caching)
    if (existsSync(outputPath)) {
      const cacheTime = Date.now() - startTime;
      console.log(`File already converted, served from cache in ${cacheTime}ms`);
      return NextResponse.json({
        success: true,
        message: 'File converted successfully',
        fileId: fileId,
        downloadUrl: `/api/download/${fileId}`,
        cached: true,
        processingTime: cacheTime
      });
    }
    
    // Initialize FreeConvert service
    const apiKey = process.env.FREECONVERT_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FreeConvert API key not configured' }, { status: 500 });
    }

    const freeConvert = new FreeConvertService(apiKey);
    
    // Convert using FreeConvert
    const result = await freeConvert.convertPdfToDocx(inputPath, outputPath);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'File converted successfully',
        fileId: fileId,
        downloadUrl: `/api/download/${fileId}`,
        cached: false,
        processingTime: result.processingTime
      });
    } else {
      return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`Conversion error after ${errorTime}ms:`, error);
    return NextResponse.json({ 
      error: error.message || 'Conversion failed',
      processingTime: errorTime
    }, { status: 500 });
  }
}
