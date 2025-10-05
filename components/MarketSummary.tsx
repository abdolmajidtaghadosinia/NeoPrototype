

import React, { useId, useState, memo } from 'react';
import clsx from 'clsx';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { MarketSummaryItem } from '../types';
import { toPersianDigits } from './formatters';
import { composeHomeCardClasses, HomeCardPadding, HomeCardTone } from './designSystem';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const accentColor = 'rgb(var(--neo-accent))';

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
                                <stop offset="0%" stopColor={accentColor} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <YAxis hide domain={['dataMin', 'dataMax']} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={accentColor}
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
    const timeframeSelectId = useId();
    const timeframeLabelId = `${timeframeSelectId}-label`;
    const timeframes: { label: string; value: Timeframe; hint: string }[] = [
        { label: 'روزانه', value: 'daily', hint: '۲۴ ساعت اخیر' },
        { label: 'هفتگی', value: 'weekly', hint: '۷ روز اخیر' },
        { label: 'ماهانه', value: 'monthly', hint: '۳۰ روز اخیر' },
        { label: 'سالیانه', value: 'yearly', hint: '۱۲ ماه اخیر' },
    ];

    return (
        <div className={composeHomeCard('space-y-4', 'default', 'md')}>
            <div className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold text-white">خلاصه وضعیت بازارها</h2>
                    <div className="relative w-full sm:w-64">
                        <label id={timeframeLabelId} htmlFor={timeframeSelectId} className="sr-only">
                            انتخاب بازه زمانی خلاصه بازار
                        </label>
                        <select
                            id={timeframeSelectId}
                            aria-labelledby={timeframeLabelId}
                            value={activeTimeframe}
                            onChange={(event) => setActiveTimeframe(event.target.value as Timeframe)}
                            className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-right text-xs font-semibold text-white shadow-sm transition focus:border-neo-green/40 focus:outline-none focus:ring-2 focus:ring-neo-green/60"
                        >
                            {timeframes.map((tf) => (
                                <option key={tf.value} value={tf.value} className="text-gray-900">
                                    {`${tf.label} — ${tf.hint}`}
                                </option>
                            ))}
                        </select>
                        <ChevronDownIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                    </div>
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
