import React from 'react';
import { Gamepad2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0a0d13] text-slate-400 py-10 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-600 text-white">
              <Gamepad2 className="h-4 w-4" />
            </div>
            <span className="font-display text-sm font-bold text-slate-200">
              SteamVault <span className="text-cyan-400 font-normal">Grátis & Demos</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>Demos Jogáveis</span>
            <span aria-hidden="true">·</span>
            <span>Free-to-Play</span>
            <span aria-hidden="true">·</span>
            <span>Jogos 100% Grátis</span>
            <span aria-hidden="true">·</span>
            <span>Links Oficiais steam://</span>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 text-[11px] text-slate-500 leading-relaxed space-y-1">
          <p>
            Steam e o logotipo Steam são marcas comerciais e/ou registradas da Valve Corporation nos EUA e/ou em outros países.
          </p>
          <p>
            Este aplicativo é uma ferramenta independente de descoberta e utilitário de instalação rápida para a comunidade gamer.
          </p>
        </div>
      </div>
    </footer>
  );
};
