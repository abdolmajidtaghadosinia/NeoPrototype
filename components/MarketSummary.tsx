

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
                    'flex h-full flex-col gap-3 transition-transform hover:-translate-y-0.5',
                    isClickable && 'cursor-pointer',
                ),
                tone,
                'sm',
            )}
        >
            <div className="flex items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
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
            <div className="flex items-end justify-between">
                <div className="space-y-1 text-left">
                    <span className="text-xs font-medium text-white/70">آخرین مقدار</span>
                    <p className="text-base font-semibold text-white">{performance.value}</p>
                </div>
                <span
                    className={clsx(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-sm',
                        isPositive ? 'bg-neo-green/15 text-neo-green' : 'bg-red-500/15 text-red-400',
                    )}
                >
                    {isPositive ? '▲' : '▼'} {toPersianDigits(performance.change.toFixed(2))}%
                </span>
            </div>
            {details && (
                <div className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-3 text-xs text-white/70">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-white/50">حجم معاملات</span>
                            <span className="text-sm font-semibold text-white">{details.volume}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-white/50">ارزش معاملات</span>
                            <span className="text-sm font-semibold text-white">{details.value}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-white/50">ارزش صف خرید</span>
                            <span className="text-sm font-semibold text-white">{details.buyQueueValue}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-white/50">ارزش صف فروش</span>
                            <span className="text-sm font-semibold text-white">{details.sellQueueValue}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="inline-flex items-center gap-1 font-medium text-white">
                                <span className="h-2 w-2 rounded-full bg-neo-green" aria-hidden />
                                نمادهای مثبت {toPersianDigits(details.positiveCount)}
                            </span>
                            <span className="inline-flex items-center gap-1 font-medium text-red-400">
                                <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden />
                                نمادهای منفی {toPersianDigits(details.negativeCount)}
                            </span>
                        </div>
                        <div className="flex h-2 overflow-hidden rounded-full bg-white/10">
                            <span
                                className="h-full bg-neo-green"
                                style={{ width: `${positivePercent}%` }}
                                aria-hidden
                            />
                            <span
                                className="h-full bg-red-500"
                                style={{ width: `${negativePercent}%` }}
                                aria-hidden
                            />
                        </div>
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
    const timeframes: { label: string; value: Timeframe }[] = [
        { label: 'روزانه', value: 'daily' },
        { label: 'هفتگی', value: 'weekly' },
        { label: 'ماهانه', value: 'monthly' },
        { label: 'سالیانه', value: 'yearly' },
    ];

    return (
        <div className={composeHomeCard('space-y-4', 'default', 'md')}>
            <div className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold text-white">خلاصه وضعیت بازارها</h2>
                    <div className="relative w-full sm:w-48">
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
                                    {tf.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDownIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                    </div>
                </div>
            </div>
            <div
                className={clsx(
                    'neo-animate-grid grid gap-3',
                    columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2',
                )}
            >
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
