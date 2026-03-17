'use client';

import { useState } from 'react';
import RecommendationWidget from './recommendation-widget';

const PRODUCT_OPTIONS = [
  { id: 1, label: 'Smartphone Galaxy Ultra 256GB' },
  { id: 3, label: 'Notebook Gamer RTX 4060 16GB' },
  { id: 5, label: 'Smart TV 55" 4K OLED' },
  { id: 7, label: 'Teclado Mecânico RGB' },
  { id: 10, label: 'Smartwatch Fitness GPS' },
];

export default function Recomendacoes() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [variant, setVariant] = useState<'A' | 'B'>('A');
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState(8);
  const [productId, setProductId] = useState<number | undefined>(1);

  return (
    <div style={{ padding: '1.5rem 1rem', maxWidth: 1360, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
        Widget de Recomendação Dinâmica
      </h1>
      <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Configure os parâmetros abaixo para visualizar o comportamento do widget.
      </p>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          background: '#f0f0f0',
          borderRadius: 8,
        }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.85rem' }}>
          Tema
          <select value={theme} onChange={e => setTheme(e.target.value as 'light' | 'dark')}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.85rem' }}>
          Variante (A/B)
          <select value={variant} onChange={e => setVariant(e.target.value as 'A' | 'B')}>
            <option value="A">A – Vertical</option>
            <option value="B">B – Horizontal</option>
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.85rem' }}>
          Categoria
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Todas</option>
            <option value="eletronicos">Eletrônicos</option>
            <option value="acessorios">Acessórios</option>
            <option value="casa-inteligente">Casa Inteligente</option>
            <option value="componentes">Componentes</option>
            <option value="moveis">Móveis</option>
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.85rem' }}>
          Limite
          <input
            type="number"
            min={1}
            max={20}
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            style={{ width: 60 }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.85rem' }}>
          Produto Atual (cross-selling)
          <select
            value={productId ?? ''}
            onChange={e => setProductId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Nenhum</option>
            {PRODUCT_OPTIONS.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Widget */}
      <RecommendationWidget
        category={category || undefined}
        limit={limit}
        theme={theme}
        currentProductId={productId}
        variant={variant}
      />
    </div>
  );
}
