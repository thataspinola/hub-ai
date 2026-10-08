import type { FeatureFlagDataProvider, FlagValueMap } from '../types'

/**
 * Provider para integração com AWS AppConfig Agent (sidecar).
 *
 * O AppConfig Agent expõe uma API HTTP local que retorna a configuração
 * de Feature Flags no formato JSON nativo do AppConfig.
 *
 * Endpoint padrão: http://localhost:2772/applications/{appId}/environments/{envId}/configurations/{configId}
 *
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-integration-lambda-extensions.html
 */

export interface AppConfigProviderOptions {
  /** Endpoint base do AppConfig Agent (default: http://localhost:2772) */
  endpoint?: string
  /** Application ID no AppConfig */
  applicationId: string
  /** Environment ID no AppConfig */
  environmentId: string
  /** Configuration Profile ID no AppConfig */
  configurationProfileId: string
  /** Timeout em ms para o fetch (default: 5000) */
  timeoutMs?: number
}

export class AppConfigProvider implements FeatureFlagDataProvider {
  private readonly url: string
  private readonly timeoutMs: number

  constructor(private readonly options: AppConfigProviderOptions) {
    const base = options.endpoint ?? 'http://localhost:2772'
    this.url = `${base}/applications/${options.applicationId}/environments/${options.environmentId}/configurations/${options.configurationProfileId}`
    this.timeoutMs = options.timeoutMs ?? 5000
  }

  async fetchFlags(): Promise<FlagValueMap> {
    // TODO: Configurar applicationId, environmentId e configurationProfileId
    //       via variáveis de ambiente quando o AppConfig Agent estiver disponível.
    //
    // O Agent retorna o payload no formato:
    // {
    //   "flag_key": { "enabled": true, "attribute1": "value1", ... },
    //   ...
    // }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs)

    try {
      const response = await fetch(this.url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error(
          `AppConfig Agent responded with status ${response.status}`
        )
      }

      return (await response.json()) as FlagValueMap
    } finally {
      clearTimeout(timeout)
    }
  }
}
