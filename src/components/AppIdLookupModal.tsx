import React, { useState } from 'react';
import { X, Search, Download, ExternalLink, Play, AlertCircle, CheckCircle2 } from 'lucide-react';
import { lookupSteamAppById } from '../services/steamApi';
import { SteamGame } from '../types/game';

interface AppIdLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDetails: (game: SteamGame) => void;
}

export const AppIdLookupModal: React.FC<AppIdLookupModalProps> = ({
  isOpen,
  onClose,
  onOpenDetails,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundGame, setFoundGame] = useState<SteamGame | null>(null);
  const [notFound, setNotFound] = useState(false);

  if (!isOpen) return null;

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    setLoading(true);
    setNotFound(false);
    setFoundGame(null);

    // Extract AppID from link or raw number
    const match = inputVal.match(/(\d{3,9})/);
    const appId = match ? parseInt(match[1], 10) : null;

    if (!appId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    try {
      const res = await lookupSteamAppById(appId);
      if (res) {
        setFoundGame(res);
      } else {
        // Create manual entry so user can still install via protocol!
        setFoundGame({
          id: `custom-${appId}`,
          appId: appId,
          title: `Steam App #${appId}`,
          type: 'demo',
          typeLabel: 'AppID Steam',
          developer: 'Steam Developer',
          publisher: 'Steam Publisher',
          releaseDate: 'Steam Store',
          coverImage: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`,
          screenshots: [
            `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`
          ],
          rating: 85,
          ratingLabel: 'Disponível no Steam',
          reviewCount: 100,
          storageGb: 5,
          genres: ['Steam'],
          tags: ['AppID Personalizado'],
          platforms: { windows: true, linux: true, mac: false },
          steamDeck: 'verified',
          languages: { ptBrAudio: false, ptBrInterface: true, ptBrSubtitles: true },
          shortDescription: `Link de instalação direta gerado para o AppID ${appId}.`,
          longDescription: `Você pode instalar este jogo diretamente na sua conta Steam usando o protocolo oficial.`,
          systemRequirements: {
            minimum: {
              os: 'Windows 10',
              processor: 'Compatível',
              memory: '4 GB RAM',
              graphics: 'Compatível',
              storage: 'Consulte no Steam',
            }
          },
          steamUrl: `https://store.steampowered.com/app/${appId}`,
          steamInstallUrl: `steam://install/${appId}`,
          steamRunUrl: `steam://run/${appId}`,
        });
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0f141d] text-slate-100 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-cyan-400" />
            <h2 className="font-display text-lg font-bold text-white">
              Consultar Qualquer AppID / Jogo Steam
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Cole o link de qualquer página da Steam ou digite o número do AppID para gerar o comando de download direto:
        </p>

        {/* Input Form */}
        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ex: 2379780 ou https://store.steampowered.com/app/2379780/..."
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? 'Consultando...' : 'Buscar'}
          </button>
        </form>

        {/* Found Result */}
        {foundGame && (
          <div className="rounded-xl border border-slate-800 bg-[#141b27] p-4 space-y-3">
            <div className="flex items-start gap-3">
              <img
                src={foundGame.coverImage}
                alt={foundGame.title}
                referrerPolicy="no-referrer"
                className="h-16 w-28 rounded object-cover bg-slate-900 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/460x215/1e293b/94a3b8?text=Steam+Cover';
                }}
              />
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-mono text-cyan-400">
                  AppID: {foundGame.appId}
                </span>
                <h4 className="font-display text-sm font-bold text-white truncate">
                  {foundGame.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                  {foundGame.shortDescription}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
              <a
                href={foundGame.steamInstallUrl}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-cyan-600 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Instalar na Steam</span>
              </a>
              <button
                onClick={() => {
                  onClose();
                  onOpenDetails(foundGame);
                }}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white transition-colors"
              >
                Detalhes
              </button>
              <a
                href={foundGame.steamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}

        {notFound && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-950/30 border border-rose-800/40 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>Nenhum AppID numérico válido identificado. Digite um número como &quot;2379780&quot; ou cole o link completo da loja Steam.</span>
          </div>
        )}
      </div>
    </div>
  );
};
