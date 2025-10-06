

import React, { useState, useMemo, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { MarketAsset } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import type { TradeRecord } from '../TradeList';
import { toEnglishDigits, parsePrice, toPersianFormatted } from '../formatters';
import PriceChart from '../PriceChart';
import { normalizeText } from '../../utils/normalizeText';

const USD_TO_TOMAN = 59500;
const EUR_TO_TOMAN = 65000;
const RIAL_TO_TOMAN = 0.1;


/**
 * Props for the TradePage component.
 */
interface TradePageProps {
  /** Information about the asset to be traded, including the asset object and the initial action. */
  assetInfo: {
    /** The market asset being traded. */
    asset: MarketAsset;
    /** The initial trade direction. */
    action: 'buy' | 'sell';
  };
  /** Callback function to navigate back to the previous view. */
  onBack: () => void;
}

type ChecklistKey = 'balance' | 'risk' | 'review';

/**
 * Renders the main trading interface for buying or selling a specific asset.
 * This comprehensive component includes:
 * - An order panel for setting buy/sell, limit/market orders, price, and amount.
 * - Real-time calculation of trade value, fees, and remaining balances.
 * - An optional section for setting take-profit and stop-loss levels.
 * - A pre-submission checklist to guide the user.
 * - Display of ongoing, completed, and canceled trades.
 * - An interactive price chart for the selected asset.
 *
 * @param {TradePageProps} props - The component props.
 * @returns {JSX.Element} The main trading page component.
 */
const TradePage: React.FC<TradePageProps> = ({ assetInfo, onBack }) => {
    const { asset } = assetInfo;
    const priceSourceInfo = useMemo((): {
        currency: 'usd' | 'eur' | 'rial' | 'toman';
        conversionRate: number;
        helperText: string | null;
        sourceLabel: string;
    } => {
        const rawPrice = asset.price || '';
        const lower = rawPrice.toLowerCase();
        const normalized = normalizeText(rawPrice);

        if (/[\$]/.test(rawPrice) || lower.includes('usd') || lower.includes('دلار') || normalized.includes('usd')) {
            return {
                currency: 'usd' as const,
                conversionRate: USD_TO_TOMAN,
                helperText: `هر ۱ دلار ≈ ${toPersianFormatted(USD_TO_TOMAN)} تومان`,
                sourceLabel: 'دلار آمریکا',
            };
        }

        if (/[€]/.test(rawPrice) || lower.includes('یورو') || lower.includes('eur') || normalized.includes('eur')) {
            return {
                currency: 'eur' as const,
                conversionRate: EUR_TO_TOMAN,
                helperText: `هر ۱ یورو ≈ ${toPersianFormatted(EUR_TO_TOMAN)} تومان`,
                sourceLabel: 'یورو',
            };
        }

        if (lower.includes('ریال') || normalized.includes('rial')) {
            return {
                currency: 'rial' as const,
                conversionRate: RIAL_TO_TOMAN,
                helperText: 'هر ۱۰ ریال = ۱ تومان',
                sourceLabel: 'ریال',
            };
        }

        return {
            currency: 'toman' as const,
            conversionRate: 1,
            helperText: null as string | null,
            sourceLabel: 'تومان',
        };
    }, [asset.price]);

    const initialPrice = useMemo(() => {
        const parsed = parsePrice(asset.price);
        const converted = parsed * priceSourceInfo.conversionRate;
        if (!Number.isFinite(converted)) {
            return 0;
        }
        return converted;
    }, [asset.price, priceSourceInfo.conversionRate]);

    const [action, setAction] = useState<'buy' | 'sell'>(assetInfo.action);
    
    // Mock user balances
    const userTomanBalance = 50_000_000;
    const userTradableTomanBalance = 45_000_000;
    const userAssetBalance = useMemo(() => {
        if (asset.id === 'khodro') return 1500;
        if (asset.id === 'ayar') return 30;
        if (asset.category === 'صندوق‌ها') return 120;
        if (asset.category === 'کالا') return 10;
        return 100;
    }, [asset]);

    const [price, setPrice] = useState<string>(initialPrice.toString());
    const [assetAmount, setAssetAmount] = useState<string>('');
    const [tomanAmount, setTomanAmount] = useState<string>('');
    const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [takeProfit, setTakeProfit] = useState<string>('');
    const [stopLoss, setStopLoss] = useState<string>('');
    const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const feedbackRef = useRef<HTMLDivElement | null>(null);
    const [checklistState, setChecklistState] = useState<Record<ChecklistKey, boolean>>({
        balance: true,
        risk: false,
        review: false,
    });

    useEffect(() => {
        setAction(assetInfo.action);
    }, [assetInfo.action, asset.id]);

    useEffect(() => {
        setPrice(initialPrice.toString());
    }, [initialPrice, asset.id]);

    useEffect(() => {
        setAssetAmount('');
        setTomanAmount('');
        setTakeProfit('');
        setStopLoss('');
        setFormFeedback(null);
        setChecklistState({ balance: true, risk: false, review: false });
    }, [asset.id, priceSourceInfo.currency]);

    const assetUnit = useMemo(() => {
       if(asset.category === 'بورس') return 'سهم';
       if(asset.category === 'صندوق‌ها') return 'واحد';
       if(asset.category === 'کالا') return 'گرم';
       if(asset.category === 'ارزها') {
           if(asset.id === 'dollar') return 'USD';
           if(asset.id === 'euro') return 'EUR';
           return 'واحد';
       }
       const symbolMatch = asset.name.match(/\(([^)]+)\)/);
       if (symbolMatch) return symbolMatch[1];
       return asset.name.split(' ')[0];
    }, [asset]);

    const checklistItems = useMemo(
        () => [
            {
                key: 'balance' as ChecklistKey,
                label: 'بررسی موجودی قابل معامله',
                description:
                    action === 'buy'
                        ? 'مطمئن شوید موجودی تومانی برای پرداخت کل سفارش کافی است.'
                        : `مقدار ${asset.name} در کیف پول شما قابل فروش است؟`,
            },
            {
                key: 'risk' as ChecklistKey,
                label: 'تعیین حد سود و ضرر',
                description: 'سناریو خروج در سود و زیان را قبل از ارسال سفارش مشخص کنید.',
            },
            {
                key: 'review' as ChecklistKey,
                label: 'بازبینی نهایی سفارش',
                description: 'قیمت، مقدار و کارمزد را دوباره بررسی کنید تا اشتباهی رخ ندهد.',
            },
        ],
        [action, asset.name]
    );

    const toggleChecklistItem = (key: ChecklistKey) => {
        setChecklistState((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const ongoingTrades: TradeRecord[] = [
        {
            id: '1',
            type: 'buy',
            asset: 'صندوق طلا عیار',
            amount: 20,
            price: 152000,
            status: 'ongoing',
            time: 'لحظاتی پیش',
        },
        {
            id: '2',
            type: 'sell',
            asset: 'سهام خودرو',
            amount: 500,
            price: 2150,
            status: 'ongoing',
            time: 'امروز',
        },
    ];

    const completedTrades: TradeRecord[] = [
        {
            id: '3',
            type: 'buy',
            asset: 'صندوق درآمد ثابت کمند',
            amount: 50,
            price: 11000,
            status: 'done',
            time: 'دیروز',
        },
    ];

    const canceledTrades: TradeRecord[] = [
        {
            id: '4',
            type: 'sell',
            asset: 'خودرو',
            amount: 100,
            price: 8000,
            status: 'canceled',
            time: 'هفته پیش',
        },
    ];

    const tradeSections = [
        { id: 'ongoing', title: 'معاملات در حال انجام', trades: ongoingTrades },
        { id: 'done', title: 'معاملات انجام شده', trades: completedTrades },
        { id: 'canceled', title: 'معاملات کنسل شده', trades: canceledTrades },
    ];

    const tradeStatusStyles: Record<TradeRecord['status'], { label: string; badge: string }> = {
        ongoing: {
            label: 'در حال انجام',
            badge: 'border border-amber-400/30 bg-amber-500/10 text-amber-400',
        },
        done: {
            label: 'انجام شد',
            badge: 'border border-[color:rgba(var(--neo-accent),0.35)] bg-[color:rgba(var(--neo-accent),0.18)] text-[rgb(var(--neo-accent))] shadow-[0_16px_32px_-28px_rgba(82,255,122,0.6)]',
        },
        canceled: {
            label: 'کنسل شد',
            badge: 'border border-rose-400/30 bg-rose-500/10 text-rose-400',
        },
    };
    
    const numericPrice = parseFloat(price) || 0;
    const numericTakeProfit = parseFloat(takeProfit) || 0;
    const numericStopLoss = parseFloat(stopLoss) || 0;
    const numericAssetAmount = parseFloat(assetAmount) || 0;
    const numericTomanAmount = parseFloat(tomanAmount) || 0;
    const effectivePrice = orderType === 'market' ? initialPrice : numericPrice;
    const tradeValue = numericAssetAmount * effectivePrice;
    const tradeFeeRate = 0.003; // 0.3%
    const fee = tradeValue * tradeFeeRate;
    const totalCost = tradeValue + fee;
    const netProceeds = tradeValue - fee;
    const remainingBalance = action === 'buy'
        ? userTradableTomanBalance - totalCost
        : userAssetBalance - numericAssetAmount;
    
    const takeProfitProfitPercent = useMemo(() => {
        if (effectivePrice > 0 && numericTakeProfit > 0) {
            return ((numericTakeProfit - effectivePrice) / effectivePrice) * 100;
        }
        return 0;
    }, [effectivePrice, numericTakeProfit]);

    const stopLossProfitPercent = useMemo(() => {
        if (effectivePrice > 0 && numericStopLoss > 0) {
            return ((numericStopLoss - effectivePrice) / effectivePrice) * 100;
        }
        return 0;
    }, [effectivePrice, numericStopLoss]);

    const hasRiskPlan = numericTakeProfit > 0 && numericStopLoss > 0;

    const isBalanceInsufficient = action === 'buy' ? totalCost > userTradableTomanBalance : numericAssetAmount > userAssetBalance;

    const checklistProgress = useMemo(() => {
        const values = Object.values(checklistState);
        const completed = values.filter(Boolean).length;
        const total = values.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed, total, percent };
    }, [checklistState]);

    const dailyChange = asset.performance?.daily?.change ?? 0;
    const formattedDailyChange = `${dailyChange > 0 ? '+' : ''}${toPersianFormatted(Math.abs(dailyChange).toFixed(2))}%`;
    const dailyChangeClass = dailyChange > 0
        ? 'text-[rgb(var(--neo-accent))]'
        : dailyChange < 0
            ? 'text-rose-400'
            : 'text-[rgb(var(--neo-text-secondary))]';

    const orderActionLabel = action === 'buy' ? 'خرید' : 'فروش';
    const settlementLabel = action === 'buy' ? 'مبلغ نهایی پرداختی' : 'مبلغ دریافتی پس از کارمزد';
    const settlementValue = action === 'buy' ? totalCost : netProceeds;
    const orderSummary = [
        { label: 'ارزش سفارش', value: `${toPersianFormatted(tradeValue.toFixed(0))} تومان` },
        { label: 'کارمزد تخمینی', value: `${toPersianFormatted(fee.toFixed(0))} تومان` },
        { label: settlementLabel, value: `${toPersianFormatted(settlementValue.toFixed(0))} تومان` },
    ];

    const balanceSummary = action === 'buy'
        ? [
            { label: 'موجودی کل تومان', value: `${toPersianFormatted(userTomanBalance)} تومان` },
            { label: 'موجودی قابل معامله', value: `${toPersianFormatted(userTradableTomanBalance)} تومان` },
            { label: 'مانده پس از سفارش', value: `${toPersianFormatted(Math.max(remainingBalance, 0).toFixed(0))} تومان` },
        ]
        : [
            { label: `دارایی ${asset.name}`, value: `${toPersianFormatted(userAssetBalance)} ${assetUnit}` },
            { label: 'ارزش معامله به تومان', value: `${toPersianFormatted(tradeValue.toFixed(0))} تومان` },
            { label: 'واحد باقی‌مانده', value: `${toPersianFormatted(Math.max(remainingBalance, 0))} ${assetUnit}` },
        ];

    const handleAssetAmountChange = (value: string) => {
        const cleanValue = toEnglishDigits(value);
        setAssetAmount(cleanValue);
        const numericValue = parseFloat(cleanValue) || 0;
        setTomanAmount(effectivePrice > 0 ? (numericValue * effectivePrice).toFixed(0) : '');
    };

    const handleTomanAmountChange = (value: string) => {
        const cleanValue = toEnglishDigits(value);
        setTomanAmount(cleanValue);
        const numericValue = parseFloat(cleanValue) || 0;
        if (effectivePrice > 0) {
            setAssetAmount((numericValue / effectivePrice).toFixed(8));
        } else {
            setAssetAmount('');
        }
    };

    const handleSetPercentage = (percentage: number) => {
        if (action === 'buy') {
            const amount = userTradableTomanBalance * (percentage / 100);
            handleTomanAmountChange(Math.floor(amount).toString());
        } else {
            const amount = userAssetBalance * (percentage / 100);
            handleAssetAmountChange(amount.toString());
        }
    };

    useEffect(() => {
        if (!formFeedback) {
            return;
        }
        feedbackRef.current?.focus();
        const timer = window.setTimeout(() => setFormFeedback(null), 6000);
        return () => window.clearTimeout(timer);
    }, [formFeedback]);

    useEffect(() => {
        setChecklistState((prev) => {
            if (prev.risk === hasRiskPlan) {
                return prev;
            }
            return { ...prev, risk: hasRiskPlan };
        });
    }, [hasRiskPlan]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormFeedback(null);
        const finalAssetAmount = parseFloat(assetAmount) || 0;
        const finalTomanAmount = parseFloat(tomanAmount) || 0;
        const finalTakeProfit = parseFloat(takeProfit) || 0;
        const finalStopLoss = parseFloat(stopLoss) || 0;

        if (finalAssetAmount <= 0) {
            setFormFeedback({ type: 'error', message: 'لطفاً مقدار معتبر وارد کنید.' });
            return;
        }

        if (action === 'buy' && finalTomanAmount > userTradableTomanBalance) {
            setFormFeedback({ type: 'error', message: 'موجودی تومانی شما برای انجام این خرید کافی نیست.' });
            return;
        }

        if (action === 'sell' && finalAssetAmount > userAssetBalance) {
            setFormFeedback({ type: 'error', message: `موجودی ${asset.name} شما برای این فروش کافی نیست.` });
            return;
        }

        if (finalTakeProfit > 0 && finalTakeProfit <= effectivePrice) {
            setFormFeedback({ type: 'error', message: 'قیمت حد سود باید بیشتر از قیمت معامله باشد.' });
            return;
        }
        if (finalStopLoss > 0 && finalStopLoss >= effectivePrice) {
            setFormFeedback({ type: 'error', message: 'قیمت حد ضرر باید کمتر از قیمت معامله باشد.' });
            return;
        }

        const settlementAmount = action === 'buy' ? totalCost : netProceeds;
        let alertMessage = `سفارش ${orderActionLabel} برای ${toPersianFormatted(finalAssetAmount)} ${assetUnit} از ${asset.name} با ارزش تقریبی ${toPersianFormatted(tradeValue.toFixed(0))} تومان ثبت شد.\n${settlementLabel}: ${toPersianFormatted(settlementAmount.toFixed(0))} تومان.`;

        if (finalTakeProfit > 0) {
            alertMessage += `\nحد سود: ${toPersianFormatted(finalTakeProfit)} تومان`;
        }
        if (finalStopLoss > 0) {
            alertMessage += `\nحد ضرر: ${toPersianFormatted(finalStopLoss)} تومان`;
        }

        setFormFeedback({ type: 'success', message: alertMessage });
        setChecklistState((prev) => ({ ...prev, review: true }));

        setAssetAmount('');
        setTomanAmount('');
        setTakeProfit('');
        setStopLoss('');
    };

    const canSubmit = (parseFloat(assetAmount) || 0) > 0;

    return (
        <div className="min-h-screen bg-[var(--app-body-bg)] pb-12 text-[rgb(var(--neo-text-primary))]">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 sm:px-6 lg:px-8">
            <header className="neo-surface rounded-3xl px-5 py-4 shadow-lg">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] shadow-sm">
                                {typeof asset.icon === 'string' && asset.icon.startsWith('http') ? (
                                    <img src={asset.icon} alt={asset.name} className="h-8 w-8 object-contain" />
                                ) : (
                                    <span className="text-2xl">{asset.icon}</span>
                                )}
                            </div>
                            <div className="space-y-1 text-right">
                                <span className="inline-flex items-center justify-center rounded-full border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] px-3 py-1 text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">
                                    {asset.category}
                                </span>
                                <h1 className="text-xl font-bold text-[rgb(var(--neo-text-strong))] sm:text-2xl">{asset.name}</h1>
                            </div>
                        </div>
                        <button
                            onClick={onBack}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] text-[rgb(var(--neo-text-secondary))] transition hover:text-[rgb(var(--neo-text-strong))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]"
                            aria-label="بازگشت"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-right text-sm sm:gap-6">
                        <div className="space-y-1">
                            <p className="text-[rgb(var(--neo-text-secondary))]">قیمت لحظه‌ای</p>
                            <p className="text-lg font-bold text-[rgb(var(--neo-text-strong))]" style={{ direction: 'ltr' }}>
                                {toPersianFormatted(initialPrice.toString())} تومان
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[rgb(var(--neo-text-secondary))]">تغییر روز</p>
                            <p className={clsx('text-lg font-bold', dailyChangeClass)}>{formattedDailyChange}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[rgb(var(--neo-text-secondary))]">نرخ مرجع</p>
                            <p className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">{priceSourceInfo.sourceLabel}</p>
                        </div>
                        {priceSourceInfo.helperText && (
                            <div className="rounded-2xl border border-dashed border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] px-4 py-2 text-xs leading-6 text-[rgb(var(--neo-text-secondary))]">
                                {priceSourceInfo.helperText}
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,1fr)] xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,1fr)]">
                <aside className="order-1 flex flex-col gap-6 lg:order-2">
                    {formFeedback && (
                        <div
                            ref={feedbackRef}
                            role="alert"
                            tabIndex={-1}
                            className={clsx(
                                'neo-surface rounded-3xl px-5 py-4 text-sm leading-7 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]',
                                formFeedback.type === 'success'
                                    ? 'neo-surface--positive text-[rgb(var(--neo-text-strong))]'
                                    : 'neo-surface--danger text-rose-100'
                            )}
                        >
                            <p className="whitespace-pre-line">{formFeedback.message}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="neo-surface rounded-3xl p-5 text-right shadow-lg space-y-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-[rgb(var(--neo-text-strong))] sm:text-xl">سفارش {orderActionLabel}</h2>
                                <p className="text-sm text-[rgb(var(--neo-text-secondary))]">
                                    مقادیر معامله را مشخص کنید و قبل از ارسال دوباره بررسی نمایید.
                                </p>
                            </div>
                            <span className="inline-flex items-center justify-center rounded-full border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] px-3 py-1 text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">
                                واحد دارایی: {assetUnit}
                            </span>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <span className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">جهت معامله</span>
                                <div className="flex gap-2 rounded-2xl bg-[color:var(--neo-surface-ghost-bg)] p-1">
                                    <button
                                        type="button"
                                        onClick={() => setAction('sell')}
                                        className={clsx(
                                            'flex-1 rounded-2xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]',
                                            action === 'sell'
                                                ? 'border border-rose-400/30 bg-rose-500/15 text-rose-400 shadow-[0_16px_32px_-26px_rgba(244,63,94,0.65)]'
                                                : 'text-[rgb(var(--neo-text-secondary))] hover:bg-[color:var(--neo-surface-muted-bg)]'
                                        )}
                                    >
                                        فروش
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAction('buy')}
                                        className={clsx(
                                            'flex-1 rounded-2xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]',
                                            action === 'buy'
                                                ? 'border border-[color:rgba(var(--neo-accent),0.4)] bg-[rgb(var(--neo-accent))] text-[rgb(var(--neo-accent-ink))] shadow-[0_18px_38px_-28px_rgba(107,255,110,0.7)]'
                                                : 'text-[rgb(var(--neo-text-secondary))] hover:bg-[color:var(--neo-surface-muted-bg)]'
                                        )}
                                    >
                                        خرید
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">نوع سفارش</span>
                                <div className="flex gap-2 rounded-2xl bg-[color:var(--neo-surface-ghost-bg)] p-1">
                                    <button
                                        type="button"
                                        onClick={() => setOrderType('limit')}
                                        className={clsx(
                                            'flex-1 rounded-2xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]',
                                            orderType === 'limit'
                                                ? 'border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-muted-bg)] text-[rgb(var(--neo-text-strong))]'
                                                : 'text-[rgb(var(--neo-text-secondary))] hover:bg-[color:var(--neo-surface-muted-bg)]'
                                        )}
                                    >
                                        سفارش محدود
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setOrderType('market')}
                                        className={clsx(
                                            'flex-1 rounded-2xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]',
                                            orderType === 'market'
                                                ? 'border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-muted-bg)] text-[rgb(var(--neo-text-strong))]'
                                                : 'text-[rgb(var(--neo-text-secondary))] hover:bg-[color:var(--neo-surface-muted-bg)]'
                                        )}
                                    >
                                        سفارش بازار
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs leading-6 text-[rgb(var(--neo-text-secondary))]">
                            سفارش محدود امکان تعیین قیمت دلخواه را می‌دهد؛ سفارش بازار با قیمت لحظه‌ای انجام می‌شود و مناسب اجرای سریع است.
                        </p>
                        <div className="space-y-5">
                            {orderType === 'limit' ? (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[rgb(var(--neo-text-secondary))]">قیمت واحد (تومان)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={toPersianFormatted(price)}
                                            onChange={(e) => setPrice(toEnglishDigits(e.target.value))}
                                            className="w-full rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] px-4 py-3 text-left text-lg font-bold text-[rgb(var(--neo-text-strong))] tracking-wide focus:border-[rgb(var(--neo-accent))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]"
                                            style={{ direction: 'ltr' }}
                                        />
                                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">
                                            تومان
                                        </span>
                                    </div>
                                    <p className="text-xs leading-6 text-[rgb(var(--neo-text-secondary))]">
                                        قیمت به تومان وارد می‌شود{priceSourceInfo.helperText ? `؛ نرخ لحظه‌ای از ${priceSourceInfo.sourceLabel} تبدیل شده است (${priceSourceInfo.helperText}).` : ' و با تغییر این مقدار می‌توانید سفارش محدود دلخواه خود را ثبت کنید.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] px-4 py-3">
                                    <span className="text-sm text-[rgb(var(--neo-text-secondary))]">قیمت بازار</span>
                                    <span className="text-lg font-bold text-[rgb(var(--neo-text-strong))]" style={{ direction: 'ltr' }}>
                                        {toPersianFormatted(initialPrice.toString())} تومان
                                    </span>
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[rgb(var(--neo-text-secondary))]">مقدار ({assetUnit})</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="۰"
                                        value={assetAmount ? toPersianFormatted(assetAmount) : ''}
                                        onChange={(e) => handleAssetAmountChange(e.target.value)}
                                        className="w-full rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] px-4 py-3 text-left text-lg font-bold text-[rgb(var(--neo-text-strong))] tracking-wide focus:border-[rgb(var(--neo-accent))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]"
                                        style={{ direction: 'ltr' }}
                                    />
                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">
                                        {assetUnit}
                                    </span>
                                </div>
                                <p className="text-xs leading-6 text-[rgb(var(--neo-text-secondary))]">
                                    مقدار بر حسب واحد {assetUnit} وارد می‌شود و برای سفارش {action === 'buy' ? 'خرید' : 'فروش'} باید عددی مثبت درج کنید.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[rgb(var(--neo-text-secondary))]">مبلغ کل (تومان)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="۰"
                                        value={tomanAmount ? toPersianFormatted(tomanAmount) : ''}
                                        onChange={(e) => handleTomanAmountChange(e.target.value)}
                                        className="w-full rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] px-4 py-3 text-left text-lg font-bold text-[rgb(var(--neo-text-strong))] tracking-wide focus:border-[rgb(var(--neo-accent))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]"
                                        style={{ direction: 'ltr' }}
                                    />
                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">
                                        تومان
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {[25, 50, 75, 100].map((p) => (
                                        <button
                                            type="button"
                                            key={p}
                                            onClick={() => handleSetPercentage(p)}
                                            className="rounded-2xl border border-[color:var(--neo-surface-border)] bg-transparent px-2 py-2 text-center text-xs font-bold text-[rgb(var(--neo-text-secondary))] transition hover:border-[rgb(var(--neo-accent))] hover:text-[rgb(var(--neo-accent))]"
                                        >
                                            {toPersianFormatted(p)}%
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] p-4">
                            <dl className="grid gap-3 sm:grid-cols-2">
                                {orderSummary.map((item) => (
                                    <div key={item.label} className="space-y-1">
                                        <dt className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">{item.label}</dt>
                                        <dd className="text-sm font-bold text-[rgb(var(--neo-text-strong))]">{item.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        <div className="rounded-2xl border border-dashed border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] p-4">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex w-full items-center justify-between text-sm font-semibold text-[rgb(var(--neo-text-strong))]"
                            >
                                <span>تنظیم حد سود / ضرر (اختیاری)</span>
                                <ChevronDownIcon className={clsx('h-5 w-5 transition-transform', showAdvanced ? 'rotate-180' : '')} />
                            </button>
                            {showAdvanced && (
                                <div className="mt-4 space-y-4 border-t border-[color:var(--neo-divider-color)] pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[rgb(var(--neo-text-secondary))]">حد سود (تومان)</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="قیمت فروش در سود"
                                                value={takeProfit ? toPersianFormatted(takeProfit) : ''}
                                                onChange={(e) => setTakeProfit(toEnglishDigits(e.target.value))}
                                                className="w-full rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] px-4 py-3 text-left text-lg font-bold text-[rgb(var(--neo-text-strong))] tracking-wide focus:border-[rgb(var(--neo-accent))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]"
                                                style={{ direction: 'ltr' }}
                                            />
                                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">
                                                تومان
                                            </span>
                                        </div>
                                        {takeProfitProfitPercent > 0 && (
                                            <p className="text-xs font-semibold text-[rgb(var(--neo-accent))]">
                                                سود احتمالی: +{toPersianFormatted(takeProfitProfitPercent.toFixed(2))}%
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[rgb(var(--neo-text-secondary))]">حد ضرر (تومان)</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="قیمت فروش در ضرر"
                                                value={stopLoss ? toPersianFormatted(stopLoss) : ''}
                                                onChange={(e) => setStopLoss(toEnglishDigits(e.target.value))}
                                                className="w-full rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] px-4 py-3 text-left text-lg font-bold text-[rgb(var(--neo-text-strong))] tracking-wide focus:border-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70"
                                                style={{ direction: 'ltr' }}
                                            />
                                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">
                                                تومان
                                            </span>
                                        </div>
                                        {stopLossProfitPercent < 0 && (
                                            <p className="text-xs font-semibold text-rose-400">
                                                زیان احتمالی: {toPersianFormatted(stopLossProfitPercent.toFixed(2))}%
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] p-4">
                            <dl className="grid gap-3 sm:grid-cols-2">
                                {balanceSummary.map((item) => (
                                    <div key={item.label} className="space-y-1">
                                        <dt className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">{item.label}</dt>
                                        <dd className="text-sm font-bold text-[rgb(var(--neo-text-strong))]">{item.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={clsx(
                                'w-full rounded-2xl px-4 py-3 text-lg font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--neo-accent))]',
                                canSubmit
                                    ? action === 'buy'
                                        ? 'bg-[rgb(var(--neo-accent))] text-[rgb(var(--neo-accent-ink))] shadow-[0_24px_48px_-28px_rgba(107,255,110,0.65)] hover:brightness-95'
                                        : 'bg-gradient-to-l from-rose-500 to-rose-400 text-white shadow-[0_24px_48px_-28px_rgba(244,63,94,0.6)] hover:brightness-95'
                                    : 'cursor-not-allowed bg-[color:var(--neo-surface-muted-bg)] text-[rgb(var(--neo-text-secondary))]'
                            )}
                        >
                            {orderActionLabel}
                        </button>
                    </form>
                    <div className="neo-surface neo-surface--ghost rounded-3xl p-5 shadow space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-[rgb(var(--neo-text-strong))]">چک‌لیست پیش از ارسال</h3>
                            <span className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">
                                {toPersianFormatted(checklistProgress.completed)} از {toPersianFormatted(checklistProgress.total)}
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--neo-surface-muted-bg)]">
                            <div
                                className="h-full rounded-full bg-[rgb(var(--neo-accent))] transition-all"
                                style={{ width: `${checklistProgress.percent}%` }}
                            />
                        </div>
                        <div className="space-y-3">
                            {checklistItems.map((item) => (
                                <label
                                    key={item.key}
                                    className="flex flex-row-reverse items-center justify-between gap-3 rounded-2xl border border-[color:var(--neo-surface-border)] bg-transparent p-3 transition hover:border-[rgb(var(--neo-accent))]"
                                >
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">{item.label}</p>
                                        <p className="text-xs leading-6 text-[rgb(var(--neo-text-secondary))]">{item.description}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-[color:var(--neo-surface-border)] accent-[rgb(var(--neo-accent))]"
                                        checked={checklistState[item.key]}
                                        onChange={() => toggleChecklistItem(item.key)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="neo-surface neo-surface--ghost rounded-3xl p-5 shadow space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-[rgb(var(--neo-text-strong))]">تاریخچه سفارشات</h3>
                            <span className="text-xs text-[rgb(var(--neo-text-secondary))]">نمونه داده‌های اخیر</span>
                        </div>
                        <div className="space-y-4">
                            {tradeSections.map((section) => (
                                <div key={section.id} className="space-y-3">
                                    <h4 className="text-sm font-semibold text-[rgb(var(--neo-text-secondary))]">{section.title}</h4>
                                    <ul className="space-y-3">
                                        {section.trades.length > 0 ? (
                                            section.trades.map((trade) => {
                                                const status = tradeStatusStyles[trade.status];
                                                const total = toPersianFormatted((trade.amount * trade.price).toFixed(0));
                                                return (
                                                    <li key={trade.id}>
                                                        <div className="rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] p-4 transition hover:border-[rgb(var(--neo-accent))]">
                                                            <div className="flex items-center justify-between gap-3">
                                                                <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', status.badge)}>
                                                                    {status.label}
                                                                </span>
                                                                <span className="text-xs text-[rgb(var(--neo-text-secondary))]">{trade.time}</span>
                                                            </div>
                                                            <div className="mt-3 space-y-1 text-right">
                                                                <p className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">
                                                                    {trade.description || `${trade.type === 'buy' ? 'خرید' : 'فروش'} ${trade.asset}`}
                                                                </p>
                                                                <p className="text-xs text-[rgb(var(--neo-text-secondary))]">
                                                                    {toPersianFormatted(trade.amount)} واحد • {toPersianFormatted(trade.price)} تومان ({total} تومان)
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        ) : (
                                            <li className="rounded-2xl border border-dashed border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] py-4 text-center text-xs text-[rgb(var(--neo-text-secondary))]">
                                                معامله‌ای ثبت نشده است
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
                <section className="order-2 space-y-6 lg:order-1">
                    <div className="neo-surface neo-surface--muted rounded-3xl p-5 shadow-lg">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-[rgb(var(--neo-text-strong))]">روند قیمتی دارایی</h2>
                                <p className="text-sm text-[rgb(var(--neo-text-secondary))]">نمایی از رفتار قیمت در بازه‌های مختلف</p>
                            </div>
                            <span className="text-xs text-[rgb(var(--neo-text-secondary))]">داده‌ها صرفاً برای نمایش نمونه‌ای است</span>
                        </div>
                        <div className="mt-4 h-72 sm:h-80 lg:h-[420px]">
                            <PriceChart asset={asset} />
                        </div>
                    </div>
                    <div className="neo-surface neo-surface--ghost rounded-3xl p-5 shadow space-y-4">
                        <h3 className="text-base font-bold text-[rgb(var(--neo-text-strong))]">جزئیات نماد</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">ارزش بازار</p>
                                <p className="text-sm font-bold text-[rgb(var(--neo-text-strong))]">{asset.marketCap}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">ارزش معاملات روز</p>
                                <p className="text-sm font-bold text-[rgb(var(--neo-text-strong))]">{asset.volume24h}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">موجودی در گردش</p>
                                <p className="text-sm font-bold text-[rgb(var(--neo-text-strong))]">{asset.circulatingSupply}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">پیشنهاد تحلیل</p>
                                <p className="text-sm text-[rgb(var(--neo-text-secondary))]">برای تصمیم‌گیری دقیق، حد سود و ضرر را قبل از ارسال سفارش مشخص کنید.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
    );
};

export default TradePage;
