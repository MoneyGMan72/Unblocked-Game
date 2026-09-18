import React from 'react';
import { GameItem } from '../types';
import { 
  Play, 
  Star, 
  ExternalLink, 
  Gamepad2, 
  Layers, 
  Trophy, 
  Flame, 
  Grid, 
  Rocket, 
  Bird, 
  Bomb, 
  Hexagon, 
  Code
} from 'lucide-react';

interface GameCardProps {
  game: GameItem;
  isFavorite: boolean;
  onSelectGame: (game: GameItem) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const getGameIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Gamepad2': return <Gamepad2 className="w-8 h-8 text-white/90" />;
    case 'Layers': return <Layers className="w-8 h-8 text-white/90" />;
    case 'Trophy': return <Trophy className="w-8 h-8 text-white/90" />;
    case 'Flame': return <Flame className="w-8 h-8 text-white/90" />;
    case 'Grid': return <Grid className="w-8 h-8 text-white/90" />;
    case 'Rocket': return <Rocket className="w-8 h-8 text-white/90" />;
    case 'Bird': return <Bird className="w-8 h-8 text-white/90" />;
    case 'Bomb': return <Bomb className="w-8 h-8 text-white/90" />;
    case 'Hexagon': return <Hexagon className="w-8 h-8 text-white/90" />;
    default: return <Gamepad2 className="w-8 h-8 text-white/90" />;
  }
};

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onSelectGame,
  onToggleFavorite,
}) => {
  const gradientClass = game.thumbnailBg || 'from-blue-600 to-indigo-900';

  const handlePopout = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (game.iframeUrl) {
      window.open(game.iframeUrl, '_blank');
    }
  };

  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onSelectGame(game)}
      className="group relative flex flex-col bg-slate-900/90 border border-slate-800 hover:border-sky-500/60 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10"
    >
      {/* Thumbnail Banner */}
      <div className={`relative h-40 w-full bg-gradient-to-br ${gradientClass} p-4 flex flex-col justify-between overflow-hidden`}>
        {/* Background Grid Accent Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top Badges */}
        <div className="relative z-10 flex justify-between items-center">
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-md text-sky-200 border border-white/10 rounded-md">
            {game.category}
          </span>
          <button
            type="button"
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`p-1.5 rounded-md backdrop-blur-md transition-colors ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-black/40 text-slate-300 hover:text-white border border-white/10'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Icon & Quick Play overlay */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="p-3 bg-black/30 rounded-xl backdrop-blur-md border border-white/10 group-hover:scale-105 transition-transform">
            {getGameIcon(game.icon)}
          </div>
          
          <div className="flex items-center gap-2">
            {game.iframeUrl && (
              <button
                type="button"
                onClick={handlePopout}
                className="opacity-0 group-hover:opacity-100 p-2 bg-black/60 hover:bg-black/90 text-white rounded-lg backdrop-blur-md transition-all border border-white/20 hover:scale-105"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
            <div className="px-3 py-1.5 bg-sky-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>PLAY</span>
            </div>
          </div>
        </div>

        {/* Custom Game Pill if added by user */}
        {game.isCustom && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-purple-500/80 text-white text-[10px] font-bold rounded uppercase">
            Custom
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-slate-100 text-base group-hover:text-sky-400 transition-colors line-clamp-1">
              {game.title}
            </h3>
            <div className="flex items-center text-xs font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-400 mr-1" />
              <span>{game.rating}</span>
            </div>
          </div>

          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-3">
            {game.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Code className="w-3 h-3 text-sky-400" />
            <span className="text-slate-400 font-mono">JSON Iframe</span>
          </span>
          <span>{game.plays.toLocaleString()} plays</span>
        </div>
      </div>
    </div>
  );
};
