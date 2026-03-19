'use client';

import { useIsEnabled, useFlagValue, useFlagAttributes, useFeatureFlags } from '@/lib/feature-flags/client';

/**
 * Componente demonstrativo mostrando os 3 tipos de flags:
 * 1. Flag booleana (isEnabled)
 * 2. Flag multivariante (getFlagValue<T>)
 * 3. Atributos da flag (getFlagAttributes)
 */
export function FeatureFlagExample() {
  const { isLoading, error } = useFeatureFlags();

  // 1. Flag booleana — controle binário
  const isCheckoutV2 = useIsEnabled('new_checkout_v2');

  // 2. Flag multivariante — valor dinâmico tipado
  const darkModeVariant = useFlagValue<string>('ui_dark_mode', 'disabled');
  const rolloutPercentage = useFlagValue<number>('new_checkout_v2', 0);

  // 3. Atributos da flag — metadados completos
  const recEngineAttrs = useFlagAttributes('ml_rec_engine');

  if (isLoading) {
    return (
      <div className="p-6 text-slate-500">
        Carregando feature flags...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">
        Feature Flags — Exemplo de Uso
      </h2>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Erro ao carregar flags: {error.message}
        </div>
      )}

      {/* 1. Flag booleana */}
      <section className="p-4 bg-white rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          1. Flag Booleana — <code className="text-sm bg-slate-100 px-1 rounded">isEnabled</code>
        </h3>
        <p className="text-slate-600">
          <code className="text-sm bg-slate-100 px-1 rounded">new_checkout_v2</code>:{' '}
          <span className={isCheckoutV2 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {isCheckoutV2 ? 'Habilitada ✓' : 'Desabilitada ✗'}
          </span>
        </p>
        {isCheckoutV2 && (
          <div className="mt-2 p-3 bg-green-50 rounded text-green-700 text-sm">
            O novo checkout V2 está ativo! O componente de checkout redesenhado será renderizado.
          </div>
        )}
      </section>

      {/* 2. Flag multivariante */}
      <section className="p-4 bg-white rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          2. Flag Multivariante — <code className="text-sm bg-slate-100 px-1 rounded">getFlagValue&lt;T&gt;</code>
        </h3>
        <ul className="space-y-1 text-slate-600">
          <li>
            <code className="text-sm bg-slate-100 px-1 rounded">ui_dark_mode</code> variant:{' '}
            <span className="font-mono font-medium">&quot;{darkModeVariant}&quot;</span>
          </li>
          <li>
            <code className="text-sm bg-slate-100 px-1 rounded">new_checkout_v2</code> rollout:{' '}
            <span className="font-mono font-medium">{rolloutPercentage}%</span>
          </li>
        </ul>
      </section>

      {/* 3. Atributos da flag */}
      <section className="p-4 bg-white rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          3. Atributos da Flag — <code className="text-sm bg-slate-100 px-1 rounded">getFlagAttributes</code>
        </h3>
        <p className="text-slate-600 mb-2">
          Atributos de <code className="text-sm bg-slate-100 px-1 rounded">ml_rec_engine</code>:
        </p>
        {recEngineAttrs ? (
          <pre className="p-3 bg-slate-900 text-green-400 rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(recEngineAttrs, null, 2)}
          </pre>
        ) : (
          <p className="text-slate-400 italic">Flag não encontrada</p>
        )}
      </section>
    </div>
  );
}
