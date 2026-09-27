import React, { useState } from 'react';
import { X, HelpCircle, Download, Check, Copy, Terminal, ShieldCheck } from 'lucide-react';

interface SteamProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SteamProtocolModal: React.FC<SteamProtocolModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const testCommand = 'steam://install/2379780';

  const handleCopy = () => {
    navigator.clipboard.writeText(testCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <HelpCircle className="h-5 w-5 text-cyan-400" />
            <h2 className="font-display text-lg font-bold text-white">
              Como funciona o botão &quot;Instalar na Steam&quot;?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content explanation */}
        <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
          <p>
            A Valve fornece um protocolo oficial do sistema chamado <code className="bg-slate-900 text-cyan-300 px-1 py-0.5 rounded font-mono">steam://</code> que comunica o navegador diretamente com o aplicativo Steam instalado no seu computador.
          </p>

          <div className="space-y-2 rounded-xl bg-slate-900/80 border border-slate-800 p-3.5">
            <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs">
              <Download className="h-4 w-4 text-cyan-400" />
              <span>Passo a passo ao clicar:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
              <li>Seu navegador perguntará se deseja abrir o aplicativo <strong>Steam Client Bootstrapper</strong>.</li>
              <li>Clique em <strong>Permitir / Abrir Steam</strong>.</li>
              <li>A janela oficial de instalação do jogo abrirá na hora dentro da sua Steam, mostrando o espaço necessário em disco e botão de download!</li>
            </ol>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-emerald-950/20 border border-emerald-800/40 p-3 text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>
              100% seguro: nenhum dado ou login de senha é transmitido. O comando apenas instrui o seu aplicativo Steam oficial local.
            </span>
          </div>

          {/* Windows Run Alternative */}
          <div className="space-y-1.5 pt-1">
            <span className="text-slate-400 block font-medium flex items-center gap-1">
              <Terminal className="h-3.5 w-3.5" />
              Atalho manual no Windows (Executar):
            </span>
            <div className="flex items-center justify-between rounded-lg bg-slate-950 p-2.5 border border-slate-800">
              <code className="font-mono text-cyan-300 text-[11px]">
                {testCommand}
              </code>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300 hover:text-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Você pode pressionar <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">Win + R</kbd>, colar este comando e dar Enter!
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
