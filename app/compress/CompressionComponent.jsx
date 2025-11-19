'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
    Upload,
    FileText,
    CheckCircle2,
    Download,
    RotateCw,
    ChevronRight,
    Shield,
    Wand2,
    Scissors,
    Layers,
    Trash,
} from 'lucide-react';

import toast from 'react-hot-toast';

const Document = dynamic(() => import('react-pdf').then(mod => ({ default: mod.Document })), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center gap-3 text-slate-500">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin"></div>
            <p className="text-sm">Preparing preview...</p>
        </div>
    ),
});

const Page = dynamic(() => import('react-pdf').then(mod => ({ default: mod.Page })), {
    ssr: false,
});

const LEVELS = [
    {
        id: 'extreme',
        title: 'Extreme compression',
        badge: 'Less quality, high compression',
        description: 'Smallest size. Best for emailing or archiving when size matters most.',
        accent: 'bg-red-500/10 text-red-600 border-red-200',
    },
    {
        id: 'recommended',
        title: 'Recommended compression',
        badge: 'Good quality, good compression',
        description: 'Balanced results that keep text crisp while shrinking file size significantly.',
        accent: 'bg-green-500/10 text-green-600 border-green-200',
        default: true,
    },
    {
        id: 'gentle',
        title: 'Less compression',
        badge: 'High quality, less compression',
        description: 'Preserves images and graphics with minimal quality loss.',
        accent: 'bg-blue-500/10 text-blue-600 border-blue-200',
    },
];

const CONTINUE_TO = [
    { href: '/merge', label: 'Merge PDF', icon: Layers },
    { href: '/split', label: 'Split PDF', icon: Scissors },
    { href: '/settings', label: 'Add watermark', icon: Wand2 },
    { href: '/settings', label: 'Add page numbers', icon: FileText },
    { href: '/settings', label: 'Rotate PDF', icon: RotateCw },
    { href: '/settings', label: 'Protect PDF', icon: Shield },
];

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return '—';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const calculateSavings = (original, compressed) => {
    if (!original || !compressed) return 0;
    if (compressed > original) return 0;
    return Math.round(((original - compressed) / original) * 100);
};

