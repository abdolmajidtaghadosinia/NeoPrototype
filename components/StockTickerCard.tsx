import React, { memo } from 'react';
import clsx from 'clsx';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Stock } from '../types';
import { toPersianDigits } from './formatters';
import { composeHomeCardClasses } from './designSystem';

interface StockTickerCardProps {
  stock: Stock;
  onClick?: () => void;
  className?: string;
}

const StockTickerCard: React.FC<StockTickerCardProps> = ({ stock, onClick, className }) => {
  const isPositive = stock.status === 'buy' || stock.status === 'up';
  const color = isPositive ? '#D7FE43' : '#ef4444';

  const statusText = stock.statusText || (stock.status === 'buy'
    ? 'حتما خرید'
    : stock.status === 'sell' 
    ? 'فروش'
    : stock.change);
    
  const valueStr = stock.value.toString();
  const valueFontSize = valueStr.length > 6 ? 'text-base' : 'text-lg';

  const cardClasses = composeHomeCardClasses(
    'muted',
    'none',
    clsx(
      'relative flex h-full w-40 shrink-0 overflow-hidden px-3 py-2 transition-transform hover:-translate-y-0.5',
      className,
      onClick && 'cursor-pointer',
    ),
  );

  return (
    <div
      onClick={onClick}
      className={cardClasses}
    >
      <div className="absolute inset-0 opacity-25 [mask-image:linear-gradient(to_left,rgba(0,0,0,1)_70%,rgba(0,0,0,0))]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stock.chartData} margin={{ top: 12, right: 0, left: 0, bottom: 0 }}>
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <Line dataKey="value" stroke={color} strokeWidth={3} dot={false} type="linear" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <h3 className="text-[13px] font-bold leading-5 text-gray-100">{stock.name}</h3>
          <p className={`${valueFontSize} my-0 font-bold leading-tight text-white`}>
            {toPersianDigits(valueStr)}
          </p>
        </div>
        <p className={`text-[11px] font-semibold leading-4 ${isPositive ? 'text-neo-green' : 'text-red-500'}`}>
          {statusText}
        </p>
      </div>
    </div>
  );
};

export default memo(StockTickerCard);
