
import React, { useState } from 'react';
import { MarketMapSector, MarketMapStock } from '../types';
import { toPersianDigits } from './formatters';
import { composeHomeCardClasses, HomeCardPadding, HomeCardTone } from './designSystem';

interface MarketMapProps {
  data: MarketMapSector[];
  onStockClick: (stock: MarketMapStock) => void;
}

const getTileStyle = (change: number): { bgClass: string; textClass: string } => {
  if (change > 0) {
    return { bgClass: 'bg-neo-green', textClass: 'text-black' };
  }
  if (change < 0) {
    return { bgClass: 'bg-red-500', textClass: 'text-white' };
  }
  return { bgClass: 'bg-gray-700', textClass: 'text-white' };
};

const getFlexBasisClass = (size: MarketMapStock['size']): string => {
    switch (size) {
        case 'xl': return 'basis-1/3';
        case 'lg': return 'basis-1/4';
        case 'md': return 'basis-1/5';
        case 'sm': return 'basis-1/6';
        default: return 'basis-1/5';
    }
}

const StockTile: React.FC<{ stock: MarketMapStock; onClick: () => void }> = ({ stock, onClick }) => {
  const { bgClass, textClass } = getTileStyle(stock.change);
  const flexBasis = getFlexBasisClass(stock.size);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative flex-grow ${flexBasis} rounded-md p-2 flex flex-col items-center justify-center ${bgClass} ${textClass} border border-black/20 cursor-pointer transition-transform transform hover:scale-105 hover:z-10`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`مشاهده جزئیات ${stock.name}`}
    >
      <span className="font-bold text-sm text-center">{stock.name}</span>
      <span className="text-xs font-semibold mt-1">{toPersianDigits(stock.change.toFixed(2))}%</span>
      
      {isHovered && (
        <div className="absolute bottom-full mb-2 w-max max-w-xs bg-neo-dark-1 text-white text-xs rounded-lg py-1.5 px-3 shadow-lg z-20 pointer-events-none transition-opacity opacity-100">
          <p className="font-bold">{stock.name}</p>
          <p>تغییر: {toPersianDigits(stock.change.toFixed(2))}%</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neo-dark-1"></div>
        </div>
      )}
    </div>
  );
};

const composeHomeCard = (
  extra: string,
  tone: HomeCardTone = 'default',
  padding: HomeCardPadding = 'md',
) => composeHomeCardClasses(tone, padding, extra);

const MarketMap: React.FC<MarketMapProps> = ({ data, onStockClick }) => {
  return (
    <div className={composeHomeCard('mt-2 space-y-4 pb-4 text-white', 'default', 'md')}>
      <header className={composeHomeCard('flex items-center justify-between px-3 py-2', 'muted', 'none')}>
        <h1 className="text-lg font-bold text-right">نقشه بازار</h1>
      </header>

      <div className="space-y-4">
        {data.map((sector) => (
          <div key={sector.name} className={composeHomeCard('space-y-2', 'muted', 'sm')}>
            <h2 className="pr-2 text-right text-base font-bold">{sector.name}</h2>
            <div className="flex flex-wrap gap-1">
              {sector.stocks.map((stock) => (
                <StockTile key={stock.id || stock.name} stock={stock} onClick={() => onStockClick(stock)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketMap;
