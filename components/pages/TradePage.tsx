

import React, { useState, useMemo, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { MarketAsset } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import type { TradeRecord } from '../TradeList';
import { toEnglishDigits, parsePrice, toPersianFormatted } from '../formatters';
import { normalizeText } from '../../utils/normalizeText';

type AssetCategory = MarketAsset['category'];

type OrderFlowSnapshot = {
    queue: {
        buy: { volume: number; value: number; orders: number };
        sell: { volume: number; value: number; orders: number };
    };
    totalVolume: { buy: number; sell: number };
    retailVolume: { buy: number; sell: number };
    institutionalVolume: { buy: number; sell: number };
};

const volumeUnits: Record<AssetCategory, string> = {
    'بورس': 'سهم',
    'صندوق‌ها': 'واحد',
    'ارزها': 'معامله',
    'کالا': 'قرارداد',
};

const orderFlowPresets: Record<AssetCategory, OrderFlowSnapshot[]> = {
    'بورس': [
        {
            queue: {
                buy: { volume: 28_400_000, value: 1_980_000_000_000, orders: 182 },
                sell: { volume: 8_600_000, value: 568_000_000_000, orders: 74 },
            },
            totalVolume: { buy: 65_200_000, sell: 48_900_000 },
            retailVolume: { buy: 37_400_000, sell: 28_100_000 },
            institutionalVolume: { buy: 27_800_000, sell: 20_800_000 },
        },
        {
            queue: {
                buy: { volume: 19_600_000, value: 1_120_000_000_000, orders: 139 },
                sell: { volume: 6_200_000, value: 372_000_000_000, orders: 58 },
            },
            totalVolume: { buy: 52_400_000, sell: 41_700_000 },
            retailVolume: { buy: 29_500_000, sell: 24_900_000 },
            institutionalVolume: { buy: 22_900_000, sell: 16_800_000 },
        },
        {
            queue: {
                buy: { volume: 34_800_000, value: 2_480_000_000_000, orders: 214 },
                sell: { volume: 9_400_000, value: 672_000_000_000, orders: 91 },
            },
            totalVolume: { buy: 71_600_000, sell: 54_300_000 },
            retailVolume: { buy: 40_800_000, sell: 30_200_000 },
            institutionalVolume: { buy: 30_800_000, sell: 24_100_000 },
        },
    ],
    'صندوق‌ها': [
        {
            queue: {
                buy: { volume: 9_200_000, value: 182_000_000_000, orders: 108 },
                sell: { volume: 2_800_000, value: 52_000_000_000, orders: 46 },
            },
            totalVolume: { buy: 18_400_000, sell: 14_300_000 },
            retailVolume: { buy: 11_200_000, sell: 8_900_000 },
            institutionalVolume: { buy: 7_200_000, sell: 5_400_000 },
        },
        {
            queue: {
                buy: { volume: 6_700_000, value: 136_000_000_000, orders: 84 },
                sell: { volume: 3_400_000, value: 64_000_000_000, orders: 52 },
            },
            totalVolume: { buy: 15_600_000, sell: 12_800_000 },
            retailVolume: { buy: 9_400_000, sell: 7_800_000 },
            institutionalVolume: { buy: 6_200_000, sell: 5_000_000 },
        },
        {
            queue: {
                buy: { volume: 11_400_000, value: 228_000_000_000, orders: 126 },
                sell: { volume: 3_000_000, value: 58_000_000_000, orders: 49 },
            },
            totalVolume: { buy: 21_800_000, sell: 16_200_000 },
            retailVolume: { buy: 12_600_000, sell: 9_600_000 },
            institutionalVolume: { buy: 9_200_000, sell: 6_600_000 },
        },
    ],
    'ارزها': [
        {
            queue: {
                buy: { volume: 4_800, value: 86_000_000_000, orders: 58 },
                sell: { volume: 3_600, value: 64_000_000_000, orders: 43 },
            },
            totalVolume: { buy: 12_400, sell: 10_800 },
            retailVolume: { buy: 7_200, sell: 6_100 },
            institutionalVolume: { buy: 5_200, sell: 4_700 },
        },
        {
            queue: {
                buy: { volume: 5_600, value: 94_000_000_000, orders: 64 },
                sell: { volume: 2_900, value: 49_000_000_000, orders: 37 },
            },
            totalVolume: { buy: 11_800, sell: 9_500 },
            retailVolume: { buy: 6_500, sell: 5_100 },
            institutionalVolume: { buy: 5_300, sell: 4_400 },
        },
        {
            queue: {
                buy: { volume: 6_200, value: 102_000_000_000, orders: 71 },
                sell: { volume: 3_100, value: 52_000_000_000, orders: 41 },
            },
            totalVolume: { buy: 13_400, sell: 11_200 },
            retailVolume: { buy: 7_800, sell: 6_600 },
            institutionalVolume: { buy: 5_600, sell: 4_600 },
        },
    ],
    'کالا': [
        {
            queue: {
                buy: { volume: 7_600, value: 148_000_000_000, orders: 92 },
                sell: { volume: 3_100, value: 64_000_000_000, orders: 53 },
            },
            totalVolume: { buy: 16_400, sell: 13_200 },
            retailVolume: { buy: 9_600, sell: 7_100 },
            institutionalVolume: { buy: 6_800, sell: 6_100 },
        },
        {
            queue: {
                buy: { volume: 5_900, value: 122_000_000_000, orders: 81 },
                sell: { volume: 2_700, value: 54_000_000_000, orders: 45 },
            },
            totalVolume: { buy: 13_800, sell: 10_900 },
            retailVolume: { buy: 7_800, sell: 5_900 },
            institutionalVolume: { buy: 6_000, sell: 5_000 },
        },
        {
            queue: {
                buy: { volume: 8_400, value: 162_000_000_000, orders: 104 },
                sell: { volume: 3_600, value: 72_000_000_000, orders: 58 },
            },
            totalVolume: { buy: 18_200, sell: 14_500 },
            retailVolume: { buy: 10_400, sell: 7_800 },
            institutionalVolume: { buy: 7_800, sell: 6_700 },
        },
    ],
};

const cloneSnapshot = (snapshot: OrderFlowSnapshot): OrderFlowSnapshot => ({
    queue: {
        buy: { ...snapshot.queue.buy },
        sell: { ...snapshot.queue.sell },
    },
    totalVolume: { ...snapshot.totalVolume },
    retailVolume: { ...snapshot.retailVolume },
    institutionalVolume: { ...snapshot.institutionalVolume },
});

const pickOrderFlowSnapshot = (asset: MarketAsset): OrderFlowSnapshot => {
    const presets = orderFlowPresets[asset.category] || orderFlowPresets['بورس'];
    if (!presets || presets.length === 0) {
        return {
            queue: {
                buy: { volume: 0, value: 0, orders: 0 },
                sell: { volume: 0, value: 0, orders: 0 },
            },
            totalVolume: { buy: 0, sell: 0 },
            retailVolume: { buy: 0, sell: 0 },
            institutionalVolume: { buy: 0, sell: 0 },
        };
    }

    const hash = asset.id
        .split('')
        .reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);

    const selected = presets[hash % presets.length];
    return cloneSnapshot(selected);
};

