import React, { useState } from 'react';
import clsx from 'clsx';
import { toPersianFormatted } from './formatters';

export interface TradeRecord {
  id: string;
  type: 'buy' | 'sell';
  asset: string;
  amount: number;
  price: number;
  status: 'ongoing' | 'done' | 'canceled';
  /** human readable relative time e.g. "لحظاتی پیش" */
  time: string;
  /** optional custom description overrides type/asset text */
  description?: string;
}

interface TradeListProps {
  /** optional title shown above the list */
  title?: string;
  trades: TradeRecord[];
  limit?: number;
  /** callback when a trade item is clicked */
  onSelectTrade?: (trade: TradeRecord) => void;
  /** visual density variant */
  variant?: 'default' | 'compact';
  /** optional className override for the container */
  className?: string;
}

const statusMap = {
  ongoing: {
    text: 'در حال انجام',
    badge: 'border border-amber-400/30 bg-amber-500/10 text-amber-400',
  },
  done: {
    text: 'انجام شد',
    badge:
      'border border-[color:rgba(var(--neo-accent),0.35)] bg-[color:rgba(var(--neo-accent),0.18)] text-[rgb(var(--neo-accent))] shadow-[0_16px_32px_-26px_rgba(82,255,122,0.55)]',
  },
  canceled: {
    text: 'کنسل شد',
    badge: 'border border-rose-400/30 bg-rose-500/10 text-rose-400',
  },
} as const;

const TradeList: React.FC<TradeListProps> = ({
  title,
  trades,
  limit = 3,
  onSelectTrade,
  variant = 'default',
  className,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? trades : trades.slice(0, limit);
  const hasMore = trades.length > limit;

  const containerClass = variant === 'compact'
    ? 'neo-surface neo-surface--ghost rounded-2xl p-3 text-right space-y-3'
    : 'neo-surface neo-surface--ghost rounded-3xl p-5 text-right space-y-4';
  const listClass = variant === 'compact' ? 'space-y-2 text-xs' : 'space-y-3 text-sm';
  const itemButtonClass = variant === 'compact'
    ? 'w-full rounded-xl border border-[color:var(--neo-surface-border)] bg-transparent px-3 py-2 text-right text-xs transition hover:border-[rgb(var(--neo-accent))] hover:shadow-[0_14px_32px_-26px_rgba(15,23,42,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]'
    : 'w-full rounded-2xl border border-[color:var(--neo-surface-border)] bg-transparent px-4 py-3 text-right text-sm transition hover:border-[rgb(var(--neo-accent))] hover:shadow-[0_18px_42px_-28px_rgba(15,23,42,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]';
  const moreButtonClass = variant === 'compact'
    ? 'text-xs font-semibold text-[rgb(var(--neo-accent))] hover:opacity-80'
    : 'text-xs font-semibold text-[rgb(var(--neo-accent))] hover:opacity-80';

  return (
    <div className={clsx(containerClass, className)}>
      {title && (
        <h3 className={clsx('font-semibold text-[rgb(var(--neo-text-strong))]', variant === 'compact' ? 'text-xs' : 'text-sm')}>
          {title}
        </h3>
      )}
      <ul className={listClass}>
        {visible.length > 0 ? (
          visible.map((t) => {
            const status = statusMap[t.status];
            const desc = t.description || `${t.type === 'buy' ? 'خرید' : 'فروش'} ${t.asset}`;
            return (
              <li key={t.id}>
                <button
                  onClick={() => onSelectTrade?.(t)}
                  className={itemButtonClass}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold', status.badge)}>
                      {status.text}
                    </span>
                    <span className="text-[10px] text-[rgb(var(--neo-text-secondary))]">{t.time}</span>
                  </div>
                  <div className="mt-2 text-[rgb(var(--neo-text-strong))] font-semibold">{desc}</div>
                  <div className="mt-1 text-[10px] text-[rgb(var(--neo-text-secondary))]">
                    {t.type === 'buy' ? 'سفارش خرید' : 'سفارش فروش'} • {toPersianFormatted(t.amount)} واحد • {toPersianFormatted(t.price)} تومان
                  </div>
                </button>
              </li>
            );
          })
        ) : (
          <li className="rounded-xl border border-dashed border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] py-3 text-center text-xs text-[rgb(var(--neo-text-secondary))]">
            معامله‌ای نیست
          </li>
        )}
      </ul>
      {hasMore && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className={clsx('mt-2', moreButtonClass)}
        >
          {expanded ? 'کمتر' : 'بیشتر'}
        </button>
      )}
    </div>
  );
};

export default TradeList;
