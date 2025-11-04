'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, Upload, Download, X, ArrowUp, ArrowDown, Zap } from 'lucide-react';

export default function JPGToPDF() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 20,
    quality: 'high'
  });

  const onDrop = useCallback((acceptedFiles) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && 
      (file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))
    );
    setFiles(prev => [...prev, ...imageFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file)
    }))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: true
  });

  const removeFile = (id) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(files.filter(file => file.id !== id));
  };

  const moveFile = (id, direction) => {
    const index = files.findIndex(file => file.id === id);
    if (index === -1) return;

    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < files.length) {
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      setFiles(newFiles);
    }
  };

  const convertToPDF = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((fileObj, index) => {
        formData.append(`file_${index}`, fileObj.file);
      });
      formData.append('options', JSON.stringify(conversionOptions));

      const response = await fetch('/api/jpg-to-pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        throw new Error('Conversion failed');
      }
    } catch (error) {
      console.error('Error converting images:', error);
      alert('Error converting images. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 rounded-full mb-4">
            <Image size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">JPG to PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert JPG images to PDF in seconds. Easily adjust orientation and margins. Combine multiple images into one PDF document.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* File Upload Area */}
          {files.length === 0 && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop image files here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload JPG, JPEG, or PNG files to convert them to PDF
              </p>
              <div className="inline-flex items-center bg-pink-100 text-pink-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select Image Files
              </div>
            </div>
          )}

          {/* File List and Options */}
          {files.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Images to Convert ({files.length})
                </h3>
                <button
                  {...getRootProps()}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  <input {...getInputProps()} />
                  <Upload size={16} className="mr-2" />
                  Add More Images
                </button>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {files.map((fileObj, index) => (
                  <div key={fileObj.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      <img 
                        src={fileObj.preview} 
                        alt={fileObj.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate text-sm">
                          {fileObj.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(fileObj.size)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => moveFile(fileObj.id, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => moveFile(fileObj.id, 'down')}
                          disabled={index === files.length - 1}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => removeFile(fileObj.id)}
                          className="p-1 rounded hover:bg-red-100 text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Conversion Options */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">PDF Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Size
                    </label>
                    <select
                      value={conversionOptions.pageSize}
                      onChange={(e) => setConversionOptions({...conversionOptions, pageSize: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="A4">A4</option>
                      <option value="Letter">Letter</option>
                      <option value="Legal">Legal</option>
                      <option value="A3">A3</option>
                      <option value="fit">Fit to Image</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orientation
                    </label>
                    <select
                      value={conversionOptions.orientation}
                      onChange={(e) => setConversionOptions({...conversionOptions, orientation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Margin (px)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={conversionOptions.margin}
                      onChange={(e) => setConversionOptions({...conversionOptions, margin: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality
                    </label>
                    <select
                      value={conversionOptions.quality}
                      onChange={(e) => setConversionOptions({...conversionOptions, quality: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Convert Button */}
              <div className="text-center">
                <button
                  onClick={convertToPDF}
                  disabled={isProcessing}
                  className="inline-flex items-center px-8 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Converting to PDF...
                    </>
                  ) : (
                    <>
                      <Image size={20} className="mr-2" />
                      Convert to PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Download Section */}
          {downloadUrl && (
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-pink-900 mb-2">
                Images Converted Successfully!
              </h3>
              <p className="text-pink-700 mb-4">
                Your {files.length} image{files.length > 1 ? 's have' : ' has'} been converted to PDF.
              </p>
              <a
                href={downloadUrl}
                download="images.pdf"
                className="inline-flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
