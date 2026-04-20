export const LOGIN_HASH = '#/login';

export const tabToHash: Record<string, string> = {
  marketplace: '#/marketplace',
  hubs: '#/hubs',
  freights: '#/monitorizacao',
  loads: '#/cargas',
  team: '#/equipa',
  'bi-overview': '#/bi/visao-geral',
  'agricultural-production': '#/bi/producao-agricola',
  geointelligence: '#/bi/geointeligencia',
  'producers-farms': '#/bi/produtores-fazendas',
  'price-demand': '#/bi/precos-demanda',
  reports: '#/bi/relatorios',
};

export const hashToTab = Object.entries(tabToHash).reduce<Record<string, string>>((acc, [tab, hash]) => {
  acc[hash] = tab;
  return acc;
}, {});

export const DEFAULT_TAB = 'bi-overview';
export const DEFAULT_APP_HASH = tabToHash[DEFAULT_TAB];

export function normalizeHash(rawHash?: string) {
  if (!rawHash || rawHash === '#') {
    return DEFAULT_APP_HASH;
  }

  return rawHash.startsWith('#/') ? rawHash : `#/${rawHash.replace(/^#?\/?/, '')}`;
}

export function getTabFromHash(rawHash?: string) {
  const hash = normalizeHash(rawHash);
  return hashToTab[hash] ?? DEFAULT_TAB;
}

export function getHashForTab(tab: string) {
  return tabToHash[tab] ?? DEFAULT_APP_HASH;
}

export function isLoginHash(rawHash?: string) {
  return normalizeHash(rawHash) === LOGIN_HASH;
}

export function isProtectedHash(rawHash?: string) {
  const hash = normalizeHash(rawHash);
  return hash !== LOGIN_HASH;
}
