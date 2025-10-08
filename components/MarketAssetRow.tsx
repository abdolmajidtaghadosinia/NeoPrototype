import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { MarketAsset } from '../types';
import { toPersianDigits } from './formatters';
import AssetIcon, { deriveAssetSymbol } from './AssetIcon';

interface MarketAssetRowProps {
  asset: MarketAsset;
}

const RsiIndicator: React.FC<{ rsi: number }> = ({ rsi }) => {
    const rsiValue = Math.round(rsi);
    let colorClass = 'bg-gray-700 text-gray-200'; // Neutral
    if (rsiValue >= 70) {
        colorClass = 'bg-red-500/20 text-red-400'; // Overbought
    } else if (rsiValue <= 30) {
        colorClass = 'bg-green-500/20 text-green-400'; // Oversold
    }

    return (
        <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${colorClass}`}>
            <span className="font-sans font-medium">RSI</span> {toPersianDigits(rsiValue)}
        </div>
    );
};

const MarketAssetRow: React.FC<MarketAssetRowProps> = ({ asset }) => {
  // Use daily performance data as default since timeframe selectors are removed
  const performance = asset.performance.daily;
  const isPositive = performance.change >= 0;
  const accentColor = 'rgb(var(--neo-accent))';
  const chartColor = isPositive ? accentColor : '#ef4444';

  const nameParts = asset.name.match(/(.*)\s+\((.*)\)/);
  const assetBaseName = nameParts ? nameParts[1].trim() : asset.name;
  const assetTicker = nameParts ? nameParts[2].trim() : '';
  const derivedSymbol = assetTicker || deriveAssetSymbol(asset.name);

  const variantMap: Record<MarketAsset['category'], NonNullable<React.ComponentProps<typeof AssetIcon>['variant']>> = {
    بورس: 'stock',
    'صندوق‌ها': 'fund',
    کالا: 'commodity',
    ارزها: 'currency',
  };

  return (
    <div className="bg-neo-dark-3 rounded-2xl p-3 flex items-center gap-3 sm:gap-4 overflow-hidden">
        {/* Column 1: Icon (appears on the right in RTL) */}
        <div className="flex-shrink-0">
          <AssetIcon
            icon={asset.icon}
            name={asset.name}
            symbol={derivedSymbol}
            size="md"
            variant={variantMap[asset.category] ?? 'default'}
          />
        </div>

        {/* Column 2: Name & Ticker */}
        <div className="text-right flex-1 min-w-0">
          {assetTicker ? (
            <>
              <p className="font-bold text-white text-sm truncate">{assetTicker}</p>
              <p className="text-xs text-gray-400 truncate">{assetBaseName}</p>
            </>
          ) : (
            <p className="font-bold text-white text-sm truncate">{asset.name}</p>
          )}
        </div>

        {/* Column 3: Chart */}
        <div className="h-10 w-24 sm:w-28 flex-shrink-0 ml-auto">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performance.chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Line dataKey="value" stroke={chartColor} strokeWidth={2.5} dot={false} type="linear"/>
                </LineChart>
            </ResponsiveContainer>
        </div>

        {/* Column 4: Price & Change */}
        <div className="text-left flex flex-col items-end gap-1 w-28 text-sm">
            <p className="font-semibold text-white truncate">{asset.price}</p>
             <div className="flex items-center justify-end gap-2 w-full">
                {asset.rsi !== undefined && <RsiIndicator rsi={asset.rsi} />}
                <p className={`font-bold ${isPositive ? 'text-neo-green' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{toPersianDigits(performance.change.toFixed(1))}%
                </p>
            </div>
        </div>
    </div>
  );
};

export default MarketAssetRow;
