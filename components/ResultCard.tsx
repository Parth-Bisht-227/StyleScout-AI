import React, { useState } from 'react';
import { StyleRecommendation } from '../types';
import { Info, ImageOff, Maximize2, X } from 'lucide-react';

interface ResultCardProps {
  recommendation: StyleRecommendation;
  type: 'hair' | 'beard';
}

// Map of style keywords to LOCAL image paths
// Using local paths with 'public/' prefix as requested.
const STYLE_IMAGES: Record<string, string> = {
  // --- HAIRSTYLES ---
  'crop': 'public/styles/texturedcrop.jpg',
  'french': 'public/styles/texturedcrop.jpg',
  'textured': 'public/styles/texturedcrop.jpg',
  
  'quiff': 'public/styles/quiff.jpg',
  'brush up': 'public/styles/quiff.jpg',
  'volume': 'public/styles/quiff.jpg',

  'fade': 'public/styles/fade.jpg',
  'taper': 'public/styles/fade.jpg',
  'skin': 'public/styles/fade.jpg', 
  
  'side part': 'public/styles/sidepart.jpg',
  'comb over': 'public/styles/sidepart.jpg',
  'classic': 'public/styles/sidepart.jpg',
  'ivy league': 'public/styles/sidepart.jpg',

  'undercut': 'public/styles/undercut.jpg',
  'disconnected': 'public/styles/undercut.jpg',

  'buzz': 'public/styles/buzzcut.jpg',
  'military': 'public/styles/buzzcut.jpg',
  'high and tight': 'public/styles/buzzcut.jpg',
  'burr': 'public/styles/buzzcut.jpg',

  'crew': 'public/styles/crewcut.jpg',
  
  'fringe': 'public/styles/fringeforward.jpg',
  'bangs': 'public/styles/fringeforward.jpg',

  'pompadour': 'public/styles/pompadour.jpg',
  
  'slick': 'public/styles/slickback.jpg',
  
  'long': 'public/styles/longhairwavy.jpg',
  'wavy': 'public/styles/longhairwavy.jpg',
  'flow': 'public/styles/longhairwavy.jpg',
  'surfer': 'public/styles/longhairwavy.jpg',

  'bun': 'public/styles/manbun.jpg',
  'top knot': 'public/styles/manbun.jpg',
  
  'curly': 'public/styles/curly.jpg',
  'coils': 'public/styles/curly.jpg',
  
  'afro': 'public/styles/afro.jpg',
  
  'braid': 'public/styles/braidscornrows.jpg',
  'cornrow': 'public/styles/braidscornrows.jpg',
  'plaits': 'public/styles/braidscornrows.jpg',
  
  'dread': 'public/styles/dreadlocks.jpg',
  'locs': 'public/styles/dreadlocks.jpg',
  
  'caesar': 'public/styles/caesarcut.jpg',
  
  'spiky': 'public/styles/spiky.jpg',
  'faux hawk': 'public/styles/spiky.jpg', 

  // --- FACIAL HAIR ---
  'clean': 'public/styles/cleanshaven.jpg', 
  'shaven': 'public/styles/cleanshaven.jpg', 
  'none': 'public/styles/cleanshaven.jpg', 
  'bald': 'public/styles/cleanshaven.jpg',

  'stubble': 'public/styles/stubbleheavy.jpg',
  'shadow': 'public/styles/stubbleheavy.jpg',
  'scruff': 'public/styles/stubbleheavy.jpg',

  'full beard': 'public/styles/fullbeard.jpg',
  'lumberjack': 'public/styles/fullbeard.jpg',

  'short beard': 'public/styles/shortbeardboxed.jpg',
  'boxed': 'public/styles/shortbeardboxed.jpg',
  'corporate': 'public/styles/shortbeardboxed.jpg',
  'verdi': 'public/styles/shortbeardboxed.jpg',

  'goatee': 'public/styles/goateefull.jpg',
  'circle': 'public/styles/goateefull.jpg',

  'mustache': 'public/styles/mustachechevron.jpg',
  'moustache': 'public/styles/mustachechevron.jpg',
  'stache': 'public/styles/mustachechevron.jpg',
  'chevron': 'public/styles/mustachechevron.jpg',

  'van dyke': 'public/styles/vandyke.jpg',
  
  'anchor': 'public/styles/anchor.jpg',
  
  'balbo': 'public/styles/balbo.jpg',
  
  'mutton': 'public/styles/muttonchopsfriendly.jpg',
  'chops': 'public/styles/muttonchopsfriendly.jpg',
  
  'sideburn': 'public/styles/sideburnsprominent.jpg',
  'burns': 'public/styles/sideburnsprominent.jpg',
  
  'chin strap': 'public/styles/chinstrap.jpg',
  'strap': 'public/styles/chinstrap.jpg',
};

