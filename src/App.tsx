import React, { useState, useEffect, useMemo } from 'react';
import { GameItem, GameCategory, TabDisguise } from './types';
import defaultGamesData from './data/games.json';
import { Navbar } from './components/Navbar';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { AddGameModal } from './components/AddGameModal';
import { JsonModal } from './components/JsonModal';
import { 
  Search, 
  Sparkles, 
  Flame, 
  Star, 
  SlidersHorizontal, 
  Layers, 
  Gamepad2,
  FileJson,
  X,
  Code
} from 'lucide-react';

const CATEGORIES: GameCategory[] = ['All', 'Arcade', 'Puzzle', 'Action', 'Retro', 'Favorites'];

export default function App() {
  // Games state (initialized with localStorage or bundled default games)
  const [games, setGames] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem('unblocked_games_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved games:', e);
    }
    return defaultGamesData as GameItem[];
  });

  // Selected active game to play
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unblocked_favorites');
      return saved ? JSON.parse(saved) : ['snake-retro', 'tetris-classic'];
    } catch (e) {
      return ['snake-retro', 'tetris-classic'];
    }
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<GameCategory>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'name'>('popular');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Tab Disguise State
  const [currentDisguise, setCurrentDisguise] = useState<string>(() => {
    return localStorage.getItem('tab_disguise_id') || 'default';
  });

  // Sync games to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('unblocked_games_db', JSON.stringify(games));
    } catch (e) {
      console.warn('Could not persist games:', e);
    }
  }, [games]);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('unblocked_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not persist favorites:', e);
    }
  }, [favorites]);

  // Apply tab disguise
  const handleSelectDisguise = (disguise: TabDisguise) => {
    setCurrentDisguise(disguise.id);
    localStorage.setItem('tab_disguise_id', disguise.id);
    document.title = disguise.title;

    // Update or create favicon link
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = disguise.favicon;
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleAddGame = (newGame: GameItem) => {
    setGames(prev => [newGame, ...prev]);
    // Automatically select to test play immediately
    setSelectedGame(newGame);
  };

  const handleImportGames = (imported: GameItem[]) => {
    setGames(imported);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset games list to the default unblocked collection?')) {
      setGames(defaultGamesData as GameItem[]);
      localStorage.removeItem('unblocked_games_db');
    }
  };

  // Filter & Sort logic
  const filteredGames = useMemo(() => {
    return games
      .filter(game => {
        // Category match
        if (activeCategory === 'Favorites') {
          if (!favorites.includes(game.id)) return false;
        } else if (activeCategory !== 'All') {
          if (game.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
        }

        // Search match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          const matchTag = game.tags.some(t => t.toLowerCase().includes(q));
          const matchCat = game.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchTag && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.plays - a.plays;
        if (sortBy === 'rating') return b.rating - a.rating;
        return a.title.localeCompare(b.title);
      });
  }, [games, activeCategory, searchQuery, favorites, sortBy]);

  // Featured game for top spotlight
  const featuredGame = games.find(g => g.id === 'snake-retro') || games[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        gameCount={games.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        currentDisguise={currentDisguise}
        onSelectDisguise={handleSelectDisguise}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {selectedGame ? (
          /* In-App Game Player View */
          <GamePlayer
            game={selectedGame}
            isFavorite={favorites.includes(selectedGame.id)}
            onBack={() => setSelectedGame(null)}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          /* Games Portal Grid View */
          <div className="space-y-8">
            {/* Banner Spotlight */}
            <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>JSON Iframe Architecture</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                  Fast, Unblocked Games at Your Fingertips
                </h1>
                <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
                  Every game is stored directly as an <code className="text-sky-300 font-mono bg-sky-950/60 px-1.5 py-0.5 rounded">&lt;iframe&gt;</code> inside a manageable JSON database with zero external blockers.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {featuredGame && (
                    <button
                      type="button"
                      id="play-featured-btn"
                      onClick={() => setSelectedGame(featuredGame)}
                      className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>Play {featuredGame.title}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsJsonModalOpen(true)}
                    className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <Code className="w-4 h-4 text-amber-400" />
                    <span>Inspect games.json</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter, Search & Category Controls Bar */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    id="game-search-input"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by title, tag, or category..."
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <span className="text-xs text-slate-400 font-medium">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold py-2 px-3 rounded-lg focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map(category => {
                  const isActive = activeCategory === category;
                  const count = category === 'All' 
                    ? games.length 
                    : category === 'Favorites'
                    ? favorites.length
                    : games.filter(g => g.category.toLowerCase() === category.toLowerCase()).length;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {category === 'Favorites' && <Star className={`w-3 h-3 ${isActive ? 'fill-slate-950' : 'text-amber-400'}`} />}
                      <span>{category}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Games Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onSelectGame={setSelectedGame}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="py-16 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-1">No games found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  No games matched your current query or category filter. Try clearing filters or adding a new game.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
                  >
                    Clear Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg"
                  >
                    Add a New Game
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-300">Unblocked Games</span>
            <span>• Embedded HTML5 Iframe Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-slate-300 underline font-mono"
            >
              View JSON Schema
            </button>
            <span>•</span>
            <span>Safe &amp; Unblocked Storage</span>
          </div>
        </div>
      </footer>

      {/* Add Game Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      {/* JSON Viewer & Manager Modal */}
      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onImportGames={handleImportGames}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
