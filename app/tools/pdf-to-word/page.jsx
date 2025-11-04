'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Download, Zap } from 'lucide-react';

export default function PDFToWord() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [conversionStats, setConversionStats] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setFile(pdfFile);
      setDownloadUrl(null);
      setConversionStats(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const convertToWord = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/pdf-to-word', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        
        // Set conversion stats
        setConversionStats({
          originalSize: file.size,
          convertedSize: blob.size,
          format: 'DOCX'
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Conversion failed');
      }
    } catch (error) {
      console.error('Error converting PDF to Word:', error);
      alert('Error converting PDF to Word: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF to Word</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert PDF files to editable Word documents. Maintain formatting and extract text content.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a PDF file to convert it to Word format
              </p>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    Size: {formatFileSize(file.size)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setDownloadUrl(null);
                    setConversionStats(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Change File
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={convertToWord}
                  disabled={isProcessing}
                  className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Converting to Word...
                    </>
                  ) : (
                    <>
                      <FileText size={20} className="mr-2" />
                      Convert to Word
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {downloadUrl && conversionStats && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                Conversion Successful!
              </h3>
              <p className="text-blue-700 mb-4">
                Your PDF has been converted to text format for easy editing.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4 inline-block">
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Original: {formatFileSize(conversionStats.originalSize)}</div>
                  <div>Converted: {formatFileSize(conversionStats.convertedSize)}</div>
                </div>
              </div>
              <br />
              <a
                href={downloadUrl}
                download={`${file.name.replace('.pdf', '')}.txt`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Text Document
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
