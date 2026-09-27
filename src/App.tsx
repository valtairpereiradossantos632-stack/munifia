import React, { useState, useEffect, useMemo } from 'react';
import { STEAM_GAMES_DATABASE } from './data/steamGames';
import { SteamGame, FilterState, UserLibraryItem, GameType } from './types/game';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { GameCard } from './components/GameCard';
import { GameDetailModal } from './components/GameDetailModal';
import { MyLibraryModal } from './components/MyLibraryModal';
import { RandomGameModal } from './components/RandomGameModal';
import { SteamProtocolModal } from './components/SteamProtocolModal';
import { AppIdLookupModal } from './components/AppIdLookupModal';
import { Footer } from './components/Footer';
import { searchSteamStoreLive } from './services/steamApi';
import { BookmarkCheck, Search, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'steamvault_saved_games';

export default function App() {
  // Master games list
  const [games, setGames] = useState<SteamGame[]>(STEAM_GAMES_DATABASE);
  const [library, setLibrary] = useState<UserLibraryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Filter state with advanced filters
  const [filter, setFilter] = useState<FilterState>({
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

  // Modals state
  const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isRandomOpen, setIsRandomOpen] = useState(false);
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  // Live Steam searching state
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save library to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    } catch {
      // ignore
    }
  }, [library]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Toggle Save Game
  const handleToggleSave = (game: SteamGame) => {
    const exists = library.some((li) => li.appId === game.appId);
    if (exists) {
      setLibrary((prev) => prev.filter((li) => li.appId !== game.appId));
      showToast(`"${game.title}" removido da sua coleção.`);
    } else {
      const newItem: UserLibraryItem = {
        appId: game.appId,
        status: 'want_to_play',
        addedAt: new Date().toISOString(),
      };
      setLibrary((prev) => [newItem, ...prev]);
      showToast(`"${game.title}" adicionado à sua coleção!`);
    }
  };

  const handleToggleLibraryStatus = (appId: number) => {
    setLibrary((prev) =>
      prev.map((li) => {
        if (li.appId === appId) {
          const nextStatus = li.status === 'want_to_play' ? 'played' : 'want_to_play';
          return { ...li, status: nextStatus };
        }
        return li;
      })
    );
  };

  const handleClearLibrary = () => {
    if (window.confirm('Tem certeza de que deseja limpar sua coleção salva?')) {
      setLibrary([]);
      showToast('Coleção esvaziada.');
    }
  };

  // Live search trigger
  const handleLiveSearchSteam = async () => {
    if (!filter.searchQuery.trim()) return;
    setIsLiveSearching(true);
    try {
      const liveResults = await searchSteamStoreLive(filter.searchQuery);
      if (liveResults.length > 0) {
        // Merge without duplicates
        const existingIds = new Set(games.map((g) => g.appId));
        const newItems = liveResults.filter((g) => !existingIds.has(g.appId));
        if (newItems.length > 0) {
          setGames((prev) => [...prev, ...newItems]);
          showToast(`${newItems.length} novos títulos encontrados na Steam Store!`);
        } else {
          showToast(`Resultados já disponíveis no catálogo.`);
        }
      } else {
        showToast('Nenhum resultado adicional encontrado na Steam Store.');
      }
    } catch {
      showToast('Erro ao consultar loja online da Steam.');
    } finally {
      setIsLiveSearching(false);
    }
  };

  // Filtered & Sorted Games Computation
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Search query
        if (filter.searchQuery.trim()) {
          const q = filter.searchQuery.toLowerCase().trim();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchDev = game.developer.toLowerCase().includes(q);
          const matchPub = game.publisher.toLowerCase().includes(q);
          const matchTag = game.tags.some((t) => t.toLowerCase().includes(q));
          const matchGenre = game.genres.some((g) => g.toLowerCase().includes(q));
          const matchAppId = game.appId.toString() === q;
          if (!matchTitle && !matchDev && !matchPub && !matchTag && !matchGenre && !matchAppId) {
            return false;
          }
        }

        // Price / Category Filter
        const activeType = filter.priceCategory !== 'all' ? filter.priceCategory : filter.type;
        if (activeType !== 'all') {
          if (activeType === 'demo' && game.type !== 'demo') return false;
          if (activeType === 'f2p' && game.type !== 'f2p') return false;
          if (activeType === 'free_game' && game.type !== 'free_game') return false;
        }

        // Genre Filter
        if (filter.genre !== 'Todos') {
          if (!game.genres.includes(filter.genre)) return false;
        }

        // Tags Filter (game must match at least one selected tag if any selected)
        if (filter.selectedTags.length > 0) {
          const hasSelectedTag = filter.selectedTags.some((tag) =>
            game.tags.includes(tag)
          );
          if (!hasSelectedTag) return false;
        }

        // Release Year Filter
        if (filter.releaseYear !== 'all') {
          const yearMatch = game.releaseDate.match(/\b(20\d\d)\b/);
          const year = yearMatch ? parseInt(yearMatch[1], 10) : 2020;
          if (filter.releaseYear === '2024_plus' && year < 2024) return false;
          if (filter.releaseYear === '2023' && year !== 2023) return false;
          if (filter.releaseYear === '2020_2022' && (year < 2020 || year > 2022)) return false;
          if (filter.releaseYear === 'classics' && year >= 2020) return false;
        }

        // Popularity Filter
        if (filter.popularity !== 'all') {
          const players = game.activePlayers || 0;
          const reviews = game.reviewCount || 0;
          if (filter.popularity === 'massive' && players < 50000 && reviews < 500000) {
            return false;
          }
          if (
            filter.popularity === 'high' &&
            (players < 10000 || players >= 50000) &&
            (reviews < 30000 || reviews >= 500000)
          ) {
            return false;
          }
          if (filter.popularity === 'indie' && (players >= 10000 || reviews >= 30000)) {
            return false;
          }
        }

        // Platform Filter
        if (filter.platform === 'windows' && !game.platforms.windows) return false;
        if (filter.platform === 'linux' && !game.platforms.linux) return false;
        if (filter.platform === 'mac' && !game.platforms.mac) return false;
        if (filter.platform === 'steamdeck' && game.steamDeck !== 'verified') return false;

        // Rating Filter
        if (filter.minRating > 0 && game.rating < filter.minRating) return false;

        // PT-BR Filter
        if (
          filter.ptBrOnly &&
          !game.languages.ptBrAudio &&
          !game.languages.ptBrInterface &&
          !game.languages.ptBrSubtitles
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'rating') return b.rating - a.rating;
        if (filter.sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        if (filter.sortBy === 'name') return a.title.localeCompare(b.title);
        if (filter.sortBy === 'newest') {
          return b.releaseDate.localeCompare(a.releaseDate);
        }
        // Default: Popular (active players or review count)
        const aScore = (a.activePlayers || 0) * 10 + a.reviewCount;
        const bScore = (b.activePlayers || 0) * 10 + b.reviewCount;
        return bScore - aScore;
      });
  }, [games, filter]);

  // Saved Games full objects
  const savedGamesList = useMemo(() => {
    const savedIds = new Set(library.map((li) => li.appId));
    return games.filter((g) => savedIds.has(g.appId));
  }, [games, library]);

  // Metrics
  const demosCount = useMemo(() => games.filter((g) => g.type === 'demo').length, [games]);
  const f2pCount = useMemo(() => games.filter((g) => g.type === 'f2p').length, [games]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-slate-900/95 px-4 py-3 text-xs font-semibold text-cyan-200 shadow-2xl backdrop-blur-md transition-all animate-bounce">
          <BookmarkCheck className="h-4 w-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract (3 zones) */}
      <Header
        activeTab={filter.type}
        onSelectTab={(tab) => {
          if (tab === 'library') {
            setIsLibraryOpen(true);
          } else {
            setFilter({
              ...filter,
              type: tab,
              priceCategory: tab === 'all' ? 'all' : (tab as any),
            });
          }
        }}
        savedCount={library.length}
        onOpenRandom={() => setIsRandomOpen(true)}
        onOpenLookup={() => setIsLookupOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        totalCount={games.length}
        demosCount={demosCount}
        f2pCount={f2pCount}
        onOpenProtocolHelp={() => setIsProtocolOpen(true)}
        onQuickFilter={(type) => {
          setFilter({
            ...filter,
            type,
            priceCategory: type,
          });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Advanced Filters Bar */}
        <FilterBar
          filter={filter}
          onChangeFilter={setFilter}
          resultsCount={filteredGames.length}
        />

        {/* Live Search Steam Store Banner (if search query entered) */}
        {filter.searchQuery.trim().length > 2 && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-cyan-800/40 bg-cyan-950/20 p-3.5 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Search className="h-4 w-4 text-cyan-400" />
                <span>
                  Quer buscar &quot;<strong>{filter.searchQuery}</strong>&quot; também em tempo real na loja da Steam oficial?
                </span>
              </div>
              <button
                onClick={handleLiveSearchSteam}
                disabled={isLiveSearching}
                className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors disabled:opacity-50 shrink-0 self-start sm:self-auto"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLiveSearching ? 'animate-spin' : ''}`} />
                <span>{isLiveSearching ? 'Buscando na Loja...' : 'Buscar na Loja Steam'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Game Cards Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isSaved={library.some((li) => li.appId === game.appId)}
                  onToggleSave={handleToggleSave}
                  onOpenDetails={(g) => setSelectedGame(g)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 py-16 px-4 text-center">
              <AlertCircle className="h-10 w-10 text-slate-500 mb-3" />
              <h3 className="font-display text-lg font-bold text-white">
                Nenhum jogo encontrado com os filtros atuais
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-md">
                Tente ajustar os filtros de gênero, tags ou termos de busca para encontrar mais jogos gratuitos e demos.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() =>
                    setFilter({
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
                    })
                  }
                  className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors"
                >
                  Redefinir Filtros
                </button>
                {filter.searchQuery.trim() && (
                  <button
                    onClick={handleLiveSearchSteam}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    Buscar na Loja Steam Online
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <GameDetailModal
        game={selectedGame}
        isOpen={Boolean(selectedGame)}
        onClose={() => setSelectedGame(null)}
        isSaved={selectedGame ? library.some((li) => li.appId === selectedGame.appId) : false}
        onToggleSave={handleToggleSave}
      />

      <MyLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedGames={savedGamesList}
        libraryItems={library}
        onToggleStatus={handleToggleLibraryStatus}
        onRemoveGame={handleToggleSave}
        onOpenDetails={(g) => {
          setIsLibraryOpen(false);
          setSelectedGame(g);
        }}
        onClearLibrary={handleClearLibrary}
      />

      <RandomGameModal
        isOpen={isRandomOpen}
        onClose={() => setIsRandomOpen(false)}
        games={games}
        onOpenDetails={(g) => setSelectedGame(g)}
      />

      <SteamProtocolModal
        isOpen={isProtocolOpen}
        onClose={() => setIsProtocolOpen(false)}
      />

      <AppIdLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onOpenDetails={(g) => setSelectedGame(g)}
      />
    </div>
  );
}
