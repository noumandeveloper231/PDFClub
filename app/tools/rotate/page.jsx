'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { RotateCw, Upload, Download, FileText, Zap } from 'lucide-react';

export default function RotatePDF() {
  const [file, setFile] = useState(null);
  const [rotationOptions, setRotationOptions] = useState({
    angle: 90,
    pages: 'all'
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

  const rotatePDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(rotationOptions));

      const response = await fetch('/api/rotate', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Rotation failed');
      }
    } catch (error) {
      console.error('Error rotating PDF:', error);
      alert('Error rotating PDF: ' + error.message);
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
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-lime-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-500 rounded-full mb-4">
            <RotateCw size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rotate PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-lime-500 bg-lime-50' 
                  : 'border-gray-300 hover:border-lime-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a PDF file to rotate its pages
              </p>
              <div className="inline-flex items-center bg-lime-100 text-lime-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-lime-600" />
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

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rotation Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rotation Angle
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[90, 180, 270, -90].map((angle) => (
                        <button
                          key={angle}
                          onClick={() => setRotationOptions({...rotationOptions, angle})}
                          className={`p-3 border-2 rounded-lg text-center transition-colors ${
                            rotationOptions.angle === angle
                              ? 'border-lime-500 bg-lime-50 text-lime-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <RotateCw size={20} className="mx-auto mb-1" />
                          <div className="text-xs">{angle > 0 ? `+${angle}°` : `${angle}°`}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pages to Rotate
                    </label>
                    <select
                      value={rotationOptions.pages}
                      onChange={(e) => setRotationOptions({...rotationOptions, pages: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    >
                      <option value="all">All Pages</option>
                      <option value="odd">Odd Pages Only</option>
                      <option value="even">Even Pages Only</option>
                      <option value="first">First Page Only</option>
                      <option value="last">Last Page Only</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={rotatePDF}
                  disabled={isProcessing}
                  className="inline-flex items-center px-8 py-3 bg-lime-600 hover:bg-lime-700 disabled:bg-lime-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Rotating PDF...
                    </>
                  ) : (
                    <>
                      <RotateCw size={20} className="mr-2" />
                      Rotate PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {downloadUrl && (
            <div className="bg-lime-50 border border-lime-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-lime-900 mb-2">
                PDF Rotated Successfully!
              </h3>
              <p className="text-lime-700 mb-4">
                Your PDF has been rotated and is ready for download.
              </p>
              <a
                href={downloadUrl}
                download={`rotated_${file.name}`}
                className="inline-flex items-center px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Rotated PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
