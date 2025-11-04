'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CheckCircle, Upload, FileText, AlertCircle, Info, XCircle, Zap } from 'lucide-react';

export default function ValidatePDF() {
  const [file, setFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      setFile(pdfFile);
      setValidationResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const validatePDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/validate', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setValidationResult(result);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Validation failed');
      }
    } catch (error) {
      console.error('Error validating PDF:', error);
      setValidationResult({
        isValid: false,
        errors: [{ type: 'error', message: error.message }],
        warnings: [],
        info: {}
      });
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

  const getStatusIcon = (type) => {
    switch (type) {
      case 'error':
        return <XCircle size={20} className="text-red-500" />;
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-500" />;
      case 'info':
        return <Info size={20} className="text-blue-500" />;
      default:
        return <CheckCircle size={20} className="text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Validate PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check your PDF for errors, compliance issues, and get detailed information about the document structure.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a PDF file to validate its structure and compliance
              </p>
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF File
              </div>
            </div>
          )}

          {file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-green-600" />
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
                    setValidationResult(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Change File
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={validatePDF}
                  disabled={isProcessing}
                  className="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Validating PDF...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} className="mr-2" />
                      Validate PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {validationResult && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    validationResult.isValid ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {validationResult.isValid ? (
                      <CheckCircle size={24} className="text-green-600" />
                    ) : (
                      <XCircle size={24} className="text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${
                      validationResult.isValid ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {validationResult.isValid ? 'PDF is Valid' : 'PDF has Issues'}
                    </h3>
                    <p className="text-gray-600">
                      Validation completed for {file.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* PDF Information */}
              {validationResult.info && Object.keys(validationResult.info).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Document Information</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(validationResult.info).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-blue-700 font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-blue-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Errors */}
              {validationResult.errors && validationResult.errors.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <XCircle size={20} className="text-red-500" />
                    Errors ({validationResult.errors.length})
                  </h4>
                  <div className="space-y-3">
                    {validationResult.errors.map((error, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon('error')}
                          <div className="flex-1">
                            <p className="text-red-900 font-medium">{error.message}</p>
                            {error.details && (
                              <p className="text-red-700 text-sm mt-1">{error.details}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {validationResult.warnings && validationResult.warnings.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle size={20} className="text-yellow-500" />
                    Warnings ({validationResult.warnings.length})
                  </h4>
                  <div className="space-y-3">
                    {validationResult.warnings.map((warning, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon('warning')}
                          <div className="flex-1">
                            <p className="text-yellow-900 font-medium">{warning.message}</p>
                            {warning.details && (
                              <p className="text-yellow-700 text-sm mt-1">{warning.details}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success message if no issues */}
              {validationResult.isValid && (!validationResult.errors || validationResult.errors.length === 0) && (!validationResult.warnings || validationResult.warnings.length === 0) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-900 mb-2">
                    Perfect! No Issues Found
                  </h3>
                  <p className="text-green-700">
                    Your PDF file is valid and complies with standard PDF specifications.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
