import React, { useState } from 'react';
import { SteamGame } from '../types/game';
import {
  X,
  Download,
  Play,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  ThumbsUp,
  Cpu,
  HardDrive,
  Gamepad,
  Languages,
  MonitorCheck,
  Info
} from 'lucide-react';

interface GameDetailModalProps {
  game: SteamGame | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (game: SteamGame) => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState<number>(0);
  const [copiedCommand, setCopiedCommand] = useState(false);

  if (!isOpen || !game) return null;

  const handleCopyInstallCommand = () => {
    navigator.clipboard.writeText(`steam://install/${game.appId}`);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const screenshots = game.screenshots.length > 0 ? game.screenshots : [game.coverImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0f141d] text-slate-100 shadow-2xl my-8 max-h-[92vh] flex flex-col">
        {/* Sticky Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#141b27] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-400">AppID: {game.appId}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              {game.typeLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(game)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-cyan-500 hover:text-white transition-colors"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400/20" />
                  <span>Salvo</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Salvar</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Main Media & Header Section */}
          <div className="space-y-4">
            {/* Primary Screenshot Display */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-800 bg-black">
              <img
                src={screenshots[selectedScreenshot] || game.coverImage}
                alt={game.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl text-balance drop-shadow">
                  {game.title}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                  <span>Desenvolvedor: {game.developer}</span>
                  <span aria-hidden="true">·</span>
                  <span>Distribuidora: {game.publisher}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{game.releaseDate}</span>
                </div>
              </div>
            </div>

            {/* Screenshots Thumbnails */}
            {screenshots.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {screenshots.map((shot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedScreenshot(idx)}
                    className={`relative aspect-[16/9] w-24 shrink-0 overflow-hidden rounded-lg border transition-all ${
                      selectedScreenshot === idx
                        ? 'border-cyan-400 ring-2 ring-cyan-400/40'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={shot}
                      alt={`Screenshot ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Steam Action Buttons Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            {/* Primary Direct Install */}
            <a
              href={game.steamInstallUrl}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:from-cyan-500 hover:to-blue-500 transition-all text-center"
            >
              <Download className="h-4 w-4" />
              <span>Instalar no Steam</span>
            </a>

            {/* Launch / Play if installed */}
            <a
              href={game.steamRunUrl}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-700 hover:text-white transition-all text-center"
            >
              <Play className="h-4 w-4 text-emerald-400" />
              <span>Iniciar no Steam</span>
            </a>

            {/* Store Web Page */}
            <a
              href={game.steamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-700 hover:text-white transition-all text-center"
            >
              <ExternalLink className="h-4 w-4 text-cyan-400" />
              <span>Página da Loja</span>
            </a>
          </div>

          {/* Quick Steam Protocol Command Copy */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-slate-950/60 p-3 text-xs border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400">
              <Info className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Comando Windows Run (Win + R) ou atalho do navegador:</span>
              <code className="font-mono text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded">
                steam://install/{game.appId}
              </code>
            </div>
            <button
              onClick={handleCopyInstallCommand}
              className="flex items-center gap-1 self-start sm:self-auto rounded px-2 py-1 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              {copiedCommand ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          {/* Synopsis & Key Info */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-semibold text-white">Sobre o Jogo</h3>
            <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
              {game.longDescription || game.shortDescription}
            </p>
          </div>

          {/* Key Indicators Matrix (Reviews, Deck, Storage, Languages) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-[11px] text-slate-400 block mb-1">Avaliação dos Usuários</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-sm">
                <ThumbsUp className="h-4 w-4" />
                <span className="font-mono tabular-nums">{game.rating}% Positivo</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block truncate">
                {game.reviewCount.toLocaleString()} análises
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-[11px] text-slate-400 block mb-1">Espaço em Disco</span>
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-sm">
                <HardDrive className="h-4 w-4" />
                <span className="font-mono tabular-nums">{game.storageGb} GB</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Aproximado</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-[11px] text-slate-400 block mb-1">Compatibilidade Deck</span>
              <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-sm">
                <Gamepad className="h-4 w-4" />
                <span>{game.steamDeck === 'verified' ? 'Verificado' : 'Jogável'}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">SteamOS</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-[11px] text-slate-400 block mb-1">Idioma Português (Brasil)</span>
              <div className="flex items-center gap-1.5 font-semibold text-sm text-emerald-400">
                <Languages className="h-4 w-4" />
                <span>
                  {game.languages.ptBrInterface || game.languages.ptBrSubtitles ? 'Suportado' : 'Apenas Inglês'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {game.languages.ptBrAudio ? 'Dublado + Legendas' : (game.languages.ptBrSubtitles ? 'Legendas PT-BR' : 'Interface')}
              </span>
            </div>
          </div>

          {/* System Requirements */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-semibold text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Requisitos de Sistema</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Minimum */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs">
                <h4 className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px]">
                  Requisitos Mínimos
                </h4>
                <div className="space-y-1.5 text-slate-300">
                  <p><strong className="text-slate-400">SO:</strong> {game.systemRequirements.minimum.os}</p>
                  <p><strong className="text-slate-400">Processador:</strong> {game.systemRequirements.minimum.processor}</p>
                  <p><strong className="text-slate-400">Memória:</strong> {game.systemRequirements.minimum.memory}</p>
                  <p><strong className="text-slate-400">Placa de Vídeo:</strong> {game.systemRequirements.minimum.graphics}</p>
                  <p><strong className="text-slate-400">Armazenamento:</strong> {game.systemRequirements.minimum.storage}</p>
                </div>
              </div>

              {/* Recommended */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs">
                <h4 className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px]">
                  Requisitos Recomendados
                </h4>
                {game.systemRequirements.recommended ? (
                  <div className="space-y-1.5 text-slate-300">
                    <p><strong className="text-slate-400">SO:</strong> {game.systemRequirements.recommended.os}</p>
                    <p><strong className="text-slate-400">Processador:</strong> {game.systemRequirements.recommended.processor}</p>
                    <p><strong className="text-slate-400">Memória:</strong> {game.systemRequirements.recommended.memory}</p>
                    <p><strong className="text-slate-400">Placa de Vídeo:</strong> {game.systemRequirements.recommended.graphics}</p>
                    <p><strong className="text-slate-400">Armazenamento:</strong> {game.systemRequirements.recommended.storage}</p>
                  </div>
                ) : (
                  <p className="text-slate-400">
                    O desenvolvedor não especificou requisitos recomendados adicionais além dos mínimos.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
