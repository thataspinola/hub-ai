export type View = 'dashboard' | 'feature-flags' | 'pilots' | 'promotions' | 'rec-engine' | 'form-builder' | 'regras';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  key: string;
  status: 'Ativado' | 'Apenas Interno' | 'Teste A/B' | 'Desativado' | 'Apenas Piloto';
  traffic: string;
  owner: string;
  lastModified: string;
  enabled: boolean;
}

export interface PilotProgram {
  id: string;
  title: string;
  description: string;
  type: string;
  userCount: string;
  progress: number;
}

export interface Promotion {
  id: string;
  name: string;
  code: string;
  duration: string;
  totalDays: string;
  status: 'Ativa' | 'Agendada';
  roi: string;
  revenue: string;
  type: 'percent' | 'dollar' | 'exchange';
  category: 'Cupons' | 'Descontos Progressivos' | 'Cashback';
}

export interface SystemEvent {
  id: string;
  title: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}
