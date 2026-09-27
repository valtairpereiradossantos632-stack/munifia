import React, { useState } from 'react';
import { SteamGame, GameType } from '../types/game';
import { Dices, Download, ExternalLink, X, Sparkles, RefreshCw } from 'lucide-react';

interface RandomGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: SteamGame[];
  onOpenDetails: (game: SteamGame) => void;
}

export const RandomGameModal: React.FC<RandomGameModalProps> = ({
  isOpen,
  onClose,
  games,
  onOpenDetails,
}) => {
  const [selectedType, setSelectedType] = useState<GameType>('all');
  const [isRolling, setIsRolling] = useState(false);
  const [pickedGame, setPickedGame] = useState<SteamGame | null>(null);

  if (!isOpen) return null;

  const handleRoll = () => {
    setIsRolling(true);
    const pool = games.filter((g) => {
      if (selectedType === 'all') return true;
      return g.type === selectedType;
    });

    const candidates = pool.length > 0 ? pool : games;
    let rollCount = 0;
    const maxRolls = 10;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      setPickedGame(candidates[randomIndex]);
      rollCount++;

      if (rollCount >= maxRolls) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 80);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0f141d] text-slate-100 shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Dices className="h-5 w-5 text-cyan-400" />
            <h2 className="font-display text-lg font-bold text-white">
              Roleta de Jogos Steam
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Intro */}
        <p className="text-xs text-slate-300 leading-relaxed">
          Em dúvida do que jogar hoje? Escolha a categoria e gire a roleta para sortear uma demo jogável ou jogo 100% grátis do catálogo.
        </p>

        {/* Category selector */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Qualquer Jogo
          </button>
          <button
            onClick={() => setSelectedType('demo')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              selectedType === 'demo'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Apenas Demos
          </button>
          <button
            onClick={() => setSelectedType('f2p')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              selectedType === 'f2p'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Free-to-Play
          </button>
        </div>

        {/* Rolling Card Display */}
        <div className="relative min-h-[220px] rounded-xl border border-slate-800 bg-[#141a24] p-4 flex flex-col items-center justify-center text-center">
          {pickedGame ? (
            <div className="w-full space-y-3">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-black/40">
                <img
                  src={pickedGame.coverImage}
                  alt={pickedGame.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[11px] font-semibold text-cyan-300">
                  {pickedGame.typeLabel}
                </div>
              </div>

              <div>
                <h3 className="font-display text-base font-bold text-white">
                  {pickedGame.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                  {pickedGame.shortDescription}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-2">
                  <span className="text-emerald-400 font-semibold font-mono">
                    {pickedGame.rating}% Positivo
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{pickedGame.genres.slice(0, 2).join(', ')}</span>
                </div>
              </div>

              {/* Actions for picked game */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <a
                  href={pickedGame.steamInstallUrl}
                  className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Instalar no Steam</span>
                </a>
                <button
                  onClick={() => {
                    onClose();
                    onOpenDetails(pickedGame);
                  }}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white transition-colors"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6">
              <Sparkles className="h-10 w-10 text-cyan-400 mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-200">
                Pronto para girar!
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Clique no botão abaixo para encontrar sua próxima jogatina.
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleRoll}
          disabled={isRolling}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 text-sm font-bold text-white shadow-lg hover:from-cyan-500 hover:to-blue-500 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRolling ? 'animate-spin' : ''}`} />
          <span>{isRolling ? 'Sorteando...' : pickedGame ? 'Girar Novamente' : 'Girar Roleta!'}</span>
        </button>
      </div>
    </div>
  );
};
