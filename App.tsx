import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GeneratedImage, AspectRatio, ModelType, ImageSize } from './types';
import { generateImage, checkApiKeySelection, promptForKeySelection } from './services/geminiService';
import { Controls } from './components/Controls';
import { Button } from './components/Button';
import { ImageModal } from './components/ImageModal';
import { Wand2, Image as ImageIcon, AlertCircle, Info } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.Square);
  const [model, setModel] = useState<ModelType>(ModelType.Flash);
  const [size, setSize] = useState<ImageSize>(ImageSize.Size1K);
  
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [needsApiKey, setNeedsApiKey] = useState<boolean>(false);

  // Check API key requirements on mount
  useEffect(() => {
    // We can do an initial check, but strictly we handle it when user tries to generate
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
        setError('Inserisci una descrizione per generare l\'immagine.');
        return;
    }

    setIsGenerating(true);
    setError(null);
    setNeedsApiKey(false);

    try {
        // If Pro model, enforce strict key selection
        if (model === ModelType.Pro) {
            const hasKey = await checkApiKeySelection();
            if (!hasKey) {
                // If no key selected, we must prompt user.
                // We show a UI state that asks them to connect.
                setNeedsApiKey(true);
                setIsGenerating(false);
                return;
            }
        }

        const urls = await generateImage({
            prompt,
            model,
            aspectRatio,
            size
        });

        const newImages: GeneratedImage[] = urls.map(url => ({
            id: uuidv4(),
            url,
            prompt,
            aspectRatio,
            model,
            timestamp: Date.now()
        }));

        setImages(prev => [...newImages, ...prev]);
    } catch (err: any) {
        console.error(err);
        if (err.message === "KEY_ERROR") {
             setNeedsApiKey(true);
        } else {
             setError(err.message || "Si è verificato un errore durante la generazione.");
        }
    } finally {
        setIsGenerating(false);
    }
  };

  const handleConnectKey = async () => {
      try {
          await promptForKeySelection();
          // After selection, retry generation immediately or let user click generate
          setNeedsApiKey(false);
          // Optional: Auto-retry could be implemented here
      } catch (e) {
          console.error("Failed to select key", e);
      }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Wand2 size={18} className="text-white" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    ImaginAI
                </h1>
            </div>
            <div className="text-xs font-medium px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-400">
                Powered by Gemini
            </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center pt-8 pb-20 px-4 sm:px-6">
        
        {/* Hero & Controls */}
        <div className="w-full max-w-4xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500">
                    Trasforma le parole in arte.
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Crea immagini fotorealistiche o artistiche in pochi secondi utilizzando i modelli di intelligenza artificiale più avanzati di Google.
                </p>
            </div>

            <Controls 
                prompt={prompt}
                setPrompt={setPrompt}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                model={model}
                setModel={setModel}
                size={size}
                setSize={setSize}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
            />

            <div className="mt-8 flex justify-center">
                {needsApiKey ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col items-center gap-3 max-w-md">
                        <div className="flex items-center gap-2 text-amber-400">
                            <AlertCircle size={20} />
                            <span className="font-semibold">Autorizzazione Richiesta</span>
                        </div>
                        <p className="text-sm text-center text-slate-300">
                            Per utilizzare il modello Pro ad alta definizione, è necessario collegare il tuo account Google Cloud con fatturazione attiva.
                        </p>
                        <Button onClick={handleConnectKey} variant="primary" className="w-full bg-amber-600 hover:bg-amber-500 shadow-amber-900/20">
                            Connetti Account Google
                        </Button>
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-400 underline">
                            Informazioni sui costi
                        </a>
                    </div>
                ) : (
                    <Button 
                        onClick={handleGenerate} 
                        isLoading={isGenerating}
                        className="w-full md:w-auto md:min-w-[200px] text-lg py-4 rounded-2xl"
                        variant="primary"
                        icon={<SparklesIcon className={isGenerating ? "animate-pulse" : ""} />}
                    >
                        {isGenerating ? "Creazione in corso..." : "Genera Immagine"}
                    </Button>
                )}
            </div>
            
            {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="shrink-0" size={20} />
                    <p>{error}</p>
                </div>
            )}
        </div>

        {/* Gallery */}
        <div className="w-full max-w-7xl">
             {images.length > 0 && (
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <ImageIcon size={20} className="text-indigo-400" />
                        Galleria Recente
                    </h3>
                    <span className="text-sm text-slate-500">{images.length} creazioni</span>
                </div>
             )}

             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {images.map((img) => (
                    <div 
                        key={img.id}
                        onClick={() => setSelectedImage(img)}
                        className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 cursor-pointer hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
                    >
                        <img 
                            src={img.url} 
                            alt={img.prompt} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <p className="text-white text-xs line-clamp-2 font-medium">
                                {img.prompt}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-slate-300">
                                    {img.model.includes('pro') ? 'PRO' : 'FLASH'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
             </div>

             {images.length === 0 && !isGenerating && !needsApiKey && (
                 <div className="text-center py-20 text-slate-600">
                     <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wand2 size={32} className="text-slate-500 opacity-50" />
                     </div>
                     <p>Le tue creazioni appariranno qui.</p>
                 </div>
             )}
        </div>
      </main>

      <ImageModal 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
);

export default App;