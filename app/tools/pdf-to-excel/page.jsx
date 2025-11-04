'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, Upload, Download, FileText, Zap } from 'lucide-react';

export default function PDFToExcel() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setFile(pdfFile);
      setDownloadUrl(null);
      setConversionResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const convertPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/pdf-to-excel', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setDownloadUrl(result.downloadUrl);
        setConversionResult({
          originalSize: file.size,
          convertedSize: result.convertedSize,
          tablesExtracted: result.tablesExtracted
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Conversion failed');
      }
    } catch (error) {
      console.error('Error converting PDF:', error);
      alert('Error converting PDF: ' + error.message);
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

  const downloadFile = async () => {
    if (!downloadUrl) return;

    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace('.pdf', '')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <FileSpreadsheet size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF to Excel</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pull data straight from PDFs into Excel spreadsheets in a few short seconds. Extract tables and data with precision.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* File Upload Area */}
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a PDF file to convert it to Excel format
              </p>
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {/* File Info and Convert */}
          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-green-600" />
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
                    setConversionResult(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Change File
                </button>
              </div>

              {/* Convert Button */}
              <div className="text-center">
                <button
                  onClick={convertPDF}
                  disabled={isProcessing}
                  className="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Converting to Excel...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet size={20} className="mr-2" />
                      Convert to Excel
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Results and Download Section */}
          {conversionResult && downloadUrl && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  PDF Converted Successfully!
                </h3>
                <p className="text-green-700 mb-4">
                  Your PDF has been converted to Excel format and is ready for download.
                </p>
              </div>

              {/* Conversion Stats */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Conversion Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {formatFileSize(conversionResult.originalSize)}
                    </div>
                    <div className="text-sm text-gray-600">Original PDF Size</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatFileSize(conversionResult.convertedSize)}
                    </div>
                    <div className="text-sm text-gray-600">Excel File Size</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {conversionResult.tablesExtracted || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Tables Extracted</div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="text-center">
                <button
                  onClick={downloadFile}
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <Download size={20} className="mr-2" />
                  Download Excel File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
