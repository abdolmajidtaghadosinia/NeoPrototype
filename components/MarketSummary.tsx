

import React, { useState, memo } from 'react';
import clsx from 'clsx';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { MarketSummaryItem } from '../types';
import { toPersianDigits } from './formatters';
import { composeHomeCardClasses, HomeCardPadding, HomeCardTone } from './designSystem';

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface MarketSummaryCardProps {
    item: MarketSummaryItem;
    timeframe: Timeframe;
    onClick?: () => void;
}

const composeHomeCard = (
    extra: string,
    tone: HomeCardTone = 'default',
    padding: HomeCardPadding = 'md',
) => composeHomeCardClasses(tone, padding, extra);

const MarketSummaryCard: React.FC<MarketSummaryCardProps> = memo(({ item, timeframe, onClick }) => {
    const performance = item.performance[timeframe];
    const isPositive = performance.change >= 0;
    const isClickable = !!onClick && item.id !== 'tse';
    const gradientId = `summaryGradient-${item.id}`;
    const details = item.details;
    const totalSymbols = details ? details.positiveCount + details.negativeCount : 0;
    const positivePercent = details && totalSymbols ? (details.positiveCount / totalSymbols) * 100 : 0;
    const negativePercent = details && totalSymbols ? 100 - positivePercent : 0;

    const tone: HomeCardTone = isPositive ? 'positive' : 'negative';

    return (
        <div
            onClick={isClickable ? onClick : undefined}
            className={composeHomeCard(
                clsx(
                    'flex h-full flex-col gap-2 transition-transform hover:-translate-y-0.5',
                    isClickable && 'cursor-pointer',
                ),
                tone,
                'sm',
            )}
        >
            <div className="flex items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <h4 className="font-bold text-white text-sm">{item.name}</h4>
            </div>
            <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performance.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#D7FE43" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#D7FE43" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <YAxis hide domain={['dataMin', 'dataMax']} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#D7FE43"
                            strokeWidth={2}
                            fill={`url(#${gradientId})`}
                            dot={false}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="text-left">
                <p className="font-semibold text-white text-sm">{performance.value}</p>
                <p className={`font-bold text-sm ${isPositive ? 'text-neo-green' : 'text-red-500'}`}>
                    {isPositive ? '▲' : '▼'} {toPersianDigits(performance.change.toFixed(2))}%
                </p>
            </div>
            {details && (
                <div className='mt-2 text-xs text-gray-400 flex flex-col gap-2'>
                    <div className='flex flex-wrap gap-x-4 gap-y-1'>
                        <span>حجم معاملات {details.volume}</span>
                        <span>ارزش معاملات {details.value}</span>
                    </div>
                    <div>
                        <div className='w-full h-2 rounded-full overflow-hidden bg-gray-600 flex'>
                            <div className='bg-red-500 h-full' style={{ width: `${negativePercent}%` }}></div>
                            <div className='bg-neo-green h-full' style={{ width: `${positivePercent}%` }}></div>
                        </div>
                        <div className='flex justify-between mt-1'>
                            <span>نمادهای منفی {toPersianDigits(details.negativeCount)}</span>
                            <span>نمادهای مثبت {toPersianDigits(details.positiveCount)}</span>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <span>ارزش صف فروش {details.sellQueueValue}</span>
                        <span>ارزش صف خرید {details.buyQueueValue}</span>
                    </div>
                </div>
            )}
        </div>
    );
});

interface MarketSummaryProps {
    items: MarketSummaryItem[];
    onItemClick?: (item: MarketSummaryItem) => void;
    columns?: 1 | 2;
}

const MarketSummary: React.FC<MarketSummaryProps> = ({ items, onItemClick, columns = 2 }) => {
    const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('daily');
    const timeframes: { label: string; value: Timeframe }[] = [
        { label: 'روزانه', value: 'daily' },
        { label: 'هفتگی', value: 'weekly' },
        { label: 'ماهانه', value: 'monthly' },
        { label: 'سالیانه', value: 'yearly' },
    ];

    return (
        <div className={composeHomeCard('space-y-4', 'default', 'md')}>
            <div className="space-y-3">
                <h2 className="text-xl font-bold text-white">خلاصه وضعیت بازارها</h2>
                <div className="flex w-full flex-wrap items-center justify-start gap-1 rounded-full bg-neo-dark-1 p-1 sm:w-auto">
                    {timeframes.map(tf => (
                        <button
                            key={tf.value}
                            onClick={() => setActiveTimeframe(tf.value)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${activeTimeframe === tf.value ? 'bg-neo-green text-[rgb(var(--tabs-active-text))]' : 'text-gray-400'}`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className={`grid gap-3 ${columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {items.map(item => (
                    <MarketSummaryCard
                        key={item.id}
                        item={item}
                        timeframe={activeTimeframe} 
                        onClick={onItemClick ? () => onItemClick(item) : undefined} 
                    />
                ))}
            </div>
        </div>
    );
};

export default memo(MarketSummary);
