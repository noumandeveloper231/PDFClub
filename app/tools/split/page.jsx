'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Scissors, Upload, Download, FileText, Eye, Plus, Minus } from 'lucide-react';

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [splitMethod, setSplitMethod] = useState('range'); // 'range', 'pages', 'size'
  const [splitOptions, setSplitOptions] = useState({
    pagesPerFile: 1,
    pageRanges: '',
    maxSizeMB: 10,
    selectedPages: new Set(),
    customRanges: [{ from: 1, to: 1 }]
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [loadingThumbnails, setLoadingThumbnails] = useState(false);

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
      setLoadingThumbnails(true);
      const formData = new FormData();
      formData.append('file', pdfFile);

      // Get PDF info and thumbnails
      const [infoResponse, thumbnailResponse] = await Promise.all([
        fetch('/api/pdf-info', {
          method: 'POST',
          body: formData,
        }),
        fetch('/api/pdf-thumbnails', {
          method: 'POST',
          body: formData,
        })
      ]);

      if (infoResponse.ok) {
        const info = await infoResponse.json();
        setPdfInfo(info);
      }

      if (thumbnailResponse.ok) {
        const thumbnailData = await thumbnailResponse.json();
        setThumbnails(thumbnailData.thumbnails || []);
      }
    } catch (error) {
      console.error('Error getting PDF info:', error);
    } finally {
      setLoadingThumbnails(false);
    }
  };

  // Helper functions for page selection
  const togglePageSelection = (pageNum) => {
    const newSelected = new Set(splitOptions.selectedPages);
    if (newSelected.has(pageNum)) {
      newSelected.delete(pageNum);
    } else {
      newSelected.add(pageNum);
    }
    setSplitOptions({...splitOptions, selectedPages: newSelected});
  };

  const addRange = () => {
    const maxPage = pdfInfo?.pageCount || 1;
    setSplitOptions({
      ...splitOptions,
      customRanges: [...splitOptions.customRanges, { from: 1, to: maxPage }]
    });
  };

  const removeRange = (index) => {
    if (splitOptions.customRanges.length > 1) {
      const newRanges = splitOptions.customRanges.filter((_, i) => i !== index);
      setSplitOptions({...splitOptions, customRanges: newRanges});
    }
  };

  const updateRange = (index, field, value) => {
    const newRanges = [...splitOptions.customRanges];
    newRanges[index] = { ...newRanges[index], [field]: parseInt(value) || 1 };
    setSplitOptions({...splitOptions, customRanges: newRanges});
  };

  const splitPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('method', splitMethod);
      
      // Prepare options based on split method
      let options = { ...splitOptions };
      if (splitMethod === 'pages') {
        options.selectedPages = Array.from(splitOptions.selectedPages);
      } else if (splitMethod === 'range') {
        options.ranges = splitOptions.customRanges;
      }
      
      formData.append('options', JSON.stringify(options));

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
                    setThumbnails([]);
                    setSplitOptions({
                      pagesPerFile: 1,
                      pageRanges: '',
                      maxSizeMB: 10,
                      selectedPages: new Set(),
                      customRanges: [{ from: 1, to: 1 }]
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Change File
                </button>
              </div>

              {/* Tab-based Split Method Selection */}
              <div className="mb-6">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setSplitMethod('range')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                      splitMethod === 'range'
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <Scissors size={14} className="text-blue-600" />
                      </div>
                      Range
                    </div>
                  </button>
                  <button
                    onClick={() => setSplitMethod('pages')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                      splitMethod === 'pages'
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                        <FileText size={14} className="text-green-600" />
                      </div>
                      Pages
                    </div>
                  </button>
                  <button
                    onClick={() => setSplitMethod('size')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                      splitMethod === 'size'
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                        <Eye size={14} className="text-orange-600" />
                      </div>
                      Size
                    </div>
                  </button>
                </div>
              </div>

              {/* Split Options with Visual Interface */}
              <div className="mb-6">
                {/* PDF Thumbnails Grid */}
                {thumbnails.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-700">PDF Pages</h4>
                      <div className="text-sm text-gray-500">
                        {file && `${formatFileSize(file.size)} • ${pdfInfo?.pageCount || 0} pages`}
                      </div>
                    </div>
                    
                    {loadingThumbnails ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Generating page previews...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                        {thumbnails.map((thumbnail) => (
                          <div
                            key={thumbnail.pageNumber}
                            className={`relative group cursor-pointer transition-all duration-200 ${
                              splitMethod === 'pages' && splitOptions.selectedPages.has(thumbnail.pageNumber)
                                ? 'ring-2 ring-blue-500 bg-blue-50'
                                : 'hover:ring-2 hover:ring-gray-300'
                            }`}
                            onClick={() => splitMethod === 'pages' && togglePageSelection(thumbnail.pageNumber)}
                          >
                            <div className="aspect-[3/4] bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                              <embed
                                src={thumbnail.thumbnailUrl}
                                type="application/pdf"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-75 text-white text-xs text-center py-1 rounded">
                              {thumbnail.pageNumber}
                            </div>
                            {splitMethod === 'pages' && (
                              <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                splitOptions.selectedPages.has(thumbnail.pageNumber)
                                  ? 'bg-blue-500 border-blue-500'
                                  : 'bg-white border-gray-300'
                              }`}>
                                {splitOptions.selectedPages.has(thumbnail.pageNumber) && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Method-specific Controls */}
                {splitMethod === 'range' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Range mode:</h4>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full border border-red-200"
                        >
                          Custom ranges
                        </button>
                        <button
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full border border-gray-200"
                        >
                          Fixed ranges
                        </button>
                      </div>
                    </div>
                    
                    {splitOptions.customRanges.map((range, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Range {index + 1}</span>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">from page</label>
                          <input
                            type="number"
                            min="1"
                            max={pdfInfo?.pageCount || 1}
                            value={range.from}
                            onChange={(e) => updateRange(index, 'from', e.target.value)}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <label className="text-sm text-gray-600">to</label>
                          <input
                            type="number"
                            min="1"
                            max={pdfInfo?.pageCount || 1}
                            value={range.to}
                            onChange={(e) => updateRange(index, 'to', e.target.value)}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        {splitOptions.customRanges.length > 1 && (
                          <button
                            onClick={() => removeRange(index)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                          >
                            <Minus size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button
                      onClick={addRange}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Plus size={16} />
                      Add Range
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="mergeRanges"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="mergeRanges" className="text-sm text-gray-600">
                        Merge all ranges in one PDF file.
                      </label>
                    </div>
                  </div>
                )}

                {splitMethod === 'pages' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Extract mode:</h4>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                          Extract all pages
                        </button>
                        <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full border border-red-200">
                          Select pages
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pages to extract:
                      </label>
                      <input
                        type="text"
                        placeholder="example: 1,5,8"
                        value={Array.from(splitOptions.selectedPages).sort((a, b) => a - b).join(',')}
                        onChange={(e) => {
                          const pages = e.target.value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
                          setSplitOptions({...splitOptions, selectedPages: new Set(pages)});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="mergePages"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="mergePages" className="text-sm text-gray-600">
                        Merge extracted pages into one PDF file.
                      </label>
                    </div>
                    
                    <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                      Selected pages will be converted into separate files.
                    </div>
                  </div>
                )}

                {splitMethod === 'size' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Original file size: {file && formatFileSize(file.size)}</h4>
                      <div className="text-sm text-gray-500">Total pages: {pdfInfo?.pageCount || 0}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum size per file:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={splitOptions.maxSizeMB}
                          onChange={(e) => setSplitOptions({...splitOptions, maxSizeMB: parseInt(e.target.value)})}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex">
                          <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 border border-gray-300 rounded-l-lg">
                            KB
                          </button>
                          <button className="px-3 py-2 text-sm bg-blue-100 text-blue-700 border border-blue-300 rounded-r-lg">
                            MB
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                      This PDF will be split into files no larger than {splitOptions.maxSizeMB} MB each.
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="allowCompression"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="allowCompression" className="text-sm text-gray-600">
                        Allow compression
                      </label>
                    </div>
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
