'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Scissors, Upload, Download, FileText, Eye } from 'lucide-react';

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [splitMethod, setSplitMethod] = useState('pages'); // 'pages', 'range', 'size'
  const [splitOptions, setSplitOptions] = useState({
    pagesPerFile: 1,
    pageRanges: '',
    maxSizeMB: 10
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [pdfInfo, setPdfInfo] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setFile(pdfFile);
      // Get PDF info (page count)
      await getPdfInfo(pdfFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const getPdfInfo = async (pdfFile) => {
    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      const response = await fetch('/api/pdf-info', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const info = await response.json();
        setPdfInfo(info);
      }
    } catch (error) {
      console.error('Error getting PDF info:', error);
    }
  };

  const splitPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('method', splitMethod);
      formData.append('options', JSON.stringify(splitOptions));

      const response = await fetch('/api/split', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setDownloadUrls(result.files);
      } else {
        throw new Error('Split failed');
      }
    } catch (error) {
      console.error('Error splitting PDF:', error);
      alert('Error splitting PDF. Please try again.');
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

  const downloadFile = async (url, filename) => {
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
      console.error('Error downloading file:', error);
    }
  };

  const downloadAll = async () => {
    for (let i = 0; i < downloadUrls.length; i++) {
      const url = downloadUrls[i];
      const filename = `split_${i + 1}.pdf`;
      await downloadFile(url, filename);
      // Add small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <Scissors size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Split PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Separate one page or a whole set for easy conversion into independent PDF files. Choose how you want to split your document.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* File Upload Area */}
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
                Upload a PDF file to split it into multiple documents
              </p>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {/* File Info and Split Options */}
          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                    {pdfInfo && ` • ${pdfInfo.pageCount} pages`}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPdfInfo(null);
                    setDownloadUrls([]);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Change File
                </button>
              </div>

              {/* Split Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Split Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    splitMethod === 'pages' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="splitMethod"
                      value="pages"
                      checked={splitMethod === 'pages'}
                      onChange={(e) => setSplitMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="font-medium text-gray-900 mb-1">Split by Pages</div>
                      <div className="text-sm text-gray-600">Extract specific pages or page ranges</div>
                    </div>
                  </label>

                  <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    splitMethod === 'range' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="splitMethod"
                      value="range"
                      checked={splitMethod === 'range'}
                      onChange={(e) => setSplitMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="font-medium text-gray-900 mb-1">Fixed Ranges</div>
                      <div className="text-sm text-gray-600">Split into files with set number of pages</div>
                    </div>
                  </label>

                  <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    splitMethod === 'size' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="splitMethod"
                      value="size"
                      checked={splitMethod === 'size'}
                      onChange={(e) => setSplitMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="font-medium text-gray-900 mb-1">By File Size</div>
                      <div className="text-sm text-gray-600">Split based on maximum file size</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Split Options */}
              <div className="mb-6">
                {splitMethod === 'pages' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Ranges (e.g., "1-3, 5, 7-10")
                    </label>
                    <input
                      type="text"
                      value={splitOptions.pageRanges}
                      onChange={(e) => setSplitOptions({...splitOptions, pageRanges: e.target.value})}
                      placeholder="1-3, 5, 7-10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Specify page ranges separated by commas. Use hyphens for ranges (e.g., 1-5).
                    </p>
                  </div>
                )}

                {splitMethod === 'range' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pages per file
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={pdfInfo?.pageCount || 100}
                      value={splitOptions.pagesPerFile}
                      onChange={(e) => setSplitOptions({...splitOptions, pagesPerFile: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {splitMethod === 'size' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum file size (MB)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={splitOptions.maxSizeMB}
                      onChange={(e) => setSplitOptions({...splitOptions, maxSizeMB: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Split Button */}
              <div className="text-center">
                <button
                  onClick={splitPDF}
                  disabled={isProcessing || (splitMethod === 'pages' && !splitOptions.pageRanges.trim())}
                  className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Splitting PDF...
                    </>
                  ) : (
                    <>
                      <Scissors size={20} className="mr-2" />
                      Split PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Download Section */}
          {downloadUrls.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  PDF Split Successfully!
                </h3>
                <p className="text-green-700 mb-4">
                  Your PDF has been split into {downloadUrls.length} files.
                </p>
                <button
                  onClick={downloadAll}
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors mb-4"
                >
                  <Download size={20} className="mr-2" />
                  Download All Files
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {downloadUrls.map((url, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">split_{index + 1}.pdf</div>
                        <div className="text-sm text-gray-500">Split file {index + 1}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadFile(url, `split_${index + 1}.pdf`)}
                      className="w-full px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 font-medium rounded-lg transition-colors"
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
