import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TEMPLATES } from './constants';
import { GeneratedImage, GenerationStatus } from './types';
import { generateImage } from './services/geminiService';
import { resizeImage, zipAndDownload } from './utils/imageUtils';
import ProgressBar from './components/ProgressBar';
import { AlertCircle, CheckCircle, Download, Image as ImageIcon, Loader2, Play, Pause, RefreshCw } from 'lucide-react';

const MAX_CONCURRENT_REQUESTS = 1; // Keep it safe for rate limits
const DELAY_BETWEEN_REQUESTS_MS = 2000; // Throttle to prevent 429

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('ALL');
  
  // Stats
  const completedCount = images.filter(i => i.status === 'completed').length;
  const failedCount = images.filter(i => i.status === 'failed').length;
  const totalCount = images.length;

  const processingRef = useRef(false);
  const queueRef = useRef<number[]>([]);

  // Initialize Queues based on constants
  useEffect(() => {
    const initialImages: GeneratedImage[] = [];
    
    Object.values(TEMPLATES).forEach(template => {
      template.subcategories.forEach(sub => {
        sub.keywords.forEach((keyword, index) => {
           initialImages.push({
             id: `${template.name}-${sub.name}-${index}`,
             template: template.name,
             category: sub.name,
             prompt: keyword,
             base64: '',
             status: 'pending'
           });
        });
      });
    });

    setImages(initialImages);
  }, []);

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    const findNextIndex = () => {
      return images.findIndex(img => img.status === 'pending' && (selectedTemplate === 'ALL' || img.template === selectedTemplate));
    };

    let nextIndex = findNextIndex();

    while (nextIndex !== -1 && status === 'running') {
      // Check if paused externally
      // We rely on the state variable 'status' but inside this async loop 
      // the closure might capture the old status.
      // So we use a functional update pattern or ref if we want live interruption.
      // For simplicity in React, we will break if we detect pause via a Ref check if needed,
      // but here we just check the loop condition on re-entry or use a ref for 'isRunning'.
      
      // Update status to generating
      setImages(prev => {
        const next = [...prev];
        next[nextIndex] = { ...next[nextIndex], status: 'generating' };
        return next;
      });

      const currentImg = images[nextIndex];

      try {
        // 1. Generate
        const rawBase64 = await generateImage(currentImg.prompt);
        
        // 2. Resize to 584x584 (2cm @ ~740dpi equivalent, or just strict pixel req)
        const resizedBase64 = await resizeImage(rawBase64, 584, 584);

        setImages(prev => {
          const next = [...prev];
          next[nextIndex] = { ...next[nextIndex], base64: resizedBase64, status: 'completed' };
          return next;
        });

      } catch (error) {
        setImages(prev => {
          const next = [...prev];
          next[nextIndex] = { 
            ...next[nextIndex], 
            status: 'failed', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
          return next;
        });
      }

      // Wait before next
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS_MS));
      
      // Re-evaluate next
      // We need to re-fetch the latest state or use a ref, but finding index by ID is safer
      // We just grab the fresh list index again from the top scope if possible, 
      // but inside useEffect/callback we need to be careful.
      // Actually, since we updated state, let's just break and let the useEffect trigger the next call?
      // No, that causes infinite loops easily. 
      // Better: local mutable copy or just re-find index from the prev state update logic?
      // Simplest: Just use the ref approach for the "queue" indices.
      
      // However, to keep it simple for this specific code block:
      // We will break the loop and rely on a `useEffect` that watches `status` and `images` 
      // to trigger the next one. This is "cleaner" in React than a while loop.
      break; 
    }

    processingRef.current = false;
  }, [images, selectedTemplate, status]);

  // The Worker Effect
  useEffect(() => {
    if (status === 'running' && !processingRef.current) {
        const hasPending = images.some(img => img.status === 'pending' && (selectedTemplate === 'ALL' || img.template === selectedTemplate));
        if (hasPending) {
            processQueue();
        } else {
            // If no pending, we might be done or filtered out
             const allDone = !images.some(img => img.status === 'pending' && (selectedTemplate === 'ALL' || img.template === selectedTemplate));
             if (allDone && totalCount > 0) {
                 setStatus('finished');
             }
        }
    }
  }, [status, images, selectedTemplate, processQueue, totalCount]);


  const handleStart = () => setStatus('running');
  const handlePause = () => setStatus('paused');
  const handleReset = () => {
     if(!window.confirm("Reset all progress?")) return;
     setStatus('idle');
     setImages(prev => prev.map(img => ({...img, status: 'pending', base64: '', error: undefined})));
  };

  const handleDownload = () => {
    zipAndDownload(images);
  };

  // Check API Key
  const [hasKey, setHasKey] = useState(!!process.env.API_KEY);
  useEffect(() => {
     // In a real scenario we might check window.aistudio.
     // Here we assume process.env as per instructions.
     if (!process.env.API_KEY) {
         console.warn("API Key missing in process.env");
         // For the sake of the generated app functioning if user adds it:
         setHasKey(!!process.env.API_KEY);
     }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">EduGen Image Batcher</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Generates 260 educational images (584x584px) for Environmental Pollution and Hygiene.
            Uses Gemini 2.5 Flash for rapid generation.
          </p>
          {!hasKey && (
             <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 inline-block">
                Warning: <code>process.env.API_KEY</code> is missing. Generation will fail.
             </div>
          )}
        </header>

        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            <div className="flex-1 w-full">
               <ProgressBar total={totalCount} current={completedCount} failures={failedCount} />
               <div className="mt-2 text-xs text-slate-500 flex justify-between">
                  <span>Target: {totalCount} Images (584x584px)</span>
                  <span>Status: {status.toUpperCase()}</span>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <select 
                 className="p-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                 value={selectedTemplate}
                 onChange={(e) => setSelectedTemplate(e.target.value)}
                 disabled={status === 'running'}
               >
                 <option value="ALL">All Templates</option>
                 <option value={TEMPLATES.TEMPLATE_1.name}>Template 1 (Pollution)</option>
                 <option value={TEMPLATES.TEMPLATE_2.name}>Template 2 (Hygiene)</option>
               </select>

               {status === 'running' ? (
                 <button onClick={handlePause} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                    <Pause size={18} /> Pause
                 </button>
               ) : (
                 <button 
                   onClick={handleStart} 
                   disabled={completedCount === totalCount}
                   className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${completedCount === totalCount ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                 >
                    <Play size={18} /> {status === 'paused' ? 'Resume' : 'Start Generation'}
                 </button>
               )}

               <button onClick={handleReset} className="p-2.5 text-slate-500 hover:text-red-600 transition-colors" title="Reset">
                 <RefreshCw size={20} />
               </button>

               <button 
                 onClick={handleDownload} 
                 disabled={completedCount === 0}
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${completedCount === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'}`}
               >
                  <Download size={18} /> Download ZIP
               </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images
            .filter(img => selectedTemplate === 'ALL' || img.template === selectedTemplate)
            .map((img) => (
            <div key={img.id} className="relative aspect-square bg-white rounded-lg border border-slate-200 overflow-hidden group">
               {img.base64 ? (
                 <>
                   <img src={img.base64} alt={img.prompt} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                     <p className="text-white text-xs text-center">{img.prompt}</p>
                   </div>
                   <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-sm">
                      <CheckCircle size={12} />
                   </div>
                 </>
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-400 bg-slate-50">
                    {img.status === 'generating' ? (
                       <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
                    ) : img.status === 'failed' ? (
                       <AlertCircle className="text-red-500 mb-2" size={24} />
                    ) : (
                       <ImageIcon size={24} className="mb-2 opacity-20" />
                    )}
                    <span className="text-[10px] text-center font-medium opacity-60 line-clamp-2">
                       {img.category}
                       <br/>
                       {img.prompt.slice(0, 15)}...
                    </span>
                 </div>
               )}
               {img.status === 'failed' && (
                  <div className="absolute bottom-0 w-full bg-red-50 text-red-600 text-[10px] p-1 text-center truncate">
                    Failed
                  </div>
               )}
               <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
                 {img.category}
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
