

import React, { useState, useEffect, useMemo, Suspense, lazy, useCallback } from 'react';
import clsx from 'clsx';
import { GoogleGenAI } from '@google/genai';
import FilterTabs, { HighlightTone, TabHighlight } from '../FilterTabs';
import StockTickerSkeleton from '../StockTickerSkeleton';
import Skeleton from '../Skeleton';
import type { MarketOverviewItem, PortfolioReturnInsight } from '../MarketOverview';
import { toPersianDigits } from '../formatters';
const StockTickerCard = lazy(() => import('../StockTickerCard'));
const MarketOverview = lazy(() => import('../MarketOverview'));
const MarketSummary = lazy(() => import('../MarketSummary'));
const TradingIdeasSection = lazy(() => import('../TradingIdeasSection'));
const MarketMap = lazy(() => import('../MarketMap'));
import {
  Stock,
  PortfolioSlice,
  MarketSummaryItem,
  MarketAsset,
  TradingIdea,
  MarketMapStock,
  NewsArticle,
} from '../../types';
import {
  userPortfolioData,
  marketMapData,
  marketTechnicalSummary,
} from '../../data/marketData';
import TechnicalSummaryPanel from '../TechnicalSummaryPanel';
import { BoltIcon } from '../icons/BoltIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { CalendarIcon } from '../icons/CalendarIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';
import { BellIcon } from '../icons/BellIcon';
import Page from '../layout/Page';
import { composeHomeCardClasses, HomeCardPadding, HomeCardTone } from '../designSystem';

/**
 * Props for the HomePage component.
 */
interface HomePageProps {
  /** Callback function for initiating a quick trade. */
  onQuickTradeClick: () => void;
  /** Callback for when a stock is selected, usually for navigation. */
  onStockSelect: (stock: Stock) => void;
  /** Callback for when a portfolio slice is selected. */
  onPortfolioSliceSelect: (slice: PortfolioSlice) => void;
  /** Callback for when an item from the market summary is selected. */
  onMarketSummarySelect: (item: MarketSummaryItem) => void;
  /** Callback for when a trading idea is selected. */
  onIdeaSelect: (idea: TradingIdea) => void;
  /** Array of all available market assets. */
  marketAssets: MarketAsset[];
  /** Loading state indicator for market assets. */
  isLoading: boolean;
  /** Array of trading ideas to display. */
  tradingIdeas: TradingIdea[];
  /** Callback for when a user likes a trading idea. */
  onLikeIdea: (ideaId: string) => void;
  /** Array of news articles to display. */
  newsArticles: NewsArticle[];
  /** Callback for when a news article is selected. */
  onNewsSelect: (article: NewsArticle) => void;
  /** Callback to navigate to the full news view. */
  onViewAllNews: () => void;
}

const initialStockData: Stock[] = [
  { id: 1, name: 'خودرو', value: 3340, status: 'buy', change: '+۱.۲٪', chartData: [ { name: 'A', value: 3200 }, { name: 'B', value: 3100 }, { name: 'C', value: 3250 }, { name: 'D', value: 3300 }, { name: 'E', value: 3400 }, { name: 'F', value: 3350 }, { name: 'G', value: 3340 } ] },
  { id: 2, name: 'صندوق طلا', value: 34150, status: 'sell', change: '-۰.۸٪', chartData: [ { name: 'A', value: 34800 }, { name: 'B', value: 34700 }, { name: 'C', value: 34600 }, { name: 'D', value: 34500 }, { name: 'E', value: 34400 }, { name: 'F', value: 34300 }, { name: 'G', value: 34150 } ] },
  { id: 3, name: 'فولاد', value: 5120, status: 'buy', change: '+۰.۵٪', chartData: [ { name: 'A', value: 5000 }, { name: 'B', value: 5050 }, { name: 'C', value: 5020 }, { name: 'D', value: 5100 }, { name: 'E', value: 5150 }, { name: 'F', value: 5180 }, { name: 'G', value: 5120 },] },
  { id: 4, name: 'شپنا', value: 8530, status: 'sell', change: '-۱.۵٪', chartData: [ { name: 'A', value: 8900 }, { name: 'B', value: 8800 }, { name: 'C', value: 8750 }, { name: 'D', value: 8600 }, { name: 'E', value: 8500 }, { name: 'F', value: 8550 }, { name: 'G', value: 8530 },] },
  { id: 5, name: 'وبملت', value: 6710, status: 'buy', change: '+۲.۱٪', chartData: [ { name: 'A', value: 6300 }, { name: 'B', value: 6320 }, { name: 'C', value: 6400 }, { name: 'D', value: 6380 }, { name: 'E', value: 6500 }, { name: 'F', value: 6650 }, { name: 'G', value: 6710 },] },
  { id: 6, name: 'دارایکم', value: 10050, status: 'sell', change: '-۰.۳٪', chartData: [ { name: 'A', value: 10450 }, { name: 'B', value: 10500 }, { name: 'C', value: 10600 }, { name: 'D', value: 10580 }, { name: 'E', value: 10300 }, { name: 'F', value: 10150 }, { name: 'G', value: 10050 },] },
];

const generateSummaryChartData = (base: number, points: number, volatility: number) => {
    let lastVal = base;
    return Array.from({ length: points }, (_, i) => {
        const change = (Math.random() - 0.5) * volatility * lastVal;
        lastVal += change;
        return { name: String.fromCharCode(65 + i), value: Math.max(0, lastVal) };
    });
};

const formatToPersianNumber = (value: number) =>
  new Intl.NumberFormat('fa-IR').format(value);

