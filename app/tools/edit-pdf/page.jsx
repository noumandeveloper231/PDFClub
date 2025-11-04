'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Edit, Upload, Download, FileText, Type, Square, Circle, Zap } from 'lucide-react';

export default function EditPDF() {
  const [file, setFile] = useState(null);
  const [editOptions, setEditOptions] = useState({
    text: '',
    textX: 100,
    textY: 100,
    fontSize: 12,
    textColor: '#000000',
    addRectangle: false,
    rectX: 50,
    rectY: 50,
    rectWidth: 100,
    rectHeight: 50,
    rectColor: '#ff0000'
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

  const editPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(editOptions));

      const response = await fetch('/api/edit-pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Edit failed');
      }
    } catch (error) {
      console.error('Error editing PDF:', error);
      alert('Error editing PDF: ' + error.message);
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
            <Edit size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Edit PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Add text, images, shapes or freehand annotations to a PDF document. Make your PDFs interactive and informative.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* File Upload Area */}
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-yellow-500 bg-yellow-50' 
                  : 'border-gray-300 hover:border-yellow-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a PDF file to add text, shapes, and annotations
              </p>
              <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {/* File Info and Edit Options */}
          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-yellow-600" />
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

              {/* Edit Options */}
              <div className="space-y-6">
                {/* Text Addition */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Type size={20} />
                    Add Text
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Content
                      </label>
                      <textarea
                        value={editOptions.text}
                        onChange={(e) => setEditOptions({...editOptions, text: e.target.value})}
                        placeholder="Enter text to add to PDF..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        X Position
                      </label>
                      <input
                        type="number"
                        value={editOptions.textX}
                        onChange={(e) => setEditOptions({...editOptions, textX: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Y Position
                      </label>
                      <input
                        type="number"
                        value={editOptions.textY}
                        onChange={(e) => setEditOptions({...editOptions, textY: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size
                      </label>
                      <input
                        type="number"
                        min="8"
                        max="72"
                        value={editOptions.fontSize}
                        onChange={(e) => setEditOptions({...editOptions, fontSize: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <input
                        type="color"
                        value={editOptions.textColor}
                        onChange={(e) => setEditOptions({...editOptions, textColor: e.target.value})}
                        className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Shape Addition */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Square size={20} />
                    Add Rectangle
                  </h4>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editOptions.addRectangle}
                        onChange={(e) => setEditOptions({...editOptions, addRectangle: e.target.checked})}
                        className="mr-2"
                      />
                      Add a rectangle shape to the PDF
                    </label>
                  </div>
                  {editOptions.addRectangle && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          X Position
                        </label>
                        <input
                          type="number"
                          value={editOptions.rectX}
                          onChange={(e) => setEditOptions({...editOptions, rectX: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Y Position
                        </label>
                        <input
                          type="number"
                          value={editOptions.rectY}
                          onChange={(e) => setEditOptions({...editOptions, rectY: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Width
                        </label>
                        <input
                          type="number"
                          value={editOptions.rectWidth}
                          onChange={(e) => setEditOptions({...editOptions, rectWidth: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Height
                        </label>
                        <input
                          type="number"
                          value={editOptions.rectHeight}
                          onChange={(e) => setEditOptions({...editOptions, rectHeight: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <input
                          type="color"
                          value={editOptions.rectColor}
                          onChange={(e) => setEditOptions({...editOptions, rectColor: e.target.value})}
                          className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <div className="text-center mt-6">
                <button
                  onClick={editPDF}
                  disabled={isProcessing || (!editOptions.text.trim() && !editOptions.addRectangle)}
                  className="inline-flex items-center px-8 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Editing PDF...
                    </>
                  ) : (
                    <>
                      <Edit size={20} className="mr-2" />
                      Edit PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Download Section */}
          {downloadUrl && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-900 mb-2">
                PDF Edited Successfully!
              </h3>
              <p className="text-yellow-700 mb-4">
                Your PDF has been edited with the new content and is ready for download.
              </p>
              <a
                href={downloadUrl}
                download={`edited_${file.name}`}
                className="inline-flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Edited PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
