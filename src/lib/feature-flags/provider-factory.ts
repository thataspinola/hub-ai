import { LocalStorageProvider } from './providers/local-storage-provider'
import { AppConfigProvider } from './providers/appconfig-provider'
import type { FeatureFlagDataProvider } from './types'

export function configuredFlagProvider(
  environment: Record<string, string | undefined> = process.env
): FeatureFlagDataProvider {
  const name = environment.FEATURE_FLAGS_PROVIDER || 'localStorage'
  if (name === 'localStorage') return new LocalStorageProvider()
  if (name !== 'appconfig') throw new Error('Unknown feature flag provider')

  const {
    APPCONFIG_APPLICATION_ID,
    APPCONFIG_ENVIRONMENT_ID,
    APPCONFIG_CONFIGURATION_PROFILE_ID,
  } = environment

  if (
    !APPCONFIG_APPLICATION_ID ||
    !APPCONFIG_ENVIRONMENT_ID ||
    !APPCONFIG_CONFIGURATION_PROFILE_ID
  ) {
    throw new Error('AppConfig identifiers are required')
  }

  return new AppConfigProvider({
    applicationId: APPCONFIG_APPLICATION_ID,
    environmentId: APPCONFIG_ENVIRONMENT_ID,
    configurationProfileId: APPCONFIG_CONFIGURATION_PROFILE_ID,
    endpoint: environment.APPCONFIG_AGENT_ENDPOINT,
  })
}
