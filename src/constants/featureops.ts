import { FeatureFlag, PilotProgram, Promotion, SystemEvent } from '@/types/featureops';

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

export const PILOT_PROGRAMS: PilotProgram[] = [
  {
    id: '1',
    title: 'Alpha Interno',
    description: 'Contém todos os usuários com endereços de e-mail @empresa.com.',
    type: 'Grupo de Usuários',
    userCount: '142 Usuários',
    progress: 85
  },
  {
    id: '2',
    title: 'América do Norte Nível 1',
    description: 'Acesso antecipado para clientes nos EUA, Canadá e México.',
    type: 'Regional',
    userCount: '8.4k Usuários',
    progress: 40
  },
  {
    id: '3',
    title: 'Enterprise Plus',
    description: 'Focado em contas de alto valor com faturamento personalizado.',
    type: 'Receita',
    userCount: '42 Contas',
    progress: 12
  }
];

export const PROMOTIONS: Promotion[] = [
  {
    id: '1',
    name: 'Liquidação de Verão 2024',
    code: 'SUMMER24',
    duration: '01 Jun - 31 Ago',
    totalDays: '92 dias no total',
    status: 'Ativa',
    roi: '4.2x ROI',
    revenue: '$12.400',
    type: 'percent',
    category: 'Cupons'
  },
  {
    id: '2',
    name: 'Promoção Volta às Aulas',
    code: 'SCHOOLDAYS',
    duration: '01 Set - 30 Set',
    totalDays: 'Inicia em 12 dias',
    status: 'Agendada',
    roi: '—',
    revenue: '—',
    type: 'dollar',
    category: 'Cupons'
  },
  {
    id: '3',
    name: 'Venda Flash de Fim de Semana',
    code: 'PROGRESSIVE10',
    duration: 'Contínua',
    totalDays: 'Ocorrência semanal',
    status: 'Ativa',
    roi: '3.8x ROI',
    revenue: '$8.920',
    type: 'exchange',
    category: 'Descontos Progressivos'
  },
  {
    id: '4',
    name: 'Semana do Cliente - Progressivo',
    code: 'CLIENTE_PROG',
    duration: '15 Set - 22 Set',
    totalDays: '7 dias',
    status: 'Agendada',
    roi: '—',
    revenue: '—',
    type: 'percent',
    category: 'Descontos Progressivos'
  },
  {
    id: '5',
    name: 'Cashback Primeira Compra',
    code: 'WELCOME_CASH',
    duration: 'Indeterminado',
    totalDays: 'Sempre ativo',
    status: 'Ativa',
    roi: '5.1x ROI',
    revenue: '$45.200',
    type: 'exchange',
    category: 'Cashback'
  },
  {
    id: '6',
    name: 'Fidelidade - Cashback Dobrado',
    code: 'DOUBLE_CASH',
    duration: 'Finais de Semana',
    totalDays: 'Recorrente',
    status: 'Agendada',
    roi: '—',
    revenue: '—',
    type: 'exchange',
    category: 'Cashback'
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
