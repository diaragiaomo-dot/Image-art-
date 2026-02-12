import React from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImageModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `imaginai-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute top-4 right-4 z-10">
        <button 
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/50 text-white hover:bg-slate-700 transition-colors"
        >
            <X size={24} />
        </button>
      </div>
      
      <div className="relative max-w-7xl max-h-[90vh] flex flex-col items-center">
        <img 
            src={image.url} 
            alt={image.prompt} 
            className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
        />
        
        <div className="mt-6 w-full max-w-2xl bg-slate-900/80 p-6 rounded-2xl backdrop-blur-md border border-slate-700/50">
            <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-4">
                {image.prompt}
            </p>
            <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
                <div className="flex gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        {image.model.includes('pro') ? 'Gemini Pro' : 'Gemini Flash'}
                    </span>
                    <span>{image.aspectRatio}</span>
                </div>
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors text-sm"
                >
                    <Download size={16} />
                    Scarica
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};