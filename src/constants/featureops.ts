import { FeatureFlag, SystemEvent } from '@/types/featureops';

export const FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: '1',
    name: 'Checkout_v2_Redesign',
    description: 'Habilitar interface de checkout integrada ao Stripe.',
    key: 'new_checkout_v2',
    status: 'Ativado',
    traffic: '15% do Rollout',
    owner: 'Engenharia',
    lastModified: '2h atrás',
    enabled: true
  },
  {
    id: '2',
    name: 'Dark_Mode_BETA',
    description: 'Suporte a modo escuro em todo o sistema.',
    key: 'ui_dark_mode',
    status: 'Apenas Piloto',
    traffic: '15%',
    owner: 'Equipe de Design',
    lastModified: '1d atrás',
    enabled: true
  },
  {
    id: '3',
    name: 'New_Onboarding_Flow',
    description: 'Sugerir produtos usando modelo de ML interno.',
    key: 'ml_rec_engine',
    status: 'Teste A/B',
    traffic: 'Divisão 50%',
    owner: 'Crescimento',
    lastModified: '5d atrás',
    enabled: false
  }
];

export const SYSTEM_EVENTS: SystemEvent[] = [
  {
    id: '1',
    title: 'Backup do sistema concluído',
    time: 'Hoje às 03:00 AM • Tarefa Automatizada',
    type: 'success'
  },
  {
    id: '2',
    title: "Nova flag: 'loyalty_rewards' criada",
    time: 'Ontem às 04:30 PM • Admin: Sarah K.',
    type: 'info'
  },
  {
    id: '3',
    title: 'Pico de latência detectado na API (Região: US-East)',
    time: '24 de Ago, 11:20 AM • Resolvido em 12m',
    type: 'warning'
  }
];
