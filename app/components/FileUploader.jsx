'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, Sparkles, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const FileUploader = ({ onFileUploaded }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      const errorMsg = 'Please select a PDF file';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      const errorMsg = 'File size must be less than 50MB';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setError(null);
    setIsUploading(true);
    
    const uploadToast = toast.loading(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('File uploaded successfully!', { id: uploadToast });
        onFileUploaded({
          ...data.file,
          originalFile: file
        });
      } else {
        const errorMsg = data.error || 'Upload failed. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg, { id: uploadToast });
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = 'Upload failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg, { id: uploadToast });
    } finally {
      setIsUploading(false);
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
    <div className="max-w-4xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-500 bg-white/80 backdrop-blur-sm shadow-soft hover:shadow-glow ${
          isDragOver 
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-105 shadow-glow' 
            : 'border-slate-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/50 hover:scale-102'
        } ${isUploading ? 'cursor-not-allowed opacity-70' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {/* Animated background elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-slate-700 mb-2">Uploading your PDF...</p>
              <p className="text-sm text-slate-500">This will only take a moment</p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow animate-float">
                <Upload size={40} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles size={14} className="text-white" />
              </div>
            </div>
            
            <h3 className="font-oswald text-3xl font-bold text-slate-900 mb-4">
              Drop your PDF here or click to browse
            </h3>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              Transform your PDF into an editable DOCX document in seconds with professional quality results
            </p>
            
            <div className="flex items-center justify-center gap-8 text-slate-500">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                <span className="font-medium">PDF files only</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-green-600" />
                <span className="font-medium">Up to 50MB</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-purple-600" />
                <span className="font-medium">Lightning fast</span>
              </div>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-2xl mt-6 border border-red-200 animate-slide-up">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle size={18} className="text-red-600" />
          </div>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
            <Zap size={24} className="text-white" />
          </div>
          <h4 className="font-oswald font-semibold text-slate-900 mb-2">Lightning Fast</h4>
          <p className="text-slate-600 text-sm">High-quality PDF files convert faster and maintain better formatting</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4">
            <Shield size={24} className="text-white" />
          </div>
          <h4 className="font-oswald font-semibold text-slate-900 mb-2">100% Secure</h4>
          <p className="text-slate-600 text-sm">Text-based PDFs provide superior conversion results compared to scanned images</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4">
            <FileText size={24} className="text-white" />
          </div>
          <h4 className="font-oswald font-semibold text-slate-900 mb-2">Perfect Quality</h4>
          <p className="text-slate-600 text-sm">Your files are processed securely and automatically deleted after conversion</p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
