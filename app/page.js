'use client';

import { useState } from 'react';
import { ArrowRight, Shield, Zap, Download, CheckCircle, Star, Users, Clock, FileText, Sparkles } from 'lucide-react';
import FileUploader from './components/FileUploader';
import ConversionStatus from './components/ConversionStatus';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [conversionStatus, setConversionStatus] = useState(null);

  const handleFileUploaded = (fileInfo) => {
    setUploadedFile(fileInfo);
    setConversionStatus('uploaded');
  };

  const handleConversionComplete = () => {
    setConversionStatus('completed');
  };

  const handleReset = () => {
    setUploadedFile(null);
    setConversionStatus(null);
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Convert your PDFs to DOCX in seconds with our optimized processing engine."
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "Your files are processed securely and deleted automatically after conversion."
    },
    {
      icon: Download,
      title: "High Quality",
      description: "Maintain formatting, fonts, and layout integrity in your converted documents."
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: "No Registration Required",
      description: "Start converting immediately without creating an account or providing personal information."
    },
    {
      icon: Star,
      title: "Professional Results",
      description: "Get publication-ready DOCX files that maintain the original document's structure and formatting."
    },
    {
      icon: Users,
      title: "Trusted by Thousands",
      description: "Join over 50,000+ users who rely on our converter for their daily document needs."
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Convert your documents anytime, anywhere. Our service is always ready when you need it."
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Users" },
    { number: "1M+", label: "Files Converted" },
    { number: "99.9%", label: "Uptime" },
    { number: "< 30s", label: "Average Time" }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-sm font-medium text-blue-700 mb-8 animate-bounce-gentle">
              <Sparkles size={16} />
              <span>Transform PDFs to DOCX Instantly</span>
            </div>
            
            <h1 className="font-oswald text-5xl md:text-7xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text mb-6 animate-slide-up">
              Convert PDF to DOCX
              <br />
              <span className="text-slate-700">In Seconds</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Professional-grade PDF to DOCX conversion with perfect formatting preservation. 
              Fast, secure, and completely free to use.
            </p>
          </div>

          {/* Conversion Tool */}
          <div className="max-w-4xl mx-auto animate-slide-up">
            {!uploadedFile ? (
              <FileUploader onFileUploaded={handleFileUploaded} />
            ) : (
              <ConversionStatus
                file={uploadedFile}
                status={conversionStatus}
                onConversionComplete={handleConversionComplete}
                onReset={handleReset}
              />
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-oswald text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-oswald text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Choose Our Converter?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the fastest and most reliable PDF to DOCX conversion with enterprise-grade security.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="font-oswald text-2xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Professional Document Conversion Made Simple
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Our advanced conversion engine uses cutting-edge technology to ensure your PDF documents 
                are transformed into fully editable DOCX files while preserving every detail of the original formatting.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <benefit.icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                      <p className="text-slate-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-soft p-8 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <FileText size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">document.pdf</div>
                    <div className="text-sm text-slate-500">2.4 MB • 15 pages</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center py-8">
                  <ArrowRight size={32} className="text-blue-600 animate-pulse" />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FileText size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">document.docx</div>
                    <div className="text-sm text-green-600">✓ Converted successfully</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
