import React, { useState } from 'react';
import { 
  Gamepad2, 
  FileJson, 
  Plus, 
  Shield, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { TabDisguise } from '../types';

interface NavbarProps {
  gameCount: number;
  onOpenAddModal: () => void;
  onOpenJsonModal: () => void;
  currentDisguise: string;
  onSelectDisguise: (disguise: TabDisguise) => void;
}

const DISGUISES: TabDisguise[] = [
  {
    id: 'default',
    name: 'Default (Unblocked Games)',
    title: 'Unblocked Games',
    favicon: '/favicon.ico'
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard - Canvas LMS',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico'
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    favicon: 'https://www.desmos.com/favicon.ico'
  }
];

export const Navbar: React.FC<NavbarProps> = ({
  gameCount,
  onOpenAddModal,
  onOpenJsonModal,
  currentDisguise,
  onSelectDisguise,
}) => {
  const [showCloakMenu, setShowCloakMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                UNBLOCKED<span className="text-sky-400 font-mono ml-1">//GAMES</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {gameCount} Games Loaded
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              HTML5 & JSON Iframe Web Arcade
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Tab Cloak Dropdown */}
          <div className="relative">
            <button
              type="button"
              id="cloak-dropdown-btn"
              onClick={() => setShowCloakMenu(!showCloakMenu)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title="Disguise this browser tab title and favicon"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Tab Disguise</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showCloakMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowCloakMenu(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Tab Cloak Preset
                  </div>
                  <div className="space-y-1 mt-1">
                    {DISGUISES.map(d => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          onSelectDisguise(d);
                          setShowCloakMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                          currentDisguise === d.id
                            ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="truncate">{d.name}</span>
                        {currentDisguise === d.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* JSON Database Modal Trigger */}
          <button
            type="button"
            id="json-modal-btn"
            onClick={onOpenJsonModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Inspect, export or import games.json"
          >
            <FileJson className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-mono">games.json</span>
          </button>

          {/* Add Game Modal Trigger */}
          <button
            type="button"
            id="add-game-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
