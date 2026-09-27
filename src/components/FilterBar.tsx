import React, { useState } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  RotateCcw,
  Tag,
  DollarSign,
  Calendar,
  Users,
  Flame,
  Gamepad2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { FilterState, GameType } from '../types/game';
import { GENRE_OPTIONS, POPULAR_TAGS } from '../data/steamGames';

interface FilterBarProps {
  filter: FilterState;
  onChangeFilter: (newFilter: FilterState) => void;
  resultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChangeFilter,
  resultsCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  const handleTabChange = (type: GameType) => {
    onChangeFilter({
      ...filter,
      type,
      priceCategory: type === 'all' ? 'all' : (type as any),
    });
  };

  const handlePriceCategoryChange = (val: FilterState['priceCategory']) => {
    onChangeFilter({
      ...filter,
      priceCategory: val,
      type: val === 'all' ? 'all' : (val as GameType),
    });
  };

  const handleTagToggle = (tag: string) => {
    const isSelected = filter.selectedTags.includes(tag);
    const newTags = isSelected
      ? filter.selectedTags.filter((t) => t !== tag)
      : [...filter.selectedTags, tag];
    onChangeFilter({ ...filter, selectedTags: newTags });
  };

  const removeSingleTag = (tag: string) => {
    onChangeFilter({
      ...filter,
      selectedTags: filter.selectedTags.filter((t) => t !== tag),
    });
  };

  const clearSearch = () => {
    onChangeFilter({ ...filter, searchQuery: '' });
  };

  const resetAllFilters = () => {
    onChangeFilter({
      searchQuery: '',
      type: 'all',
      genre: 'Todos',
      selectedTags: [],
      priceCategory: 'all',
      releaseYear: 'all',
      popularity: 'all',
      platform: 'all',
      minRating: 0,
      ptBrOnly: false,
      sortBy: 'popular',
    });
  };

  const isFilterActive =
    filter.searchQuery !== '' ||
    filter.type !== 'all' ||
    filter.priceCategory !== 'all' ||
    filter.genre !== 'Todos' ||
    filter.selectedTags.length > 0 ||
    filter.releaseYear !== 'all' ||
    filter.popularity !== 'all' ||
    filter.platform !== 'all' ||
    filter.minRating > 0 ||
    filter.ptBrOnly ||
    filter.sortBy !== 'popular';

