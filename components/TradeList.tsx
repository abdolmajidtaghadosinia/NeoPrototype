import React, { useState } from 'react';

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
}

const statusMap = {
  ongoing: { text: 'در حال انجام', color: 'text-yellow-400' },
  done: { text: 'انجام شد', color: 'text-neo-green' },
  canceled: { text: 'کنسل شد', color: 'text-red-500' },
};

const TradeList: React.FC<TradeListProps> = ({
  title,
  trades,
  limit = 3,
  onSelectTrade,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? trades : trades.slice(0, limit);
  const hasMore = trades.length > limit;

  return (
    <div className="bg-neo-dark-2 p-4 rounded-2xl shadow text-right">
      {title && <h3 className="text-sm font-semibold text-gray-300 mb-2">{title}</h3>}
      <ul className="text-sm">
        {visible.length > 0 ? (
          visible.map((t) => {
            const status = statusMap[t.status];
            const desc = t.description || `${t.type === 'buy' ? 'خرید' : 'فروش'} ${t.asset}`;
            return (
              <li key={t.id} className="mb-2 last:mb-0">
                <button
                  onClick={() => onSelectTrade?.(t)}
                  className="w-full text-right bg-neo-dark-3 rounded-xl p-3 hover:bg-neo-dark-4 transition-colors"
                >
                  <div className={`text-xs mb-1 font-medium ${status.color}`}>{status.text}</div>
                  <div className="text-white font-semibold">{desc}</div>
                  <div className="text-xs text-gray-400 mt-1">{t.time}</div>
                </button>
              </li>
            );
          })
        ) : (
          <li className="text-center py-2 text-gray-400">معامله‌ای نیست</li>
        )}
      </ul>
      {hasMore && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-xs text-neo-green hover:underline"
        >
          {expanded ? 'کمتر' : 'بیشتر'}
        </button>
      )}
    </div>
  );
};

export default TradeList;
