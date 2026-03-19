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

export interface SystemEvent {
  id: string;
  title: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}
