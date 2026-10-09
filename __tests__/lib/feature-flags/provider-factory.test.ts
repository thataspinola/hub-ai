import { configuredFlagProvider } from '@/lib/feature-flags/provider-factory'
import { AppConfigProvider } from '@/lib/feature-flags/providers/appconfig-provider'
it('requires complete AppConfig configuration and rejects typos', () => {
  expect(() => configuredFlagProvider({ FEATURE_FLAGS_PROVIDER: 'appconfig' })).toThrow('identifiers')
  expect(() => configuredFlagProvider({ FEATURE_FLAGS_PROVIDER: 'typo' })).toThrow('Unknown')
  expect(configuredFlagProvider({ FEATURE_FLAGS_PROVIDER: 'appconfig', APPCONFIG_APPLICATION_ID: 'a', APPCONFIG_ENVIRONMENT_ID: 'e', APPCONFIG_CONFIGURATION_PROFILE_ID: 'c' })).toBeInstanceOf(AppConfigProvider)
})
