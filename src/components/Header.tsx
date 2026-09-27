import React from 'react';
import { Gamepad2, Bookmark, Dices, Search } from 'lucide-react';
import { GameType } from '../types/game';

interface HeaderProps {
  activeTab: GameType | 'library';
  onSelectTab: (tab: GameType | 'library') => void;
  savedCount: number;
  onOpenRandom: () => void;
  onOpenLookup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  onOpenRandom,
  onOpenLookup,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0d1117]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => onSelectTab('all')}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            SteamVault <span className="text-cyan-400 font-normal text-sm">Grátis & Demos</span>
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('all')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'all'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            Explorar Tudo
          </button>
          <button
            onClick={() => onSelectTab('demo')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'demo'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            Demos Jogáveis
          </button>
          <button
            onClick={() => onSelectTab('f2p')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'f2p'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            Free to Play
          </button>
          <button
            onClick={() => onSelectTab('free_game')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'free_game'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            100% Grátis
          </button>
          <button
            onClick={onOpenLookup}
            className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors py-1"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>Consultar AppID</span>
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenRandom}
            title="Sortear um jogo grátis ou demo aleatória"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:bg-slate-700/80 hover:text-white transition-all whitespace-nowrap"
          >
            <Dices className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Roleta Aleatória</span>
          </button>

          <button
            onClick={() => onSelectTab('library')}
            className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'library'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Minha Coleção</span>
            {savedCount > 0 && (
              <span className="ml-1 rounded-full bg-slate-950/40 px-1.5 py-0.2 text-[11px] font-mono text-cyan-200">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
