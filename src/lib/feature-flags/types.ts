/**
 * Tipos e interfaces para a camada de abstração de Feature Flags.
 *
 * Formato alinhado ao AWS AppConfig Feature Flags nativo:
 * cada flag é um objeto com `enabled: boolean` e atributos adicionais.
 */

import Stringifier from 'postcss/lib/stringifier'
import React from 'react'

// --------------------------------------------------------------------------------
// Flag value types
// --------------------------------------------------------------------------------

/** Tipos permitidos como valor de retorno de `getFlagValue<T>`. */
export type FlagPrimitive = string | number | boolean | Record<string, unknown>

/** Representação de uma única flag no formato AppConfig nativo. */
export interface FlagEntry {
  enabled: boolean
  [attribute: string]: unknown
}

/** Mapa completo de flags retornado pelo provider (payload do AppConfig). */
export type FlagValueMap = Record<string, FlagEntry>

// --------------------------------------------------------------------------------
// Provider strategy
// --------------------------------------------------------------------------------

/** Interface Strategy para abstração do data source de flags. */
export interface FeatureFlagDataProvider {
  fetchFlags(): Promise<FlagValueMap>
}

// --------------------------------------------------------------------------------
// Client-side context state
// --------------------------------------------------------------------------------

/** Shape do React Context exposto pelos hooks client-side */
export interface FeatureFlagClientState {
  /** Mapa completo de flags carregadas. */
  flags: FlagValueMap
  /** `true`durante o primeiro fetch (antes de qualquer dado estar disponível). */
  isLoading: boolean
  /** Último erro ocorrido durante o fetch (ou `null`). */
  error: Error | null
  /** Retorna `true`se a flag existir e estiver habilitada. */
  isEnabled(flagName: string): boolean
  /** Retorna o valor tipado de um atributo da flag, ou `defaultValue` */
  getFlagValue<T extends FlagPrimitive>(flagName: string, defaultValue: T): T
  /** Retorna todos os atributos da flag (exceto `enabled`), ou `null` se não existir. */
  getFlagAttributes(flagName: string): Record<string, unknown> | null
}

// ---------------------------------------------------------------------------------
// Provider component props
// ---------------------------------------------------------------------------------

export interface FeatureFlagProviderProps {
  children: React.ReactNode
  /** Provider customizado; se omitido, usa LocalStorageProvider. */
  provider?: FeatureFlagDataProvider
  /** Intervalo de polling em ms (default: 30000). Use `0` para desabilitar polling. */
  pollingInterval?: number
  /** Flags pré-carregadas no server (hydration). */
  initialFlags?: FlagValueMap
}
