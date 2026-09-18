import React, { useRef, useState } from 'react';
import { GameItem } from '../types';
import { 
  ChevronLeft, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ExternalLink, 
  Star, 
  Code, 
  Copy, 
  Check, 
  Keyboard,
  Share2,
  Sparkles
} from 'lucide-react';

interface GamePlayerProps {
  game: GameItem;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  isFavorite,
  onBack,
  onToggleFavorite,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [showJsonSnippet, setShowJsonSnippet] = useState(false);

  // Extract src from iframe string or fallback to iframeUrl
  const getIframeSrc = () => {
    if (game.iframeUrl) return game.iframeUrl;
    const match = game.iframe.match(/src=["']([^"']+)["']/i);
    return match ? match[1] : '';
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.warn('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
  };

  const handlePopout = () => {
    const src = getIframeSrc();
    if (src) {
      window.open(src, '_blank');
    }
  };

  const handleCopyIframe = () => {
    navigator.clipboard.writeText(game.iframe);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const srcUrl = getIframeSrc();

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="back-to-library-btn"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Games Library</span>
          </button>
          
          <div className="h-5 w-px bg-slate-700 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-slate-100 font-bold text-lg">{game.title}</h2>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">
                {game.category}
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleReload}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-sm transition-colors"
            title="Restart Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handlePopout}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-sm transition-colors"
            title="Open in new window / tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="fullscreen-toggle-btn"
            onClick={handleFullscreen}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-sky-600/20"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden md:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main Game Stage / Iframe Container */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/3] md:aspect-[16/10] max-h-[78vh] min-h-[440px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col items-center justify-center group"
      >
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={srcUrl}
          title={game.title}
          className="w-full h-full border-0 rounded-2xl"
          allow="autoplay; fullscreen; gamepad; focus-without-user-activation; accelerometer; gyroscope"
          allowFullScreen
          loading="eager"
        />
      </div>

      {/* Details & Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Game Info Card */}
        <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-100 font-bold text-base flex items-center gap-2">
                <span>About {game.title}</span>
                <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                  By {game.author}
                </span>
              </h3>
              <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">{game.rating}</span>
                <span className="text-slate-500">({game.plays.toLocaleString()} plays)</span>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {game.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {game.tags.map((tag, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 bg-slate-800/80 text-slate-400 border border-slate-700/60 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Embedded via JSON Iframe specification</span>
            </span>
            <button
              type="button"
              onClick={() => setShowJsonSnippet(!showJsonSnippet)}
              className="text-sky-400 hover:text-sky-300 font-medium underline flex items-center gap-1"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJsonSnippet ? 'Hide JSON Code' : 'View JSON Code'}</span>
            </button>
          </div>
        </div>

        {/* Controls Card */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Keyboard className="w-4 h-4 text-sky-400" />
              <h4 className="text-slate-100 font-bold text-sm">Controls & Guide</h4>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 leading-relaxed font-mono">
              {game.controls || 'Use keyboard or mouse as supported by the game.'}
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleCopyIframe}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Iframe HTML!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Game Iframe HTML</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable JSON Entry Inspector */}
      {showJsonSnippet && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 animate-in fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Code className="w-4 h-4 text-sky-400" />
              <span>JSON Record (`games.json`):</span>
            </div>
            <button
              type="button"
              onClick={handleCopyIframe}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              Copy Iframe
            </button>
          </div>
          <pre className="p-3 bg-slate-900 rounded-lg text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(game, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
