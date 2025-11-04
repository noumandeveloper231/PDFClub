'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Layout, Upload, Download, FileText, Move, Trash2, RotateCw, Zap } from 'lucide-react';

export default function OrganizePDF() {
  const [file, setFile] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [pages, setPages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setFile(pdfFile);
      setDownloadUrl(null);
      
      // Get PDF info
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
          
          // Initialize pages array
          const initialPages = Array.from({ length: info.pageCount }, (_, i) => ({
            id: i + 1,
            originalIndex: i + 1,
            rotation: 0,
            include: true
          }));
          setPages(initialPages);
        }
      } catch (error) {
        console.error('Error getting PDF info:', error);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const movePageUp = (index) => {
    if (index > 0) {
      const newPages = [...pages];
      [newPages[index - 1], newPages[index]] = [newPages[index], newPages[index - 1]];
      setPages(newPages);
    }
  };

  const movePageDown = (index) => {
    if (index < pages.length - 1) {
      const newPages = [...pages];
      [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
      setPages(newPages);
    }
  };

  const togglePageInclude = (index) => {
    const newPages = [...pages];
    newPages[index].include = !newPages[index].include;
    setPages(newPages);
  };

  const rotatePage = (index) => {
    const newPages = [...pages];
    newPages[index].rotation = (newPages[index].rotation + 90) % 360;
    setPages(newPages);
  };

  const organizePDF = async () => {
    if (!file || !pages.length) return;

    setIsProcessing(true);
    try {
      const organizeOptions = {
        pages: pages.filter(p => p.include).map(p => ({
          originalIndex: p.originalIndex,
          rotation: p.rotation
        }))
      };

      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(organizeOptions));

      const response = await fetch('/api/organize', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Organization failed');
      }
    } catch (error) {
      console.error('Error organizing PDF:', error);
      alert('Error organizing PDF: ' + error.message);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <Layout size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Organize PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Reorder, rotate, and remove pages from your PDF. Organize your document exactly how you want it.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a PDF file to organize its pages
              </p>
              <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {file && pdfInfo && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    {pdfInfo.pageCount} pages • Size: {formatFileSize(file.size)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPdfInfo(null);
                    setPages([]);
                    setDownloadUrl(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Change File
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Organization</h3>
                <div className="text-sm text-gray-600 mb-4">
                  Drag pages to reorder, click to include/exclude, or rotate individual pages. 
                  Included pages: {pages.filter(p => p.include).length} of {pages.length}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
                  {pages.map((page, index) => (
                    <div
                      key={page.id}
                      className={`relative border-2 rounded-lg p-3 transition-all ${
                        page.include 
                          ? 'border-orange-300 bg-orange-50' 
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="aspect-[3/4] bg-white border border-gray-200 rounded flex items-center justify-center mb-2">
                        <div 
                          className="text-gray-600 font-medium"
                          style={{ transform: `rotate(${page.rotation}deg)` }}
                        >
                          Page {page.originalIndex}
                        </div>
                      </div>
                      
                      <div className="text-xs text-center text-gray-600 mb-2">
                        Position: {index + 1}
                      </div>
                      
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => movePageUp(index)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => movePageDown(index)}
                          disabled={index === pages.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => rotatePage(index)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Rotate"
                        >
                          <RotateCw size={12} />
                        </button>
                        <button
                          onClick={() => togglePageInclude(index)}
                          className={`p-1 ${
                            page.include 
                              ? 'text-orange-500 hover:text-orange-700' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title={page.include ? "Exclude page" : "Include page"}
                        >
                          {page.include ? <Trash2 size={12} /> : <Move size={12} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={organizePDF}
                  disabled={isProcessing || pages.filter(p => p.include).length === 0}
                  className="inline-flex items-center px-8 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Organizing PDF...
                    </>
                  ) : (
                    <>
                      <Layout size={20} className="mr-2" />
                      Organize PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {downloadUrl && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-orange-900 mb-2">
                PDF Organized Successfully!
              </h3>
              <p className="text-orange-700 mb-4">
                Your PDF has been reorganized with {pages.filter(p => p.include).length} pages.
              </p>
              <a
                href={downloadUrl}
                download={`organized_${file.name}`}
                className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Organized PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
