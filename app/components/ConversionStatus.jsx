'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, Download, RefreshCw, CheckCircle, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const ConversionStatus = ({ file, status, onConversionComplete, onReset }) => {
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const conversionStartedRef = useRef(false);

  useEffect(() => {
    if (status === 'uploaded' && !conversionStartedRef.current) {
      conversionStartedRef.current = true;
      handleConversion();
      // Create preview URL for the PDF
      if (file.originalFile) {
        const url = URL.createObjectURL(file.originalFile);
        setPdfPreviewUrl(url);
      }
    }
    
    // Cleanup preview URL on unmount
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [status, file]);

  const handleConversion = async () => {
    // Prevent multiple conversions
    if (isConverting) return;
    
    setIsConverting(true);
    setError(null);
    setConversionProgress(0);
    
    // Dismiss any existing toasts first
    toast.dismiss();
    
    const conversionToast = toast.loading('Converting PDF to DOCX...', {
      duration: Infinity,
    });

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setConversionProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const response = await fetch(`/api/convert/${file.id}`, {
        method: 'POST',
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setConversionProgress(100);

      if (response.ok && data.success) {
        setDownloadUrl(data.downloadUrl);
        onConversionComplete();
        toast.success('PDF converted successfully! Ready for download.', { id: conversionToast });
        setTimeout(() => setIsConverting(false), 500);
      } else {
        throw new Error(data.error || 'Conversion failed');
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Conversion error:', error);
      const errorMsg = error.message || 'Conversion failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg, { id: conversionToast });
      setIsConverting(false);
      setConversionProgress(0);
    }
  };

  const handleDownload = async () => {
    const downloadToast = toast.loading('Preparing download...');
    
    try {
      const response = await fetch(`/api/download/${file.id}`);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.originalName.replace('.pdf', '')}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully!', { id: downloadToast });
    } catch (error) {
      console.error('Download error:', error);
      const errorMsg = 'Download failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg, { id: downloadToast });
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
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* File Info and Preview Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* File Information */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-glow">
              <FileText size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-oswald text-xl font-semibold text-slate-900 mb-2">{file.originalName}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {formatFileSize(file.size)}
                </span>
                <span>PDF Document</span>
              </div>
              <p className="text-slate-500 text-xs mt-2">
                Uploaded: {new Date(file.uploadedAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* File Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">{formatFileSize(file.size)}</div>
              <div className="text-sm text-blue-700">File Size</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-1">PDF</div>
              <div className="text-sm text-green-700">Format</div>
            </div>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-soft">
          <h4 className="font-oswald text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-600" />
            PDF Preview
          </h4>
          
          <div className="relative bg-slate-100 rounded-xl overflow-hidden aspect-[3/4] border-2 border-dashed border-slate-300">
            {pdfPreviewUrl ? (
              <iframe
                src={`${pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full"
                title="PDF Preview"
                style={{ border: 'none' }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FileText size={48} className="text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Loading preview...</p>
                </div>
              </div>
            )}
            
            {/* Preview Overlay */}
            <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
              Preview
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mt-3 text-center">
            This is a preview of your uploaded PDF document
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200">
        {isConverting && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6 text-blue-600 font-medium">
              <RefreshCw className="animate-spin" size={20} />
              <span>Converting PDF to DOCX...</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out" 
                style={{ width: `${conversionProgress}%` }}
              ></div>
            </div>
            <p className="text-slate-600 text-sm">{Math.round(conversionProgress)}% complete</p>
          </div>
        )}

        {status === 'completed' && !isConverting && (
          <div className="text-center">
            <CheckCircle className="text-green-500 mb-4 mx-auto" size={24} />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Conversion Complete!</h3>
            <p className="text-slate-600 mb-8">Your PDF has been successfully converted to DOCX format.</p>
            
            <button 
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              onClick={handleDownload}
            >
              <Download size={20} />
              Download DOCX File
            </button>
          </div>
        )}

        {error && (
          <div className="text-center">
            <AlertCircle className="text-red-500 mb-4 mx-auto" size={24} />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Conversion Failed</h3>
            <p className="text-slate-600 mb-8">{error}</p>
            
            <button 
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              onClick={handleConversion}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button 
          className="inline-flex items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          onClick={onReset}
        >
          <ArrowLeft size={16} />
          Convert Another File
        </button>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4">What happens next?</h4>
        <ul className="space-y-2 text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Your converted file will be available for download</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Files are automatically deleted from our servers after 24 hours</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>The conversion preserves formatting as much as possible</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ConversionStatus;
