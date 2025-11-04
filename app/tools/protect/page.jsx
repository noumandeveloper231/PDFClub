'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Lock, Upload, Download, FileText, Shield, Zap } from 'lucide-react';

export default function ProtectPDF() {
  const [file, setFile] = useState(null);
  const [protectionOptions, setProtectionOptions] = useState({
    userPassword: '',
    ownerPassword: '',
    permissions: {
      printing: true,
      modifying: false,
      copying: false,
      annotating: true
    }
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

  const protectPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(protectionOptions));

      const response = await fetch('/api/protect', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Protection failed');
      }
    } catch (error) {
      console.error('Error protecting PDF:', error);
      alert('Error protecting PDF: ' + error.message);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-600 rounded-full mb-4">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Protect PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-slate-500 bg-slate-50' 
                  : 'border-gray-300 hover:border-slate-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a PDF file to add password protection
              </p>
              <div className="inline-flex items-center bg-slate-100 text-slate-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-slate-600" />
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield size={20} />
                    Password Protection
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Password (Required to open PDF)
                      </label>
                      <input
                        type="password"
                        value={protectionOptions.userPassword}
                        onChange={(e) => setProtectionOptions({
                          ...protectionOptions, 
                          userPassword: e.target.value
                        })}
                        placeholder="Enter password..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Owner Password (Optional - for permissions)
                      </label>
                      <input
                        type="password"
                        value={protectionOptions.ownerPassword}
                        onChange={(e) => setProtectionOptions({
                          ...protectionOptions, 
                          ownerPassword: e.target.value
                        })}
                        placeholder="Enter owner password..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Document Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={protectionOptions.permissions.printing}
                        onChange={(e) => setProtectionOptions({
                          ...protectionOptions,
                          permissions: {
                            ...protectionOptions.permissions,
                            printing: e.target.checked
                          }
                        })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Allow Printing</div>
                        <div className="text-sm text-gray-500">Users can print the document</div>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={protectionOptions.permissions.modifying}
                        onChange={(e) => setProtectionOptions({
                          ...protectionOptions,
                          permissions: {
                            ...protectionOptions.permissions,
                            modifying: e.target.checked
                          }
                        })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Allow Modifying</div>
                        <div className="text-sm text-gray-500">Users can edit the document</div>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={protectionOptions.permissions.copying}
                        onChange={(e) => setProtectionOptions({
                          ...protectionOptions,
                          permissions: {
                            ...protectionOptions.permissions,
                            copying: e.target.checked
                          }
                        })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Allow Copying</div>
                        <div className="text-sm text-gray-500">Users can copy text and images</div>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={protectionOptions.permissions.annotating}
                        onChange={(e) => setProtectionOptions({
                          ...protectionOptions,
                          permissions: {
                            ...protectionOptions.permissions,
                            annotating: e.target.checked
                          }
                        })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Allow Annotations</div>
                        <div className="text-sm text-gray-500">Users can add comments and notes</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={protectPDF}
                  disabled={isProcessing || !protectionOptions.userPassword.trim()}
                  className="inline-flex items-center px-8 py-3 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Protecting PDF...
                    </>
                  ) : (
                    <>
                      <Lock size={20} className="mr-2" />
                      Protect PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {downloadUrl && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                PDF Protected Successfully!
              </h3>
              <p className="text-slate-700 mb-4">
                Your PDF has been encrypted with password protection and is ready for download.
              </p>
              <a
                href={downloadUrl}
                download={`protected_${file.name}`}
                className="inline-flex items-center px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Protected PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
