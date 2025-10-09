
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis, XAxis, CartesianGrid } from 'recharts';
import Skeleton from '../Skeleton';
import moment from 'jalali-moment';
import { GoogleGenAI } from '@google/genai';
import { MarketAsset, PerformanceData } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { CurrencyDollarIcon } from '../icons/CurrencyDollarIcon';
import { RefreshIcon } from '../icons/RefreshIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { AiIcon } from '../icons/AiIcon';
import { BookmarkIcon } from '../icons/BookmarkIcon';
import TechnicalAnalysisSection from '../TechnicalAnalysisSection';
import { toPersianDigits } from '../formatters';
import Page from '../layout/Page';
import { composeSurfaceClasses, SurfacePadding, SurfaceTone } from '../designSystem';
import AssetIcon, { deriveAssetSymbol } from '../AssetIcon';


type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

const assetVariantMap: Record<MarketAsset['category'], NonNullable<React.ComponentProps<typeof AssetIcon>['variant']>> = {
  بورس: 'stock',
  'صندوق‌ها': 'fund',
  ارزها: 'currency',
  کالا: 'commodity',
};

/**
 * Props for the AssetProfilePage component.
 */
interface AssetProfilePageProps {
  /** The financial asset object to display. */
  asset: MarketAsset;
  /** Callback function to navigate back to the previous view. */
  onBack: () => void;
  /** Callback function to initiate the buy process for the asset. */
  onBuy: (asset: MarketAsset) => void;
  /** Callback function to initiate the sell process for the asset. */
  onSell: (asset: MarketAsset) => void;
}

/**
 * A reusable card component for displaying a single key-value statistic with an icon.
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the statistic (e.g., "Market Cap").
 * @param {string} props.value - The value of the statistic.
 * @param {React.ReactNode} props.icon - The icon to display next to the statistic.
 * @returns {JSX.Element} A styled card displaying the statistic.
 */
const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className={composeSurfaceClasses('bg-neo-dark-3/70 flex-1 p-4', 'muted', 'sm')}>
        <div className="flex items-center gap-3">
            <div className="text-neo-green bg-black/20 p-2 rounded-lg">{icon}</div>
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className="font-bold text-white text-md">{value}</p>
            </div>
        </div>
    </div>
);

/**
 * Renders the detailed profile page for a specific financial asset.
 * This page includes a dynamic price chart, key statistics, an AI-powered summary,
 * technical analysis, and action buttons for buying, selling, and managing watchlists.
 * It fetches detailed chart data on demand based on the selected timeframe.
 * @param {AssetProfilePageProps} props - The component props.
 * @returns {JSX.Element} The full-page component for an asset's profile.
 */
