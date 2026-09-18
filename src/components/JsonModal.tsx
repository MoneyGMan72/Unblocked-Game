import React, { useState } from 'react';
import { GameItem } from '../types';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  FileJson, 
  RotateCcw,
  AlertCircle 
} from 'lucide-react';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: GameItem[];
  onImportGames: (importedGames: GameItem[]) => void;
  onResetDefaults: () => void;
}

export const JsonModal: React.FC<JsonModalProps> = ({
  isOpen,
  onClose,
  games,
  onImportGames,
  onResetDefaults,
}) => {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [isImportMode, setIsImportMode] = useState(false);
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    try {
      setImportError('');
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON root must be an array of game objects.');
      }
      // Check each has at least title and iframe
      for (const item of parsed) {
        if (!item.title || !item.iframe) {
          throw new Error('Every game object must include at least "title" and "iframe".');
        }
      }
      onImportGames(parsed);
      setIsImportMode(false);
      setImportText('');
    } catch (err: any) {
      setImportError(err.message || 'Invalid JSON format.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          onImportGames(parsed);
          setIsImportMode(false);
        } else {
          setImportError('Imported file must contain a JSON array of games.');
        }
      } catch (err) {
        setImportError('Failed to parse uploaded JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>games.json</span>
                <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded font-normal">
                  {games.length} games recorded
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                JSON database storing each unblocked game with an embedded Iframe
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download games.json</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsImportMode(!isImportMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isImportMode ? 'View JSON' : 'Import JSON'}</span>
            </button>

            <button
              type="button"
              onClick={onResetDefaults}
              className="flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              title="Reset games list to default bundle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          {isImportMode ? (
            <div className="space-y-4 font-sans">
              <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-lg text-xs text-sky-300">
                Paste a custom JSON array of games or upload a `.json` file below. Each entry should include `title` and `iframe`.
              </div>

              {importError && (
                <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Upload file:
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Or paste JSON text:
                </label>
                <textarea
                  rows={8}
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder='[ { "title": "My Game", "iframe": "<iframe src=...>" } ]'
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportMode(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportSubmit}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg"
                >
                  Apply Imported Games
                </button>
              </div>
            </div>
          ) : (
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed select-text">
              {jsonString}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
