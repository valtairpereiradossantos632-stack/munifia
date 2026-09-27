import { SteamGame } from '../types/game';
import { STEAM_GAMES_DATABASE } from '../data/steamGames';

export interface SteamSearchResult {
  id: number;
  name: string;
  price?: {
    initial: number;
    final: number;
    discount_percent: number;
    currency: string;
  };
  tiny_image: string;
  metascore?: string;
}

export async function searchSteamStoreLive(query: string): Promise<SteamGame[]> {
  if (!query.trim()) return [];

  // Check if query is a numeric AppID or Steam URL
  const numericMatch = query.match(/(\d{3,9})/);
  const potentialAppId = numericMatch ? parseInt(numericMatch[1], 10) : null;

  try {
    const url = `/api/steam/api/storesearch/?term=${encodeURIComponent(query)}&l=brazilian&cc=br`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error('Steam API response not ok');
    const data = await res.json();

    if (data && Array.isArray(data.items)) {
      const parsedGames: SteamGame[] = data.items.map((item: any) => {
        const isFree = item.price ? item.price.final === 0 : true;
        const isDemo = item.name.toLowerCase().includes('demo') || item.name.toLowerCase().includes('prólogo');
        const type: SteamGame['type'] = isDemo ? 'demo' : (isFree ? 'f2p' : 'demo');
        const typeLabel = isDemo ? 'Demo Jogável' : (isFree ? 'Gratuito / Free' : 'Demo na Loja');

        return {
          id: `steam-live-${item.id}`,
          appId: item.id,
          demoAppId: item.id,
          title: item.name,
          type,
          typeLabel,
          developer: 'Steam Developer',
          publisher: 'Steam Publisher',
          releaseDate: 'Disponível na Steam',
          coverImage: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${item.id}/header.jpg`,
          screenshots: [
            `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${item.id}/header.jpg`
          ],
          rating: item.metascore ? parseInt(item.metascore, 10) : 85,
          ratingLabel: 'Disponível na Loja',
          reviewCount: 1000,
          storageGb: 5,
          genres: ['Steam Store', 'PC Game'],
          tags: [isDemo ? 'Demo' : 'Grátis', 'Steam Oficial'],
          platforms: {
            windows: true,
            linux: true,
            mac: false,
          },
          steamDeck: 'playable',
          languages: {
            ptBrAudio: false,
            ptBrInterface: true,
            ptBrSubtitles: true,
          },
          shortDescription: `Título encontrado diretamente no catálogo oficial da Steam. Verifique os botões para abrir ou instalar instantaneamente no seu cliente Steam.`,
          longDescription: `Jogo indexado na loja da Steam. Use o botão Instalar na Steam para abrir diretamente o instalador no seu PC ou acesse a página oficial da loja.`,
          systemRequirements: {
            minimum: {
              os: 'Windows 10 64-bit',
              processor: 'Intel / AMD Dual Core',
              memory: '4 GB RAM',
              graphics: 'Compatível com DirectX 11',
              storage: 'Consulte a página da Steam',
            }
          },
          steamUrl: `https://store.steampowered.com/app/${item.id}`,
          steamInstallUrl: `steam://install/${item.id}`,
          steamRunUrl: `steam://run/${item.id}`,
        };
      });
      return parsedGames;
    }
  } catch {
    // If live search fails (e.g. offline, proxy limit, CORS), filter local database intelligently
  }

  // Fallback to local filter
  const q = query.toLowerCase();
  return STEAM_GAMES_DATABASE.filter(g =>
    g.title.toLowerCase().includes(q) ||
    g.appId.toString() === query.trim() ||
    g.tags.some(t => t.toLowerCase().includes(q)) ||
    g.genres.some(gen => gen.toLowerCase().includes(q)) ||
    (potentialAppId && g.appId === potentialAppId)
  );
}

export async function lookupSteamAppById(appId: number): Promise<SteamGame | null> {
  // Check local first
  const local = STEAM_GAMES_DATABASE.find(g => g.appId === appId);
  if (local) return local;

  try {
    const url = `/api/steam/api/appdetails?appids=${appId}&l=brazilian&cc=br`;
    const res = await fetch(url, { credentials: 'omit', signal: AbortSignal.timeout(4500) });
    if (!res.ok) throw new Error('Steam appdetails not ok');
    const data = await res.json();
    const appData = data[appId]?.data;
    if (!appData) return null;

    const isFree = appData.is_free || false;
    const hasDemos = Array.isArray(appData.demos) && appData.demos.length > 0;
    const isDemo = appData.type === 'demo' || hasDemos;

    return {
      id: `steam-${appId}`,
      appId: appId,
      demoAppId: hasDemos ? appData.demos[0].appid : appId,
      title: appData.name,
      type: isDemo ? 'demo' : (isFree ? 'f2p' : 'free_game'),
      typeLabel: isDemo ? 'Demo Jogável' : (isFree ? 'Gratuito / Free' : 'Steam Game'),
      developer: appData.developers?.join(', ') || 'Desenvolvedor Steam',
      publisher: appData.publishers?.join(', ') || 'Distribuidora',
      releaseDate: appData.release_date?.date || 'Disponível',
      coverImage: appData.header_image || `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`,
      screenshots: appData.screenshots?.map((s: any) => s.path_full) || [],
      rating: appData.metacritic?.score || 88,
      ratingLabel: appData.metacritic?.score ? `${appData.metacritic.score}/100 Metacritic` : 'Muito Positivo',
      reviewCount: 5000,
      storageGb: 10,
      genres: appData.genres?.map((g: any) => g.description) || ['Ação'],
      tags: hasDemos ? ['Demo Disponível', 'Steam'] : ['Steam'],
      platforms: {
        windows: appData.platforms?.windows ?? true,
        linux: appData.platforms?.linux ?? false,
        mac: appData.platforms?.mac ?? false,
      },
      steamDeck: 'verified',
      languages: {
        ptBrAudio: appData.supported_languages?.includes('Português') || false,
        ptBrInterface: appData.supported_languages?.includes('Português') || false,
        ptBrSubtitles: appData.supported_languages?.includes('Português') || false,
      },
      shortDescription: appData.short_description || 'Jogo disponível no catálogo da Steam.',
      longDescription: appData.detailed_description || appData.about_the_game || '',
      systemRequirements: {
        minimum: {
          os: 'Windows 10 (64 bits)',
          processor: 'Dual Core',
          memory: '4 GB RAM',
          graphics: 'Placa gráfica compatível',
          storage: 'Verifique no Steam',
        }
      },
      steamUrl: `https://store.steampowered.com/app/${appId}`,
      steamInstallUrl: `steam://install/${appId}`,
      steamRunUrl: `steam://run/${appId}`,
    };
  } catch {
    return null;
  }
}
