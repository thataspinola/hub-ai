import type { FeatureFlagDataProvider, FlagEntry, FlagPrimitive, FlagValueMap } from './types';
import { LocalStorageProvider } from './providers/local-storage-provider';

// ---------------------------------------------------------------------------
// Cache em memória com TTL
// ---------------------------------------------------------------------------

interface CacheEntry {
  data: FlagValueMap;
  timestamp: number;
}

const DEFAULT_TTL_MS = 30_000; // 30 segundos

let cache: CacheEntry | null = null;
let cacheTtl = DEFAULT_TTL_MS;

/** Permite substituir o TTL do cache (útil para testes). */
export function setCacheTtl(ms: number): void {
  cacheTtl = ms;
}

/** Invalida o cache manualmente (útil para testes e revalidação forçada). */
export function invalidateCache(): void {
  cache = null;
}

// ---------------------------------------------------------------------------
// Provider resolution
// ---------------------------------------------------------------------------

let providerOverride: FeatureFlagDataProvider | null = null;

/** Permite injetar um provider customizado (útil para testes). */
export function setProvider(provider: FeatureFlagDataProvider | null): void {
  providerOverride = provider;
}

function getProvider(): FeatureFlagDataProvider {
  if (providerOverride) return providerOverride;

  // TODO: quando o AppConfig estiver configurado, selecionar via env var:
  // const providerType = process.env.FEATURE_FLAGS_PROVIDER ?? 'localStorage';
  // if (providerType === 'appconfig') return new AppConfigProvider({...});

  return new LocalStorageProvider();
}

// ---------------------------------------------------------------------------
// Public API — server-side functions
// ---------------------------------------------------------------------------

/**
 * Busca todas as feature flags (com cache em memória).
 * Uso ideal em React Server Components e Server Actions.
 */
export async function getFeatureFlags(): Promise<FlagValueMap> {
  const now = Date.now();

  if (cache && now - cache.timestamp < cacheTtl) {
    return cache.data;
  }

  const provider = getProvider();
  const data = await provider.fetchFlags();

  cache = { data, timestamp: now };
  return data;
}

/**
 * Retorna `true` se a flag existir e estiver habilitada.
 * Retorna `false` como fallback seguro para flags inexistentes.
 */
export async function isEnabled(flagName: string): Promise<boolean> {
  const flags = await getFeatureFlags();
  return flags[flagName]?.enabled ?? false;
}

/**
 * Retorna o valor tipado de um atributo da flag.
 *
 * Por convenção, o atributo `variant` é usado como valor principal
 * da flag multivariante. Caso a flag ou o atributo não exista,
 * retorna `defaultValue`.
 *
 * @example
 * const color = await getFlagValue<string>('theme_color', 'blue');
 * const limit = await getFlagValue<number>('rate_limit', 100);
 */
export async function getFlagValue<T extends FlagPrimitive>(
  flagName: string,
  defaultValue: T,
): Promise<T> {
  const flags = await getFeatureFlags();
  const entry: FlagEntry | undefined = flags[flagName];

  if (!entry || entry.variant === undefined) {
    return defaultValue;
  }

  return entry.variant as T;
}

/**
 * Retorna todos os atributos da flag (exceto `enabled`), ou `null`
 * se a flag não existir.
 */
export async function getFlagAttributes(
  flagName: string,
): Promise<Record<string, unknown> | null> {
  const flags = await getFeatureFlags();
  const entry = flags[flagName];

  if (!entry) return null;

  const { enabled: _enabled, ...attributes } = entry;
  return attributes;
}