  // Filter available tags with tagSearch
  const visibleTags = POPULAR_TAGS.filter((t) =>
    t.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      {/* Primary Bar: Search & Quick Type Navigation */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) =>
              onChangeFilter({ ...filter, searchQuery: e.target.value })
            }
            placeholder="Buscar por título, gênero, tag ou desenvolvedor..."
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/90 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
          />
          {filter.searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Segmented Type Tabs (PRICE / CATEGORY SELECTOR) */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-900/80 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              filter.type === 'all' && filter.priceCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Todos os Grátis
          </button>
          <button
            onClick={() => handleTabChange('demo')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1 ${
              filter.type === 'demo' || filter.priceCategory === 'demo'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>Demos Jogáveis</span>
          </button>
          <button
            onClick={() => handleTabChange('f2p')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1 ${
              filter.type === 'f2p' || filter.priceCategory === 'f2p'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            <span>Free-to-Play</span>
          </button>
          <button
            onClick={() => handleTabChange('free_game')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1 ${
              filter.type === 'free_game' || filter.priceCategory === 'free_game'
                ? 'bg-emerald-400 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>100% Grátis (Indie)</span>
          </button>
        </div>

        {/* Advanced Filters Expand Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
            showAdvanced || isFilterActive
              ? 'border-cyan-500/80 bg-cyan-950/40 text-cyan-300 shadow-sm shadow-cyan-500/10'
              : 'border-slate-700/80 bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
          <span>Filtros Avançados</span>
          {filter.selectedTags.length > 0 && (
            <span className="rounded-full bg-cyan-500 text-slate-950 px-1.5 py-0.2 text-[10px] font-bold">
              {filter.selectedTags.length}
            </span>
          )}
          {showAdvanced ? (
            <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="rounded-xl border border-slate-800 bg-[#111622] p-5 shadow-xl space-y-6">
          {/* Section 1: Main Dropdowns (Genre, Price, Release Date, Popularity) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Genre Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Gamepad2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Gênero Principal</span>
              </label>
              <select
                value={filter.genre}
                onChange={(e) =>
                  onChangeFilter({ ...filter, genre: e.target.value })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                {GENRE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Price / Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                <span>Preço & Categoria</span>
              </label>
              <select
                value={filter.priceCategory}
                onChange={(e) =>
                  handlePriceCategoryChange(e.target.value as FilterState['priceCategory'])
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">Todos os Tipos Grátis</option>
                <option value="demo">Apenas Demos Jogáveis (Demos)</option>
                <option value="f2p">Free to Play (Jogos Online / F2P)</option>
                <option value="free_game">100% Grátis (Indie / Sem Microtransação)</option>
              </select>
            </div>

            {/* 3. Release Date Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                <span>Data de Lançamento</span>
              </label>
              <select
                value={filter.releaseYear}
                onChange={(e) =>
                  onChangeFilter({
                    ...filter,
                    releaseYear: e.target.value as FilterState['releaseYear'],
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">Qualquer Período</option>
                <option value="2024_plus">Lançamentos Recentes (2024 / 2025)</option>
                <option value="2023">Ano de 2023</option>
                <option value="2020_2022">Entre 2020 e 2022</option>
                <option value="classics">Clássicos Consagrados (Antes de 2020)</option>
              </select>
            </div>

            {/* 4. Popularity / Playerbase Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-indigo-400" />
                <span>Popularidade / Jogadores</span>
              </label>
              <select
                value={filter.popularity}
                onChange={(e) =>
                  onChangeFilter({
                    ...filter,
                    popularity: e.target.value as FilterState['popularity'],
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">Todas as Faixas de Jogadores</option>
                <option value="massive">Gigantes (+50.000 jogadores ativos)</option>
                <option value="high">Alta Popularidade (+10.000 jogadores)</option>
                <option value="indie">Joias Indie & Singleplayer (&lt;10.000 jogadores)</option>
              </select>
            </div>
          </div>

          {/* Section 2: Secondary Controls (Platform, Minimum Rating, Sorting, PT-BR) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-slate-800/80 pt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Plataforma
              </label>
              <select
                value={filter.platform}
                onChange={(e) =>
                  onChangeFilter({
                    ...filter,
                    platform: e.target.value as FilterState['platform'],
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">Todas (Windows, Deck, Mac, Linux)</option>
                <option value="windows">Windows PC</option>
                <option value="steamdeck">Steam Deck Verificado</option>
                <option value="linux">Linux / SteamOS</option>
                <option value="mac">macOS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nota Mínima na Steam
              </label>
              <select
                value={filter.minRating}
                onChange={(e) =>
                  onChangeFilter({
                    ...filter,
                    minRating: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value={0}>Qualquer Avaliação</option>
                <option value={80}>Positivas (80%+ aprovação)</option>
                <option value={90}>Muito Positivas (90%+ aprovação)</option>
                <option value={95}>Extremamente Positivas (95%+ aprovação)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <ArrowUpDown className="h-3 w-3" />
                <span>Ordenar Resultados</span>
              </label>
              <select
                value={filter.sortBy}
                onChange={(e) =>
                  onChangeFilter({
                    ...filter,
                    sortBy: e.target.value as FilterState['sortBy'],
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="popular">Mais Populares (Jogadores Ativos)</option>
                <option value="rating">Maior Avaliação Positiva (%)</option>
                <option value="reviews">Maior Quantidade de Análises</option>
                <option value="newest">Mais Recentes</option>
                <option value="name">Ordem Alfabética (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Interactive Tags Selector with dedicated Tag Search */}
          <div className="border-t border-slate-800/80 pt-4 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Filtrar por Tags da Comunidade Steam
                </span>
                {filter.selectedTags.length > 0 && (
                  <span className="text-[11px] text-cyan-300 font-mono">
                    ({filter.selectedTags.length} selecionadas)
                  </span>
                )}
              </div>

              {/* Tag Search Input */}
              <div className="w-full sm:w-48">
                <input
                  type="text"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="Pesquisar tags..."
                  className="w-full rounded border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Interactive Clickable Tags (Allowed button filter pills) */}
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-950/40 rounded-lg border border-slate-800/60">
              {visibleTags.map((tag) => {
                const isSelected = filter.selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm shadow-cyan-500/30'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: PT-BR Checkbox & Clear Button */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-4 gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={filter.ptBrOnly}
                onChange={(e) =>
                  onChangeFilter({ ...filter, ptBrOnly: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="font-medium">
                Apenas com suporte ao Português (PT-BR: dublado ou legendado)
              </span>
            </label>

            {isFilterActive && (
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-rose-400 hover:border-rose-500/50 hover:bg-rose-950/20 hover:text-rose-300 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Limpar Todos os Filtros</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Filter Indicators Bar (if any active) */}
      {isFilterActive && (
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-slate-400">Filtros ativos:</span>

          {filter.priceCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-200 px-2 py-0.5 rounded text-[11px]">
              Preço: {filter.priceCategory === 'demo' ? 'Demos' : filter.priceCategory === 'f2p' ? 'Free-to-Play' : '100% Grátis'}
              <button
                onClick={() => handlePriceCategoryChange('all')}
                className="hover:text-rose-400 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filter.genre !== 'Todos' && (
            <span className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-200 px-2 py-0.5 rounded text-[11px]">
              Gênero: {filter.genre}
              <button
                onClick={() => onChangeFilter({ ...filter, genre: 'Todos' })}
                className="hover:text-rose-400 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filter.selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-cyan-950/80 border border-cyan-800/60 text-cyan-200 px-2 py-0.5 rounded text-[11px]"
            >
              Tag: {tag}
              <button
                onClick={() => removeSingleTag(tag)}
                className="hover:text-rose-400 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {filter.releaseYear !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-200 px-2 py-0.5 rounded text-[11px]">
              Ano:{' '}
              {filter.releaseYear === '2024_plus'
                ? '2024+'
                : filter.releaseYear === '2023'
                ? '2023'
                : filter.releaseYear === '2020_2022'
                ? '2020-2022'
                : 'Clássicos'}
              <button
                onClick={() => onChangeFilter({ ...filter, releaseYear: 'all' })}
                className="hover:text-rose-400 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filter.popularity !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-200 px-2 py-0.5 rounded text-[11px]">
              Popularidade:{' '}
              {filter.popularity === 'massive'
                ? 'Gigantes'
                : filter.popularity === 'high'
                ? 'Alta'
                : 'Indie'}
              <button
                onClick={() => onChangeFilter({ ...filter, popularity: 'all' })}
                className="hover:text-rose-400 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetAllFilters}
            className="text-[11px] text-cyan-400 hover:underline ml-1"
          >
            Limpar todos
          </button>
        </div>
      )}

      {/* Results Header / Unboxed text metadata */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-2">
          <span>
            Mostrando <strong className="font-mono text-slate-200 font-semibold">{resultsCount}</strong> títulos
          </span>
          <span aria-hidden="true">·</span>
          <span>Demos e jogos 100% gratuitos verificados</span>
        </div>

        <span className="hidden sm:inline text-slate-500">
          Clique no card para abrir especificações completas
        </span>
      </div>
    </div>
  );
};