// Fallback images (Unsplash)
const DEFAULT_HAIR = 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1000&auto=format&fit=crop';
const DEFAULT_BEARD = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80';

const getStyleImage = (name: string, type: 'hair' | 'beard'): string => {
  const lowerName = name.toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  const keys = Object.keys(STYLE_IMAGES).sort((a, b) => b.length - a.length);
  const match = keys.find(keyword => lowerName.includes(keyword));
  
  if (match) {
    return STYLE_IMAGES[match];
  }
  
  return type === 'hair' ? DEFAULT_HAIR : DEFAULT_BEARD;
};

export const ResultCard: React.FC<ResultCardProps> = ({ recommendation, type }) => {
  const [imgSrc, setImgSrc] = useState<string>(getStyleImage(recommendation.name, type));
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    setImgSrc(getStyleImage(recommendation.name, type));
    setHasError(false);
  }, [recommendation.name, type]);

  const handleError = () => {
    const fallback = type === 'hair' ? DEFAULT_HAIR : DEFAULT_BEARD;
    
    // INSTANT SWAP: If local fails, switch to fallback
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    } else {
      // Only error out if the fallback also fails
      setHasError(true);
    }
  };

  return (
    <>
      <div className="bg-surface rounded-lg border border-gray-700 hover:border-primary/50 transition-colors shadow-lg overflow-hidden flex flex-col h-full group/card">
        {/* Clickable Image Container */}
        <div 
          className="h-48 w-full relative overflow-hidden bg-gray-800 cursor-pointer"
          onClick={() => !hasError && setIsModalOpen(true)}
        >
          {!hasError ? (
            <>
              <img 
                src={imgSrc} 
                alt={recommendation.name} 
                className="w-full h-full object-cover opacity-90 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-700"
                onError={handleError}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="text-white w-8 h-8 drop-shadow-lg" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-900">
              <div className="text-center p-4">
                 <ImageOff className="w-8 h-8 opacity-50 mx-auto mb-2" />
                 <span className="text-xs opacity-50">Image unavailable</span>
              </div>
            </div>
          )}
          <div className="absolute top-3 right-3 pointer-events-none">
            <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-secondary/90 text-gray-200 font-semibold backdrop-blur-sm border border-gray-600`}>
              {type}
            </span>
          </div>
        </div>
        
        <div className="p-6 pt-4 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-primary mb-3">{recommendation.name}</h3>
          
          <p className="text-gray-300 mb-6 text-sm leading-relaxed flex-grow">
            {recommendation.description}
          </p>
          
          <div className="bg-secondary/50 rounded-lg p-4 border-l-2 border-primary mt-auto">
            <div className="flex items-start gap-3">
               <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
               <p className="text-xs text-gray-400 italic leading-relaxed">
                 <span className="font-bold text-gray-300 not-italic block mb-1">Why it works</span>
                 {recommendation.reasoning}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-secondary rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col border border-gray-700">
             <div className="absolute top-4 right-4 z-10">
               <button onClick={() => setIsModalOpen(false)} className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                 <X className="w-6 h-6" />
               </button>
             </div>
             <div className="flex-grow overflow-hidden bg-black flex items-center justify-center">
               <img 
                 src={imgSrc} 
                 alt={recommendation.name} 
                 className="max-w-full max-h-[75vh] object-contain"
               />
             </div>
             <div className="p-6 bg-secondary border-t border-gray-800">
               <h3 className="text-2xl font-bold text-primary">{recommendation.name}</h3>
               <p className="text-gray-300 mt-2">{recommendation.description}</p>
             </div>
          </div>
        </div>
      )}
    </>
  );
};