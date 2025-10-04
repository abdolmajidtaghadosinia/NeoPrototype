

import React from 'react';
import Portfolio from '../Portfolio';
import PortfolioAnalysis from '../PortfolioAnalysis';
import { PortfolioSlice } from '../../types';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, ComposedChart, Bar, Scatter, CartesianGrid, TooltipProps } from 'recharts';
import { userPortfolioData, userRecentTrades } from '../../data/marketData';
import AssetCategories, { AssetCategory } from '../AssetCategories';
import { toPersianDigits } from '../formatters';
import TradeHistoryCard from '../TradeHistoryCard';
import ERC20Wallet from '../ERC20Wallet';

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
const cryptoAssets = userPortfolioData.filter(a => !a.name.includes('صندوق') && !a.name.includes('سهام'));

const categories: AssetCategory[] = [
    { name: 'ارزش صندوق‌ها', value: 16350000, percentage: 50, color: '#D7FE43', lastUpdated: 'بروزرسانی سه شنبه, ۱۱ شهریور', assets: fundAssets },
    { name: 'ارزش سبد سهام', value: 8175000, percentage: 25, color: '#8b5cf6', lastUpdated: 'بروزرسانی پنج شنبه, ۱۳ شهریور', assets: stockAssets },
    { name: 'ارزش رمزارزها', value: 8175000, percentage: 25, color: '#38bdf8', lastUpdated: 'بروزرسانی لحظه‌ای', assets: cryptoAssets },
];

const tooltipStyles = {
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    border: '1px solid #444',
    borderRadius: '10px',
    direction: 'rtl' as const,
    fontFamily: 'Vazirmatn, sans-serif',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    color: '#fff',
    padding: '6px 10px'
};

const PortfolioTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    const value = payload[0].value as number;
    return (
        <div style={tooltipStyles}>
            <p className="font-bold mb-1">{label}</p>
            <p>{`ارزش: ${toPersianDigits(value.toLocaleString())} تومان`}</p>
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

                <div className="bg-neo-dark-3 rounded-2xl p-4">
                    <h2 className="text-xl font-bold text-white mb-4 text-right">روند ارزش پورتفوی</h2>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={portfolioHistoryData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <defs>
                                    <pattern id="portfolioBar" width="8" height="8" patternUnits="userSpaceOnUse">
                                        <rect width="8" height="8" fill="#D7FE43" opacity="0.15" />
                                        <rect width="4" height="4" fill="#D7FE43" opacity="0.25" />
                                        <rect x="4" y="4" width="4" height="4" fill="#D7FE43" opacity="0.25" />
                                    </pattern>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis hide domain={['dataMin', 'dataMax']} />
                                <Tooltip content={<PortfolioTooltip />} />
                                <Bar dataKey="value" fill="url(#portfolioBar)" radius={[8, 8, 0, 0]} barSize={24} />
                                <Scatter dataKey="value" fill="#D7FE43" />
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

                <ERC20Wallet />

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
