'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Droplets, Upload, Download, FileText, Type, Image, Zap } from 'lucide-react';

export default function WatermarkPDF() {
  const [file, setFile] = useState(null);
  const [watermarkOptions, setWatermarkOptions] = useState({
    type: 'text',
    text: 'CONFIDENTIAL',
    fontSize: 48,
    opacity: 0.3,
    rotation: 45,
    position: 'center',
    color: '#ff0000'
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

  const addWatermark = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(watermarkOptions));

      const response = await fetch('/api/watermark', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Watermark failed');
      }
    } catch (error) {
      console.error('Error adding watermark:', error);
      alert('Error adding watermark: ' + error.message);
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-full mb-4">
            <Droplets size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Watermark PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stamp an image or text over your PDF in seconds. Choose typography and position.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-cyan-500 bg-cyan-50' 
                  : 'border-gray-300 hover:border-cyan-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a PDF file to add watermarks
              </p>
              <div className="inline-flex items-center bg-cyan-100 text-cyan-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-cyan-600" />
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Watermark Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Watermark Type
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="type"
                            value="text"
                            checked={watermarkOptions.type === 'text'}
                            onChange={(e) => setWatermarkOptions({...watermarkOptions, type: e.target.value})}
                            className="mr-2"
                          />
                          <Type size={16} className="mr-1" />
                          Text
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="type"
                            value="image"
                            checked={watermarkOptions.type === 'image'}
                            onChange={(e) => setWatermarkOptions({...watermarkOptions, type: e.target.value})}
                            className="mr-2"
                          />
                          <Image size={16} className="mr-1" />
                          Image
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <select
                        value={watermarkOptions.position}
                        onChange={(e) => setWatermarkOptions({...watermarkOptions, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="center">Center</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </div>
                  </div>
                </div>

                {watermarkOptions.type === 'text' && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Text Watermark</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Watermark Text
                        </label>
                        <input
                          type="text"
                          value={watermarkOptions.text}
                          onChange={(e) => setWatermarkOptions({...watermarkOptions, text: e.target.value})}
                          placeholder="Enter watermark text..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Size
                        </label>
                        <input
                          type="number"
                          min="12"
                          max="100"
                          value={watermarkOptions.fontSize}
                          onChange={(e) => setWatermarkOptions({...watermarkOptions, fontSize: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <input
                          type="color"
                          value={watermarkOptions.color}
                          onChange={(e) => setWatermarkOptions({...watermarkOptions, color: e.target.value})}
                          className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opacity ({Math.round(watermarkOptions.opacity * 100)}%)
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={watermarkOptions.opacity}
                          onChange={(e) => setWatermarkOptions({...watermarkOptions, opacity: parseFloat(e.target.value)})}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rotation ({watermarkOptions.rotation}°)
                        </label>
                        <input
                          type="range"
                          min="-90"
                          max="90"
                          step="15"
                          value={watermarkOptions.rotation}
                          onChange={(e) => setWatermarkOptions({...watermarkOptions, rotation: parseInt(e.target.value)})}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={addWatermark}
                  disabled={isProcessing || (watermarkOptions.type === 'text' && !watermarkOptions.text.trim())}
                  className="inline-flex items-center px-8 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding Watermark...
                    </>
                  ) : (
                    <>
                      <Droplets size={20} className="mr-2" />
                      Add Watermark
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {downloadUrl && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-900 mb-2">
                Watermark Added Successfully!
              </h3>
              <p className="text-cyan-700 mb-4">
                Your PDF has been watermarked and is ready for download.
              </p>
              <a
                href={downloadUrl}
                download={`watermarked_${file.name}`}
                className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Watermarked PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
