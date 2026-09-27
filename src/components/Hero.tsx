import React from 'react';
import { Download, Sparkles, HelpCircle, Flame } from 'lucide-react';
import heroVaultImage from '../assets/images/hero_steam_vault_1790545549698.jpg';

interface HeroProps {
  totalCount: number;
  demosCount: number;
  f2pCount: number;
  onOpenProtocolHelp: () => void;
  onQuickFilter: (type: 'demo' | 'f2p' | 'free_game') => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalCount,
  demosCount,
  f2pCount,
  onOpenProtocolHelp,
  onQuickFilter,
}) => {
  return (
    <div className="relative overflow-hidden border-b border-slate-800/80 bg-[#0d1117]">
      {/* Background Image with Measured Scrim */}
      <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen">
        <img
          src={heroVaultImage}
          alt="Steam Vault Background"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117] via-transparent to-[#0d1117]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          {/* Subtle kicker without pill enclosure */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">
            <Sparkles className="h-4 w-4" />
            <span>Catálogo Completo de Jogos & Demos da Steam</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Instalação Direta 1-Clique</span>
          </div>

          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            Encontre todos os jogos grátis e demos jogáveis da Steam.
          </h1>

          <p className="mt-4 text-base text-slate-300 sm:text-lg leading-relaxed max-w-2xl">
            Explore demos de grandes lançamentos, jogos gratuitos aclamados e joias indies sem gastar nada.
            Instale diretamente no seu cliente Steam no PC com apenas um clique via protocolo oficial.
          </p>

          {/* Quick Metrics & Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onQuickFilter('demo')}
              className="group flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-medium text-slate-200 hover:border-cyan-500 hover:bg-slate-700/80 transition-all shadow-sm"
            >
              <Flame className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Ver Demos ({demosCount})</span>
            </button>

            <button
              onClick={() => onQuickFilter('f2p')}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-medium text-slate-200 hover:border-cyan-500 hover:bg-slate-700/80 transition-all shadow-sm"
            >
              <Download className="h-4 w-4 text-cyan-400" />
              <span>Ver Free-to-Play ({f2pCount})</span>
            </button>

            <button
              onClick={onOpenProtocolHelp}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Como funciona a instalação 1-clique?</span>
            </button>
          </div>

          {/* Unboxed Metadata Stats */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-6">
            <span className="font-mono text-cyan-300 font-semibold">{totalCount} jogos catalogados</span>
            <span aria-hidden="true">·</span>
            <span>Links oficiais steam://</span>
            <span aria-hidden="true">·</span>
            <span>Suporte Steam Deck</span>
            <span aria-hidden="true">·</span>
            <span>Verificação em Português PT-BR</span>
          </div>
        </div>
      </div>
    </div>
  );
};
