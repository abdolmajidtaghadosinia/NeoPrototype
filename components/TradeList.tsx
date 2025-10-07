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
    textClass: 'text-amber-500',
    dot: 'bg-amber-400',
  },
  done: {
    text: 'انجام شد',
    textClass: 'text-[rgb(var(--neo-accent))]',
    dot: 'bg-[rgb(var(--neo-accent))]',
  },
  canceled: {
    text: 'کنسل شد',
    textClass: 'text-rose-500',
    dot: 'bg-rose-400',
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

  const containerClass =
    variant === 'compact'
      ? 'neo-surface neo-surface--ghost rounded-2xl p-3 text-right space-y-3'
      : 'neo-surface neo-surface--ghost rounded-3xl p-5 text-right space-y-4';
  const listClass = variant === 'compact' ? 'space-y-2.5' : 'space-y-3';
  const itemButtonClass = clsx(
    'group w-full min-w-0 rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-raised-bg)] text-right transition hover:border-[rgb(var(--neo-accent))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]',
    variant === 'compact' ? 'px-3 py-3 rounded-2xl' : 'px-4 py-4 rounded-3xl'
  );
  const moreButtonClass = 'text-xs font-semibold text-[rgb(var(--neo-accent))] hover:opacity-80';

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
            const amountLabel = t.amount > 0 ? `${toPersianFormatted(t.amount)} واحد` : null;
            const priceLabel = t.price > 0 ? `${toPersianFormatted(t.price)} تومان` : null;
            const detailParts = [t.type === 'buy' ? 'سفارش خرید' : 'سفارش فروش', amountLabel, priceLabel].filter(Boolean);

            return (
              <li key={t.id}>
                <button onClick={() => onSelectTrade?.(t)} className={itemButtonClass}>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="flex flex-row-reverse items-center gap-3">
                      <div className="flex flex-row-reverse items-center gap-1 text-[10px] md:text-[11px]">
                        <span className={clsx('h-1.5 w-1.5 rounded-full', status.dot)} aria-hidden="true" />
                        <span className={clsx('font-medium', status.textClass)}>{status.text}</span>
                      </div>
                      <span className="text-[10px] text-[rgb(var(--neo-text-secondary))]">{t.time}</span>
                    </div>
                    <p
                      className={clsx(
                        'line-clamp-2 w-full text-[rgb(var(--neo-text-strong))] font-semibold leading-relaxed',
                        variant === 'compact' ? 'text-xs' : 'text-base'
                      )}
                    >
                      {desc}
                    </p>
                    {detailParts.length > 0 && (
                      <p
                        className={clsx(
                          'w-full text-[rgb(var(--neo-text-secondary))]',
                          variant === 'compact' ? 'text-[10px]' : 'text-xs'
                        )}
                      >
                        {detailParts.join(' • ')}
                      </p>
                    )}
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
