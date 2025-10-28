'use client';

import { useState } from 'react';
import { Save, RefreshCw, Trash2, Download } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    autoDownload: false,
    deleteAfterDownload: true,
    compressionLevel: 'medium',
    notificationsEnabled: true,
    theme: 'light'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('pdfConverterSettings', JSON.stringify(settings));
      setIsSaving(false);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      autoDownload: false,
      deleteAfterDownload: true,
      compressionLevel: 'medium',
      notificationsEnabled: true,
      theme: 'light'
    };
    setSettings(defaultSettings);
    setSaveMessage('Settings reset to defaults');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all conversion history?')) {
      localStorage.removeItem('conversionHistory');
      setSaveMessage('Conversion history cleared');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-lg text-slate-600">Customize your PDF conversion experience</p>
      </header>

      <div className="max-w-2xl mx-auto">
        <section className="bg-white p-8 rounded-xl border border-slate-200 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Conversion Settings</h2>
          
          <div className="mb-8">
            <label className="flex items-center gap-3 font-medium text-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoDownload}
                onChange={(e) => handleSettingChange('autoDownload', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span>Auto-download converted files</span>
            </label>
            <p className="text-slate-600 text-sm mt-2 ml-8">
              Automatically start downloading files when conversion is complete
            </p>
          </div>

          <div className="mb-8">
            <label className="flex items-center gap-3 font-medium text-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.deleteAfterDownload}
                onChange={(e) => handleSettingChange('deleteAfterDownload', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span>Delete files after download</span>
            </label>
            <p className="text-slate-600 text-sm mt-2 ml-8">
              Remove files from server immediately after downloading
            </p>
          </div>

          <div className="mb-8">
            <label className="flex items-center justify-between gap-3 font-medium text-slate-900">
              <span>Compression Level</span>
              <select
                value={settings.compressionLevel}
                onChange={(e) => handleSettingChange('compressionLevel', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low (Better quality)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Smaller file size)</option>
              </select>
            </label>
            <p className="text-slate-600 text-sm mt-2 ml-8">
              Choose the balance between file size and quality
            </p>
          </div>
        </section>

        <section className="bg-white p-8 rounded-xl border border-slate-200 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Interface Settings</h2>
          
          <div className="mb-8">
            <label className="flex items-center gap-3 font-medium text-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span>Enable notifications</span>
            </label>
            <p className="text-slate-600 text-sm mt-2 ml-8">
              Show browser notifications when conversion is complete
            </p>
          </div>

          <div className="mb-8">
            <label className="flex items-center justify-between gap-3 font-medium text-slate-900">
              <span>Theme</span>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </label>
            <p className="text-slate-600 text-sm mt-2 ml-8">
              Choose your preferred color theme
            </p>
          </div>
        </section>

        <section className="bg-white p-8 rounded-xl border border-slate-200 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Data Management</h2>
          
          <div className="mb-8">
            <button 
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              onClick={handleClearHistory}
            >
              <Trash2 size={16} />
              Clear Conversion History
            </button>
            <p className="text-slate-600 text-sm mt-2">
              Remove all locally stored conversion history
            </p>
          </div>

          <div className="mb-8">
            <button className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3 rounded-lg font-medium transition-colors duration-200 border border-slate-200">
              <Download size={16} />
              Export Settings
            </button>
            <p className="text-slate-600 text-sm mt-2">
              Download your settings as a backup file
            </p>
          </div>
        </section>

        <div className="flex gap-4 justify-center mb-8">
          <button 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Settings
              </>
            )}
          </button>

          <button 
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3 rounded-lg font-medium transition-colors duration-200 border border-slate-200"
            onClick={handleResetSettings}
          >
            <RefreshCw size={16} />
            Reset to Defaults
          </button>
        </div>

        {saveMessage && (
          <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
}
