import React from 'react';
import { AspectRatio, ModelType, ImageSize } from '../types';
import { Settings2, Sparkles, Monitor, Square, Smartphone } from 'lucide-react';

interface ControlsProps {
  prompt: string;
  setPrompt: (value: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (value: AspectRatio) => void;
  model: ModelType;
  setModel: (value: ModelType) => void;
  size: ImageSize;
  setSize: (value: ImageSize) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  model,
  setModel,
  size,
  setSize,
  onGenerate,
  isGenerating
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Descrivi l'immagine che vuoi creare... (es. Un paesaggio futuristico cyberpunk al tramonto)"
          className="w-full h-32 px-5 py-4 text-lg bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400 resize-none transition-all shadow-xl backdrop-blur-sm"
          disabled={isGenerating}
        />
        <div className="absolute bottom-3 right-3 text-xs text-slate-500">
            {prompt.length} caratteri
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model Selection */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-3 text-slate-300 font-medium text-sm">
                <Sparkles size={16} className="text-indigo-400" />
                <span>Modello AI</span>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={() => setModel(ModelType.Flash)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
                        model === ModelType.Flash 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                    Standard
                </button>
                <button
                    onClick={() => setModel(ModelType.Pro)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
                        model === ModelType.Pro 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                    Pro (HD)
                </button>
            </div>
        </div>

        {/* Aspect Ratio */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-3 text-slate-300 font-medium text-sm">
                <Settings2 size={16} className="text-indigo-400" />
                <span>Formato</span>
            </div>
            <div className="flex space-x-1">
                {[
                    { val: AspectRatio.Square, icon: <Square size={16} />, label: "1:1" },
                    { val: AspectRatio.Landscape, icon: <Monitor size={16} />, label: "16:9" },
                    { val: AspectRatio.Portrait, icon: <Smartphone size={16} />, label: "9:16" }
                ].map((opt) => (
                    <button
                        key={opt.val}
                        onClick={() => setAspectRatio(opt.val)}
                        className={`flex-1 py-2 rounded-lg text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                            aspectRatio === opt.val 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                        title={opt.label}
                    >
                        {opt.icon}
                        <span>{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Resolution (Only for Pro) */}
        <div className={`bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm transition-opacity ${model !== ModelType.Pro ? 'opacity-50 pointer-events-none' : ''}`}>
             <div className="flex items-center space-x-2 mb-3 text-slate-300 font-medium text-sm">
                <span className="text-indigo-400 font-bold text-xs border border-indigo-400 rounded px-1">HD</span>
                <span>Risoluzione</span>
            </div>
            <div className="flex space-x-2">
                {[ImageSize.Size1K, ImageSize.Size2K, ImageSize.Size4K].map((s) => (
                    <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                            size === s
                            ? 'bg-purple-600 text-white' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};