const formatVolume = (value: number, unit: string): string => {
    if (value === 0) {
        return `۰ ${unit}`;
    }

    if (value >= 1_000_000_000) {
        const scaled = value / 1_000_000_000;
        const label = scaled >= 10 ? toPersianFormatted(Math.round(scaled)) : toPersianFormatted(scaled.toFixed(1));
        return `${label} میلیارد ${unit}`;
    }

    if (value >= 1_000_000) {
        const scaled = value / 1_000_000;
        const label = scaled >= 10 ? toPersianFormatted(Math.round(scaled)) : toPersianFormatted(scaled.toFixed(1));
        return `${label} میلیون ${unit}`;
    }

    if (value >= 1_000) {
        const scaled = value / 1_000;
        const label = scaled >= 10 ? toPersianFormatted(Math.round(scaled)) : toPersianFormatted(scaled.toFixed(1));
        return `${label} هزار ${unit}`;
    }

    return `${toPersianFormatted(value)} ${unit}`;
};

const formatMoney = (value: number): string => {
    if (value === 0) {
        return '۰ تومان';
    }

    if (value >= 1_000_000_000_000) {
        const scaled = value / 1_000_000_000_000;
        const label = scaled >= 10 ? toPersianFormatted(Math.round(scaled)) : toPersianFormatted(scaled.toFixed(1));
        return `${label} هزار میلیارد تومان`;
    }

    if (value >= 1_000_000_000) {
        const scaled = value / 1_000_000_000;
        const label = scaled >= 10 ? toPersianFormatted(Math.round(scaled)) : toPersianFormatted(scaled.toFixed(1));
        return `${label} میلیارد تومان`;
    }

    if (value >= 1_000_000) {
        const scaled = value / 1_000_000;
        const label = scaled >= 10 ? toPersianFormatted(Math.round(scaled)) : toPersianFormatted(scaled.toFixed(1));
        return `${label} میلیون تومان`;
    }

    if (value >= 1_000) {
        const scaled = value / 1_000;
        const label = scaled >= 10 ? toPersianFormatted(Math.round(scaled)) : toPersianFormatted(scaled.toFixed(1));
        return `${label} هزار تومان`;
    }

    return `${toPersianFormatted(value)} تومان`;
};

