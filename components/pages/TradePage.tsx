

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MarketAsset } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import TradeList, { TradeRecord } from '../TradeList';
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
        if (asset.category === 'کریپتو') return 0.5;
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
       if(asset.category === 'کریپتو') {
           const symbolMatch = asset.name.match(/\(([^)]+)\)/);
           if (symbolMatch) return symbolMatch[1];
       }
       if(asset.category === 'بورس' || asset.category === 'صندوق‌ها') return 'سهم';
       if(asset.id === 'dollar') return 'USD';
       if(asset.id === 'euro') return 'EUR';
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
            asset: 'بیت کوین',
            amount: 0.1,
            price: 650000000,
            status: 'ongoing',
            time: 'لحظاتی پیش',
        },
        {
            id: '2',
            type: 'sell',
            asset: 'اتریوم',
            amount: 1,
            price: 70000000,
            status: 'ongoing',
            time: 'امروز',
        },
    ];

    const completedTrades: TradeRecord[] = [
        {
            id: '3',
            type: 'buy',
            asset: 'دوج کوین',
            amount: 1000,
            price: 5000,
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
       } else { // sell
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

        const actionText = action === 'buy' ? 'خرید' : 'فروش';
        const settlementAmount = action === 'buy' ? totalCost : netProceeds;
        const settlementLabel = action === 'buy' ? 'مبلغ پرداختی نهایی' : 'مبلغ دریافتی پس از کارمزد';
        let alertMessage = `سفارش ${actionText} برای ${toPersianFormatted(finalAssetAmount)} ${assetUnit} از ${asset.name} با ارزش تقریبی ${toPersianFormatted(tradeValue.toFixed(0))} تومان ثبت شد.\n${settlementLabel}: ${toPersianFormatted(settlementAmount.toFixed(0))} تومان.`;

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
        <div className="h-screen w-full bg-neo-dark-1 flex flex-col font-sans">
            {/* Header */}
            <header className="flex-shrink-0 bg-neo-dark-2 p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="w-8"></div>
                    <div className="flex items-center gap-2">
                        <h1 className="font-bold text-lg text-white">{asset.name}</h1>
                        {typeof asset.icon === 'string' && asset.icon.startsWith('http') ?
                            <img src={asset.icon} alt={asset.name} className="w-8 h-8 object-contain" /> :
                            <span className="text-2xl w-8 h-8 flex items-center justify-center">{asset.icon}</span>
                        }
                    </div>
                    <button onClick={onBack} className="p-1 text-gray-300 hover:text-neo-green">
                      <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col md:flex-row gap-6 p-4">
                <aside className="w-full md:w-96 p-4 overflow-y-auto">
                  <div className="space-y-6">
                    <h2 className="text-right font-bold text-white">سفارش فعلی</h2>
                    {formFeedback && (
                        <div
                            ref={feedbackRef}
                            role="alert"
                            tabIndex={-1}
                            className={`rounded-xl border px-3 py-3 text-right text-sm leading-6 shadow ${
                                formFeedback.type === 'success'
                                    ? 'border-neo-green/70 bg-neo-green/10 text-neo-green'
                                    : 'border-red-500/60 bg-red-500/10 text-red-300'
                            }`}
                        >
                            <p className="whitespace-pre-line">{formFeedback.message}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex bg-neo-dark-3 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setAction('sell')}
                            className={`w-1/2 py-2.5 text-center rounded-lg font-bold text-sm transition-colors ${action === 'sell' ? 'bg-red-500 text-white shadow-md' : 'text-gray-300'}`}>
                            فروش
                        </button>
                        <button
                            type="button"
                            onClick={() => setAction('buy')}
                            className={`w-1/2 py-2.5 text-center rounded-lg font-bold text-sm transition-colors ${action === 'buy' ? 'bg-neo-green text-black shadow-md' : 'text-gray-300'}`}>
                            خرید
                        </button>
                    </div>

                    <div className="flex bg-neo-dark-3 p-1 rounded-xl shadow">
                        <button
                            type="button"
                            onClick={() => setOrderType('limit')}
                            className={`w-1/2 py-2 text-center rounded-lg text-sm font-bold transition-colors ${orderType === 'limit' ? 'bg-neo-dark-2 text-white' : 'text-gray-300'}`}>سفارش محدود</button>
                        <button
                            type="button"
                            onClick={() => setOrderType('market')}
                            className={`w-1/2 py-2 text-center rounded-lg text-sm font-bold transition-colors ${orderType === 'market' ? 'bg-neo-dark-2 text-white' : 'text-gray-300'}`}>سفارش بازار</button>
                    </div>
                    <p className="text-xs text-gray-500 text-right">
                        سفارش محدود امکان تعیین قیمت دلخواه را می‌دهد؛ سفارش بازار با قیمت لحظه‌ای انجام می‌شود و مناسب اجرای سریع است.
                    </p>

                    <div className="space-y-3 bg-neo-dark-2 p-4 rounded-2xl shadow">
                        {/* Price Input */}
                        {orderType === 'limit' ? (
                        <div>
                            <label className="text-sm font-semibold text-gray-400 mb-2 block text-right">قیمت واحد</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={toPersianFormatted(price)}
                                    onChange={e => setPrice(toEnglishDigits(e.target.value))}
                                    className="w-full bg-neo-dark-3 p-3 rounded-lg text-lg font-bold text-white text-left focus:outline-none focus:ring-2 focus:ring-neo-green border-2 border-transparent"
                                    style={{direction: 'ltr'}}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">تومان</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 text-right leading-5">
                                قیمت به تومان وارد می‌شود{priceSourceInfo.helperText ? `؛ نرخ لحظه‌ای از ${priceSourceInfo.sourceLabel} تبدیل شده است (${priceSourceInfo.helperText}).` : ' و با تغییر این مقدار می‌توانید سفارش محدود دلخواه خود را ثبت کنید.'}
                            </p>
                        </div>
                        ) : (
                        <div className="flex justify-between items-center bg-neo-dark-3 p-3 rounded-lg">
                            <span className="text-sm text-gray-400">قیمت بازار</span>
                            <span className="text-white font-bold" style={{direction:'ltr'}}>{toPersianFormatted(initialPrice.toString())} تومان</span>
                        </div>
                        )}

                        {/* Asset Amount Input */}
                        <div>
                            <label className="text-sm font-semibold text-gray-400 mb-2 block text-right">مقدار</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="۰"
                                    value={assetAmount ? toPersianFormatted(assetAmount) : ''}
                                    onChange={e => handleAssetAmountChange(e.target.value)}
                                    className="w-full bg-neo-dark-3 p-3 rounded-lg text-lg font-bold text-white text-left focus:outline-none focus:ring-2 focus:ring-neo-green border-2 border-transparent"
                                    style={{direction: 'ltr'}}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">{assetUnit}</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 text-right leading-5">
                                مقدار بر حسب واحد {assetUnit} وارد می‌شود و برای سفارش {action === 'buy' ? 'خرید' : 'فروش'} باید عددی مثبت درج کنید.
                            </p>
                        </div>

                        {/* Toman Amount Input */}
                         <div>
                            <label className="text-sm font-semibold text-gray-400 mb-2 block text-right">مبلغ کل</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="۰"
                                    value={tomanAmount ? toPersianFormatted(tomanAmount) : ''}
                                    onChange={e => handleTomanAmountChange(e.target.value)}
                                    className="w-full bg-neo-dark-3 p-3 rounded-lg text-lg font-bold text-white text-left focus:outline-none focus:ring-2 focus:ring-neo-green border-2 border-transparent"
                                    style={{direction: 'ltr'}}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">تومان</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 text-right leading-5">
                                مبلغ کل تخمینی سفارش به تومان است و کارمزد پس از محاسبه در خلاصه سفارش نمایش داده می‌شود.
                            </p>
                         </div>

                        <div className="flex justify-between gap-2 pt-2">
                            {[25, 50, 75, 100].map(p => (
                                <button type="button" key={p} onClick={() => handleSetPercentage(p)} className="bg-neo-dark-3 text-xs font-bold text-gray-300 py-1.5 rounded-md flex-1 hover:bg-neo-dark-1 transition-colors">{toPersianFormatted(p)}%</button>
                            ))}
                        </div>
                        <p className="text-[11px] leading-5 text-gray-500 text-right">
                            درصدها بر اساس {action === 'buy' ? 'موجودی قابل معامله تومانی' : `موجودی ${assetUnit} شما`} محاسبه می‌شوند.
                        </p>
                    </div>

                    <div className="bg-neo-dark-2 p-4 rounded-2xl shadow space-y-2 text-gray-300 text-sm" aria-live="polite">
                        <h3 className="text-right text-white font-semibold mb-2">خلاصه سفارش</h3>
                        {priceSourceInfo.currency !== 'toman' && (
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>مبنای تبدیل</span>
                                <span className="text-right">{priceSourceInfo.helperText}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>ارزش معامله</span>
                            <span>{toPersianFormatted(tradeValue.toFixed(0))} تومان</span>
                        </div>
                        <div className="flex justify-between">
                            <span>کارمزد</span>
                            <span>{toPersianFormatted(fee.toFixed(0))} تومان</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{action === 'buy' ? 'مبلغ پرداختی' : 'دریافتی پس از کارمزد'}</span>
                            <span>{toPersianFormatted((action === 'buy' ? totalCost : netProceeds).toFixed(0))} تومان</span>
                        </div>
                        <div className="flex justify-between">
                            <span>موجودی شما</span>
                            <span>{action === 'buy' ? `${toPersianFormatted(userTomanBalance)} تومان` : `${toPersianFormatted(userAssetBalance)} ${assetUnit}`}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>موجودی کیف پول قابل معامله (مبنای درصدها)</span>
                            <span>{toPersianFormatted(userTradableTomanBalance)} تومان</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{action === 'buy' ? 'باقیمانده موجودی قابل معامله' : 'باقیمانده دارایی'}</span>
                            <span>{action === 'buy' ? `${toPersianFormatted(Math.max(remainingBalance, 0).toFixed(0))} تومان` : `${toPersianFormatted(Math.max(remainingBalance, 0))} ${assetUnit}`}</span>
                        </div>
                        {isBalanceInsufficient && (
                            <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-right text-xs font-semibold text-red-300">
                                {action === 'buy'
                                    ? 'موجودی قابل معامله تومانی برای این سفارش کافی نیست. مبلغ سفارش یا درصدهای انتخابی را کاهش دهید.'
                                    : `${asset.name} کافی برای فروش در کیف پول شما موجود نیست.`}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3 rounded-2xl border border-gray-800/70 bg-neo-dark-2/80 p-4 text-right text-sm text-gray-300 shadow">
                        <h3 className="text-white font-semibold">چک‌لیست قبل از ارسال</h3>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-gray-500">
                                <span>پیشرفت آماده‌سازی</span>
                                <span className="font-semibold text-gray-200">
                                    {toPersianFormatted(checklistProgress.completed)} از {toPersianFormatted(checklistProgress.total)}
                                </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-neo-dark-3">
                                <div className="h-full rounded-full bg-neo-green transition-all" style={{ width: `${checklistProgress.percent}%` }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            {checklistItems.map((item) => (
                                <label
                                    key={item.key}
                                    className="flex flex-row-reverse items-center justify-between gap-3 rounded-xl bg-neo-dark-3/50 p-3"
                                >
                                    <div className="text-right">
                                        <p className="font-semibold text-white text-sm">{item.label}</p>
                                        <p className="text-xs text-gray-400 leading-5">{item.description}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-600 bg-neo-dark-3 text-neo-green focus:ring-neo-green"
                                        checked={checklistState[item.key]}
                                        onChange={() => toggleChecklistItem(item.key)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-neo-dark-2 p-4 rounded-2xl shadow">
                        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="w-full flex justify-between items-center text-right font-semibold text-gray-300">
                            <span>تنظیم حد سود / ضرر (اختیاری)</span>
                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                        </button>
                        {showAdvanced && (
                            <div className="mt-4 pt-4 border-t border-gray-800 space-y-3">
                                {/* Take Profit Input */}
                                <div>
                                    <label className="text-sm font-semibold text-green-500 mb-2 block text-right">حد سود</label>
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            placeholder="قیمت فروش در سود"
                                            value={takeProfit ? toPersianFormatted(takeProfit) : ''}
                                            onChange={e => setTakeProfit(toEnglishDigits(e.target.value))}
                                            className="w-full bg-neo-dark-3 p-3 rounded-lg text-lg font-bold text-white text-left focus:outline-none focus:ring-2 focus:ring-green-500 border-2 border-transparent"
                                            style={{direction: 'ltr'}}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">تومان</span>
                                    </div>
                                    {takeProfitProfitPercent > 0 && (
                                        <p className="text-xs text-green-500 font-semibold mt-1 text-right">
                                            سود احتمالی: +{toPersianFormatted(takeProfitProfitPercent.toFixed(2))}%
                                        </p>
                                    )}
                                </div>
                                {/* Stop Loss Input */}
                                <div>
                                    <label className="text-sm font-semibold text-red-500 mb-2 block text-right">حد ضرر</label>
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            placeholder="قیمت فروش در ضرر"
                                            value={stopLoss ? toPersianFormatted(stopLoss) : ''}
                                            onChange={e => setStopLoss(toEnglishDigits(e.target.value))}
                                            className="w-full bg-neo-dark-3 p-3 rounded-lg text-lg font-bold text-white text-left focus:outline-none focus:ring-2 focus:ring-red-500 border-2 border-transparent"
                                            style={{direction: 'ltr'}}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">تومان</span>
                                    </div>
                                    {stopLossProfitPercent < 0 && (
                                        <p className="text-xs text-red-500 font-semibold mt-1 text-right">
                                            زیان احتمالی: {toPersianFormatted(stopLossProfitPercent.toFixed(2))}%
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-neo-dark-2 p-4 rounded-2xl text-right text-sm text-gray-400 space-y-1 shadow">
                        <p>موجودی تومان: <span className="font-semibold text-white">{toPersianFormatted(userTomanBalance)} تومان</span></p>
                        <p>موجودی قابل معامله کیف پول: <span className="font-semibold text-white">{toPersianFormatted(userTradableTomanBalance)} تومان</span></p>
                        <p>موجودی {asset.name}: <span className="font-semibold text-white">{toPersianFormatted(userAssetBalance)} {assetUnit}</span></p>
                    </div>
                    
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={`w-full p-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105
                            ${action === 'buy' ? 'bg-neo-green text-black hover:bg-opacity-90' : 'bg-red-500 hover:bg-red-600'}
                            ${!canSubmit ? 'bg-neo-dark-3 text-gray-500 !transform-none !shadow-none cursor-not-allowed' : 'shadow-lg'}`}
                        >
                            {action === 'buy' ? 'خرید' : 'فروش'}
                        </button>
                    </div>
                  </form>
                  <div className="space-y-4">
                    <TradeList title="معاملات در حال انجام" trades={ongoingTrades} />
                    <TradeList title="معاملات انجام شده" trades={completedTrades} />
                    <TradeList title="معاملات کنسل شده" trades={canceledTrades} />
                  </div>
                </div>
              </aside>
                <section className="flex-1 p-4">
                    <div className="w-full h-80 md:h-[32rem] rounded-2xl border border-gray-800 bg-neo-dark-2">
                        <PriceChart asset={asset} />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TradePage;
