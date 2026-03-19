'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  FeatureFlagClientState,
  FeatureFlagProviderProps,
  FlagPrimitive,
  FlagValueMap,
} from './types';
import { LocalStorageProvider } from './providers/local-storage-provider';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const FeatureFlagContext = createContext<FeatureFlagClientState | null>(null);

// ---------------------------------------------------------------------------
// Helper: extrai atributos (sem `enabled`) de uma flag entry
// ---------------------------------------------------------------------------

function extractAttributes(
  flags: FlagValueMap,
  flagName: string,
): Record<string, unknown> | null {
  const entry = flags[flagName];
  if (!entry) return null;
  const { enabled: _enabled, ...attributes } = entry;
  return attributes;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

const DEFAULT_POLLING_INTERVAL = 30_000;

export function FeatureFlagProvider({
  children,
  provider,
  pollingInterval = DEFAULT_POLLING_INTERVAL,
  initialFlags,
}: FeatureFlagProviderProps) {
  const dataProvider = useRef(provider ?? new LocalStorageProvider());

  const [flags, setFlags] = useState<FlagValueMap>(initialFlags ?? {});
  const [isLoading, setIsLoading] = useState(!initialFlags);
  const [error, setError] = useState<Error | null>(null);

  // Fetch flags do provider
  const fetchFlags = useCallback(async (isInitial: boolean) => {
    try {
      const data = await dataProvider.current.fetchFlags();
      setFlags(data);
      setError(null);
      if (isInitial) setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      // Nos fetches subsequentes, mantém o último estado válido
      if (isInitial) setIsLoading(false);
    }
  }, []);

  // Fetch inicial (apenas se não há initialFlags)
  useEffect(() => {
    if (!initialFlags) {
      fetchFlags(true);
    }
  }, [initialFlags, fetchFlags]);

  // Polling periódico
  useEffect(() => {
    if (pollingInterval <= 0) return;

    const id = setInterval(() => fetchFlags(false), pollingInterval);
    return () => clearInterval(id);
  }, [pollingInterval, fetchFlags]);

  // Métodos de leitura memoizados
  const isEnabled = useCallback(
    (flagName: string): boolean => flags[flagName]?.enabled ?? false,
    [flags],
  );

  const getFlagValue = useCallback(
    <T extends FlagPrimitive>(flagName: string, defaultValue: T): T => {
      const entry = flags[flagName];
      if (!entry || entry.variant === undefined) return defaultValue;
      return entry.variant as T;
    },
    [flags],
  );

  const getFlagAttributes = useCallback(
    (flagName: string): Record<string, unknown> | null =>
      extractAttributes(flags, flagName),
    [flags],
  );

  // Context value memoizado para evitar re-renders desnecessários
  const value = useMemo<FeatureFlagClientState>(
    () => ({
      flags,
      isLoading,
      error,
      isEnabled,
      getFlagValue,
      getFlagAttributes,
    }),
    [flags, isLoading, error, isEnabled, getFlagValue, getFlagAttributes],
  );

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useFeatureFlagContext(): FeatureFlagClientState {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) {
    throw new Error(
      'useFeatureFlags deve ser usado dentro de <FeatureFlagProvider>',
    );
  }
  return ctx;
}

/** Acesso completo ao estado de feature flags. */
export function useFeatureFlags(): FeatureFlagClientState {
  return useFeatureFlagContext();
}

/** Retorna `true` se a flag existir e estiver habilitada. */
export function useIsEnabled(flagName: string): boolean {
  const { isEnabled } = useFeatureFlagContext();
  return useMemo(() => isEnabled(flagName), [isEnabled, flagName]);
}

/** Retorna o valor tipado de um atributo da flag, ou `defaultValue`. */
export function useFlagValue<T extends FlagPrimitive>(
  flagName: string,
  defaultValue: T,
): T {
  const { getFlagValue } = useFeatureFlagContext();
  return useMemo(
    () => getFlagValue<T>(flagName, defaultValue),
    [getFlagValue, flagName, defaultValue],
  );
}

/** Retorna os atributos da flag (exceto `enabled`), ou `null`. */
export function useFlagAttributes(
  flagName: string,
): Record<string, unknown> | null {
  const { getFlagAttributes } = useFeatureFlagContext();
  return useMemo(
    () => getFlagAttributes(flagName),
    [getFlagAttributes, flagName],
  );
}