const AssetProfilePage: React.FC<AssetProfilePageProps> = ({ asset, onBack, onBuy, onSell }) => {
    const [detailedAsset, setDetailedAsset] = useState<MarketAsset>(asset);
    const [isLoadingChart, setIsLoadingChart] = useState(false);
    const [chartError, setChartError] = useState<string | null>(null);
    const [timeframe, setTimeframe] = useState<Timeframe>('monthly');

    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const [summaryGenerated, setSummaryGenerated] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    // This effect ensures that if the parent component passes a new asset,
    // our local state is reset correctly.
    useEffect(() => {
        setDetailedAsset(asset);
        setTimeframe('monthly'); // Reset to default timeframe for the new asset
        // Reset AI summary state for the new asset
        setAiSummary(null);
        setIsSummaryLoading(false);
        setSummaryError(null);
        setSummaryGenerated(false);
    }, [asset]);

    // This effect fetches the dynamic chart data whenever the asset or timeframe changes.
    useEffect(() => {
        setIsLoadingChart(false);
        setChartError(null);
    }, [detailedAsset.id, detailedAsset.category, timeframe]);

    const toggleWatchlist = () => setIsInWatchlist((prev) => !prev);
    
    const handleGenerateSummary = async () => {
      setIsSummaryLoading(true);
      setSummaryError(null);
      setSummaryGenerated(true); // Show the summary section now
      
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        setTimeout(() => {
          setAiSummary(`این یک تحلیل نمونه برای ${asset.name} است. بر اساس داده‌های اخیر، این دارایی نوسانات مثبتی را تجربه کرده و حجم معاملات آن افزایش یافته است. اخبار اخیر نشان‌دهنده چشم انداز مثبت در این صنعت است.`);
          setIsSummaryLoading(false);
        }, 1500);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
          Please provide a brief, easy-to-understand market analysis summary for the following asset in Persian.
          Focus on its recent performance and any significant news. The tone should be informative and neutral for a financial app.

          Asset Name: ${asset.name}
          Description: ${asset.description}
          Daily Change: ${asset.performance.daily.change.toFixed(2)}%
          Weekly Change: ${asset.performance.weekly.change.toFixed(2)}%
          Market Cap: ${asset.marketCap}
          24h Volume: ${asset.volume24h}

          Generate a concise summary (2-3 sentences).
        `;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        setAiSummary(response.text);
      } catch (error) {
        console.error("Error generating AI summary:", error);
        setSummaryError("خطا در تولید تحلیل هوشمند. لطفا دوباره تلاش کنید.");
      } finally {
        setIsSummaryLoading(false);
      }
    };


    const performance = detailedAsset.performance[timeframe];
    const isPositive = performance && performance.change >= 0;
    const accentColor = 'rgb(var(--neo-accent))';
    const chartColor = isPositive ? accentColor : '#ef4444';
    const priceUnitLabel = useMemo(() => {
        const priceText = detailedAsset.price;
        if (priceText.includes('$')) return 'دلار';
        if (priceText.includes('ریال')) return 'ریال';
        if (priceText.includes('تومان')) return 'تومان';
        return '';
    }, [detailedAsset.price]);
    const priceStats = useMemo(() => {
        if (!performance || !performance.chartData || performance.chartData.length === 0) {
            return null;
        }
        const values = performance.chartData
            .map((point) => point.value)
            .filter((value) => typeof value === 'number' && Number.isFinite(value));
        if (values.length === 0) {
            return null;
        }
        const high = Math.max(...values);
        const low = Math.min(...values);
        const average = values.reduce((sum, value) => sum + value, 0) / values.length;
        return { high, low, average };
    }, [performance]);

    const intradayStats = useMemo(() => {
        const daily = detailedAsset.performance?.daily;
        const dataPoints = daily?.chartData ?? [];
        if (!daily || !Array.isArray(dataPoints) || dataPoints.length === 0) {
            return null;
        }
        const numericValues = dataPoints
            .map((point) => point.value)
            .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
        if (numericValues.length === 0) {
            return null;
        }
        const open = numericValues[0];
        const close = numericValues[numericValues.length - 1];
        const high = Math.max(...numericValues);
        const low = Math.min(...numericValues);
        const change = close - open;
        const percent = open !== 0 ? (change / open) * 100 : 0;
        return { open, close, high, low, change, percent };
    }, [detailedAsset.performance]);

    const formatPriceWithUnit = (value: number) => {
        const localeValue = value.toLocaleString('fa-IR', {
            maximumFractionDigits: value >= 100 ? 0 : 2,
        });
        return `${toPersianDigits(localeValue)}${priceUnitLabel ? ` ${priceUnitLabel}` : ''}`;
    };

    const chartXAxisLabel = 'زمان';
    const chartYAxisLabel = priceUnitLabel ? `قیمت (${priceUnitLabel})` : 'قیمت';

    const formatChartLabel = useCallback(
        (rawLabel: string | number) => {
            const label = typeof rawLabel === 'number' ? rawLabel.toString() : rawLabel;
            if (typeof label !== 'string' || !label.trim()) return '';
            const timestamp = parseInt(label, 10);
            if (Number.isNaN(timestamp) || timestamp <= 0) {
                return '';
            }

            const m = moment(timestamp).locale('fa');
            if (!m.isValid()) return '';

            switch (timeframe) {
                case 'daily':
                    return toPersianDigits(m.format('HH:mm'));
                case 'weekly':
                case 'monthly':
                    return toPersianDigits(m.format('jD jMMM'));
                case 'yearly':
                    return toPersianDigits(m.format('jMMM jYY'));
                default:
                    return toPersianDigits(m.format('jYYYY/jM/jD'));
            }
        },
        [timeframe],
    );

    const formatPriceTick = useCallback(
        (value: number) => {
            if (typeof value !== 'number' || Number.isNaN(value)) {
                return '';
            }
            const localized = value.toLocaleString('fa-IR', {
                maximumFractionDigits: value >= 100 ? 0 : 1,
            });
            return toPersianDigits(localized);
        },
        [],
    );

    const timeframes: { label: string; value: Timeframe }[] = [
        { label: 'روزانه', value: 'daily' },
        { label: 'هفتگی', value: 'weekly' },
        { label: 'ماهانه', value: 'monthly' },
        { label: 'سالیانه', value: 'yearly' },
    ];

    const surface = useCallback(
        (extra = '', tone: SurfaceTone = 'base', padding: SurfacePadding = 'md') =>
            composeSurfaceClasses(tone, padding, extra),
        [],
    );

    return (
        <div className="min-h-screen bg-neo-dark-1 text-white">
            <header className="sticky top-0 z-20 bg-neo-dark-1/85 backdrop-blur flex items-center justify-between gap-4 px-4 py-5 border-b border-neo-dark-3/60 lg:px-8">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="hidden rounded-full border border-neo-dark-3/70 p-2 text-gray-300 transition hover:border-neo-green/60 hover:text-neo-green lg:inline-flex"
                        aria-label="بازگشت"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-neo-dark-2 p-1 rounded-xl flex items-center justify-center w-12 h-12">
                            <AssetIcon
                                icon={detailedAsset.icon}
                                name={detailedAsset.name}
                                symbol={deriveAssetSymbol(detailedAsset.name)}
                                size="sm"
                                variant={assetVariantMap[detailedAsset.category] ?? 'default'}
                            />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <h1 className="text-lg font-bold text-white sm:text-xl">{detailedAsset.name}</h1>
                            <span className="rounded-full bg-neo-dark-3/80 px-3 py-1 text-xs text-gray-300 sm:text-sm">
                                {detailedAsset.category || 'بازار'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-left">
                    <div className="text-right">
                        <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">{detailedAsset.price}</p>
                        <p className={`text-sm font-semibold sm:text-base ${isPositive ? 'text-neo-green' : 'text-red-400'}`}>
                            {performance && performance.chartData.length > 0 ? (
                                <>
                                    {isPositive ? '▲' : '▼'} {toPersianDigits(performance.change.toFixed(2))}%
                                </>
                            ) : (
                                '...'
                            )}
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-pressed={isInWatchlist}
                        onClick={toggleWatchlist}
                        className={`hidden items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition lg:inline-flex ${
                            isInWatchlist
                                ? 'border-neo-green/70 bg-neo-dark-3/70 text-neo-green'
                                : 'border-gray-700 text-gray-300 hover:border-neo-green/60 hover:text-neo-green'
                        }`}
                    >
                        <BookmarkIcon className={`h-4 w-4 ${isInWatchlist ? 'text-neo-green' : 'text-gray-400'}`} />
                        {isInWatchlist ? 'در دیده‌بان' : 'افزودن به دیده‌بان'}
                    </button>
                    <button
                        onClick={() => onBuy(detailedAsset)}
                        className="hidden rounded-xl bg-neo-green px-5 py-3 text-sm font-bold text-black transition hover:bg-neo-green/90 lg:block"
                    >
                        خرید سریع
                    </button>
                </div>
            </header>

            <Page
                as="main"
                spacing="none"
                className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-28 pt-6 text-white lg:grid lg:grid-cols-[2fr,1fr] lg:px-8 lg:pb-16"
            >
                <section className="space-y-6">
                    <div
                        className={surface(
                            'bg-neo-dark-2/60 shadow-lg backdrop-blur lg:p-8',
                            'elevated',
                            'md',
                        )}
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4 text-right">
                                <div className="hidden rounded-2xl border border-neo-dark-3/60 px-3 py-2 text-gray-300 lg:block">
                                    <span className="text-sm">آخرین بروزرسانی</span>
                                    <p className="text-base font-semibold text-white">{moment().locale('fa').format('jYYYY/jM/jD')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">قیمت لحظه‌ای</p>
                                    <p className="text-3xl font-black text-white sm:text-4xl">{detailedAsset.price}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-end gap-2">
                                {timeframes.map((tf) => (
                                    <button
                                        key={tf.value}
                                        onClick={() => setTimeframe(tf.value)}
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-green/70 ${
                                            timeframe === tf.value
                                                ? 'bg-neo-green text-black shadow-lg shadow-neo-green/30'
                                                : 'bg-neo-dark-3 text-gray-300 hover:bg-neo-dark-2'
                                        }`}
                                    >
                                        {tf.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 h-64 w-full rounded-2xl bg-neo-dark-1/40 p-2 sm:h-72">
                            {isLoadingChart ? (
                                <Skeleton className="h-full w-full rounded-2xl" />
                            ) : chartError ? (
                                <div className="flex h-full items-center justify-center text-red-500">{chartError}</div>
                            ) : performance && performance.chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={performance.chartData}
                                        margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
                                    >
                                        <defs>
                                            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                                                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2E" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tickFormatter={formatChartLabel}
                                            tickLine={false}
                                            axisLine={{ stroke: '#3F3F46' }}
                                            tick={{ fill: '#D4D4D8', fontSize: 12 }}
                                            interval="preserveStartEnd"
                                            minTickGap={16}
                                            label={{
                                                value: chartXAxisLabel,
                                                position: 'insideBottom',
                                                offset: -10,
                                                fill: '#9CA3AF',
                                                fontSize: 12,
                                            }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(28, 28, 30, 0.9)',
                                                border: '1px solid #4A4A4A',
                                                borderRadius: '14px',
                                                direction: 'rtl',
                                                fontFamily: 'Vazirmatn, sans-serif',
                                                color: '#fff',
                                            }}
                                            formatter={(value: number) => [`مقدار: ${toPersianDigits(value)}`, null]}
                        
                                            labelStyle={{ color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                            labelFormatter={(label: string) => {
                                                try {
                                                    const formatted = formatChartLabel(label);
                                                    return formatted || 'تاریخ نامعتبر';
                                                } catch (e) {
                                                    console.error('Error in date formatting:', e);
                                                    return 'خطا در تاریخ';
                                                }
                                            }}
                                            cursor={{ stroke: accentColor, strokeWidth: 1 }}
                                        />
                                        <YAxis
                                            domain={['dataMin', 'dataMax']}
                                            tickFormatter={formatPriceTick}
                                            orientation="right"
                                            tickLine={false}
                                            axisLine={{ stroke: '#3F3F46' }}
                                            tick={{ fill: '#D4D4D8', fontSize: 12 }}
                                            width={70}
                                            label={{
                                                value: chartYAxisLabel,
                                                angle: -90,
                                                position: 'insideRight',
                                                offset: 10,
                                                fill: '#9CA3AF',
                                                fontSize: 12,
                                            }}
                                        />
                                        <Area type="linear" dataKey="value" stroke={chartColor} strokeWidth={3} fill="url(#chart-gradient)" fillOpacity={1} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-500">داده‌ای برای نمایش نمودار وجود ندارد.</div>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-neo-dark-3/60 bg-neo-dark-1/40 p-4 text-right text-sm text-gray-300 sm:grid-cols-3">
                        <div>
                            <p className="text-xs text-gray-400">بیشترین قیمت بازه</p>
                            <p className="mt-1 font-bold text-white">
                                {priceStats ? `${toPersianDigits(priceStats.high.toLocaleString('fa-IR', { maximumFractionDigits: 2 }))}${priceUnitLabel ? ` ${priceUnitLabel}` : ''}` : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">کمترین قیمت بازه</p>
                            <p className="mt-1 font-bold text-white">
                                {priceStats ? `${toPersianDigits(priceStats.low.toLocaleString('fa-IR', { maximumFractionDigits: 2 }))}${priceUnitLabel ? ` ${priceUnitLabel}` : ''}` : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">میانگین قیمتی دوره</p>
                            <p className="mt-1 font-bold text-white">
                                {priceStats ? `${toPersianDigits(priceStats.average.toLocaleString('fa-IR', { maximumFractionDigits: 2 }))}${priceUnitLabel ? ` ${priceUnitLabel}` : ''}` : '—'}
                            </p>
                        </div>
                    </div>

                    {intradayStats && (
                        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-neo-dark-3/60 bg-neo-dark-1/30 p-4 text-right text-sm text-gray-300 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <p className="text-xs text-gray-400">قیمت باز امروز</p>
                                <p className="mt-1 font-bold text-white">{formatPriceWithUnit(intradayStats.open)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">قیمت پایانی فعلی</p>
                                <p className="mt-1 font-bold text-white">{formatPriceWithUnit(intradayStats.close)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">تغییر خالص روزانه</p>
                                <p className={`mt-1 font-bold ${intradayStats.change >= 0 ? 'text-neo-green' : 'text-red-400'}`}>
                                    {intradayStats.change >= 0 ? '+' : '-'}{formatPriceWithUnit(Math.abs(intradayStats.change))}
                                </p>
                            </div>
                            <div className="flex flex-col items-end justify-center gap-2">
                                <p className="text-xs text-gray-400">درصد تغییر</p>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${intradayStats.percent >= 0 ? 'bg-neo-green/10 text-neo-green' : 'bg-red-500/10 text-red-400'}`}>
                                    {intradayStats.percent >= 0 ? '+' : ''}{toPersianDigits(intradayStats.percent.toFixed(2))}%
                                </span>
                            </div>
                        </div>
                    )}

                    <div className={surface('bg-neo-dark-2/70 shadow-lg', 'base', 'md')}>
                        <h2 className="mb-4 text-xl font-bold text-white">درباره دارایی</h2>
                        <p className="text-sm leading-relaxed text-gray-300 sm:text-base">{detailedAsset.description}</p>
                    </div>
                </section>

                <aside className="space-y-6">
                    <div className={surface('bg-neo-dark-2/80 shadow-lg', 'base', 'md')}>
                        <h2 className="mb-4 text-lg font-bold text-white">آمار کلیدی</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            <StatCard label="ارزش بازار" value={toPersianDigits(detailedAsset.marketCap)} icon={<CurrencyDollarIcon className="w-6 h-6" />} />
                            <StatCard label="حجم معاملات (۲۴ ساعت)" value={toPersianDigits(detailedAsset.volume24h)} icon={<ChartBarIcon className="w-6 h-6" />} />
                            <StatCard label="دارایی در گردش" value={toPersianDigits(detailedAsset.circulatingSupply)} icon={<RefreshIcon className="w-6 h-6" />} />
                            {detailedAsset.rsi !== undefined && (
                                <StatCard label="شاخص RSI (ساعتی)" value={toPersianDigits(detailedAsset.rsi.toFixed(1))} icon={<TrendingUpIcon className="w-6 h-6" />} />
                            )}
                        </div>
                    </div>

                    <div className={surface('bg-neo-dark-2/80 shadow-lg', 'base', 'md')}>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-white">تحلیل هوشمند</h2>
                            <button
                                onClick={handleGenerateSummary}
                                disabled={isSummaryLoading}
                                className="inline-flex items-center gap-2 rounded-full border border-neo-green/50 px-4 py-2 text-xs font-semibold text-neo-green transition hover:bg-neo-green/10 disabled:cursor-not-allowed disabled:border-neo-dark-3 disabled:text-gray-500"
                            >
                                {isSummaryLoading ? (
                                    <>
                                        <span className="h-2 w-2 rounded-full bg-neo-green animate-pulse" />
                                        در حال تولید
                                    </>
                                ) : (
                                    <>
                                        <AiIcon className="h-4 w-4" />
                                        تولید تحلیل
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="min-h-[112px] rounded-2xl border border-neo-dark-3/70 bg-black/20 p-4 text-sm leading-relaxed text-gray-300">
                            {!summaryGenerated && <p className="text-gray-400">برای دریافت جمع‌بندی سریع روی دکمه «تولید تحلیل» بزنید.</p>}
                            {summaryGenerated && (
                                <>
                                    {isSummaryLoading ? (
                                        <Skeleton className="h-6 w-full" />
                                    ) : summaryError ? (
                                        <p className="text-red-400">{summaryError}</p>
                                    ) : (
                                        <p>{aiSummary}</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className={surface('bg-neo-dark-2/80 shadow-lg', 'base', 'md')}>
                        <h2 className="mb-4 text-lg font-bold text-white">تحلیل تکنیکال</h2>
                        <TechnicalAnalysisSection asset={detailedAsset} />
                    </div>

                    <div className={surface('hidden gap-4 bg-neo-dark-2/80 shadow-lg lg:grid lg:grid-cols-2', 'base', 'md')}>
                        <button
                            onClick={() => onSell(detailedAsset)}
                            className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600"
                        >
                            فروش
                        </button>
                        <button
                            onClick={() => onBuy(detailedAsset)}
                            className="rounded-2xl bg-neo-green px-4 py-3 text-sm font-bold text-black transition hover:bg-neo-green/90"
                        >
                            خرید
                        </button>
                    </div>
                </aside>
            </Page>

            <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-neo-dark-2/95 p-4 backdrop-blur lg:hidden">
                <div className="mx-auto flex max-w-md flex-col gap-3">
                    <button
                        type="button"
                        onClick={toggleWatchlist}
                        className={`w-full rounded-xl border p-3 text-sm font-semibold transition ${
                            isInWatchlist
                                ? 'border-neo-green/70 text-neo-green bg-neo-dark-3/70'
                                : 'border-gray-700 text-gray-200 hover:border-neo-green hover:text-neo-green'
                        }`}
                    >
                        {isInWatchlist ? 'در دیده‌بان' : 'افزودن به دیده‌بان'}
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onSell(detailedAsset)}
                            className="w-full rounded-xl bg-red-500 p-4 text-lg font-bold text-white transition-colors hover:bg-red-600"
                        >
                            فروش
                        </button>
                        <button
                            onClick={() => onBuy(detailedAsset)}
                            className="w-full rounded-xl bg-neo-green p-4 text-lg font-bold text-black transition-colors hover:bg-neo-green/90"
                        >
                            خرید
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetProfilePage;
