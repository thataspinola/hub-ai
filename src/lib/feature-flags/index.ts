// Barrel exports para a camada de Feature Flags

// Tipos
export type {
  FlagPrimitive,
  FlagEntry,
  FlagValueMap,
  FeatureFlagDataProvider,
  FeatureFlagClientState,
  FeatureFlagProviderProps,
} from './types'

// Providers
export {
  LocalStorageProvider,
  SEED_FLAGS,
} from './providers/local-storage-provider'

export { AppConfigProvider } from './providers/appconfig-provider'
export type { AppConfigProviderOptions } from './providers/appconfig-provider'
