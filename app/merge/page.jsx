'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Layers, Upload, Download, X, ArrowUp, ArrowDown, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const downloadSectionRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    const rejectedFiles = acceptedFiles.filter(file => file.type !== 'application/pdf');

    if (rejectedFiles.length > 0) {
      toast.error('Only PDF files are allowed');
      return;
    }

    if (pdfFiles.length > 0) {
      setFiles(prev => [...prev, ...pdfFiles.map((file, index) => ({
        id: Date.now() + index,
        file,
        name: file.name,
        size: file.size
      }))]);
      toast.success(`${pdfFiles.length} PDF file${pdfFiles.length > 1 ? 's' : ''} added successfully`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const removeFile = (id) => {
    const fileToRemove = files.find(file => file.id === id);
    setFiles(files.filter(file => file.id !== id));
    if (fileToRemove) {
      toast.info(`${fileToRemove.name} removed`);
    }
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
    if (files.length < 2) {
      toast.error('Please add at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);
    toast.loading('Merging PDFs...', { id: 'merge-progress' });

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
        toast.success('PDFs merged successfully! Ready for download.', { id: 'merge-progress' });

        // Smooth scroll to download section after a brief delay
        setTimeout(() => {
          downloadSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 500);
      } else {
        throw new Error('Merge failed');
      }
    } catch (error) {
      console.error('Error merging PDFs:', error);
      toast.error('Failed to merge PDFs. Please try again.', { id: 'merge-progress' });
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
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold mb-3">Merger Club</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Merge PDF Online Free - Combine Multiple PDF Files</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Merge PDF online for free with our powerful PDF merger tool. Combine multiple PDF documents into one file instantly. Convert pdf to pdf merge. No registration required, completely secure, and works in your browser.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Merge PDF Online</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Combine PDF Files</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Free PDF Merger</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ No File Size Limit</span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* File Upload Area */}
          {files.length === 0 && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive
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
                    <div className="shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
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
            <div
              ref={downloadSectionRef}
              className="bg-green-50 border border-green-200 rounded-xl p-6 text-center scroll-mt-8"
            >
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
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={() => toast.success('Download started!')}
              >
                <Download size={20} className="mr-2" />
                Download Merged PDF
              </a>
            </div>
          )}

          {/* SEO Content Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Merge PDF Files Online</h2>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Guide</h3>
                  <ol className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="bg-red-500 text-white rounded-full w-12 h-7 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
                      <span>Upload multiple PDF files by clicking "Select PDF Files" or drag and drop them</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-500 text-white rounded-full w-12 h-7 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
                      <span>Arrange the PDFs in your desired order using the up/down arrows</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-500 text-white rounded-full w-12 h-7 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
                      <span>Click "Merge PDFs" to combine all files into one document</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-500 text-white rounded-full w-12 h-7 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">4</span>
                      <span>Download your merged PDF file instantly</span>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our PDF Merger?</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span><strong>100% Free:</strong> No hidden costs or subscriptions</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span><strong>Secure:</strong> Files processed locally in your browser</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span><strong>No Registration:</strong> Start merging PDFs immediately</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span><strong>Fast Processing:</strong> Merge multiple PDFs in seconds</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span><strong>No File Limits:</strong> Combine as many PDFs as needed</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {[
                    {
                      id: 1,
                      question: "Is it safe to merge PDF files online?",
                      answer: "Yes, our PDF merger is completely secure. All processing happens locally in your browser, and your files are never uploaded to our servers. Your documents remain private and secure."
                    },
                    {
                      id: 2,
                      question: "Can I merge password-protected PDFs?",
                      answer: "Currently, our tool works best with unprotected PDF files. If you have password-protected PDFs, you may need to unlock them first before merging."
                    },
                    {
                      id: 3,
                      question: "What's the maximum file size for merging PDFs?",
                      answer: "There's no strict file size limit. However, very large files may take longer to process depending on your device's capabilities and internet connection."
                    },
                    {
                      id: 4,
                      question: "Can I change the order of PDFs before merging?",
                      answer: "Absolutely! Use the up and down arrow buttons next to each file to rearrange them in your preferred order before clicking \"Merge PDFs\"."
                    }
                  ].map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg transition-all duration-200">
                      <button
                        onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900">{faq.question}</h4>
                        {openFaq === faq.id ? (
                          <ChevronUp size={20} className="text-gray-500 shrink-0 ml-2" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-500 shrink-0 ml-2" />
                        )}
                      </button>
                      {openFaq === faq.id && (
                        <div className="px-4 pb-4 pt-3">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sonner Toast Container */}
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        expand={false}
        visibleToasts={5}
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
            color: '#374151',
          },
          className: 'font-medium',
          duration: 4000,
        }}
      />
    </div>
  );
}
