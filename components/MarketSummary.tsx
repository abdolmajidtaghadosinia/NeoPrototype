

import React, { useId, useState, memo } from 'react';
import clsx from 'clsx';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { MarketSummaryItem } from '../types';
import { toPersianDigits } from './formatters';
import {
    composeHomeCardClasses,
    HomeCardPadding,
    HomeCardTone,
    toneBarFillVariantClasses,
    toneChipVariantClasses,
    toneTextVariantClasses,
} from './designSystem';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import AssetIcon, { deriveAssetSymbol } from './AssetIcon';

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

const getSummaryVariant = (
    item: MarketSummaryItem,
): NonNullable<React.ComponentProps<typeof AssetIcon>['variant']> => {
    if (item.name.includes('شاخص')) {
        return 'index';
    }
    if (item.name.includes('دلار') || item.id === 'usd') {
        return 'currency';
    }
    if (item.name.includes('طلا') || item.name.includes('صندوق')) {
        return 'fund';
    }
    return 'stock';
};

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
    const iconVariant = getSummaryVariant(item);

    return (
        <div
            onClick={isClickable ? onClick : undefined}
            className={composeHomeCard(
                clsx(
                    'h-full neo-stack neo-stack--tight transition-transform hover:-translate-y-0.5',
                    isClickable && 'cursor-pointer',
                ),
                tone,
                'sm',
            )}
        >
            <div className="flex items-center gap-2 text-[rgb(var(--neo-text-strong))]">
                <AssetIcon
                    icon={item.icon}
                    name={item.name}
                    symbol={deriveAssetSymbol(item.name)}
                    size="sm"
                    variant={iconVariant}
                />
                <h4 className="text-sm font-bold">{item.name}</h4>
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
            <div className="flex items-end justify-between text-[rgb(var(--neo-text-secondary))]">
                <div className="neo-stack neo-stack--tight text-left">
                    <span className="text-xs font-medium">آخرین مقدار</span>
                    <p className="text-base font-semibold text-[rgb(var(--neo-text-strong))]">{performance.value}</p>
                </div>
                <span
                    className={clsx(
                        toneChipVariantClasses[isPositive ? 'positive' : 'negative'],
                        'text-xs',
                    )}
                >
                    {isPositive ? '▲' : '▼'} {toPersianDigits(performance.change.toFixed(2))}%
                </span>
            </div>
            {details && (
                <div className="neo-subtle-panel neo-stack neo-stack--tight text-xs text-[rgb(var(--neo-text-secondary))]">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-[rgb(var(--neo-text-muted))]">حجم معاملات</span>
                            <span className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">{details.volume}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-[rgb(var(--neo-text-muted))]">ارزش معاملات</span>
                            <span className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">{details.value}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-[rgb(var(--neo-text-muted))]">ارزش صف خرید</span>
                            <span className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">{details.buyQueueValue}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-[rgb(var(--neo-text-muted))]">ارزش صف فروش</span>
                            <span className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">{details.sellQueueValue}</span>
                        </div>
                    </div>
                    <div className="neo-stack neo-stack--tight">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className={clsx('inline-flex items-center gap-1 font-medium', toneTextVariantClasses.positive)}>
                                <span className="neo-dot" aria-hidden />
                                نمادهای مثبت {toPersianDigits(details.positiveCount)}
                            </span>
                            <span className={clsx('inline-flex items-center gap-1 font-medium', toneTextVariantClasses.negative)}>
                                <span className="neo-dot" aria-hidden />
                                نمادهای منفی {toPersianDigits(details.negativeCount)}
                            </span>
                        </div>
                        <div className="neo-tone-bar" role="presentation">
                            <span
                                className={toneBarFillVariantClasses.positive}
                                style={{ width: `${positivePercent}%` }}
                                aria-hidden
                            />
                            <span
                                className={toneBarFillVariantClasses.negative}
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
        <div className={composeHomeCard('neo-stack neo-stack--normal', 'default', 'md')}>
            <div className="neo-stack neo-stack--tight">
                <div className="flex flex-col gap-2 text-[rgb(var(--neo-text-strong))] sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold">خلاصه وضعیت بازارها</h2>
                    <div className="relative w-full sm:w-48">
                        <label id={timeframeLabelId} htmlFor={timeframeSelectId} className="sr-only">
                            انتخاب بازه زمانی خلاصه بازار
                        </label>
                        <select
                            id={timeframeSelectId}
                            aria-labelledby={timeframeLabelId}
                            value={activeTimeframe}
                            onChange={(event) => setActiveTimeframe(event.target.value as Timeframe)}
                            className="neo-field neo-field--sm text-right text-xs font-semibold"
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
