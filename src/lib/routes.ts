// O app é exportado como site estático (GitHub Pages), que não serve rotas
// dinâmicas do tipo /racquets/[id]. Por isso os detalhes usam query string.

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const routes = {
  home: "/",
  racquets: "/racquets",
  newRacquet: (playerId?: string) =>
    playerId ? `/racquets/new?player=${playerId}` : "/racquets/new",
  racquet: (id: string) => `/racquet?id=${id}`,

  players: "/players",
  player: (id: string) => `/player?id=${id}`,

  newJob: (racquetId?: string) =>
    racquetId ? `/jobs/new?racquet=${racquetId}` : "/jobs/new",
  job: (id: string) => `/job?id=${id}`,

  stock: "/stock",
  settings: "/settings",
};

/** URL absoluta — usada no QR Code colado na raquete */
export function absoluteUrl(path: string): string {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${BASE}${path}`;
}
