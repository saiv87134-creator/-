import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Sparkles, FileImage } from 'lucide-react';

interface UploadZoneProps {
  coverImage: string;
  onCoverImageChange: (url: string, isTemplate?: boolean) => void;
  onAlertMessage?: (msg: string) => void;
}

export default function UploadZone({ coverImage, onCoverImageChange, onAlertMessage }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template pre-configured high-quality illustration links
  const templatePix = {
    ai: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    code: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    stats: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    cyber: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800'
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      if (onAlertMessage) onAlertMessage('Please select a valid image file (PNG, JPG, or WEBP)');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      if (onAlertMessage) onAlertMessage('Image file is too large. Maximum size budget is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onCoverImageChange(event.target.result as string, false);
      }
    };
    reader.readAsDataURL(file);
  };

  const selectTemplate = (key: keyof typeof templatePix) => {
    onCoverImageChange(templatePix[key], true);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onCoverImageChange(urlInput.trim(), false);
      setUrlInput('');
      setUseUrlMode(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    onCoverImageChange('', false);
  };

  const isTemplateActive = (url: string) => {
    return Object.values(templatePix).includes(url);
  };

  return (
    <div className="space-y-4" id="upload-zone-container">
      <div className="flex items-center justify-between">
        <label className="text-white text-md font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-400" />
          Article Cover Layout
        </label>
        <button
          type="button"
          onClick={() => setUseUrlMode(!useUrlMode)}
          className="text-xs text-indigo-300 hover:text-white transition duration-200 flex items-center gap-1 bg-[#1E2D4E] hover:bg-[#253961] py-1 px-2.5 rounded-md cursor-pointer"
        >
          {useUrlMode ? (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Direct File Upload</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Reference External URL</span>
            </>
          )}
        </button>
      </div>

      {useUrlMode ? (
        <form onSubmit={handleUrlSubmit} className="space-y-2 text-left">
          <label className="block text-slate-300 text-xs font-semibold">
            Unsplash or absolute direct image URL:
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 bg-[#1D2E4D] border border-[#2D3E5D] rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg transition duration-200 font-medium cursor-pointer shrink-0"
            >
              Apply Image Link
            </button>
          </div>
        </form>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={coverImage ? undefined : triggerFileInput}
          className={`relative border-2 border-dashed rounded-xl p-6 transition duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[160px] ${
            dragActive
              ? 'border-indigo-400 bg-indigo-950/20'
              : coverImage
              ? 'border-emerald-500 bg-[#162744]/40 hover:border-emerald-400'
              : 'border-[#2D3E5D] bg-[#111C30] hover:border-indigo-400 hover:bg-[#13213A]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {coverImage ? (
            <div className="w-full flex flex-col items-center gap-3">
              <div className="relative group rounded-lg overflow-hidden border border-[#2D3E5D] max-h-48 w-full flex justify-center bg-black/30">
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="object-cover max-h-48 rounded"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}
                    className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-500 text-white transition cursor-pointer"
                    title="Replace Image"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="p-2 bg-rose-600 rounded-full hover:bg-rose-500 text-white transition cursor-pointer"
                    title="Remove Image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full text-xs text-slate-300 px-1">
                <span className="flex items-center gap-1 text-emerald-400 font-sans">
                  <FileImage className="w-3.5 h-3.5" />
                  Cover image successfully attached
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5 cursor-pointer font-sans font-semibold"
                >
                  Remove Cover
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2 pointer-events-none font-sans">
              <div className="p-3 bg-[#1B2944] rounded-full inline-flex text-indigo-400">
                <Upload className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-medium text-sm">
                  Drag and drop cover graphic here, or click to browse local devices
                </p>
                <p className="text-slate-400 text-xs text-center">
                  PNG, JPG, or WEBP (Standard absolute formats, Max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick templates section */}
      <div className="space-y-2 text-left">
        <label className="block text-xs text-slate-300 font-semibold font-sans">
          Dynamic Mock Illustration Presets:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => selectTemplate('ai')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition duration-200 cursor-pointer ${
              coverImage === templatePix.ai
                ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500 font-sans'
                : 'border-[#2D3E5D] bg-[#111C30] text-slate-300 hover:bg-[#162744] hover:text-white font-sans'
            }`}
          >
            <span>🧠</span>
            <span>Gen AI</span>
          </button>
          
          <button
            type="button"
            onClick={() => selectTemplate('code')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition duration-200 cursor-pointer ${
              coverImage === templatePix.code
                ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500 font-sans'
                : 'border-[#2D3E5D] bg-[#111C30] text-slate-300 hover:bg-[#162744] hover:text-white font-sans'
            }`}
          >
            <span>💻</span>
            <span>Dev Structures</span>
          </button>

          <button
            type="button"
            onClick={() => selectTemplate('stats')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition duration-200 cursor-pointer ${
              coverImage === templatePix.stats
                ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500 font-sans'
                : 'border-[#2D3E5D] bg-[#111C30] text-slate-300 hover:bg-[#162744] hover:text-white font-sans'
            }`}
          >
            <span>📊</span>
            <span>Analytics Charts</span>
          </button>

          <button
            type="button"
            onClick={() => selectTemplate('cyber')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition duration-200 cursor-pointer ${
              coverImage === templatePix.cyber
                ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500 font-sans'
                : 'border-[#2D3E5D] bg-[#111C30] text-slate-300 hover:bg-[#162744] hover:text-white font-sans'
            }`}
          >
            <span>🔒</span>
            <span>Security</span>
          </button>
        </div>
      </div>
    </div>
  );
}
