'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Crop, Upload, Download, FileText, Move, Zap } from 'lucide-react';

export default function CropPDF() {
  const [file, setFile] = useState(null);
  const [cropOptions, setCropOptions] = useState({
    preset: 'custom',
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
    unit: 'points'
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

  const presets = {
    'no-crop': { top: 0, bottom: 0, left: 0, right: 0 },
    'small-margins': { top: 20, bottom: 20, left: 20, right: 20 },
    'medium-margins': { top: 50, bottom: 50, left: 50, right: 50 },
    'large-margins': { top: 100, bottom: 100, left: 100, right: 100 },
    'header-footer': { top: 100, bottom: 100, left: 20, right: 20 },
    'custom': cropOptions
  };

  const applyPreset = (preset) => {
    setCropOptions({
      ...cropOptions,
      preset,
      ...presets[preset]
    });
  };

  const cropPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(cropOptions));

      const response = await fetch('/api/crop', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Cropping failed');
      }
    } catch (error) {
      console.error('Error cropping PDF:', error);
      alert('Error cropping PDF: ' + error.message);
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-full mb-4">
            <Crop size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Crop PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Remove unwanted margins and whitespace from your PDF pages. Crop all pages uniformly.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a PDF file to crop its pages
              </p>
              <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-teal-600" />
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Settings</h3>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Quick Presets
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries({
                        'no-crop': 'No Crop',
                        'small-margins': 'Small Margins',
                        'medium-margins': 'Medium Margins',
                        'large-margins': 'Large Margins',
                        'header-footer': 'Header/Footer',
                        'custom': 'Custom'
                      }).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => applyPreset(key)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                            cropOptions.preset === key
                              ? 'bg-teal-100 border-teal-300 text-teal-800'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Top Margin
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={cropOptions.top}
                        onChange={(e) => setCropOptions({
                          ...cropOptions, 
                          top: parseInt(e.target.value) || 0,
                          preset: 'custom'
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bottom Margin
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={cropOptions.bottom}
                        onChange={(e) => setCropOptions({
                          ...cropOptions, 
                          bottom: parseInt(e.target.value) || 0,
                          preset: 'custom'
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Left Margin
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={cropOptions.left}
                        onChange={(e) => setCropOptions({
                          ...cropOptions, 
                          left: parseInt(e.target.value) || 0,
                          preset: 'custom'
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Right Margin
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={cropOptions.right}
                        onChange={(e) => setCropOptions({
                          ...cropOptions, 
                          right: parseInt(e.target.value) || 0,
                          preset: 'custom'
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={cropOptions.unit}
                      onChange={(e) => setCropOptions({...cropOptions, unit: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="points">Points</option>
                      <option value="inches">Inches</option>
                      <option value="mm">Millimeters</option>
                    </select>
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-teal-900 mb-2 flex items-center gap-2">
                    <Move size={16} />
                    Crop Preview
                  </h4>
                  <div className="bg-white border-2 border-dashed border-teal-300 rounded-lg p-8 relative">
                    <div className="absolute inset-0 bg-gray-100 rounded-lg"></div>
                    <div 
                      className="relative bg-white border-2 border-teal-400 rounded"
                      style={{
                        marginTop: `${cropOptions.top / 4}px`,
                        marginBottom: `${cropOptions.bottom / 4}px`,
                        marginLeft: `${cropOptions.left / 4}px`,
                        marginRight: `${cropOptions.right / 4}px`,
                        minHeight: '80px'
                      }}
                    >
                      <div className="flex items-center justify-center h-full text-teal-700 font-medium">
                        Cropped Content Area
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 text-xs text-gray-500">
                      Margins: T:{cropOptions.top} B:{cropOptions.bottom} L:{cropOptions.left} R:{cropOptions.right}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={cropPDF}
                  disabled={isProcessing}
                  className="inline-flex items-center px-8 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Cropping PDF...
                    </>
                  ) : (
                    <>
                      <Crop size={20} className="mr-2" />
                      Crop PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {downloadUrl && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-teal-900 mb-2">
                PDF Cropped Successfully!
              </h3>
              <p className="text-teal-700 mb-4">
                Your PDF has been cropped with the specified margins.
              </p>
              <a
                href={downloadUrl}
                download={`cropped_${file.name}`}
                className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Cropped PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