const CompressionComponent = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, ready, compressing, success, error
    const [selectedLevel, setSelectedLevel] = useState(
        LEVELS.find((level) => level.default)?.id ?? LEVELS[0].id,
    );
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('react-pdf').then((pdfjs) => {
                pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
            });
        }
    }, []);

    useEffect(() => {
        if (status === 'compressing') {
            setProgress(10);
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 95) return prev;
                    return Math.min(prev + Math.random() * 15, 95);
                });
            }, 600);
            return () => clearInterval(interval);
        }

        if (status === 'success') {
            setProgress(100);
        } else {
            setProgress(0);
        }
    }, [status]);

    useEffect(() => {
        return () => {
            if (result?.downloadUrl) {
                URL.revokeObjectURL(result.downloadUrl);
            }
        };
    }, [result?.downloadUrl]);

    const validateFile = (incomingFile) => {
        if (!incomingFile) return false;

        if (incomingFile.type !== 'application/pdf') {
            toast.error('Please upload a PDF file');
            return false;
        }

        if (incomingFile.size > MAX_SIZE) {
            toast.error('File size must be under 50MB');
            return false;
        }

        return true;
    };

    const resetResultUrl = () => {
        setResult((prev) => {
            if (prev?.downloadUrl) {
                URL.revokeObjectURL(prev.downloadUrl);
            }
            return null;
        });
    };

    const handleFileSelection = (event) => {
        const chosenFile = event.target.files?.[0];
        if (!validateFile(chosenFile)) return;

        resetResultUrl();
        setFile(chosenFile);
        setPreviewUrl(URL.createObjectURL(chosenFile));
        setStatus('ready');
        setError(null);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const chosenFile = event.dataTransfer.files?.[0];
        if (!validateFile(chosenFile)) return;

        resetResultUrl();
        setFile(chosenFile);
        setStatus('ready');
        setError(null);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const removeFile = () => {
        resetResultUrl();
        setFile(null);
        setStatus('idle');
        setError(null);
        setProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setPreviewUrl(null);
    };

    const compressPdf = async () => {
        if (!file) {
            toast.error('Select a PDF to compress');
            return;
        }

        try {
            setStatus('compressing');
            setError(null);
            resetResultUrl();

            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('level', selectedLevel);

            const response = await fetch('/api/compress', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Compression failed. Please try again.');
            }

            const arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: "application/pdf" });

            const downloadUrl = URL.createObjectURL(blob);
            const originalSizeHeader = Number(response.headers.get('X-Original-Size'));
            const compressedHeader = Number(response.headers.get('X-Compressed-Size'));

            const originalSize = Number.isFinite(originalSizeHeader)
                ? originalSizeHeader
                : file.size;

            const compressedSize = Number.isFinite(compressedHeader)
                ? compressedHeader
                : blob.size;

            setResult({
                downloadUrl,
                originalSize,
                compressedSize,
                savedPercentage: calculateSavings(originalSize, compressedSize),
            });

            setStatus('success');
            toast.success('PDF compressed successfully');

        } catch (err) {
            console.error(err);
            setStatus('error');
            setError(err.message || 'Something went wrong during compression.');
            toast.error('Failed to compress PDF');
        }
    };


    const handleDownload = () => {
        if (!result?.downloadUrl) return;

        const anchor = document.createElement('a');
        anchor.href = result.downloadUrl;
        anchor.download = `${file?.name?.replace(/\.pdf$/i, '') || 'document'}-compressed.pdf`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

    const renderDropZone = () => (
        <div
            className="h-full border-2 border-dashed border-slate-300 rounded-xl cursor-pointer p-12 flex flex-col items-center justify-center text-center bg-white/80 backdrop-blur-sm shadow-soft hover:border-green-500 hover:transition-all"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
        >
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop PDF file here or click to upload
            </h3>
            <p className="text-gray-600 mb-4">
                Upload multiple PDF file to compress them into one document
            </p>
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                Select PDF Files
            </div>
            <p className="text-sm text-slate-400 mt-4">Max size: 50MB</p>
        </div>
    );

    const renderPreviewPanel = () => (
        <div className="relative bg-white rounded-3xl border border-slate-200 shadow-soft flex flex-col h-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">Selected file</p>
                    <p className="font-semibold text-slate-900">{file?.name}</p>
                </div>
                <button className="cursor-pointer text-sm text-slate-400 hover:text-red-500" onClick={removeFile}>
                    <Trash size={20} />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
                {status === 'success' ? (
                    <div className="w-full max-w-xl flex flex-col items-center gap-6">
                        <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-inner overflow-hidden">
                            <Document file={result?.downloadUrl} className="w-full">
                                <Page pageNumber={1} width={420} renderAnnotationLayer={false} renderTextLayer={false} />
                            </Document>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative w-36 h-36">
                                <svg viewBox="0 0 36 36" className="w-full h-full">
                                    <path
                                        className="text-slate-100"
                                        strokeWidth="4"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    ></path>
                                    <path
                                        className="text-red-500"
                                        strokeWidth="4"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={`${result?.savedPercentage}, 100`}
                                        d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    ></path>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-3xl font-bold text-slate-900">{result?.savedPercentage}%</p>
                                    <p className="text-xs uppercase tracking-wide text-slate-400">Saved</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 text-center max-w-xs">
                                Your PDF is now {result?.savedPercentage}% smaller – download it or continue with other tools.
                            </p>
                        </div>
                    </div>
                ) : previewUrl ? (
                    <div className="w-full max-w-xl flex flex-col items-center gap-6">
                        <div className="w-full bg-slate-50 rounded-2xl border border-slate-100 shadow-inner min-h-[420px] flex items-center justify-center">
                            <Document file={previewUrl} className="w-full flex justify-center">
                                <Page pageNumber={1} width={420} renderAnnotationLayer={false} renderTextLayer={false} />
                            </Document>
                        </div>
                        {status === 'compressing' && (
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative w-24 h-24">
                                    <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                                    <div
                                        className="absolute inset-0 border-8 border-red-500 border-t-transparent rounded-full animate-spin"
                                    ></div>
                                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-red-500">
                                        {progress.toFixed(0)}%
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500">Compressing PDF...</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-slate-400">
                        <FileText size={48} className="mx-auto mb-4" />
                        <p className="text-lg font-semibold">Upload a PDF to preview</p>
                        <p className="text-sm">Your first page preview will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileSelection}
            />

            <div className={`grid ${file ? 'lg:grid-cols-[2fr_1fr]' : 'grid-cols-1'} gap-8 items-start`}>
                <div className="min-h-[600px]">
                    {file ? renderPreviewPanel() : renderDropZone()}
                </div>

                <div className="space-y-5">
                    {
                        file &&
                        <>
                            <div className="bg-white rounded-md border border-slate-200 shadow-soft">
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide p-4">Compression level</p>
                                <div className="">
                                    {LEVELS.map((level) => (
                                        <button
                                            key={level.id}
                                            className={`w-full text-left border p-4 transition-all ${selectedLevel === level.id
                                                ? `${level.accent} shadow-[0_10px_30px_rgba(0,0,0,0.05)]`
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                            onClick={() => setSelectedLevel(level.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-slate-900">{level.title}</p>
                                                </div>
                                                {selectedLevel === level.id && (
                                                    <CheckCircle2 className="text-green-500" size={24} />
                                                )}
                                            </div>
                                            <p
                                                className={`text-xs font-semibold uppercase tracking-wide mt-3 ${level.id === 'extreme' ? 'text-red-500' : 'text-slate-500'
                                                    }`}
                                            >
                                                {level.badge}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
                                <div className="space-y-3 text-sm text-slate-600">
                                    <p className="flex items-center justify-between"><span>File size:</span> <span className="font-semibold">{formatBytes(file?.size)}</span></p>
                                    <p className="flex items-center justify-between"><span>Level:</span> <span className="font-semibold text-slate-900 capitalize">{selectedLevel}</span></p>
                                    <p className="flex items-center justify-between"><span>Status:</span> <span className="font-semibold text-slate-900">{status === 'compressing' ? 'Compressing' : status === 'success' ? 'Done' : 'Ready'}</span></p>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
                                <div className="flex items-center gap-3 justify-end">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-3 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:border-slate-300"
                                    >
                                        Choose another file
                                    </button>
                                    <button
                                        onClick={status === 'success' ? handleDownload : compressPdf}
                                        disabled={!file || status === 'compressing'}
                                        className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-white font-semibold transition-colors ${status === 'success'
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-red-500 hover:bg-red-600 disabled:bg-red-300'
                                            }`}
                                    >
                                        {status === 'success' ? (
                                            <>
                                                <Download size={18} /> Download PDF
                                            </>
                                        ) : status === 'compressing' ? (
                                            <>
                                                <RotateCw className="animate-spin" size={18} /> Compressing...
                                            </>
                                        ) : (
                                            <>
                                                <CompressIcon /> Compress PDF
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    }


                </div>
            </div>



            {status === 'success' && (
                <section className="mt-16">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                            <div>
                                <p className="text-sm uppercase text-slate-500 mb-2">Continue to...</p>
                                <h2 className="text-2xl font-semibold text-slate-900">Do more with your PDF</h2>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <Shield size={18} />
                                Work offline and enjoy batch tools with PDFClub Desktop (coming soon)
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            {CONTINUE_TO.map(({ href, label, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="flex items-center justify-between border border-slate-200 rounded-2xl p-4 hover:border-red-400 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                            <Icon size={22} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{label}</p>
                                            <p className="text-xs text-slate-500">Open tool</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-slate-400" size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}


function CompressIcon(props) {
    return <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <path d="M7 10h10" strokeLinecap="round" />
        <path d="M5 6h14" strokeLinecap="round" />
        <path d="M9 14h6" strokeLinecap="round" />
        <path d="M12 18v4" strokeLinecap="round" />
        <path d="M9 22h6" strokeLinecap="round" />
        <path d="M12 2v4" strokeLinecap="round" />
        <path d="M9 2h6" strokeLinecap="round" />
    </svg>;
}


export default CompressionComponent