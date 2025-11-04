'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileImage, Upload, Download, FileText, Zap, Image } from 'lucide-react';

export default function PDFToJPG() {
  const [file, setFile] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({
    quality: 'high',
    dpi: 150,
    extractAll: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [conversionResult, setConversionResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setFile(pdfFile);
      setDownloadUrls([]);
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
      formData.append('options', JSON.stringify(conversionOptions));

      const response = await fetch('/api/pdf-to-jpg', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setDownloadUrls(result.images);
        setConversionResult({
          originalSize: file.size,
          imagesCreated: result.images.length,
          totalSize: result.totalSize
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

  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const downloadAll = async () => {
    for (let i = 0; i < downloadUrls.length; i++) {
      const url = downloadUrls[i];
      const filename = `page_${i + 1}.jpg`;
      await downloadImage(url, filename);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
            <FileImage size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF to JPG</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert each PDF page into a JPG or extract all images contained in a PDF. High-quality image conversion with customizable settings.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* File Upload Area */}
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a PDF file to convert pages to JPG images
              </p>
              <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {/* File Info and Options */}
          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-purple-600" />
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
                    setDownloadUrls([]);
                    setConversionResult(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Change File
                </button>
              </div>

              {/* Conversion Options */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Quality Setting */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Quality
                    </label>
                    <select
                      value={conversionOptions.quality}
                      onChange={(e) => setConversionOptions({...conversionOptions, quality: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="low">Low (Smaller files)</option>
                      <option value="medium">Medium (Balanced)</option>
                      <option value="high">High (Best quality)</option>
                    </select>
                  </div>

                  {/* DPI Setting */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resolution (DPI)
                    </label>
                    <select
                      value={conversionOptions.dpi}
                      onChange={(e) => setConversionOptions({...conversionOptions, dpi: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value={72}>72 DPI (Web)</option>
                      <option value={150}>150 DPI (Standard)</option>
                      <option value={300}>300 DPI (Print)</option>
                      <option value={600}>600 DPI (High)</option>
                    </select>
                  </div>

                  {/* Extract Option */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extraction Mode
                    </label>
                    <select
                      value={conversionOptions.extractAll ? 'all' : 'pages'}
                      onChange={(e) => setConversionOptions({...conversionOptions, extractAll: e.target.value === 'all'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="pages">Convert pages to images</option>
                      <option value="all">Extract embedded images</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Convert Button */}
              <div className="text-center">
                <button
                  onClick={convertPDF}
                  disabled={isProcessing}
                  className="inline-flex items-center px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Converting to JPG...
                    </>
                  ) : (
                    <>
                      <FileImage size={20} className="mr-2" />
                      Convert to JPG
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Results and Download Section */}
          {conversionResult && downloadUrls.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  PDF Converted Successfully!
                </h3>
                <p className="text-purple-700 mb-4">
                  Your PDF has been converted to {conversionResult.imagesCreated} JPG images.
                </p>
                <button
                  onClick={downloadAll}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors mb-6"
                >
                  <Download size={20} className="mr-2" />
                  Download All Images
                </button>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {downloadUrls.map((url, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Image size={20} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">page_{index + 1}.jpg</div>
                        <div className="text-sm text-gray-500">Page {index + 1}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadImage(url, `page_${index + 1}.jpg`)}
                      className="w-full px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium rounded-lg transition-colors"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
