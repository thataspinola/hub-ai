'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Produto } from '@/types/produto';
import allProducts from '@/data/produtos.json';
import './recommendation-widget.css';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type RecommendationType = 'cross-selling' | 'trending' | 'history';

interface WidgetConfig {
  category?: string;
  limit?: number;
  theme?: 'light' | 'dark';
  currentProductId?: number;
  variant?: 'A' | 'B';
}

/* ------------------------------------------------------------------ */
/*  LocalStorage helpers                                               */
/* ------------------------------------------------------------------ */

const HISTORY_KEY = 'rw_viewed_products';
const CART_KEY    = 'rw_cart';

function getHistory(): number[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch { return []; }
}

function addToHistory(id: number) {
  const history = getHistory().filter(h => h !== id);
  history.unshift(id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
}

function getCart(): number[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch { return []; }
}

function addToCart(id: number) {
  const cart = getCart();
  if (!cart.includes(id)) {
    cart.push(id);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
}

/* ------------------------------------------------------------------ */
/*  Recommendation engine                                              */
/* ------------------------------------------------------------------ */

function getRecommendations(
  type: RecommendationType,
  config: WidgetConfig,
  cartIds: number[],
): Produto[] {
  const excludeIds = new Set([...cartIds, config.currentProductId ?? -1]);
  const catalog = (allProducts as Produto[]).filter(p => !excludeIds.has(p.id));

  switch (type) {
    case 'cross-selling': {
      const current = (allProducts as Produto[]).find(p => p.id === config.currentProductId);
      if (!current) return [];
      const currentTags = new Set(current.tags);
      return catalog
        .filter(p => p.id !== current.id && p.tags.some(t => currentTags.has(t)))
        .sort((a, b) => {
          const scoreA = a.tags.filter(t => currentTags.has(t)).length;
          const scoreB = b.tags.filter(t => currentTags.has(t)).length;
          return scoreB - scoreA;
        })
        .slice(0, config.limit ?? 8);
    }

    case 'trending':
      return catalog
        .filter(p => !config.category || p.categoria === config.category)
        .sort((a, b) => b.vendas - a.vendas)
        .slice(0, config.limit ?? 8);

    case 'history': {
      const history = getHistory();
      return history
        .filter(id => !excludeIds.has(id))
        .map(id => catalog.find(p => p.id === id))
        .filter((p): p is Produto => !!p)
        .slice(0, config.limit ?? 8);
    }
  }
}

const TITLES: Record<RecommendationType, string> = {
  'cross-selling': 'Quem comprou isto, também gostou de...',
  'trending':      'Mais Vendidos & Tendências',
  'history':       'Vistos Recentemente',
};

/* ------------------------------------------------------------------ */
/*  Product card                                                       */
/* ------------------------------------------------------------------ */

function ProductCard({
  produto,
  onAddToCart,
  variant,
}: {
  produto: Produto;
  onAddToCart: (id: number) => void;
  variant: 'A' | 'B';
}) {
  const discount = produto.precoPromocional
    ? Math.round((1 - produto.precoPromocional / produto.preco) * 100)
    : 0;

  return (
    <article className={`rw-card rw-card--${variant}`} role="group" aria-label={produto.nome}>
      {/* Image */}
      <div className="rw-card__img-wrapper">
        {discount > 0 && (
          <span className="rw-card__badge" aria-label={`${discount}% de desconto`}>
            -{discount}%
          </span>
        )}
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="rw-card__img"
          loading="lazy"
          width={400}
          height={400}
        />
      </div>

      {/* Info */}
      <div className="rw-card__body">
        <h3 className="rw-card__title">{produto.nome}</h3>

        <div className="rw-card__prices">
          {produto.precoPromocional ? (
            <>
              <span className="rw-card__price--old" aria-label="Preço original">
                {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <span className="rw-card__price--promo" aria-label="Preço promocional">
                {produto.precoPromocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </>
          ) : (
            <span className="rw-card__price">
              {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          )}
        </div>

        {variant === 'A' ? (
          <button
            className="rw-card__btn"
            onClick={() => onAddToCart(produto.id)}
            aria-label={`Adicionar ${produto.nome} ao carrinho`}
          >
            Adicionar ao Carrinho
          </button>
        ) : (
          <button
            className="rw-card__btn rw-card__btn--outline"
            onClick={() => addToHistory(produto.id)}
            aria-label={`Ver detalhes de ${produto.nome}`}
          >
            Ver Detalhes
          </button>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Carousel                                                           */
/* ------------------------------------------------------------------ */

function Carousel({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect(); };
  }, [updateArrows]);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="rw-carousel" role="region" aria-label={label}>
      {canScrollLeft && (
        <button
          className="rw-carousel__arrow rw-carousel__arrow--left"
          onClick={() => scroll('left')}
          aria-label="Anterior"
        >
          ‹
        </button>
      )}
      <div className="rw-carousel__track" ref={trackRef} tabIndex={0} role="list">
        {children}
      </div>
      {canScrollRight && (
        <button
          className="rw-carousel__arrow rw-carousel__arrow--right"
          onClick={() => scroll('right')}
          aria-label="Próximo"
        >
          ›
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section (one recommendation block)                                 */
/* ------------------------------------------------------------------ */

function RecommendationSection({
  type,
  config,
  cartIds,
  onAddToCart,
}: {
  type: RecommendationType;
  config: WidgetConfig;
  cartIds: number[];
  onAddToCart: (id: number) => void;
}) {
  const items = getRecommendations(type, config, cartIds);
  if (items.length === 0) return null;

  return (
    <section className="rw-section" aria-labelledby={`rw-title-${type}`}>
      <h2 className="rw-section__title" id={`rw-title-${type}`}>
        {TITLES[type]}
      </h2>
      <Carousel label={TITLES[type]}>
        {items.map(p => (
          <div key={p.id} role="listitem" className="rw-carousel__item">
            <ProductCard
              produto={p}
              onAddToCart={onAddToCart}
              variant={config.variant ?? 'A'}
            />
          </div>
        ))}
      </Carousel>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Widget                                                        */
/* ------------------------------------------------------------------ */

export default function RecommendationWidget({
  category,
  limit = 8,
  theme = 'light',
  currentProductId,
  variant = 'A',
}: WidgetConfig) {
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<RecommendationType>('trending');

  useEffect(() => {
    setCartIds(getCart());
    // Seed history with a few random products for demonstration
    const history = getHistory();
    if (history.length === 0) {
      [2, 5, 8, 13, 16].forEach(id => addToHistory(id));
    }
  }, []);

  const handleAddToCart = (id: number) => {
    addToCart(id);
    setCartIds(prev => [...prev, id]);
  };

  const config: WidgetConfig = { category, limit, theme, currentProductId, variant };

  const tabs: { key: RecommendationType; label: string }[] = [
    { key: 'trending', label: 'Tendências' },
    { key: 'cross-selling', label: 'Cross-selling' },
    { key: 'history', label: 'Histórico' },
  ];

  return (
    <div
      className={`rw-widget rw-widget--${theme} rw-widget--variant-${variant}`}
      data-category={category}
      data-limit={limit}
      data-theme={theme}
    >
      {/* Tab navigation */}
      <nav className="rw-tabs" role="tablist" aria-label="Tipo de recomendação">
        {tabs.map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`rw-tabs__btn ${activeTab === tab.key ? 'rw-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Active section */}
      <div role="tabpanel">
        <RecommendationSection
          type={activeTab}
          config={config}
          cartIds={cartIds}
          onAddToCart={handleAddToCart}
        />
        {activeTab === 'cross-selling' && !currentProductId && (
          <p className="rw-empty">Selecione um produto para ver recomendações de cross-selling.</p>
        )}
      </div>

      {/* Integration snippet */}
      <details className="rw-snippet">
        <summary>Snippet de Integração</summary>
        <pre>
          <code>{`<div id="recommendation-widget"
     data-category="${category ?? 'eletronicos'}"
     data-limit="${limit}"
     data-theme="${theme}">
</div>
<script src="https://cdn.seusite.com/widget-recomenda.js"></script>`}</code>
        </pre>
      </details>
    </div>
  );
}
