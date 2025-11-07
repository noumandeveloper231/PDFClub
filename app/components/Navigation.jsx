'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Home, Info, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const Navigation = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return pathname === path;
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: Info },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/50 px-4 py-4 lg:px-8 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 font-oswald font-bold text-2xl text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text hover:scale-105 transition-transform duration-200">
          <Image src="/logo.webp" alt="Logo" width={40} height={40} />
          <span>PDF Club</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link 
              key={href}
              href={href} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive(href) 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-glow transform scale-105' 
                  : 'text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:scale-105'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-soft animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link 
                key={href}
                href={href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive(href) 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
