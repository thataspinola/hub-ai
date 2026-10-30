'use client'

import { X, HelpCircle } from 'lucide-react'
import type { Tab } from './types'

export const TAB_HELP: Record<
  Tab,
  {
    title: string
    description: string
    howItWorks: string
    useCases: { title: string; description: string }[]
    codeExample: string
  }
> = {
  boolean: {
    title: 'Flags Booleanas',
    description:
      'A forma mais simples de feature flag: ligado ou desligado. Ideal para controle binário de funcionalidades.',
    howItWorks:
      'Uma flag booleana possui apenas dois estados: ativada (true) ou desativada (false). Quando ativada, a funcionalidade associada é exibida ou executada. Quando desativada, o comportamento padrão (ou nenhum) é mantido. No código, basta verificar o estado com isEnabled() no servidor ou useIsEnabled() no cliente.',
    useCases: [
      {
        title: 'Kill Switch',
        description:
          'Desativar uma funcionalidade problemática instantaneamente sem necessidade de rollback ou novo deploy.',
      },
      {
        title: 'Lançamento Gradual',
        description:
          'Habilitar uma feature para teste interno antes de liberar para todos os usuários.',
      },
      {
        title: 'Modo Manutenção',
        description:
          'Colocar o sistema inteiro ou módulos específicos em modo de manutenção.',
      },
      {
        title: 'Feature Gate',
        description:
          'Esconder uma funcionalidade em desenvolvimento que já foi deployed mas não está pronta para uso.',
      },
    ],
    codeExample: `// Server-side (RSC)
const showCheckout = await isEnabled('new_checkout_v2');
return showCheckout ? <NewCheckout /> : <LegacyCheckout />;

// Client-side (Hook)
const showCheckout = useIsEnabled('new_checkout_v2');`,
  },
  multivariant: {
    title: 'Flags Multivariantes',
    description:
      'Retornam valores dinâmicos (string, number ou JSON) ao invés de apenas true/false. Ideais para testes A/B e configurações ajustáveis.',
    howItWorks:
      'Uma flag multivariante possui um valor atual e uma lista de variantes possíveis com pesos de distribuição. O tipo do valor pode ser string, number ou JSON. No código, use getFlagValue<T>() no servidor ou useFlagValue<T>() no cliente para obter o valor tipado com um fallback seguro.',
    useCases: [
      {
        title: 'Teste A/B',
        description:
          'Distribuir usuários entre variantes ("controle" vs "tratamento") com pesos configuráveis (50%/50%).',
      },
      {
        title: 'Tema Visual',
        description:
          'Alternar entre temas (light, dark, auto) sem deploy, controlando a variante ativa.',
      },
      {
        title: 'Limites Configuráveis',
        description:
          'Ajustar rate limits, número máximo de itens, timeouts — tudo via flag numérica.',
      },
      {
        title: 'Configuração JSON',
        description:
          'Passar objetos de configuração complexos (ex: { theme: "dark", density: "compact" }) como valor da flag.',
      },
    ],
    codeExample: `// Server-side (RSC)
const theme = await getFlagValue<string>('ui_theme', 'light');
const limit = await getFlagValue<number>('rate_limit', 100);

// Client-side (Hook)
const theme = useFlagValue<string>('ui_theme', 'light');`,
  },
  attributes: {
    title: 'Flags com Atributos',
    description:
      'Carregam metadados e configurações adicionais em pares chave-valor. Ideais para features com múltiplos parâmetros configuráveis.',
    howItWorks:
      'Uma flag com atributos possui um estado habilitado/desabilitado e um mapa de atributos (chave → valor). Os valores são auto-detectados como string, number ou boolean. No código, use getFlagAttributes() no servidor ou useFlagAttributes() no cliente para obter todos os atributos como um objeto.',
    useCases: [
      {
        title: 'Motor de ML',
        description:
          'Configurar modelo, número máximo de resultados, grupo de teste e percentual de rollout — tudo vinculado a uma flag.',
      },
      {
        title: 'Regras de Negócio',
        description:
          'Definir múltiplos parâmetros de uma regra (desconto máximo, prazo, segmento) em uma única flag.',
      },
      {
        title: 'Integração Externa',
        description:
          'Armazenar endpoint, timeout, retry count e API version como atributos de uma flag de integração.',
      },
      {
        title: 'Rollout Detalhado',
        description:
          'Combinar percentual de rollout, região, plano do usuário e outros critérios como atributos da flag.',
      },
    ],
    codeExample: `// Server-side (RSC)
const config = await getFlagAttributes('ml_rec_engine');
// → { rolloutPercentage: 50, model: "v3", maxResults: 12 }

// Client-side (Hook)
const config = useFlagAttributes('ml_rec_engine');`,
  },
}

export function TabHelpContent({
  tab,
  onClose,
}: {
  tab: Tab
  onClose: () => void
}) {
  const help = TAB_HELP[tab]

  return (
    <div className="mt-3 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <HelpCircle size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{help.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{help.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Como funciona */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Como funciona
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            {help.howItWorks}
          </p>
        </div>

        {/* Casos de uso */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Casos de Uso
          </h4>
          <ul className="space-y-2">
            {help.useCases.map((uc, i) => (
              <li key={i} className="flex gap-2">
                <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <div>
                  <span className="text-sm font-semibold text-slate-700">
                    {uc.title}
                  </span>
                  <span className="text-sm text-slate-500">
                    {' '}
                    — {uc.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Exemplo de código */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Exemplo de Código
          </h4>
          <pre className="p-3 bg-slate-900 text-[11px] text-indigo-300 font-mono rounded-lg overflow-x-auto leading-relaxed">
            {help.codeExample}
          </pre>
        </div>
      </div>
    </div>
  )
}
