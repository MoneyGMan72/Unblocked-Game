import React, { useState } from 'react';
import { GameItem } from '../types';
import { X, Plus, Code, Eye, AlertCircle, Check } from 'lucide-react';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: GameItem) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({
  isOpen,
  onClose,
  onAddGame,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [iframeInput, setIframeInput] = useState('');
  const [controls, setControls] = useState('Keyboard / Mouse');
  const [tagsInput, setTagsInput] = useState('Custom, Web');
  const [previewActive, setPreviewActive] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Extract or build clean iframe and URL
  const parseIframe = () => {
    const trimmed = iframeInput.trim();
    if (!trimmed) return null;

    let iframeString = trimmed;
    let url = '';

    if (trimmed.startsWith('<iframe') || trimmed.includes('<iframe')) {
      iframeString = trimmed;
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      url = match ? match[1] : '';
    } else if (trimmed.startsWith('http') || trimmed.startsWith('/')) {
      url = trimmed;
      iframeString = `<iframe src="${trimmed}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen; gamepad"></iframe>`;
    }

    return { iframeString, url };
  };

  const parsed = parseIframe();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }
    if (!parsed || !parsed.url) {
      setError('Please provide a valid <iframe> code or game URL.');
      return;
    }

    const newGame: GameItem = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      description: description.trim() || 'Custom unblocked game stored in JSON.',
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      author: 'User Added',
      rating: 5.0,
      plays: 1,
      controls: controls.trim(),
      thumbnailBg: 'from-violet-600 to-purple-950',
      icon: 'Gamepad2',
      iframe: parsed.iframeString,
      iframeUrl: parsed.url,
      isCustom: true
    };

    onAddGame(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Add Unblocked Game</h3>
              <p className="text-xs text-slate-400">Stores as an Iframe in the games JSON record</p>
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Game Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g., Retro Asteroids"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Retro">Retro</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Arcade, Space, Retro"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Iframe Embed Code or Game URL *
              </label>
              {parsed?.url && (
                <button
                  type="button"
                  onClick={() => setPreviewActive(!previewActive)}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{previewActive ? 'Hide Preview' : 'Test Iframe'}</span>
                </button>
              )}
            </div>
            <textarea
              required
              rows={3}
              value={iframeInput}
              onChange={e => { setIframeInput(e.target.value); setError(''); }}
              placeholder='<iframe src="https://..." width="100%" height="100%"></iframe> or https://game-url.com'
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              You can paste a full &lt;iframe ...&gt; snippet or a direct game link. It will be stored as an iframe object in the JSON.
            </p>
          </div>

          {/* Optional Iframe live test preview */}
          {previewActive && parsed?.url && (
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950 p-2">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                <span>Iframe Live Preview:</span>
                <span className="font-mono text-emerald-400">{parsed.url}</span>
              </div>
              <div className="w-full h-44 bg-black rounded border border-slate-800 overflow-hidden">
                <iframe
                  src={parsed.url}
                  title="Test Preview"
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; gamepad"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short summary of game mechanics and objectives..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Controls Instructions
            </label>
            <input
              type="text"
              value={controls}
              onChange={e => setControls(e.target.value)}
              placeholder="e.g. WASD to move, Space to jump"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-sky-600/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Save Game to JSON</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
