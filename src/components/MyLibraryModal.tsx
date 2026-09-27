import React, { useState } from 'react';
import { SteamGame, UserLibraryItem } from '../types/game';
import {
  X,
  Download,
  Trash2,
  HardDrive,
  Copy,
  Check,
  ExternalLink,
  BookmarkCheck,
  Share2,
  Gamepad2
} from 'lucide-react';

interface MyLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedGames: SteamGame[];
  libraryItems: UserLibraryItem[];
  onToggleStatus: (appId: number) => void;
  onRemoveGame: (game: SteamGame) => void;
  onOpenDetails: (game: SteamGame) => void;
  onClearLibrary: () => void;
}

export const MyLibraryModal: React.FC<MyLibraryModalProps> = ({
  isOpen,
  onClose,
  savedGames,
  libraryItems,
  onToggleStatus,
  onRemoveGame,
  onOpenDetails,
  onClearLibrary,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'want_to_play' | 'played'>('all');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen) return null;

  // Calculate total disk space needed
  const totalGb = savedGames.reduce((acc, game) => acc + (game.storageGb || 0), 0);

  // Filter items
  const filteredGames = savedGames.filter((game) => {
    const item = libraryItems.find((li) => li.appId === game.appId);
    if (filterStatus === 'all') return true;
    return item?.status === filterStatus;
  });

  const handleShareList = () => {
    if (savedGames.length === 0) return;
    const textLines = savedGames.map(
      (g) => `• ${g.title} (${g.typeLabel}) - Instalar: steam://install/${g.appId}`
    );
    const text = `🎮 Minha Lista de Jogos Grátis e Demos da Steam (${savedGames.length} títulos, ~${totalGb.toFixed(1)} GB):\n\n${textLines.join('\n')}\n\nEncontrado em SteamVault.`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0f141d] text-slate-100 shadow-2xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#141b27] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <BookmarkCheck className="h-5 w-5 text-cyan-400" />
            <h2 className="font-display text-lg font-bold text-white">
              Minha Coleção de Grátis & Demos
            </h2>
            <span className="font-mono text-xs text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">
              {savedGames.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Space Calculator & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/60 px-6 py-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <HardDrive className="h-4 w-4 text-cyan-400" />
            <span>Espaço total estimado:</span>
            <span className="font-mono text-cyan-300 font-bold tabular-nums">
              {totalGb.toFixed(1)} GB
            </span>
          </div>

          <div className="flex items-center gap-2">
            {savedGames.length > 0 && (
              <>
                <button
                  onClick={handleShareList}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 hover:border-cyan-500 hover:text-white transition-colors"
                  title="Copiar lista para compartilhar no Discord ou WhatsApp"
                >
                  {copiedShare ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Lista Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Compartilhar Lista</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClearLibrary}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors ml-2"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Limpar Tudo</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter subtabs */}
        {savedGames.length > 0 && (
          <div className="flex items-center gap-2 px-6 pt-3 pb-1 border-b border-slate-800/40 text-xs">
            <span className="text-slate-400">Filtrar por:</span>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterStatus === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({savedGames.length})
            </button>
            <button
              onClick={() => setFilterStatus('want_to_play')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterStatus === 'want_to_play'
                  ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Quero Jogar
            </button>
            <button
              onClick={() => setFilterStatus('played')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterStatus === 'played'
                  ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Já Joguei
            </button>
          </div>
        )}

        {/* Scrollable Games List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedGames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-500 mb-3">
                <Gamepad2 className="h-8 w-8" />
              </div>
              <h3 className="font-display text-base font-semibold text-white">
                Sua coleção ainda está vazia
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                Explore o catálogo de jogos gratuitos e demos jogáveis e clique no ícone de marcador para salvar e organizar seus favoritos.
              </p>
              <button
                onClick={onClose}
                className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors"
              >
                Explorar Jogos Agora
              </button>
            </div>
          ) : (
            filteredGames.map((game) => {
              const item = libraryItems.find((li) => li.appId === game.appId);
              const isPlayed = item?.status === 'played';

              return (
                <div
                  key={game.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-[#121721] p-3.5 transition-colors hover:border-slate-700"
                >
                  {/* Left: Thumbnail & Info */}
                  <div
                    onClick={() => onOpenDetails(game)}
                    className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                  >
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      referrerPolicy="no-referrer"
                      className="h-14 w-24 rounded-lg object-cover bg-slate-900 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] mb-0.5">
                        <span className="font-semibold text-cyan-400">{game.typeLabel}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-400 font-mono">{game.storageGb} GB</span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-white hover:text-cyan-300 transition-colors truncate">
                        {game.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{game.rating}% Positivo</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{game.genres.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Status toggle (Quero Jogar vs Já Joguei) */}
                    <button
                      onClick={() => onToggleStatus(game.appId)}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                        isPlayed
                          ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                      title="Alternar entre Quero Jogar e Já Joguei"
                    >
                      {isPlayed ? 'Já Joguei' : 'Quero Jogar'}
                    </button>

                    {/* Direct Install */}
                    <a
                      href={game.steamInstallUrl}
                      title="Instalar diretamente na Steam"
                      className="flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Instalar</span>
                    </a>

                    {/* Remove */}
                    <button
                      onClick={() => onRemoveGame(game)}
                      title="Remover da coleção"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
