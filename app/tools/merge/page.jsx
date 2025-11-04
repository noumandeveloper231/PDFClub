'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Layers, Upload, Download, X, ArrowUp, ArrowDown, FileText } from 'lucide-react';

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    setFiles(prev => [...prev, ...pdfFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size
    }))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const removeFile = (id) => {
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

  const mergePDFs = async () => {
    if (files.length < 2) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((fileObj, index) => {
        formData.append(`file_${index}`, fileObj.file);
      });

      const response = await fetch('/api/merge', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        throw new Error('Merge failed');
      }
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Error merging PDFs. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
            <Layers size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Merge PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Combine multiple PDF files into one document. Simply upload your PDFs, arrange them in the desired order, and merge them together.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* File Upload Area */}
          {files.length === 0 && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF files here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload multiple PDF files to merge them into one document
              </p>
              <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF Files
              </div>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Files to Merge ({files.length})
                </h3>
                <button
                  {...getRootProps()}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  <input {...getInputProps()} />
                  <Upload size={16} className="mr-2" />
                  Add More Files
                </button>
              </div>

              <div className="space-y-3">
                {files.map((fileObj, index) => (
                  <div
                    key={fileObj.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText size={20} className="text-red-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {fileObj.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatFileSize(fileObj.size)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveFile(fileObj.id, 'up')}
                        disabled={index === 0}
                        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUp size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => moveFile(fileObj.id, 'down')}
                        disabled={index === files.length - 1}
                        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowDown size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {files.length >= 2 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={mergePDFs}
                    disabled={isProcessing}
                    className="inline-flex items-center px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-colors"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Merging PDFs...
                      </>
                    ) : (
                      <>
                        <Layers size={20} className="mr-2" />
                        Merge PDFs
                      </>
                    )}
                  </button>
                </div>
              )}

              {files.length === 1 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Please add at least one more PDF file to merge.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Download Section */}
          {downloadUrl && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                PDFs Merged Successfully!
              </h3>
              <p className="text-green-700 mb-4">
                Your merged PDF is ready for download.
              </p>
              <a
                href={downloadUrl}
                download="merged.pdf"
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Merged PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
