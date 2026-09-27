export type GameType = 'all' | 'demo' | 'f2p' | 'free_game' | 'prologue';

export type SteamDeckStatus = 'verified' | 'playable' | 'unsupported' | 'unknown';

export interface SystemRequirements {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
}

export interface SteamGame {
  id: string;
  appId: number;
  demoAppId?: number;
  title: string;
  type: 'demo' | 'f2p' | 'free_game' | 'prologue';
  typeLabel: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  coverImage: string;
  heroImage?: string;
  screenshots: string[];
  rating: number; // percentage positive reviews e.g. 96
  ratingLabel: string;
  reviewCount: number;
  activePlayers?: number;
  storageGb: number;
  genres: string[];
  tags: string[];
  platforms: {
    windows: boolean;
    linux: boolean;
    mac: boolean;
  };
  steamDeck: SteamDeckStatus;
  languages: {
    ptBrAudio: boolean;
    ptBrInterface: boolean;
    ptBrSubtitles: boolean;
  };
  shortDescription: string;
  longDescription: string;
  systemRequirements: {
    minimum: SystemRequirements;
    recommended?: SystemRequirements;
  };
  steamUrl: string;
  steamInstallUrl: string;
  steamRunUrl: string;
  highlight?: boolean;
}

export interface FilterState {
  searchQuery: string;
  type: GameType;
  genre: string;
  selectedTags: string[];
  priceCategory: 'all' | 'f2p' | 'demo' | 'free_game';
  releaseYear: 'all' | '2024_plus' | '2023' | '2020_2022' | 'classics';
  popularity: 'all' | 'massive' | 'high' | 'indie';
  platform: 'all' | 'windows' | 'linux' | 'mac' | 'steamdeck';
  minRating: number;
  ptBrOnly: boolean;
  sortBy: 'popular' | 'rating' | 'reviews' | 'name' | 'newest';
}

export interface UserLibraryItem {
  appId: number;
  status: 'want_to_play' | 'played';
  addedAt: string;
  notes?: string;
}
