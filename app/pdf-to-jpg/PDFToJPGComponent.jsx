'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, Image as ImageIcon, Archive } from 'lucide-react';
import NextImage from 'next/image';

export default function PDFToJPGComponent() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(0.92);
  const [scale, setScale] = useState(2);
  const [isClient, setIsClient] = useState(false);
  const [isZipCreating, setIsZipCreating] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      import('react-pdf').then((pdfjs) => {
        pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      });
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    const pdfFile = acceptedFiles.find((f) => f.type === 'application/pdf');
    if (pdfFile) {
      setImages([]);
      setProgress(0);
      setFile(pdfFile);
      const arrayBuffer = await pdfFile.arrayBuffer();
      const { pdfjs } = await import('react-pdf');
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setPageCount(pdf.numPages);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const convertToImages = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    setImages([]);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { pdfjs } = await import('react-pdf');
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const total = pdf.numPages;
      const result = [];

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
        const url = URL.createObjectURL(blob);
        result.push({ url, name: `${file.name.replace(/\.pdf$/i, '')}_page_${i}.jpg`, size: blob.size });
        setProgress(Math.round((i / total) * 100));
      }

      setImages(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadOne = async (item) => {
    const a = document.createElement('a');
    a.href = item.url;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllIndividually = async () => {
    for (let i = 0; i < images.length; i++) {
      await downloadOne(images[i]);
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  const downloadAsZip = async () => {
    if (images.length === 0) return;
    setIsZipCreating(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const resp = await fetch(item.url);
        const blob = await resp.blob();
        zip.file(item.name, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file?.name?.replace(/\.pdf$/i, '') || 'converted'}_jpg.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipCreating(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setImages([]);
    setPageCount(0);
    setProgress(0);
  };

  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return '—';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      {!file && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop PDF file here or click to upload</h3>
          <p className="text-gray-600 mb-4">Convert each page of your PDF into JPG images</p>
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">Select PDF File</div>
        </div>
      )}

      {file && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ImageIcon size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{file.name}</div>
                <div className="text-sm text-gray-500">{formatBytes(file.size)}{pageCount ? ` • ${pageCount} pages` : ''}</div>
              </div>
              <button onClick={clearFile} className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">Change File</button>
            </div>

            {images.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">Converted {images.length} image{images.length !== 1 ? 's' : ''}</div>
                  <div className="flex items-center gap-2">
                    <button onClick={downloadAllIndividually} className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-medium">Download All</button>
                    <button onClick={downloadAsZip} disabled={isZipCreating} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold inline-flex items-center gap-2">
                      {isZipCreating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Creating ZIP
                        </>
                      ) : (
                        <>
                          <Archive size={16} />
                          Download as ZIP
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="relative aspect-3/4 bg-gray-50 rounded-md overflow-hidden mb-3">
                        <NextImage src={img.url} alt={img.name} fill className="object-contain" />
                      </div>
                      <div className="text-sm text-gray-700 mb-2 truncate">{img.name}</div>
                      <div className="text-xs text-gray-500 mb-3">{formatBytes(img.size)}</div>
                      <button onClick={() => downloadOne(img)} className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium rounded-lg">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center">
                {isProcessing ? (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                    Converting... {progress}%
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No images yet</div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Convert</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                <input type="range" min="0.5" max="1" step="0.02" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full" />
                <div className="text-xs text-gray-500 mt-1">{Math.round(quality * 100)}%</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                <input type="range" min="1" max="3" step="0.25" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full" />
                <div className="text-xs text-gray-500 mt-1">x{scale}</div>
              </div>
              <button onClick={convertToImages} disabled={isProcessing || !file} className="w-full mt-2 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Converting
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Convert to JPG
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}