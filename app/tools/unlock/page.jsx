'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Unlock, Upload, Download, FileText, Key, Zap } from 'lucide-react';

export default function UnlockPDF() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
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

  const unlockPDF = async () => {
    if (!file || !password.trim()) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', password);

      const response = await fetch('/api/unlock', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Unlock failed');
      }
    } catch (error) {
      console.error('Error unlocking PDF:', error);
      alert('Error unlocking PDF: ' + error.message);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4">
            <Unlock size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Unlock PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Remove password protection from PDF files. Unlock encrypted PDFs by providing the correct password.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop protected PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a password-protected PDF file to unlock it
              </p>
              <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-emerald-600" />
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
                    setPassword('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Change File
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Key size={20} />
                    Enter Password
                  </h3>
                  
                  <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PDF Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter the PDF password..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && password.trim()) {
                          unlockPDF();
                        }
                      }}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Enter the password that was used to protect this PDF file.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={unlockPDF}
                  disabled={isProcessing || !password.trim()}
                  className="inline-flex items-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Unlocking PDF...
                    </>
                  ) : (
                    <>
                      <Unlock size={20} className="mr-2" />
                      Unlock PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {downloadUrl && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                PDF Unlocked Successfully!
              </h3>
              <p className="text-emerald-700 mb-4">
                Password protection has been removed from your PDF file.
              </p>
              <a
                href={downloadUrl}
                download={`unlocked_${file.name}`}
                className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Unlocked PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
