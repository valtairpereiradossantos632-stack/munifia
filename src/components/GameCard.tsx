import React, { useState } from 'react';
import { SteamGame } from '../types/game';
import { Download, Bookmark, BookmarkCheck, ExternalLink, Gamepad2, ThumbsUp, HardDrive } from 'lucide-react';

interface GameCardProps {
  game: SteamGame;
  isSaved: boolean;
  onToggleSave: (game: SteamGame) => void;
  onOpenDetails: (game: SteamGame) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isSaved,
  onToggleSave,
  onOpenDetails,
}) => {
  const [imageError, setImageError] = useState(false);

  // Type color accent for subtle title kicker
  const getTypeColor = (type: SteamGame['type']) => {
    switch (type) {
      case 'demo':
        return 'text-amber-400';
      case 'f2p':
        return 'text-cyan-400';
      case 'free_game':
        return 'text-emerald-400';
      case 'prologue':
        return 'text-violet-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800/90 bg-[#12161f] transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-cyan-950/20">
      {/* Top Media Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        {!imageError ? (
          <img
            src={game.coverImage}
            alt={game.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-center">
            <Gamepad2 className="h-8 w-8 text-slate-600 mb-2" />
            <span className="text-xs font-medium text-slate-400 line-clamp-1">{game.title}</span>
          </div>
        )}

        {/* Floating Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(game);
          }}
          title={isSaved ? 'Remover da Minha Coleção' : 'Salvar na Minha Coleção'}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 backdrop-blur-md text-slate-200 transition-colors hover:bg-black/90 hover:text-cyan-300"
        >
          {isSaved ? (
            <BookmarkCheck className="h-4 w-4 text-cyan-400 fill-cyan-400/20" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>

        {/* Scrim Gradient for Legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12161f] via-transparent to-transparent opacity-80" />
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Zero-Pill Unboxed Metadata Kicker */}
          <div className="flex items-center gap-2 text-xs font-medium mb-1.5">
            <span className={`font-semibold uppercase tracking-wider ${getTypeColor(game.type)}`}>
              {game.typeLabel}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono text-[11px]">{game.releaseDate}</span>
            {game.storageGb > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono text-[11px] flex items-center gap-0.5">
                  <HardDrive className="h-2.5 w-2.5 inline" /> {game.storageGb} GB
                </span>
              </>
            )}
          </div>

          {/* Game Title */}
          <h3
            onClick={() => onOpenDetails(game)}
            className="font-display text-base font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
          >
            {game.title}
          </h3>

          {/* Short Description */}
          <p className="mt-2 text-xs leading-relaxed text-slate-300 line-clamp-2">
            {game.shortDescription}
          </p>

          {/* Unboxed Metadata row: Reviews & Steam Deck */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-1 text-emerald-400 font-medium">
              <ThumbsUp className="h-3 w-3" />
              <span className="font-mono tabular-nums">{game.rating}%</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="truncate max-w-[120px] text-slate-400">{game.ratingLabel}</span>
            {game.steamDeck === 'verified' && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-cyan-300 font-medium">Deck Verificado</span>
              </>
            )}
          </div>

          {/* Clean Genre Tags - separated by bullet, NO PILL BOXES */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
            {game.genres.slice(0, 3).map((genre, idx) => (
              <React.Fragment key={genre}>
                {idx > 0 && <span aria-hidden="true" className="text-slate-600">/</span>}
                <span className="hover:text-slate-200 transition-colors">{genre}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="mt-5 flex items-center gap-2 border-t border-slate-800/80 pt-3.5">
          {/* Direct 1-Click Steam Install Link */}
          <a
            href={game.steamInstallUrl}
            title={`Instalar ${game.title} diretamente na Steam (abre o cliente)`}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:from-cyan-500 hover:to-blue-500 transition-all text-center whitespace-nowrap active:scale-[0.98]"
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            <span>Instalar Steam</span>
          </a>

          {/* Details Button */}
          <button
            onClick={() => onOpenDetails(game)}
            className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-700/80 hover:text-white transition-colors"
            title="Ver requisitos, screenshots e detalhes"
          >
            <span>Detalhes</span>
          </button>

          {/* Web Store Link */}
          <a
            href={game.steamUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver na loja web da Steam"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-slate-400 hover:border-slate-600 hover:text-cyan-400 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
