'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import dynamic from 'next/dynamic';
import { Scissors, Upload, Download, FileText, Eye, Check, Plus, ZoomIn, ZoomOut, Archive } from 'lucide-react';

// Dynamically import PDF components to prevent SSR issues
const Document = dynamic(() => import('react-pdf').then(mod => ({ default: mod.Document })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 w-full h-full rounded"></div>
});

const Page = dynamic(() => import('react-pdf').then(mod => ({ default: mod.Page })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 w-full h-full rounded"></div>
});

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
  const [pdfData, setPdfData] = useState(null);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [splitMode, setSplitMode] = useState('range'); // 'range', 'pages', 'size'
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);
  const [extractMode, setExtractMode] = useState('select'); // 'all', 'select'
  const [isClient, setIsClient] = useState(false);
  const [thumbnailSize, setThumbnailSize] = useState(150); // Default thumbnail width
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Configure PDF.js worker on client side only
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      import('react-pdf').then((pdfjs) => {
        // Use the worker file from public directory
        pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      });
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setFile(pdfFile);
      // Get PDF info and preview data
      await getPdfInfo(pdfFile);
      // Create object URL for PDF rendering
      const url = URL.createObjectURL(pdfFile);
      setPdfData(url);
      // Reset selections
      setSelectedPages(new Set());
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

      const response = await fetch('/api/pdf-preview', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const info = await response.json();
        setPdfInfo({ pageCount: info.pageCount });
        setRangeEnd(info.pageCount);
      }
    } catch (error) {
      console.error('Error getting PDF info:', error);
    }
  };

  const togglePageSelection = (pageNum) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageNum)) {
      newSelected.delete(pageNum);
    } else {
      newSelected.add(pageNum);
    }
    setSelectedPages(newSelected);
  };

  const addRange = () => {
    const newSelected = new Set(selectedPages);
    for (let i = rangeStart; i <= rangeEnd; i++) {
      newSelected.add(i);
    }
    setSelectedPages(newSelected);
  };

  const selectAllPages = () => {
    if (pdfInfo) {
      const allPages = new Set();
      for (let i = 1; i <= pdfInfo.pageCount; i++) {
        allPages.add(i);
      }
      setSelectedPages(allPages);
    }
  };

  const clearSelection = () => {
    setSelectedPages(new Set());
  };

  const downloadAsZip = async () => {
    if (downloadUrls.length === 0) return;
    
    setIsDownloadingZip(true);
    try {
      // Import JSZip dynamically
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add all files to zip
      for (let i = 0; i < downloadUrls.length; i++) {
        const fileItem = downloadUrls[i];
        const filename = fileItem.name || `split_${i + 1}.pdf`;
        
        // Convert data URL to blob
        const response = await fetch(fileItem.url);
        const blob = await response.blob();
        zip.file(filename, blob);
      }

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Download zip file
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${file.name.replace('.pdf', '')}_split.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Error creating zip file. Please try again.');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleKeyDown = (event, pageNum) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      togglePageSelection(pageNum);
    }
  };

  const splitPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      let method = splitMode;
      let options = {};

      if (splitMode === 'range') {
        method = 'pages';
        options.pageRanges = `${rangeStart}-${rangeEnd}`;
      } else if (splitMode === 'pages') {
        method = 'pages';
        if (extractMode === 'select' && selectedPages.size > 0) {
          const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);
          options.pageRanges = sortedPages.join(',');
        } else {
          options.pageRanges = `1-${pdfInfo.pageCount}`;
        }
      } else if (splitMode === 'size') {
        method = 'size';
        options.maxSizeMB = splitOptions.maxSizeMB;
      }

      formData.append('method', method);
      formData.append('options', JSON.stringify(options));

      const response = await fetch('/api/split', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        // Convert file data objects to download URLs
        const urls = result.files.map(file => ({
          url: file.data,
          name: file.name,
          size: file.size
        }));
        setDownloadUrls(urls);
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

  const downloadFile = async (fileData, filename) => {
    try {
      // Handle both old URL format and new data URL format
      if (typeof fileData === 'string') {
        // New format: data URL
        const a = document.createElement('a');
        a.href = fileData;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Old format: fetch from URL
        const response = await fetch(fileData);
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const downloadAll = async () => {
    for (let i = 0; i < downloadUrls.length; i++) {
      const fileItem = downloadUrls[i];
      const filename = fileItem.name || `split_${i + 1}.pdf`;
      await downloadFile(fileItem.url, filename);
      // Add small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full px-4 py-8">
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

        <div className="w-full flex flex-col ">
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

          {/* PDF Preview and Split Interface */}
          {file && pdfData && (
            <div className="flex gap-6">
              {/* Left Panel - PDF Preview */}
              <div className="flex-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                        setPdfData(null);
                        setDownloadUrls([]);
                        setSelectedPages(new Set());
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Change File
                    </button>
                  </div>

                  {/* Page Previews Grid */}
                  {splitMode === 'pages' && isClient && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Page Previews</h3>
                        <div className="flex items-center gap-2">
                          {/* Zoom Controls */}
                          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => setThumbnailSize(Math.max(100, thumbnailSize - 25))}
                              className="p-1 hover:bg-white rounded transition-colors"
                              aria-label="Decrease thumbnail size"
                              title="Zoom out"
                            >
                              <ZoomOut size={16} />
                            </button>
                            <span className="text-xs text-gray-600 px-2">{Math.round((thumbnailSize / 150) * 100)}%</span>
                            <button
                              onClick={() => setThumbnailSize(Math.min(250, thumbnailSize + 25))}
                              className="p-1 hover:bg-white rounded transition-colors"
                              aria-label="Increase thumbnail size"
                              title="Zoom in"
                            >
                              <ZoomIn size={16} />
                            </button>
                          </div>
                          {/* Selection Controls */}
                          <button
                            onClick={selectAllPages}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                            aria-label="Select all pages"
                          >
                            Select All
                          </button>
                          <button
                            onClick={clearSelection}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                            aria-label="Clear page selection"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      
                      <div 
                        className="grid gap-4 max-h-96 overflow-y-auto"
                        style={{
                          gridTemplateColumns: `repeat(auto-fill, minmax(${thumbnailSize}px, 1fr))`
                        }}
                        role="grid"
                        aria-label="PDF page thumbnails"
                      >
                        {pdfInfo && Array.from({ length: pdfInfo.pageCount }, (_, i) => i + 1).map((pageNum) => (
                          <div
                            key={pageNum}
                            className={`relative border-2 rounded-lg cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              selectedPages.has(pageNum)
                                ? 'border-red-500 bg-red-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                            onClick={() => togglePageSelection(pageNum)}
                            onKeyDown={(e) => handleKeyDown(e, pageNum)}
                            tabIndex={0}
                            role="gridcell"
                            aria-label={`Page ${pageNum}${selectedPages.has(pageNum) ? ', selected' : ''}`}
                            aria-selected={selectedPages.has(pageNum)}
                          >
                            <div className="aspect-[3/4] p-2">
                              {pdfData && (
                                <Document file={pdfData} className="w-full h-full">
                                  <Page
                                    pageNumber={pageNum}
                                    width={thumbnailSize - 16}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    className="w-full h-full"
                                  />
                                </Document>
                              )}
                            </div>
                            <div className="absolute bottom-2 left-2 right-2 text-center">
                              <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700 shadow-sm">
                                {pageNum}
                              </span>
                            </div>
                            {selectedPages.has(pageNum) && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                                <Check size={14} className="text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {selectedPages.size > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>{selectedPages.size}</strong> page{selectedPages.size !== 1 ? 's' : ''} selected
                            {selectedPages.size > 1 && (
                              <span className="ml-2 text-xs">
                                (Pages: {Array.from(selectedPages).sort((a, b) => a - b).join(', ')})
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Range Preview */}
                  {splitMode === 'range' && pdfInfo && isClient && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Range Preview</h3>
                      <div className="flex gap-4 items-center mb-4">
                        <div className="aspect-[3/4] w-40 border-2 border-gray-200 rounded-lg p-2">
                          {pdfData && (
                            <Document file={pdfData} className="w-full h-full">
                              <Page
                                pageNumber={rangeStart}
                                width={140}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="w-full h-full"
                              />
                            </Document>
                          )}
                          <div className="text-center mt-1">
                            <span className="text-sm font-medium text-gray-700">Page {rangeStart}</span>
                          </div>
                        </div>
                        <div className="text-2xl text-gray-400 mx-4">...</div>
                        <div className="aspect-[3/4] w-40 border-2 border-gray-200 rounded-lg p-2">
                          {pdfData && (
                            <Document file={pdfData} className="w-full h-full">
                              <Page
                                pageNumber={rangeEnd}
                                width={140}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="w-full h-full"
                              />
                            </Document>
                          )}
                          <div className="text-center mt-1">
                            <span className="text-sm font-medium text-gray-700">Page {rangeEnd}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Split Controls */}
              <div className="w-100">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Split</h2>

                  {/* Split Mode Tabs */}
                  <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setSplitMode('range')}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        splitMode === 'range'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Range
                    </button>
                    <button
                      onClick={() => setSplitMode('pages')}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        splitMode === 'pages'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Pages
                    </button>
                    <button
                      onClick={() => setSplitMode('size')}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        splitMode === 'size'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Size
                    </button>
                  </div>

                  {/* Range Mode Controls */}
                  {splitMode === 'range' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Range mode:
                        </label>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
                            Custom ranges
                          </button>
                          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
                            Fixed ranges
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Range 1
                        </label>
                        <div className="flex gap-2 items-center">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">from page</label>
                            <input
                              type="number"
                              min="1"
                              max={pdfInfo?.pageCount || 1}
                              value={rangeStart}
                              onChange={(e) => setRangeStart(parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-700 focus:border-transparent"
                            />
                          </div>
                          <div className="text-gray-400 mt-6">to</div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">to</label>
                            <input
                              type="number"
                              min={rangeStart}
                              max={pdfInfo?.pageCount || 1}
                              value={rangeEnd}
                              onChange={(e) => setRangeEnd(parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-700 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={addRange}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                        Add Range
                      </button>
                    </div>
                  )}

                  {/* Pages Mode Controls */}
                  {splitMode === 'pages' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Extract mode:
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setExtractMode('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              extractMode === 'all'
                                ? 'bg-red-100 text-red-800'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Extract all pages
                          </button>
                          <button
                            onClick={() => setExtractMode('select')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              extractMode === 'select'
                                ? 'bg-red-100 text-red-800'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Select pages
                          </button>
                        </div>
                      </div>
                      {extractMode === 'select' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pages to extract:
                          </label>
                          <input
                            type="text"
                            placeholder="example: 1,5-8"
                            value={Array.from(selectedPages).sort((a, b) => a - b).join(',')}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Click on pages above to select them
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Size Mode Controls */}
                  {splitMode === 'size' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Original file size: {formatFileSize(file.size)}
                        </label>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total pages: {pdfInfo?.pageCount || 0}
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum size per file:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="1"
                            value={splitOptions.maxSizeMB}
                            onChange={(e) => setSplitOptions({...splitOptions, maxSizeMB: parseInt(e.target.value) || 1})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 text-gray-700 focus:ring-red-500 focus:border-transparent"
                          />
                          <select className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg">
                            <option>MB</option>
                          </select>
                        </div>
                        <p className="text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded">
                          This PDF will be split into files no larger than {splitOptions.maxSizeMB} MB each.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Split Button */}
                  <button
                    onClick={splitPDF}
                    disabled={isProcessing || (splitMode === 'pages' && extractMode === 'select' && selectedPages.size === 0)}
                    className="w-full mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Splitting PDF...
                      </>
                    ) : (
                      <>
                        <Scissors size={20} />
                        Split PDF
                      </>
                    )}
                  </button>
                </div>
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
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                  <button
                    onClick={downloadAll}
                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    aria-label="Download all split PDF files individually"
                  >
                    <Download size={20} className="mr-2" />
                    Download All Files
                  </button>
                  <button
                    onClick={downloadAsZip}
                    disabled={isDownloadingZip}
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                    aria-label="Download all split PDF files as a ZIP archive"
                  >
                    {isDownloadingZip ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating ZIP...
                      </>
                    ) : (
                      <>
                        <Archive size={20} className="mr-2" />
                        Download as ZIP
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {downloadUrls.map((fileItem, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{fileItem.name || `split_${index + 1}.pdf`}</div>
                        <div className="text-sm text-gray-500">
                          {fileItem.size ? formatFileSize(fileItem.size) : `Split file ${index + 1}`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadFile(fileItem.url, fileItem.name || `split_${index + 1}.pdf`)}
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