const initialMarketSummaryData: MarketSummaryItem[] = [
    {
        id: 'tse',
        name: 'شاخص کل',
        icon: '📈',
        performance: {
            daily: { value: '۲,۱۵۰,۱۲۳', change: 0.75, chartData: generateSummaryChartData(2150123, 7, 0.01) },
            weekly: { value: '۲,۱۴۰,۰۰۰', change: 1.2, chartData: generateSummaryChartData(2140000, 4, 0.02) },
            monthly: { value: '۲,۱۰۰,۰۰۰', change: 2.5, chartData: generateSummaryChartData(2100000, 30, 0.05) },
            yearly: { value: '۱,۹۰۰,۰۰۰', change: 13.1, chartData: generateSummaryChartData(1900000, 12, 0.1) },
        },
        details: {
            volume: '۲۲.۸ میلیارد سهم',
            value: '۲۲۴,۶۰۹ میلیارد تومان',
            positiveCount: 571,
            negativeCount: 122,
            buyQueueValue: '۲۴,۷۱۶ میلیارد تومان',
            sellQueueValue: '۴۸۷.۸ میلیارد تومان',
        }
    },
    {
        id: 'gold',
        name: 'طلا',
        icon: '💰',
        performance: {
            daily: { value: '۴۱,۵۰۰,۰۰۰', change: 0.5, chartData: generateSummaryChartData(41500, 7, 0.015) },
            weekly: { value: '۴۱,۳۰۰,۰۰۰', change: -0.8, chartData: generateSummaryChartData(41300, 4, 0.03) },
            monthly: { value: '۴۰,۸۰۰,۰۰۰', change: 1.7, chartData: generateSummaryChartData(40800, 30, 0.06) },
            yearly: { value: '۳۰,۰۰۰,۰۰۰', change: 38.3, chartData: generateSummaryChartData(30000, 12, 0.12) },
        },
        details: {
            volume: '۵۰۰ کیلوگرم',
            value: '۲۰,۰۰۰ میلیارد تومان',
            positiveCount: 20,
            negativeCount: 5,
            buyQueueValue: '۱,۲۵۰ میلیارد تومان',
            sellQueueValue: '۷۵۰ میلیارد تومان',
        }
    },
    {
        id: 'tse-index',
        name: 'شاخص کل بورس',
        icon: '📈',
        performance: {
            daily: { value: '۲,۱۸۰,۰۰۰', change: 0.6, chartData: generateSummaryChartData(2180, 7, 0.015) },
            weekly: { value: '۲,۱۵۵,۰۰۰', change: 1.2, chartData: generateSummaryChartData(2155, 4, 0.02) },
            monthly: { value: '۲,۰۹۵,۰۰۰', change: 3.5, chartData: generateSummaryChartData(2095, 30, 0.04) },
            yearly: { value: '۱,۸۹۰,۰۰۰', change: 12.3, chartData: generateSummaryChartData(1890, 12, 0.05) },
        },
        details: {
            volume: '۷,۵۰۰ میلیارد تومان',
            value: '۱۳,۴۰۰ میلیارد تومان',
            positiveCount: 275,
            negativeCount: 180,
            buyQueueValue: '۹۵۰ میلیارد تومان',
            sellQueueValue: '۶۸۰ میلیارد تومان',
        }
    },
    {
        id: 'usd',
        name: 'دلار',
        icon: '💵',
        performance: {
            daily: { value: '۵۹,۵۰۰', change: 0.1, chartData: generateSummaryChartData(59500, 7, 0.005) },
            weekly: { value: '۵۹,۲۰۰', change: 0.5, chartData: generateSummaryChartData(59200, 4, 0.01) },
            monthly: { value: '۶۰,۰۰۰', change: -0.8, chartData: generateSummaryChartData(60000, 30, 0.02) },
            yearly: { value: '۱۶,۶', change: 16.6, chartData: generateSummaryChartData(51000, 12, 0.03) },
        },
        details: {
            volume: '۳۰۰ میلیون دلار',
            value: '۱۸,۰۰۰ میلیارد تومان',
            positiveCount: 15,
            negativeCount: 5,
            buyQueueValue: '۱,۰۰۰ میلیارد تومان',
            sellQueueValue: '۸۰۰ میلیارد تومان',
        }
    },
];

type SignalTone = 'positive' | 'warning' | 'neutral';
type UpcomingEventAccent = 'primary' | 'info' | 'alert';

interface SmartSignalSuggestion {
  id: string;
  title: string;
  reason: string;
  badge: string;
  tone: SignalTone;
}

interface UpcomingEventItem {
  id: string;
  day: string;
  date: string;
  title: string;
  description: string;
  time?: string;
  location?: string;
  meta?: string;
  accent: UpcomingEventAccent;
}

interface HotSpotlight {
  id: string;
  title: string;
  subtitle: string;
  asset: string;
  change: number;
  tone: HighlightTone;
  tag?: string;
}

const hotSpotlightItems: HotSpotlight[] = [
  {
    id: 'index-leader',
    title: 'رهبر شاخص',
    subtitle: 'فارس امروز با رشد ۸٫۶۵٪ در صدر نمادهای شاخص‌ساز قرار گرفت.',
    asset: 'فارس',
    change: 8.65,
    tone: 'up',
  },
  {
    id: 'gold-fund',
    title: 'طلایی‌ترین صندوق',
    subtitle: 'گنج در بازه شش‌ماهه ۳۲٫۷۴٪ بازدهی داشته است.',
    asset: 'گنج',
    change: 32.74,
    tone: 'up',
    tag: '۶ ماهه',
  },
  {
    id: 'sell-pressure',
    title: 'نیازمند پایش',
    subtitle: 'شبندر پس از افت ۴٫۱۶٪ امروز زیر ذره‌بین قرار دارد.',
    asset: 'شبندر',
    change: -4.16,
    tone: 'down',
  },
];

const hotSpotlightToneMap: Record<HighlightTone, { text: string; chip: string; tone: HomeCardTone }> = {
  up: {
    text: 'text-neo-green',
    chip: 'border border-neo-green/45 bg-neo-green/10 text-neo-green',
    tone: 'positive',
  },
  down: {
    text: 'text-rose-600 dark:text-rose-300',
    chip: 'border border-rose-300/60 bg-rose-100 text-rose-700 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-100',
    tone: 'negative',
  },
  neutral: {
    text: 'text-gray-200',
    chip: 'border border-white/15 bg-white/10 text-gray-100',
    tone: 'default',
  },
  info: {
    text: 'text-sky-300',
    chip: 'border border-sky-400/40 bg-sky-500/10 text-sky-200',
    tone: 'info',
  },
  alert: {
    text: 'text-amber-300',
    chip: 'border border-amber-400/45 bg-amber-500/10 text-amber-200',
    tone: 'alert',
  },
};

interface IndexMakerDefinition {
  id: string;
  symbol: string;
  company: string;
  industry: string;
}

type IndexMakerMetrics = {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
};

interface GoldFundDefinition {
  id: string;
  name: string;
  focus: string;
}

type GoldFundReturns = {
  three: number;
  six: number;
  nine: number;
  twelve: number;
};