const formatNetFlow = (value: number, unit: string): { label: string; tone: 'positive' | 'negative' | 'neutral' } => {
    if (value === 0) {
        return { label: `۰ ${unit}`, tone: 'neutral' };
    }

    const tone: 'positive' | 'negative' = value > 0 ? 'positive' : 'negative';
    const magnitude = Math.abs(value);
    return {
        label: `${value > 0 ? '+' : '−'}${formatVolume(magnitude, unit)}`,
        tone,
    };
};

const formatNetMoney = (value: number): { label: string; tone: 'positive' | 'negative' | 'neutral' } => {
    if (value === 0) {
        return { label: '۰ تومان', tone: 'neutral' };
    }

    const tone: 'positive' | 'negative' = value > 0 ? 'positive' : 'negative';
    const magnitude = Math.abs(value);
    const prefix = value > 0 ? '+' : '−';
    return {
        label: `${prefix}${formatMoney(magnitude)}`,
        tone,
    };
};

const toneClassName = (tone: 'positive' | 'negative' | 'neutral'): string => {
    switch (tone) {
        case 'positive':
            return 'text-[rgb(var(--neo-accent))]';
        case 'negative':
            return 'text-[rgb(239,68,68)]';
        default:
            return 'text-[rgb(var(--neo-text-secondary))]';
    }
};

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
 * - A market order-flow digest covering queues and participant volumes.
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

    const orderFlowSnapshot = useMemo(() => pickOrderFlowSnapshot(asset), [asset]);
    const volumeUnit = volumeUnits[asset.category] ?? 'واحد';

    const totalVolume = orderFlowSnapshot.totalVolume.buy + orderFlowSnapshot.totalVolume.sell;
    const buyVolumePercent = totalVolume > 0 ? Math.round((orderFlowSnapshot.totalVolume.buy / totalVolume) * 100) : 50;
    const sellVolumePercent = 100 - buyVolumePercent;

    const netVolumeInfo = formatNetFlow(orderFlowSnapshot.totalVolume.buy - orderFlowSnapshot.totalVolume.sell, volumeUnit);

    const retailNetInfo = formatNetFlow(orderFlowSnapshot.retailVolume.buy - orderFlowSnapshot.retailVolume.sell, volumeUnit);

    const institutionalNetInfo = formatNetFlow(
        orderFlowSnapshot.institutionalVolume.buy - orderFlowSnapshot.institutionalVolume.sell,
        volumeUnit,
    );

    const queueNetMoneyInfo = formatNetMoney(orderFlowSnapshot.queue.buy.value - orderFlowSnapshot.queue.sell.value);
    const totalQueueOrders = orderFlowSnapshot.queue.buy.orders + orderFlowSnapshot.queue.sell.orders;

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
                </aside>
                <section className="order-2 space-y-6 lg:order-1">
                    <div className="neo-surface neo-surface--muted rounded-3xl p-5 shadow-lg space-y-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-[rgb(var(--neo-text-strong))]">تحلیل جریان سفارشات</h2>
                                <p className="text-sm text-[rgb(var(--neo-text-secondary))]">
                                    تصویری از صف‌های خرید و فروش و رفتار حقیقی و حقوقی در امروز
                                </p>
                            </div>
                            <span className="text-xs text-[rgb(var(--neo-text-secondary))]">داده‌ها صرفاً برای نمایش نمونه‌ای است</span>
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] p-4 text-right">
                                <div className="flex items-center justify-between gap-3">
                                    <h4 className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">صف‌های فعال امروز</h4>
                                    <span className="inline-flex items-center rounded-full border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-muted-bg)] px-3 py-1 text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">
                                        مجموع {toPersianFormatted(totalQueueOrders)} سفارش
                                    </span>
                                </div>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border border-[color:var(--neo-surface-border)] bg-transparent p-3">
                                        <div className="flex items-center justify-between text-sm font-semibold text-[rgb(var(--neo-text-strong))]">
                                            <span>صف خرید</span>
                                            <span>{formatVolume(orderFlowSnapshot.queue.buy.volume, volumeUnit)}</span>
                                        </div>
                                        <p className="mt-2 text-xs text-[rgb(var(--neo-text-secondary))]">
                                            ارزش تقریبی: {formatMoney(orderFlowSnapshot.queue.buy.value)}
                                        </p>
                                        <p className="mt-1 text-[10px] text-[rgb(var(--neo-text-secondary))]">
                                            {toPersianFormatted(orderFlowSnapshot.queue.buy.orders)} سفارش در انتظار تکمیل
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-[color:var(--neo-surface-border)] bg-transparent p-3">
                                        <div className="flex items-center justify-between text-sm font-semibold text-[rgb(var(--neo-text-strong))]">
                                            <span>صف فروش</span>
                                            <span>{formatVolume(orderFlowSnapshot.queue.sell.volume, volumeUnit)}</span>
                                        </div>
                                        <p className="mt-2 text-xs text-[rgb(var(--neo-text-secondary))]">
                                            ارزش تقریبی: {formatMoney(orderFlowSnapshot.queue.sell.value)}
                                        </p>
                                        <p className="mt-1 text-[10px] text-[rgb(var(--neo-text-secondary))]">
                                            {toPersianFormatted(orderFlowSnapshot.queue.sell.orders)} سفارش در انتظار تکمیل
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] p-4 text-right">
                                <h4 className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">حجم و ارزش معاملات امروز</h4>
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">حجم خرید</p>
                                        <p className="text-sm font-bold text-[rgb(var(--neo-text-strong))]">
                                            {formatVolume(orderFlowSnapshot.totalVolume.buy, volumeUnit)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">حجم فروش</p>
                                        <p className="text-sm font-bold text-[rgb(var(--neo-text-strong))]">
                                            {formatVolume(orderFlowSnapshot.totalVolume.sell, volumeUnit)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">خالص جریان</p>
                                        <p className={clsx('text-sm font-semibold', toneClassName(netVolumeInfo.tone))}>{netVolumeInfo.label}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-[rgb(var(--neo-text-secondary))]">خالص ارزش صف‌ها</p>
                                        <p className={clsx('text-sm font-semibold', toneClassName(queueNetMoneyInfo.tone))}>{queueNetMoneyInfo.label}</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="h-2 rounded-full bg-[color:var(--neo-surface-muted-bg)]">
                                        <div
                                            className="h-full rounded-full bg-[rgb(var(--neo-accent))]"
                                            style={{ width: `${buyVolumePercent}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-semibold text-[rgb(var(--neo-text-secondary))]">
                                        <span>سهم خرید {toPersianFormatted(buyVolumePercent)}%</span>
                                        <span>سهم فروش {toPersianFormatted(sellVolumePercent)}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] p-4 text-right">
                                <h4 className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">ترکیب بازیگران بازار</h4>
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border border-[color:var(--neo-surface-border)] bg-transparent p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">حقیقی‌ها</span>
                                            <span className="text-[10px] font-semibold text-[rgb(var(--neo-text-secondary))]">سهامداران خرد</span>
                                        </div>
                                        <div className="space-y-1 text-xs text-[rgb(var(--neo-text-secondary))]">
                                            <div className="flex items-center justify-between">
                                                <span>حجم خرید</span>
                                                <span className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">
                                                    {formatVolume(orderFlowSnapshot.retailVolume.buy, volumeUnit)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>حجم فروش</span>
                                                <span className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">
                                                    {formatVolume(orderFlowSnapshot.retailVolume.sell, volumeUnit)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className={clsx('text-[10px] font-semibold', toneClassName(retailNetInfo.tone))}>
                                            خالص ورود: <span className="text-sm">{retailNetInfo.label}</span>
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-[color:var(--neo-surface-border)] bg-transparent p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">حقوقی‌ها</span>
                                            <span className="text-[10px] font-semibold text-[rgb(var(--neo-text-secondary))]">سرمایه‌گذاران عمده</span>
                                        </div>
                                        <div className="space-y-1 text-xs text-[rgb(var(--neo-text-secondary))]">
                                            <div className="flex items-center justify-between">
                                                <span>حجم خرید</span>
                                                <span className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">
                                                    {formatVolume(orderFlowSnapshot.institutionalVolume.buy, volumeUnit)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>حجم فروش</span>
                                                <span className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">
                                                    {formatVolume(orderFlowSnapshot.institutionalVolume.sell, volumeUnit)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className={clsx('text-[10px] font-semibold', toneClassName(institutionalNetInfo.tone))}>
                                            خالص ورود: <span className="text-sm">{institutionalNetInfo.label}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
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
