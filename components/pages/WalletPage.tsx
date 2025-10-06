

import React from 'react';
import Portfolio from '../Portfolio';
import PortfolioAnalysis from '../PortfolioAnalysis';
import { PortfolioSlice } from '../../types';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, ComposedChart, Area, CartesianGrid, TooltipProps } from 'recharts';
import { userPortfolioData, userRecentTrades } from '../../data/marketData';
import AssetCategories, { AssetCategory } from '../AssetCategories';
import { toPersianDigits } from '../formatters';
import TradeHistoryCard from '../TradeHistoryCard';
import { composeSurfaceClasses } from '../designSystem';

const portfolioHistoryData = [
  { name: '۶ روز پیش', value: 31200000 },
  { name: '۵ روز پیش', value: 31500000 },
  { name: '۴ روز پیش', value: 32100000 },
  { name: '۳ روز پیش', value: 31800000 },
  { name: 'دیروز', value: 32200000 },
  { name: 'امروز', value: 32700000 },
];

const fundAssets = userPortfolioData.filter(a => a.name.includes('صندوق'));
const stockAssets = userPortfolioData.filter(a => a.name.includes('سهام'));
const accentColor = 'rgb(var(--neo-accent))';

const categories: AssetCategory[] = [
    { name: 'ارزش صندوق‌ها', value: 19500000, percentage: 45, color: accentColor, lastUpdated: 'بروزرسانی سه شنبه, ۱۱ شهریور', assets: fundAssets },
    { name: 'ارزش سبد سهام', value: 17250000, percentage: 40, color: '#8b5cf6', lastUpdated: 'بروزرسانی پنج شنبه, ۱۳ شهریور', assets: stockAssets },
    { name: 'اوراق و سپرده‌ها', value: 6500000, percentage: 15, color: '#38bdf8', lastUpdated: 'بروزرسانی لحظه‌ای', assets: userPortfolioData.filter(a => a.name.includes('اوراق')) },
];

const tooltipStyles: React.CSSProperties = {
    background: 'var(--neo-surface-bg)',
    border: '1px solid var(--neo-surface-border)',
    borderRadius: '14px',
    boxShadow: 'var(--neo-surface-shadow)',
    color: 'rgb(var(--neo-text-primary))',
    direction: 'rtl',
    fontFamily: 'Vazirmatn, sans-serif',
    padding: '8px 12px'
};

const chartGridColor = 'rgba(148, 163, 184, 0.18)';
const chartAreaGradientId = 'portfolioValueArea';
const portfolioSurfaceClasses = composeSurfaceClasses('muted', 'lg', 'rounded-3xl space-y-5 transition-colors');

const PortfolioTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    const value = payload[0].value as number;
    return (
        <div style={tooltipStyles}>
            <p className="mb-1 text-sm font-semibold text-[rgb(var(--neo-text-strong))]">{label}</p>
            <p className="text-sm font-bold text-[rgb(var(--neo-text-primary))]">
                <span className="font-medium text-[rgb(var(--neo-text-secondary))]">ارزش:</span>{' '}
                <span style={{ color: accentColor }}>{toPersianDigits(value.toLocaleString())}</span>
                <span className="mr-1 font-medium text-[rgb(var(--neo-text-secondary))]">تومان</span>
            </p>
        </div>
    );
};

interface WalletPageProps {
  onSellClick: (asset: PortfolioSlice) => void;
  onLoanRequestClick: () => void;
  onQuickTradeClick: () => void;
  onPortfolioSliceSelect: (slice: PortfolioSlice) => void;
}

const WalletPage: React.FC<WalletPageProps> = ({ onSellClick, onLoanRequestClick, onQuickTradeClick, onPortfolioSliceSelect }) => {
    const totalValue = portfolioHistoryData[portfolioHistoryData.length - 1].value;

    return (
        <div className="pb-4 space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">

            <div className="space-y-6">
                <AssetCategories totalValue={totalValue} categories={categories} />

                <button
                    onClick={onLoanRequestClick}
                    className="w-full text-center py-3 rounded-xl font-semibold text-black bg-neo-green shadow-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
                >
                    درخواست وام (توثیق)
                </button>

                <div className={portfolioSurfaceClasses}>
                    <h2 className="text-right text-lg font-bold text-[rgb(var(--neo-text-strong))] sm:text-xl">روند ارزش پورتفوی</h2>
                    <div className="h-56 w-full sm:h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={portfolioHistoryData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id={chartAreaGradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={accentColor} stopOpacity={0.32} />
                                        <stop offset="100%" stopColor={accentColor} stopOpacity={0.04} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 6" vertical={false} stroke={chartGridColor} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={12}
                                    tick={{ fill: 'rgb(var(--neo-text-secondary))', fontSize: 12, fontWeight: 500 }}
                                />
                                <YAxis hide domain={[dataMin => dataMin * 0.98, dataMax => dataMax * 1.04]} />
                                <Tooltip content={<PortfolioTooltip />} cursor={{ stroke: accentColor, strokeDasharray: '3 6', strokeOpacity: 0.4 }} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={accentColor}
                                    strokeWidth={3}
                                    fill={`url(#${chartAreaGradientId})`}
                                    dot={{ r: 5, fill: accentColor, stroke: `rgb(var(--neo-accent-ink))`, strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: accentColor, stroke: '#ffffff', strokeWidth: 2 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <PortfolioAnalysis portfolioData={userPortfolioData} />
            </div>

            <div className="space-y-6">
                <Portfolio
                    data={userPortfolioData}
                    totalValue={totalValue}
                    onQuickTradeClick={onQuickTradeClick}
                    onSliceClick={onPortfolioSliceSelect}
                    variant="highlight"
                />

                <div>
                    <h2 className="text-xl font-bold text-white text-right mb-4">آخرین معاملات</h2>
                    <div className="space-y-3">
                    {userRecentTrades.map((trade) => (
                        <TradeHistoryCard key={trade.id} trade={trade} />
                    ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