const indexMakerDefinitions: IndexMakerDefinition[] = [
  {
    id: 'fars',
    symbol: 'فارس',
    company: 'صنایع پتروشیمی خلیج فارس',
    industry: 'پتروشیمی',
  },
  {
    id: 'foolad',
    symbol: 'فولاد',
    company: 'فولاد مبارکه اصفهان',
    industry: 'فولاد',
  },
  {
    id: 'fameli',
    symbol: 'فملی',
    company: 'ملی صنایع مس ایران',
    industry: 'فلزات اساسی',
  },
  {
    id: 'kegol',
    symbol: 'کگل',
    company: 'معدنی و صنعتی گل‌گهر',
    industry: 'سنگ آهن',
  },
  {
    id: 'tapico',
    symbol: 'تاپیکو',
    company: 'سرمایه‌گذاری نفت و گاز و پتروشیمی تأمین',
    industry: 'هلدینگ پتروشیمی',
  },
  {
    id: 'shepna',
    symbol: 'شپنا',
    company: 'پالایش نفت اصفهان',
    industry: 'پالایشی',
  },
  {
    id: 'kchad',
    symbol: 'کچاد',
    company: 'معدنی و صنعتی چادرملو',
    industry: 'سنگ آهن',
  },
  {
    id: 'midco',
    symbol: 'میدکو',
    company: 'توسعه معادن و صنایع معدنی خاورمیانه',
    industry: 'هلدینگ معدنی',
  },
  {
    id: 'vghadir',
    symbol: 'وغدیر',
    company: 'سرمایه‌گذاری غدیر',
    industry: 'هلدینگ سرمایه‌گذاری',
  },
  {
    id: 'shbandar',
    symbol: 'شبندر',
    company: 'پالایش نفت بندرعباس',
    industry: 'پالایشی',
  },
];

const goldFundDefinitions: GoldFundDefinition[] = [
  { id: 'zarfam', name: 'زرفام', focus: 'صندوق طلا' },
  { id: 'kahroba', name: 'کهربا', focus: 'صندوق طلا' },
  { id: 'lotus-gold', name: 'لوتوس', focus: 'صندوق کالایی طلا' },
  { id: 'mesghal', name: 'مثقال', focus: 'صندوق طلا' },
  { id: 'ganj', name: 'گنج', focus: 'صندوق طلا' },
  { id: 'gohar-gold', name: 'گوهر', focus: 'صندوق طلا' },
  { id: 'alton', name: 'آلتون', focus: 'صندوق طلا' },
  { id: 'nafis', name: 'نفیس', focus: 'صندوق طلا' },
  { id: 'zarafshan', name: 'زر افشان', focus: 'صندوق طلا' },
  { id: 'ayar', name: 'عیار', focus: 'صندوق طلا' },
];

const indexTimeframeLabels: Record<keyof IndexMakerDefinition['metrics'], string> = {
  daily: 'روزانه',
  weekly: 'هفتگی',
  monthly: 'ماهانه',
  yearly: 'سالیانه',
};

const goldReturnLabels: Record<keyof GoldFundDefinition['returns'], string> = {
  three: '۳ ماهه',
  six: '۶ ماهه',
  nine: '۹ ماهه',
  twelve: '۱۲ ماهه',
};

// Consolidated market events for the sidebar feed

