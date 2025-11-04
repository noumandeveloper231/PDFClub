'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Archive, Upload, Download, FileText, Zap, Settings } from 'lucide-react';

export default function CompressPDF() {
  const [file, setFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [compressionResult, setCompressionResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setFile(pdfFile);
      setDownloadUrl(null);
      setCompressionResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const compressPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('compressionLevel', compressionLevel);

      const response = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setDownloadUrl(result.downloadUrl);
        setCompressionResult({
          originalSize: file.size,
          compressedSize: result.compressedSize,
          compressionRatio: result.compressionRatio
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Compression failed');
      }
    } catch (error) {
      console.error('Error compressing PDF:', error);
      alert('Error compressing PDF: ' + error.message);
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

  const getCompressionDescription = (level) => {
    switch (level) {
      case 'low':
        return 'Minimal compression, best quality retention';
      case 'medium':
        return 'Balanced compression and quality';
      case 'high':
        return 'Maximum compression, smaller file size';
      default:
        return '';
    }
  };

  const downloadFile = async () => {
    if (!downloadUrl) return;

    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${file.name}`;
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <Archive size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Compress PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Reduce file size while optimizing for maximal PDF quality. Choose your compression level to balance file size and quality.
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
                Upload a PDF file to compress and reduce its file size
              </p>
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {/* File Info and Compression Options */}
          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    Original size: {formatFileSize(file.size)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setDownloadUrl(null);
                    setCompressionResult(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Change File
                </button>
              </div>

              {/* Compression Level Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings size={20} />
                  Compression Level
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    compressionLevel === 'low' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="compressionLevel"
                      value="low"
                      checked={compressionLevel === 'low'}
                      onChange={(e) => setCompressionLevel(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="font-medium text-gray-900 mb-1">Low Compression</div>
                      <div className="text-sm text-gray-600 mb-2">Best Quality</div>
                      <div className="text-xs text-gray-500">10-30% size reduction</div>
                    </div>
                  </label>

                  <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    compressionLevel === 'medium' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="compressionLevel"
                      value="medium"
                      checked={compressionLevel === 'medium'}
                      onChange={(e) => setCompressionLevel(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="font-medium text-gray-900 mb-1">Medium Compression</div>
                      <div className="text-sm text-gray-600 mb-2">Balanced</div>
                      <div className="text-xs text-gray-500">30-50% size reduction</div>
                    </div>
                  </label>

                  <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    compressionLevel === 'high' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="compressionLevel"
                      value="high"
                      checked={compressionLevel === 'high'}
                      onChange={(e) => setCompressionLevel(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="font-medium text-gray-900 mb-1">High Compression</div>
                      <div className="text-sm text-gray-600 mb-2">Smallest Size</div>
                      <div className="text-xs text-gray-500">50-70% size reduction</div>
                    </div>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {getCompressionDescription(compressionLevel)}
                </p>
              </div>

              {/* Compress Button */}
              <div className="text-center">
                <button
                  onClick={compressPDF}
                  disabled={isProcessing}
                  className="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Compressing PDF...
                    </>
                  ) : (
                    <>
                      <Archive size={20} className="mr-2" />
                      Compress PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Results and Download Section */}
          {compressionResult && downloadUrl && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  PDF Compressed Successfully!
                </h3>
                <p className="text-green-700 mb-4">
                  Your PDF has been compressed and is ready for download.
                </p>
              </div>

              {/* Compression Stats */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Compression Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {formatFileSize(compressionResult.originalSize)}
                    </div>
                    <div className="text-sm text-gray-600">Original Size</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatFileSize(compressionResult.compressedSize)}
                    </div>
                    <div className="text-sm text-gray-600">Compressed Size</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {compressionResult.compressionRatio}%
                    </div>
                    <div className="text-sm text-gray-600">Size Reduction</div>
                  </div>
                </div>
                
                <div className="mt-4 bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${compressionResult.compressionRatio}%` }}
                  ></div>
                </div>
              </div>

              {/* Download Button */}
              <div className="text-center">
                <button
                  onClick={downloadFile}
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <Download size={20} className="mr-2" />
                  Download Compressed PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
