'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Hash, Upload, Download, FileText, AlignLeft, AlignCenter, AlignRight, Zap } from 'lucide-react';

export default function PageNumbers() {
  const [file, setFile] = useState(null);
  const [numberingOptions, setNumberingOptions] = useState({
    position: 'bottom-center',
    format: 'number',
    startNumber: 1,
    fontSize: 12,
    margin: 20,
    includeFirstPage: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setFile(pdfFile);
      setDownloadUrl(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const addPageNumbers = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(numberingOptions));

      const response = await fetch('/api/page-numbers', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Adding page numbers failed');
      }
    } catch (error) {
      console.error('Error adding page numbers:', error);
      alert('Error adding page numbers: ' + error.message);
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

  const getPreviewText = () => {
    switch (numberingOptions.format) {
      case 'number':
        return `${numberingOptions.startNumber}`;
      case 'roman':
        return 'i';
      case 'roman-upper':
        return 'I';
      case 'page-of-total':
        return `Page ${numberingOptions.startNumber} of 10`;
      default:
        return `${numberingOptions.startNumber}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-full mb-4">
            <Hash size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Add Page Numbers</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Add page numbers to your PDF documents. Choose position, format, and styling options.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a PDF file to add page numbers
              </p>
              <div className="inline-flex items-center bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-indigo-600" />
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
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Change File
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Number Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <select
                        value={numberingOptions.position}
                        onChange={(e) => setNumberingOptions({...numberingOptions, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="top-left">Top Left</option>
                        <option value="top-center">Top Center</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-center">Bottom Center</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number Format
                      </label>
                      <select
                        value={numberingOptions.format}
                        onChange={(e) => setNumberingOptions({...numberingOptions, format: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="number">Numbers (1, 2, 3...)</option>
                        <option value="roman">Roman lowercase (i, ii, iii...)</option>
                        <option value="roman-upper">Roman uppercase (I, II, III...)</option>
                        <option value="page-of-total">Page X of Y</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Number
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={numberingOptions.startNumber}
                        onChange={(e) => setNumberingOptions({...numberingOptions, startNumber: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size
                      </label>
                      <input
                        type="number"
                        min="8"
                        max="24"
                        value={numberingOptions.fontSize}
                        onChange={(e) => setNumberingOptions({...numberingOptions, fontSize: parseInt(e.target.value) || 12})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Margin (px)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="50"
                        value={numberingOptions.margin}
                        onChange={(e) => setNumberingOptions({...numberingOptions, margin: parseInt(e.target.value) || 20})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={numberingOptions.includeFirstPage}
                          onChange={(e) => setNumberingOptions({...numberingOptions, includeFirstPage: e.target.checked})}
                          className="mr-2"
                        />
                        Include first page
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-indigo-900 mb-2">Preview</h4>
                  <div className="bg-white border border-indigo-300 rounded-lg p-8 relative min-h-32">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
                      PDF Page Content
                    </div>
                    <div 
                      className={`absolute text-indigo-800 font-medium ${
                        numberingOptions.position.includes('top') ? 'top-0' : 'bottom-0'
                      } ${
                        numberingOptions.position.includes('left') ? 'left-0' : 
                        numberingOptions.position.includes('right') ? 'right-0' : 
                        'left-1/2 transform -translate-x-1/2'
                      }`}
                      style={{ 
                        fontSize: `${numberingOptions.fontSize}px`,
                        margin: `${numberingOptions.margin}px`
                      }}
                    >
                      {getPreviewText()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={addPageNumbers}
                  disabled={isProcessing}
                  className="inline-flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding Page Numbers...
                    </>
                  ) : (
                    <>
                      <Hash size={20} className="mr-2" />
                      Add Page Numbers
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {downloadUrl && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">
                Page Numbers Added Successfully!
              </h3>
              <p className="text-indigo-700 mb-4">
                Page numbers have been added to your PDF document.
              </p>
              <a
                href={downloadUrl}
                download={`numbered_${file.name}`}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Numbered PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