const HomePage: React.FC<HomePageProps> = ({
  onQuickTradeClick,
  onStockSelect,
  onPortfolioSliceSelect,
  onMarketSummarySelect,
  onIdeaSelect,
  marketAssets,
  isLoading,
  tradingIdeas,
  onLikeIdea,
  newsArticles,
  onNewsSelect,
  onViewAllNews,
}) => {
  const [activeTab, setActiveTab] = useState('پورتفوی من');
  const [displayedStocks, setDisplayedStocks] = useState<Stock[]>([]);
  const [marketSummaryItems, setMarketSummaryItems] = useState<MarketSummaryItem[]>(initialMarketSummaryData);
  const [marketMapView, setMarketMapView] = useState<'stock' | 'commodities' | 'funds'>('stock');
  const [activeTabLabelId, setActiveTabLabelId] = useState<string>('');
  const topStripMinHeight = activeTab === 'پورتفوی من' ? 'min-h-[5rem]' : 'min-h-[4.5rem]';
  const tabPanelId = 'homepage-tabpanel';
  const homeCard = useCallback(
    (extra = '', tone: HomeCardTone = 'default', padding: HomeCardPadding = 'md') =>
      composeHomeCardClasses(tone, padding, extra),
    [],
  );

  const formatSpotlightPercent = useCallback((value: number) => {
    const prefix = value > 0 ? '+' : value < 0 ? '-' : '';
    const magnitude = Math.abs(value);
    const formatted = `${prefix}${magnitude.toFixed(magnitude >= 1 ? 1 : 2)}`;
    return `${toPersianDigits(formatted)}٪`;
  }, []);

  const getChangeChipClasses = useCallback(
    (value: number) =>
      value >= 0
        ? 'border border-neo-green/35 bg-neo-green/10 text-neo-green'
        : 'border border-rose-400/45 bg-rose-500/10 text-rose-100',
    [],
  );

  const portfolioReturnInsights = useMemo<PortfolioReturnInsight[]>(
    () => [
      {
        id: 'today',
        label: 'بازده امروز',
        value: '+۲٫۴٪',
        detail: '۲٬۴۵۰٬۰۰۰ تومان سود خالص در ۲۴ ساعت گذشته',
        trend: 'up',
      },
      {
        id: 'week',
        label: 'بازده هفتگی',
        value: '+۵٫۲٪',
        detail: '۵٬۳۱۰٬۰۰۰ تومان رشد نسبت به هفته گذشته',
        trend: 'up',
      },
    ],
    []
  );

  const smartSignals = useMemo<SmartSignalSuggestion[]>(
    () => [
      {
        id: 'signal-1',
        title: 'خرید پله‌ای شپنا',
        reason: 'حجم معاملات امروز ۲ برابر میانگین ماهانه است و مقاومت ۲٬۴۵۰ شکسته شد.',
        badge: 'سیگنال خرید',
        tone: 'positive',
      },
      {
        id: 'signal-2',
        title: 'حد ضرر برای طلای آب‌شده',
        reason: 'ضعف مومنتوم در RSI روزانه دیده می‌شود؛ حد ضرر ۳٬۴۸۰٬۰۰۰ تومان برای هر مثقال پیشنهاد شد.',
        badge: 'هشدار مدیریت ریسک',
        tone: 'warning',
      },
      {
        id: 'signal-3',
        title: 'پایش صندوق طلا',
        reason: 'نوسان کمتر از ۱٪ در ۲۴ ساعت اخیر؛ فرصت خوبی برای تقویت بخش امن پرتفوی است.',
        badge: 'پیشنهاد پایش',
        tone: 'neutral',
      },
    ],
    []
  );

  const indexMakerHighlights = useMemo(
    () =>
      indexMakerDefinitions
        .map((definition) => {
          const asset = marketAssets.find((item) => item.id === definition.id);
          if (!asset) {
            return null;
          }

          const metrics: IndexMakerMetrics = {
            daily: asset.performance?.daily?.change ?? 0,
            weekly: asset.performance?.weekly?.change ?? 0,
            monthly: asset.performance?.monthly?.change ?? 0,
            yearly: asset.performance?.yearly?.change ?? 0,
          };

          return { ...definition, asset, metrics };
        })
        .filter(
          (
            value,
          ): value is IndexMakerDefinition & { asset: MarketAsset; metrics: IndexMakerMetrics } => Boolean(value),
        ),
    [marketAssets],
  );

  const goldFundHighlights = useMemo(
    () =>
      goldFundDefinitions
        .map((definition) => {
          const asset = marketAssets.find((item) => item.id === definition.id);
          if (!asset) {
            return null;
          }

          const returns = asset.extendedReturns ?? {
            three: asset.performance?.daily?.change ?? 0,
            six: asset.performance?.weekly?.change ?? 0,
            nine: asset.performance?.monthly?.change ?? 0,
            twelve: asset.performance?.yearly?.change ?? 0,
          };

          return { ...definition, asset, returns };
        })
        .filter(
          (
            value,
          ): value is GoldFundDefinition & { asset: MarketAsset; returns: GoldFundReturns } => Boolean(value),
        ),
    [marketAssets],
  );

  const ideaTabHighlights = useMemo<TabHighlight[]>(() => {
    if (!tradingIdeas || tradingIdeas.length === 0) {
      return [];
    }

    const bullishIdeas = tradingIdeas.filter((idea) => idea.type === 'bullish').length;
    const freshIdeas = tradingIdeas.filter((idea) => !idea.userHasLiked).length;

    return [
      {
        id: 'ideas-bullish',
        label: 'تحلیل صعودی',
        value: formatToPersianNumber(bullishIdeas),
        tone: bullishIdeas > 0 ? 'up' : 'neutral',
        icon: <TrendingUpIcon className="h-3.5 w-3.5" />,
      },
      {
        id: 'ideas-fresh',
        label: 'ایده تازه',
        value: formatToPersianNumber(freshIdeas > 0 ? freshIdeas : tradingIdeas.length),
        tone: freshIdeas > 0 ? 'info' : 'neutral',
        icon: <BoltIcon className="h-3.5 w-3.5" />,
      },
    ];
  }, [tradingIdeas]);

  const hotTabHighlights = useMemo<TabHighlight[]>(() => {
    return hotSpotlightItems.map((spotlight) => ({
      id: spotlight.id,
      label: spotlight.title,
      value: spotlight.asset,
      tone: spotlight.tone,
    }));
  }, []);

  const marketTabHighlights = useMemo<TabHighlight[]>(() => {
    if (!marketSummaryItems || marketSummaryItems.length === 0) {
      return [];
    }

    const positiveMarkets = marketSummaryItems.filter(
      (item) => item.performance.daily.change >= 0,
    ).length;
    const negativeMarkets = marketSummaryItems.length - positiveMarkets;

    const highlights: TabHighlight[] = [
      {
        id: 'market-green',
        label: 'بازار سبز',
        value: formatToPersianNumber(positiveMarkets),
        tone: positiveMarkets > 0 ? 'up' : 'neutral',
        icon: <ArrowUpIcon className="h-3.5 w-3.5" />,
      },
      {
        id: 'market-red',
        label: 'بازار قرمز',
        value: formatToPersianNumber(negativeMarkets),
        tone: negativeMarkets > 0 ? 'down' : 'neutral',
        icon: <ArrowDownIcon className="h-3.5 w-3.5" />,
      },
    ];

    if (smartSignals.length > 0) {
      highlights.push({
        id: 'market-alerts',
        label: 'هشدار تازه',
        value: formatToPersianNumber(smartSignals.length),
        tone: 'alert',
        icon: <BellIcon className="h-3.5 w-3.5" />,
      });
    }

    return highlights;
  }, [marketSummaryItems, smartSignals]);

  const tabHighlights = useMemo<Record<string, TabHighlight[]>>(() => {
    const map: Record<string, TabHighlight[]> = {};

    if (ideaTabHighlights.length > 0) {
      map['ایده‌ها'] = ideaTabHighlights;
    }

    if (hotTabHighlights.length > 0) {
      map['داغ‌ترین‌ها'] = hotTabHighlights;
    }

    if (marketTabHighlights.length > 0) {
      map['نمای بازار'] = marketTabHighlights;
    }

    return map;
  }, [ideaTabHighlights, hotTabHighlights, marketTabHighlights]);

  const upcomingEvents = useMemo<UpcomingEventItem[]>(
    () => [
      {
        id: 'event-1',
        day: 'امروز',
        date: '۲۵ خرداد',
        title: 'گزارش تولید فملی',
        description: 'جزئیات تولید اردیبهشت پس از بسته شدن بازار منتشر می‌شود و می‌تواند مسیر فردا را تعیین کند.',
        time: 'ساعت ۱۷:۳۰',
        meta: 'گزارش فصلی تولید',
        accent: 'primary',
      },
      {
        id: 'event-2',
        day: 'سه‌شنبه',
        date: '۲۷ خرداد',
        title: 'مجمع سالانه شستا',
        description: 'ارائه گزارش هیئت‌مدیره و تصمیم‌گیری درباره تقسیم سود در مجمع عمومی سالانه.',
        time: 'ساعت ۱۰:۳۰',
        location: 'تهران، مرکز همایش‌های صدا و سیما',
        accent: 'info',
      },
      {
        id: 'event-3',
        day: 'پنجشنبه',
        date: '۲۹ خرداد',
        title: 'آمار تورم آمریکا',
        description: 'انتشار شاخص CPI آمریکا که می‌تواند روی بازار ارز و طلا در ابتدای هفته آینده اثر بگذارد.',
        time: '۲۳:۳۰ به وقت تهران',
        meta: 'پیگیری از طریق وب‌سایت BLS',
        accent: 'alert',
      },
    ],
    []
  );

  const toneTextClass: Record<SignalTone, string> = {
    positive: 'text-neo-green',
    warning: 'text-amber-300',
    neutral: 'text-gray-300',
  };

  const eventAccentStyles: Record<UpcomingEventAccent, {
    tone: HomeCardTone;
    dayBadge: string;
    connector: string;
    mobileDivider: string;
    timeIcon: string;
  }> = {
    primary: {
      tone: 'positive',
      dayBadge: 'border border-neo-green/50 bg-neo-green/10 text-neo-green',
      connector: 'bg-gradient-to-b from-transparent via-neo-green/45 to-transparent',
      mobileDivider: 'bg-gradient-to-l from-transparent via-neo-green/60 to-transparent',
      timeIcon: 'text-neo-green',
    },
    info: {
      tone: 'info',
      dayBadge: 'border border-sky-500/40 bg-sky-500/10 text-sky-300',
      connector: 'bg-gradient-to-b from-transparent via-sky-500/40 to-transparent',
      mobileDivider: 'bg-gradient-to-l from-transparent via-sky-400/50 to-transparent',
      timeIcon: 'text-sky-300',
    },
    alert: {
      tone: 'alert',
      dayBadge: 'border border-rose-500/40 bg-rose-500/10 text-rose-300',
      connector: 'bg-gradient-to-b from-transparent via-rose-500/35 to-transparent',
      mobileDivider: 'bg-gradient-to-l from-transparent via-rose-400/45 to-transparent',
      timeIcon: 'text-rose-300',
    },
  };

  const topNewsArticles = useMemo(() => {
    if (!newsArticles?.length) {
      return [] as NewsArticle[];
    }

    const uniqueArticles = new Map<string, NewsArticle>();
    newsArticles.forEach((article) => {
      if (!uniqueArticles.has(article.id)) {
        uniqueArticles.set(article.id, article);
      }
    });

    return Array.from(uniqueArticles.values()).slice(0, 4);
  }, [newsArticles]);

  const renderPortfolioNewsPanel = (panelClassName = '') => (
    <div className={homeCard(clsx('sm:p-6', panelClassName), 'muted', 'sm')}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white md:text-base">خبرهای مهم پرتفو</h3>
        <button
          type="button"
          onClick={onViewAllNews}
          className="text-[11px] font-medium text-neo-green transition-colors hover:text-neo-green/80"
        >
          مشاهده همه
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {topNewsArticles.length === 0 ? (
          <p className="text-xs text-gray-500">در حال حاضر خبری برای نمایش وجود ندارد.</p>
        ) : (
          topNewsArticles.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => onNewsSelect(article)}
              className={homeCard(
                'group flex w-full items-center gap-3 text-right transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_34px_72px_-42px_rgba(80,255,189,0.35)]',
                'muted',
                'sm',
              )}
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-gray-800/50">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-end gap-2 text-[11px] text-gray-500">
                  <span className="rounded-full border border-gray-700/60 bg-neo-dark-1/80 px-2 py-0.5 text-[10px] text-gray-300">
                    {article.category}
                  </span>
                  <span>{article.time}</span>
                  <span className="text-gray-600">{article.source}</span>
                </div>
                <p className="mt-2 text-sm font-semibold leading-5 text-white">{article.title}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  const renderLeftPanels = () => (
    <>
      <div className={homeCard('sm:p-6', 'default', 'sm')}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white md:text-base">رویدادهای پیش رو</h3>
              <p className="mt-1 text-xs text-gray-400">برنامه معاملاتتان را با خبرهای مهم هفته هماهنگ کنید</p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-5">
          {upcomingEvents.map((event, index) => {
            const accent = eventAccentStyles[event.accent];

            return (
              <div
                key={event.id}
                className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-4"
              >
                <div className="hidden sm:flex sm:w-20 sm:flex-col sm:items-end sm:pt-1">
                  <div
                    className={`flex min-h-[3.5rem] min-w-[4.25rem] items-center justify-center rounded-2xl px-3 text-center text-[11px] font-semibold ${accent.dayBadge}`}
                  >
                    {event.day}
                  </div>
                  {index < upcomingEvents.length - 1 && (
                    <div className="relative mt-3 w-full flex-1">
                      <span
                        className={`mx-auto block h-full w-[3px] rounded-full ${accent.connector}`}
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                <article
                  className={homeCard(
                    'group relative flex-1 transition-all duration-300 ease-out hover:-translate-y-1 sm:p-6',
                    accent.tone,
                    'md',
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-end text-[11px] sm:hidden">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 font-semibold ${accent.dayBadge}`}
                      >
                        {event.day}
                      </span>
                    </div>
                    <div className="sm:hidden">
                      <div
                        className={`h-0.5 w-full rounded-full ${accent.mobileDivider}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex flex-row-reverse items-center justify-end gap-3 text-[11px]">
                      <div className="flex flex-row-reverse items-center gap-2 text-gray-400">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <span>{event.date}</span>
                      </div>
                    </div>
                    <h4 className="text-sm font-semibold text-white md:text-base">{event.title}</h4>
                    <p className="text-xs leading-6 text-gray-400">{event.description}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-[11px] text-gray-200">
                    {event.time && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-gray-700/60 bg-neo-dark-1/75 px-3 py-1">
                        <ClockIcon className={`h-3.5 w-3.5 ${accent.timeIcon}`} />
                        <span>{event.time}</span>
                      </span>
                    )}
                    {event.location && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-gray-700/60 bg-neo-dark-1/75 px-3 py-1 text-gray-200">
                        <span className="text-lg leading-none text-neo-green/80">📍</span>
                        <span>{event.location}</span>
                      </span>
                    )}
                    {event.meta && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-gray-700/60 bg-neo-dark-1/75 px-3 py-1 text-gray-300">
                        {event.meta}
                      </span>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
      <div className={homeCard('sm:p-6', 'muted', 'sm')}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-white md:text-base">پیشنهادهای دستیار هوشمند</h3>
          <span className="inline-flex items-center justify-center rounded-full border border-gray-700/70 bg-neo-dark-1/80 p-2 text-[13px]">
            🤖
          </span>
        </div>
        <div className="mt-4 space-y-4">
          {smartSignals.map((signal) => (
            <div
              key={signal.id}
              className={homeCard(
                'flex flex-col gap-2 text-sm shadow-[0_18px_44px_-28px_rgba(0,0,0,0.6)]',
                'muted',
                'sm',
              )}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-100">{signal.title}</span>
                <span className={`text-xs font-semibold ${toneTextClass[signal.tone]}`}>{signal.badge}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-400">{signal.reason}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-gray-700/70 bg-gradient-to-l from-neo-dark-1 via-neo-dark-2 to-neo-dark-3 px-4 py-2 text-xs font-semibold text-neo-green transition-colors hover:border-neo-green/60 sm:mt-5"
        >
          مشاهده برنامه معاملاتی
        </button>
      </div>
      {renderPortfolioNewsPanel()}
    </>
  );

  const handleAssetQuickView = useCallback(
    (asset: MarketAsset) => {
      onStockSelect({
        id: asset.id,
        name: asset.name,
        value: asset.price,
        status: asset.performance.daily.change >= 0 ? 'up' : 'down',
        change: `${asset.performance.daily.change >= 0 ? '+' : ''}${asset.performance.daily.change.toFixed(2)}%`,
        chartData: asset.performance.daily.chartData ?? [],
      });
    },
    [onStockSelect],
  );

  const renderRightPanels = () => (
    <>
      {indexMakerHighlights.length > 0 && (
        <div className={homeCard('sm:p-5 space-y-4', 'default', 'md')}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white md:text-base">شاخص‌سازان برتر</h3>
            <span className="text-[11px] text-gray-400">به‌روزرسانی ۱۶ مهر ۱۴۰۴</span>
          </div>
          <div className="space-y-3">
            {indexMakerHighlights.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleAssetQuickView(item.asset)}
                className={clsx(
                  'flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-neo-green/40 hover:bg-white/10',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-green/60',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      {typeof item.asset.icon === 'string' ? (
                        <span className="text-base leading-none">{item.asset.icon}</span>
                      ) : (
                        item.asset.icon
                      )}
                      <span>{item.company}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">{item.industry}</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">{item.asset.price}</div>
                    <div className={`text-xs ${item.metrics.daily >= 0 ? 'text-neo-green' : 'text-rose-300'}`}>
                      {formatSpotlightPercent(item.metrics.daily)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 text-[11px]">
                  {(Object.entries(item.metrics) as [keyof IndexMakerDefinition['metrics'], number][]).map(([key, value]) => (
                    <span
                      key={`${item.id}-${key}`}
                      className={clsx(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold',
                        getChangeChipClasses(value),
                      )}
                    >
                      <span>{indexTimeframeLabels[key]}</span>
                      <span>{formatSpotlightPercent(value)}</span>
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      <Suspense fallback={<Skeleton className="h-[26rem] rounded-3xl" />}>
        <div className={homeCard('sm:p-5 w-full min-w-0', 'default', 'md')}>
          <MarketSummary items={marketSummaryItems} onItemClick={onMarketSummarySelect} columns={1} />
        </div>
      </Suspense>
      {goldFundHighlights.length > 0 && (
        <div className={homeCard('sm:p-5 space-y-4', 'muted', 'sm')}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white md:text-base">صندوق‌های طلایی پربازده</h3>
            <span className="text-[11px] text-gray-400">آمار ۱۶ مهر ۱۴۰۴</span>
          </div>
          <div className="space-y-3">
            {goldFundHighlights.map((fund) => (
              <button
                key={fund.id}
                type="button"
                onClick={() => handleAssetQuickView(fund.asset)}
                className={clsx(
                  'flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-neo-green/40 hover:bg-white/10',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-green/60',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    {typeof fund.asset.icon === 'string' ? (
                      <span className="text-base leading-none">{fund.asset.icon}</span>
                    ) : (
                      fund.asset.icon
                    )}
                    <span>{fund.name}</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">{fund.asset.price}</div>
                    <div className="text-[11px] text-gray-400">{fund.focus}</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 text-[11px]">
                  {(Object.entries(fund.returns) as [keyof GoldFundDefinition['returns'], number][]).map(([key, value]) => (
                    <span
                      key={`${fund.id}-${key}`}
                      className={clsx(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold',
                        getChangeChipClasses(value),
                      )}
                    >
                      <span>{goldReturnLabels[key]}</span>
                      <span>{formatSpotlightPercent(value)}</span>
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      <TechnicalSummaryPanel signals={marketTechnicalSummary} className="mt-0" />
    </>
  );

  const handleMarketOverviewSelect = (item: MarketOverviewItem) => {
    const stockForNavigation: Stock = {
      id: item.id,
      name: item.assetName,
      value: item.price,
      status: item.change >= 0 ? 'up' : 'down',
      change: `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%`,
      chartData: [],
    };

    onStockSelect(stockForNavigation);
  };

  const commodityMarketData = useMemo(() => {
    const commodityAssets = marketAssets.filter(a => a.category === 'کالا').slice(0, 10);
    const sizeOrder: MarketMapStock['size'][] = ['xl', 'xl', 'lg', 'lg', 'md', 'md', 'md', 'sm', 'sm', 'sm'];
    const stocks: MarketMapStock[] = commodityAssets.map((asset, index) => ({
      name: asset.name.replace(/\s*\(.*\)/, ''),
      change: asset.performance.daily.change,
      size: sizeOrder[index] || 'sm',
      id: asset.id,
    }));
    return stocks.length
      ? [{ name: 'بازار کالایی', stocks }]
      : [
          {
            name: 'بازار کالایی',
            stocks: [
              { name: 'انس جهانی طلا', change: 0.6, size: 'lg' as const },
              { name: 'سکه طرح جدید', change: 0.9, size: 'md' as const },
              { name: 'شمش طلا', change: 0.4, size: 'md' as const },
            ],
          },
        ];
  }, [marketAssets]);

  const fundMarketData = useMemo(() => {
    const funds = marketAssets.filter((asset) => asset.category === 'صندوق‌ها');

    if (!funds.length) {
      return [
        {
          name: 'صندوق‌های منتخب',
          stocks: [
            { name: 'صندوق طلا', change: 0.8, size: 'lg' as const },
            { name: 'صندوق درآمد ثابت', change: 0.3, size: 'md' as const },
            { name: 'صندوق مختلط', change: 1.1, size: 'md' as const },
          ],
        },
      ];
    }

    const categoryForFund = (name: string) => {
      if (/طلا|عیار|پالایشی|نفت|فلز|سکه|ارز/i.test(name)) {
        return 'صندوق‌های طلا و کالایی';
      }
      if (/درآمد ثابت|اوراق|همای|کمند|پارند|ثابت/i.test(name)) {
        return 'صندوق‌های درآمد ثابت';
      }
      if (/اهرم|جسور|شتاب|سرو|مختلط|زیتون/i.test(name)) {
        return 'صندوق‌های سهامی و اهرمی';
      }
      return 'سایر صندوق‌های فعال';
    };

    const grouped = funds.reduce<Record<string, MarketAsset[]>>((acc, asset) => {
      const groupKey = categoryForFund(asset.name);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(asset);
      return acc;
    }, {});

    const sizeOrder: MarketMapStock['size'][] = ['xl', 'lg', 'lg', 'md', 'md', 'sm', 'sm'];

    return Object.entries(grouped).map(([groupName, assets]) => {
      const sortedAssets = [...assets].sort(
        (a, b) => (b.performance.daily.change ?? 0) - (a.performance.daily.change ?? 0),
      );

      return {
        name: groupName,
        stocks: sortedAssets.map((asset, index) => ({
          name: asset.name.replace(/\s*\(.*\)/, ''),
          change: asset.performance.daily.change,
          size: sizeOrder[index] || 'sm',
          id: asset.id,
        })),
      };
    });
  }, [marketAssets]);

  useEffect(() => {
    const fetchSummary = async () => {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) return;
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Search the web and provide latest market summary for Tehran Stock Exchange main index (tse), gold price in Iran (gold), major equity fund performance (fund), and US dollar price in Iran (usd). Return a JSON array with objects {id, value, change, details: {volume, value, positiveCount, negativeCount, buyQueueValue, sellQueueValue}}. Use Persian digits and appropriate currency units.`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          tools: { webSearch: {} },
          config: { responseMimeType: 'application/json' },
        });
        const data = JSON.parse(response.text);
        setMarketSummaryItems(prev => prev.map(item => {
          const upd = data.find((d: any) => d.id === item.id);
          if (!upd) return item;
          const changeNum = typeof upd.change === 'string' ? parseFloat(upd.change) : upd.change;
          return {
            ...item,
            performance: {
              ...item.performance,
              daily: {
                ...item.performance.daily,
                value: upd.value || item.performance.daily.value,
                change: isNaN(changeNum) ? item.performance.daily.change : changeNum,
              },
            },
            details: upd.details ? {
              volume: upd.details.volume || item.details?.volume || '',
              value: upd.details.value || item.details?.value || '',
              positiveCount: upd.details.positiveCount ?? item.details?.positiveCount ?? 0,
              negativeCount: upd.details.negativeCount ?? item.details?.negativeCount ?? 0,
              buyQueueValue: upd.details.buyQueueValue || item.details?.buyQueueValue || '',
              sellQueueValue: upd.details.sellQueueValue || item.details?.sellQueueValue || '',
            } : item.details,
          };
        }));
      } catch (err) {
        console.error('AI market summary fetch error', err);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    // This effect is now only for the ticker cards, not the market map view.
    if (activeTab === 'ایده‌ها' || activeTab === 'نمای بازار') {
      return;
    }
    
    if (activeTab === 'پورتفوی من') {
        if (isLoading) {
            setDisplayedStocks([]);
            return;
        }

        const assetKeywordMap: { [key: string]: string } = {
            'وبملت': 'webmelat',
            'درآمدثابت': 'kamand',
            'خودرو': 'khodro',
            'طلاعیار': 'ayar',
            'فولاد': 'foolad',
            'شپنا': 'shepna',
        };

        const portfolioAssetsAsStocks: Stock[] = userPortfolioData
            .map((portfolioItem): Stock | null => {
                const portfolioItemName = portfolioItem.name.replace(/\s/g, '').toLowerCase();
                let foundAsset: MarketAsset | undefined;
                
                for (const keyword in assetKeywordMap) {
                    if (portfolioItemName.includes(keyword)) {
                        const assetId = assetKeywordMap[keyword];
                        foundAsset = marketAssets.find(a => a.id === assetId);
                        if (foundAsset) break;
                    }
                }
                
                if (!foundAsset) {
                    console.warn(`Could not find live data for portfolio item: ${portfolioItem.name}`);
                    return null;
                }

                const performance = foundAsset.performance.daily;
                const isPositive = performance.change >= 0;

                const chartDataForTicker = foundAsset.performance.daily.chartData;

                return {
                    id: foundAsset.id,
                    name: foundAsset.name.replace(/\s+\(.*\)/, ''),
                    value: foundAsset.price,
                    status: isPositive ? 'up' : 'down',
                    change: `${isPositive ? '+' : ''}${performance.change.toFixed(1)}%`,
                    chartData: chartDataForTicker,
                };
            })
            .filter((stock): stock is Stock => stock !== null);

        setDisplayedStocks(portfolioAssetsAsStocks);

    } else if (activeTab === 'داغ‌ترین‌ها') {
        setDisplayedStocks([]);
    }
  }, [activeTab, marketAssets, isLoading]);

  const handleMarketMapStockClick = (marketStock: MarketMapStock) => {
    const identifier = marketStock.id || marketStock.name;
    const stockForNavigation: Stock = {
      id: identifier,
      name: identifier,
      value: '',
      status: marketStock.change >= 0 ? 'up' : 'down',
      chartData: [],
    };
    onStockSelect(stockForNavigation);
  };

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderTopStripContent = () => {
    if (activeTab === 'ایده‌ها') {
      return (
        <Suspense fallback={<Skeleton className="h-40" />}>
          <TradingIdeasSection
            ideas={tradingIdeas}
            onIdeaClick={onIdeaSelect}
            onLikeClick={onLikeIdea}
            showTitle={false}
            showDescription={false}
          />
        </Suspense>
      );
    }

    if (activeTab === 'داغ‌ترین‌ها') {
      return (
        <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible">
          {hotSpotlightItems.map((spotlight) => {
            const accent = hotSpotlightToneMap[spotlight.tone] ?? hotSpotlightToneMap.neutral;

            return (
              <article
                key={spotlight.id}
                className={homeCard(
                  'relative flex min-w-[14rem] flex-1 flex-col justify-between gap-3 transition-all duration-300 ease-out hover:-translate-y-1 sm:min-w-0 sm:p-5',
                  accent.tone,
                  'md',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white md:text-base">{spotlight.title}</span>
                  {spotlight.tag && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-gray-100">
                      {spotlight.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs leading-6 text-gray-300">{spotlight.subtitle}</p>
                <div className="mt-1 h-px w-full rounded-full bg-gradient-to-l from-transparent via-white/15 to-transparent" />
                <div className="flex items-end justify-between gap-2.5 pt-1 text-sm text-gray-200">
                  <span className={`text-2xl font-black tracking-tight ${accent.text}`}>
                    {formatSpotlightPercent(spotlight.change)}
                  </span>
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold',
                      accent.chip,
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/50" aria-hidden="true" />
                    {spotlight.asset}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      );
    }

    if (displayedStocks.length === 0) {
      if (isLoading) {
        return (
          <div className={`${topStripMinHeight} flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-hide`}>
            {Array.from({ length: 4 }).map((_, index) => (
              <StockTickerSkeleton
                key={index}
                className={`min-w-[13rem] h-full ${topStripMinHeight}`}
              />
            ))}
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center py-8 text-sm text-gray-500">
          موردی برای نمایش وجود ندارد.
        </div>
      );
    }

    return (
      <div className={`${topStripMinHeight} flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-hide`}>
        {displayedStocks.map((stock) => (
          <Suspense
            key={stock.id}
            fallback={(
              <StockTickerSkeleton className={`min-w-[13rem] h-full ${topStripMinHeight}`} />
            )}
          >
            <StockTickerCard
              stock={stock}
              onClick={() => onStockSelect(stock)}
              className={`min-w-[13rem] h-full ${topStripMinHeight}`}
            />
          </Suspense>
        ))}
      </div>
    );
  };

  const renderDashboardContent = () => (
    <div className="flex flex-col gap-4 sm:gap-5 lg:gap-5">
      {renderTopStripContent()}
      <div className="flex flex-col gap-4 sm:gap-5 lg:grid lg:grid-cols-[minmax(0,280px),minmax(0,1fr)] lg:items-start lg:gap-5 xl:grid-cols-[minmax(0,320px),minmax(0,1fr)] xl:gap-7 2xl:grid-cols-[minmax(0,360px),minmax(0,1.1fr),minmax(0,360px)] 2xl:gap-7">
        <div className="order-2 space-y-4 sm:space-y-5 lg:order-1 lg:col-start-1 lg:space-y-5 xl:order-2 xl:col-span-2 xl:col-start-1 xl:space-y-6 2xl:order-1 2xl:col-span-1 2xl:col-start-1 2xl:space-y-6">
          {renderLeftPanels()}
        </div>
        <div className="order-1 space-y-4 sm:space-y-5 lg:col-start-2 lg:min-w-0 xl:order-1 xl:col-span-2 xl:col-start-1 xl:space-y-6 xl:min-w-0 2xl:order-2 2xl:col-span-1 2xl:col-start-2 2xl:space-y-6">
          <div className="min-w-0">
            <Suspense fallback={<Skeleton className="h-[26rem] rounded-3xl" />}>
              <MarketOverview
                marketAssets={marketAssets}
                onAssetSelect={handleMarketOverviewSelect}
                onQuickTradeClick={onQuickTradeClick}
                isLoading={isLoading}
                onPortfolioItemSelect={(item) =>
                  onPortfolioSliceSelect({
                    name: item.assetName,
                    value: 0,
                    color: 'rgb(var(--neo-accent))',
                    dailyChange: item.change,
                  })
                }
                portfolioReturns={portfolioReturnInsights}
                renderHighlightsInline={false}
              />
            </Suspense>
          </div>
        </div>
        <div className="order-3 space-y-4 sm:space-y-5 lg:col-span-2 lg:col-start-1 xl:order-3 xl:col-span-2 xl:col-start-1 xl:space-y-6 xl:min-w-0 2xl:order-3 2xl:col-span-1 2xl:col-start-3 2xl:space-y-7">
          {renderRightPanels()}
        </div>
      </div>
    </div>
  );

  return (
    <Page as="main" spacing="md" className="home-page space-y-5 pt-4 sm:space-y-6">
      <FilterTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        portfolioReturns={portfolioReturnInsights}
        tabHighlights={tabHighlights}
        tabPanelId={tabPanelId}
        onActiveTabIdChange={setActiveTabLabelId}
      />
      <div
        id={tabPanelId}
        role="tabpanel"
        aria-labelledby={activeTabLabelId || undefined}
        tabIndex={0}
        className="outline-none focus-visible:ring-2 focus-visible:ring-neo-green/60"
      >
        {activeTab === 'نمای بازار' ? (
          <div>
            <div className="flex items-center gap-2 pb-2">
              {[
                { key: 'stock' as const, label: 'بورس' },
                { key: 'funds' as const, label: 'صندوق‌ها' },
                { key: 'commodities' as const, label: 'بازار کالایی' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setMarketMapView(tab.key)}
                  aria-pressed={marketMapView === tab.key}
                  className={`flex-1 rounded-full py-2 px-2 text-xs font-semibold transition-colors ${
                    marketMapView === tab.key
                      ? 'bg-neo-green text-[rgb(var(--tabs-active-text))] shadow-[0_12px_30px_-12px_rgba(107,255,110,0.65)]'
                      : 'bg-neo-dark-3 text-gray-300 hover:bg-neo-dark-2'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Suspense fallback={<Skeleton className="h-72" />}>
              <MarketMap
                data={
                  marketMapView === 'stock'
                    ? marketMapData
                    : marketMapView === 'funds'
                      ? fundMarketData
                      : commodityMarketData
                }
                onStockClick={handleMarketMapStockClick}
              />
            </Suspense>
          </div>
        ) : (
          renderDashboardContent()
        )}
      </div>
    </Page>
  );
};

export default HomePage;