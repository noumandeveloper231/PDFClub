'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PenTool, Upload, Download, FileText, Type, Image, Zap } from 'lucide-react';

export default function SignPDF() {
  const [file, setFile] = useState(null);
  const [signatureOptions, setSignatureOptions] = useState({
    type: 'text',
    text: 'John Doe',
    fontSize: 24,
    position: 'bottom-right',
    page: 1,
    x: 400,
    y: 50
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

  const signPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(signatureOptions));

      const response = await fetch('/api/sign', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Signing failed');
      }
    } catch (error) {
      console.error('Error signing PDF:', error);
      alert('Error signing PDF: ' + error.message);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
            <PenTool size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sign PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Add your signature to PDF documents. Sign contracts, agreements, and forms digitally.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a PDF file to add your signature
              </p>
              <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-purple-600" />
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Signature Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Signature Type
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="type"
                            value="text"
                            checked={signatureOptions.type === 'text'}
                            onChange={(e) => setSignatureOptions({...signatureOptions, type: e.target.value})}
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
                            checked={signatureOptions.type === 'image'}
                            onChange={(e) => setSignatureOptions({...signatureOptions, type: e.target.value})}
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
                        value={signatureOptions.position}
                        onChange={(e) => setSignatureOptions({...signatureOptions, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                        <option value="center">Center</option>
                      </select>
                    </div>
                  </div>
                </div>

                {signatureOptions.type === 'text' && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Text Signature</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Signature Text
                        </label>
                        <input
                          type="text"
                          value={signatureOptions.text}
                          onChange={(e) => setSignatureOptions({...signatureOptions, text: e.target.value})}
                          placeholder="Enter your name or signature..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Size
                        </label>
                        <input
                          type="number"
                          min="12"
                          max="48"
                          value={signatureOptions.fontSize}
                          onChange={(e) => setSignatureOptions({...signatureOptions, fontSize: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Page Number
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={signatureOptions.page}
                          onChange={(e) => setSignatureOptions({...signatureOptions, page: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-purple-900 mb-2">Preview</h4>
                  <div className="bg-white border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
                    <div 
                      className="inline-block text-purple-800 font-semibold"
                      style={{ fontSize: `${signatureOptions.fontSize}px` }}
                    >
                      {signatureOptions.text || 'Your signature will appear here'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={signPDF}
                  disabled={isProcessing || (signatureOptions.type === 'text' && !signatureOptions.text.trim())}
                  className="inline-flex items-center px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing PDF...
                    </>
                  ) : (
                    <>
                      <PenTool size={20} className="mr-2" />
                      Sign PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {downloadUrl && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">
                PDF Signed Successfully!
              </h3>
              <p className="text-purple-700 mb-4">
                Your signature has been added to the PDF document.
              </p>
              <a
                href={downloadUrl}
                download={`signed_${file.name}`}
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Signed PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
