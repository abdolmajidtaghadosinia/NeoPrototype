
import React, { useState, useEffect, useCallback, Suspense, lazy, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

import Header from './components/Header';
import PageLayout from './components/PageLayout';
import type { NotificationItem, NotificationAction } from './components/pages/NotificationsPage';
import type { TradeRecord } from './components/TradeList';
import InstallPrompt from './components/InstallPrompt';
const HomePage = lazy(() => import('./components/pages/HomePage'));
const SearchPage = lazy(() => import('./components/pages/SearchPage'));
const SwapPage = lazy(() => import('./components/pages/SwapPage'));
const WalletPage = lazy(() => import('./components/pages/WalletPage'));
const QuickTradePage = lazy(() => import('./components/pages/QuickTradePage'));
const ProfilePage = lazy(() => import('./components/pages/ProfilePage'));
const PublicProfilePage = lazy(() => import('./components/pages/PublicProfilePage'));
const AssetProfilePage = lazy(() => import('./components/pages/AssetProfilePage'));
const NotificationsPage = lazy(() => import('./components/pages/NotificationsPage'));
const LoanPage = lazy(() => import('./components/pages/LoanPage'));
const TradePage = lazy(() => import('./components/pages/TradePage'));
const SocialTradingPage = lazy(() => import('./components/pages/SocialTradingPage'));
const TradingIdeaPage = lazy(() => import('./components/pages/TradingIdeaPage'));
const NewsArticlePage = lazy(() => import('./components/pages/NewsArticlePage'));
import { NavTab, PortfolioSlice, LeaderboardUser, MarketAsset, Message, User, Stock, MarketSummaryItem, TradingIdea, NewsArticle, AiAction, FollowedActivity, View, IdeaComment } from './types';
import { staticMarketData, userPortfolioData, leaderboardData, mockUserLoans, tradingIdeasData, financialNewsData } from './data/marketData';
import { calculateRSI } from './components/technicalIndicators';
import { toPersianDigits } from './components/formatters';
import { normalizeText } from './utils/normalizeText';

type ThemeMode = 'dark' | 'light';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const stored = window.localStorage.getItem('neo-theme');
  if (stored === 'dark' || stored === 'light') {
    if (typeof document !== 'undefined') {
      const meta = document.querySelector('meta[name="theme-color"]');
      document.documentElement.dataset.theme = stored;
      const bodyElement = document.body;
      if (bodyElement) {
        bodyElement.dataset.theme = stored;
      }
      if (meta) {
        meta.setAttribute('content', stored === 'dark' ? '#000000' : '#f5f8ff');
      }
    }
    return stored;
  }

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = prefersDark ? 'dark' : 'light';

  if (typeof document !== 'undefined') {
    const meta = document.querySelector('meta[name="theme-color"]');
    document.documentElement.dataset.theme = resolved;
    const bodyElement = document.body;
    if (bodyElement) {
      bodyElement.dataset.theme = resolved;
    }
    if (meta) {
      meta.setAttribute('content', resolved === 'dark' ? '#000000' : '#f5f8ff');
    }
  }

  return resolved;
};

const initialUser: User = {
  id: '12345',
  name: 'کاربر رایا',
  email: 'user@example.com',
  picture: 'https://randomuser.me/api/portraits/men/32.jpg',
  loans: mockUserLoans,
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'trade',
    message: '۱۰ واحد بیت‌کوین با موفقیت خریداری شد.',
    time: '۸ دقیقه پیش',
    read: false,
    actions: [
      {
        label: 'جزئیات',
        variant: 'primary',
        view: {
          page: 'trade',
          payload: { asset: staticMarketData[0], action: 'buy' },
        },
      },
    ],
  },
  {
    id: 2,
    type: 'social',
    message: '@مریم در مورد ایده شما نظر داد.',
    time: '۱ ساعت پیش',
    avatar: 'https://i.pravatar.cc/100?img=47',
    read: false,
    actions: [
      {
        label: 'پاسخ',
        variant: 'primary',
        view: { page: 'main', tab: 'social' },
      },
    ],
  },
  {
    id: 3,
    type: 'settings',
    message: 'ورود جدیدی به حساب شما انجام شد.',
    time: 'دیروز',
    read: true,
  },
  {
    id: 4,
    type: 'symbol',
    message: 'نماد فولاد از حد ضرر عبور کرد.',
    time: '۲ روز پیش',
    read: true,
  },
  {
    id: 5,
    type: 'social',
    message: 'علی درخواست دسترسی به پرتفوی تیم دارد.',
    time: '۳ روز پیش',
    avatar: 'https://i.pravatar.cc/100?img=12',
    read: false,
    actions: [
      {
        label: 'تایید',
        variant: 'primary',
        view: { page: 'main', tab: 'social' },
      },
      {
        label: 'رد',
        variant: 'danger',
        view: { page: 'main', tab: 'social' },
      },
    ],
  },
  {
    id: 6,
    type: 'trade',
    message: 'سفارش فروش شما لغو شد.',
    time: 'هفته پیش',
    read: true,
  },
  {
    id: 7,
    type: 'social',
    message: 'سارا یک فایل جدید بارگذاری کرد.',
    time: 'هفته پیش',
    avatar: 'https://i.pravatar.cc/100?img=55',
    read: true,
    actions: [
      {
        label: 'دانلود',
        variant: 'secondary',
        view: { page: 'main', tab: 'social' },
      },
    ],
  },
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const WEEK_IN_MS = DAY_IN_MS * 7;
const MONTH_IN_MS = DAY_IN_MS * 30;
const YEAR_IN_MS = DAY_IN_MS * 365;

const resampleSeries = (values: number[], targetPoints: number): number[] => {
  if (!values.length || targetPoints <= 0) {
    return [];
  }

  if (values.length === 1) {
    return Array.from({ length: targetPoints }, () => values[0]);
  }

  if (targetPoints === values.length) {
    return [...values];
  }

  const lastIndex = values.length - 1;

  return Array.from({ length: targetPoints }, (_, index) => {
    const ratio = targetPoints === 1 ? 0 : index / (targetPoints - 1);
    const scaledIndex = ratio * lastIndex;
    const lowerIndex = Math.floor(scaledIndex);
    const upperIndex = Math.min(lastIndex, lowerIndex + 1);
    const weight = scaledIndex - lowerIndex;
    const lowerValue = values[lowerIndex];
    const upperValue = values[upperIndex];

    return lowerValue + (upperValue - lowerValue) * weight;
  });
};

const buildChartDataFromSparkline = (
  prices: number[],
  targetPoints: number,
  options?: { mode?: 'tail' | 'span'; totalDurationMs?: number; now?: number },
) => {
  if (!prices.length || targetPoints <= 0) {
    return [];
  }

  const mode = options?.mode ?? 'span';
  const totalDurationMs = options?.totalDurationMs ?? WEEK_IN_MS;
  const now = options?.now ?? Date.now();

  const sanitized = prices.filter((value) => Number.isFinite(value));
  if (!sanitized.length) {
    return [];
  }

  const needsTailSlice = mode === 'tail' && sanitized.length > targetPoints;
  const sourceValues = needsTailSlice
    ? sanitized.slice(sanitized.length - targetPoints)
    : sanitized;

  const series = resampleSeries(sourceValues, targetPoints);
  const effectiveInterval =
    series.length > 1 ? totalDurationMs / (series.length - 1) : totalDurationMs;
  const startTimestamp =
    mode === 'tail'
      ? now - effectiveInterval * (series.length - 1)
      : now - totalDurationMs;

  return series.map((value, index) => ({
    name: String(Math.round(startTimestamp + index * effectiveInterval)),
    value,
  }));
};

const CRYPTO_REFRESH_INTERVAL = 60_000;

const STATIC_NON_CRYPTO_ASSETS = staticMarketData.filter(
  (asset) => asset.category !== 'کریپتو',
);
const STATIC_CRYPTO_ASSETS = staticMarketData.filter(
  (asset) => asset.category === 'کریپتو',
);

const resolveCoinGeckoApiKey = (): string | null => {
  const metaEnv = (import.meta as unknown as {
    env?: Record<string, string | undefined>;
  }).env;
  const processEnv =
    typeof process !== 'undefined'
      ? (process.env as Record<string, string | undefined>)
      : undefined;

  const candidates = [
    metaEnv?.VITE_COINGECKO_API_KEY,
    metaEnv?.VITE_CG_API_KEY,
    metaEnv?.VITE_CG_DEMO_KEY,
    processEnv?.VITE_COINGECKO_API_KEY,
    processEnv?.COINGECKO_API_KEY,
    processEnv?.CG_API_KEY,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return null;
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const [view, setView] = useState<View>({ page: 'main', tab: 'home' });
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [user, setUser] = useState<User>(initialUser);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [marketAssets, setMarketAssets] = useState<MarketAsset[]>(
    STATIC_NON_CRYPTO_ASSETS,
  );
  const [tradingIdeas, setTradingIdeas] = useState<TradingIdea[]>(tradingIdeasData);
  const [followedUserIds, setFollowedUserIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const isFetchingMarketData = useRef(false);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const rootElement = document.documentElement;
    if (rootElement) {
      rootElement.dataset.theme = theme;
    }

    const bodyElement = document.body;
    if (bodyElement) {
      bodyElement.dataset.theme = theme;
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('neo-theme', theme);
      } catch (error) {
        // ignore storage errors (private mode, etc.)
      }
    }

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'dark' ? '#000000' : '#f5f8ff');
    }
  }, [theme]);

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Initialize browser history with the default view and handle back/forward navigation
  useEffect(() => {
    // Replace the initial state so the first entry contains our view object
    window.history.replaceState({ page: 'main', tab: 'home', section: undefined }, '');

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as View | null;
      if (state) {
        setView(state);
        if (state.page === 'main') setActiveTab(state.tab);
      } else {
        setView({ page: 'main', tab: 'home' });
        setActiveTab('home');
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchMarketAssets = useCallback(async (options?: { silent?: boolean }) => {
    if (isFetchingMarketData.current) {
      return;
    }

    isFetchingMarketData.current = true;

    if (!options?.silent) {
      setIsLoading(true);
      setError(null);
    }

    const errors: string[] = [];
    let fetchedCryptoAssets: MarketAsset[] | null = null;

    try {
      const params = new URLSearchParams({
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: '10',
        page: '1',
        sparkline: 'true',
        price_change_percentage: '24h,7d,30d,1y',
      });

      const headers: Record<string, string> = {
        accept: 'application/json',
        'cache-control': 'no-cache',
      };

      const apiKey = resolveCoinGeckoApiKey();
      if (apiKey) {
        headers['x_cg_demo_api_key'] = apiKey;
      }

      const cryptoResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`,
        {
          headers,
          cache: 'no-store',
        },
      );

      if (!cryptoResponse.ok) {
        throw new Error(`HTTP error! status: ${cryptoResponse.status}`);
      }

      const payload = await cryptoResponse.json();
      const coinsArray: any[] = Array.isArray(payload) ? payload : [];

      if (!coinsArray.length) {
        errors.push('داده معتبر از بازار کریپتو دریافت نشد.');
      } else {
        fetchedCryptoAssets = coinsArray.map((coin: any) => {
          const rawSymbol =
            typeof coin.symbol === 'string' && coin.symbol.trim().length > 0
              ? coin.symbol.trim()
              : '';
          const symbol = rawSymbol.toUpperCase();
          const rawName =
            typeof coin.name === 'string' && coin.name.trim().length > 0
              ? coin.name.trim()
              : '';
          const displayName = rawName || symbol || 'رمزارز';
          const id =
            typeof coin.id === 'string' && coin.id.trim().length > 0
              ? coin.id
              : `${symbol || displayName}`.toLowerCase().replace(/\s+/g, '-');

          const priceValue =
            typeof coin.current_price === 'number'
              ? coin.current_price
              : Number(coin.current_price);
          const currentPrice = Number.isFinite(priceValue) ? priceValue : 0;

          const sparkline = Array.isArray(coin.sparkline_in_7d?.price)
            ? coin.sparkline_in_7d.price.filter((value: number) =>
                typeof value === 'number' && Number.isFinite(value),
              )
            : [];

          const baseSeries = sparkline.length ? sparkline : [currentPrice];
          const dailyPointCount = Math.max(1, Math.min(24, baseSeries.length));
          const weeklyPointCount = Math.max(1, Math.min(7, baseSeries.length));
          const monthlyPointCount = Math.max(1, Math.min(30, baseSeries.length));
          const yearlyPointCount = Math.max(1, Math.min(52, baseSeries.length));

          const dailyChartData = buildChartDataFromSparkline(baseSeries, dailyPointCount, {
            mode: 'tail',
            totalDurationMs: DAY_IN_MS,
          });
          const weeklyChartData = buildChartDataFromSparkline(baseSeries, weeklyPointCount, {
            totalDurationMs: WEEK_IN_MS,
          });
          const monthlyChartData = buildChartDataFromSparkline(baseSeries, monthlyPointCount, {
            totalDurationMs: MONTH_IN_MS,
          });
          const yearlyChartData = buildChartDataFromSparkline(baseSeries, yearlyPointCount, {
            totalDurationMs: YEAR_IN_MS,
          });

          const rsiValue = calculateRSI(baseSeries, 14);

          const formatUsd = (value: number | null | undefined): string => {
            if (typeof value === 'number' && Number.isFinite(value)) {
              return `$${value.toLocaleString('en-US')}`;
            }
            return 'نامشخص';
          };

          const formatSupply = (value: number | null | undefined): string => {
            if (typeof value === 'number' && Number.isFinite(value)) {
              return `${value.toLocaleString('en-US')} ${symbol}`;
            }
            return 'نامشخص';
          };

          const formattedPrice =
            currentPrice > 0 && currentPrice < 1
              ? `$${currentPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 6,
                })}`
              : `$${currentPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;

          return {
            id,
            name: symbol ? `${displayName} (${symbol})` : displayName,
            category: 'کریپتو',
            icon: typeof coin.image === 'string' ? coin.image : '',
            price: formattedPrice,
            description: `اطلاعات لحظه‌ای و نمودار ${displayName}. این ارز دیجیتال با نماد ${symbol || displayName} شناخته می‌شود.`,
            marketCap: formatUsd(coin.market_cap),
            volume24h: formatUsd(coin.total_volume),
            circulatingSupply: formatSupply(coin.circulating_supply),
            performance: {
              daily: {
                change:
                  typeof coin.price_change_percentage_24h_in_currency === 'number'
                    ? coin.price_change_percentage_24h_in_currency
                    : 0,
                chartData: dailyChartData,
              },
              weekly: {
                change:
                  typeof coin.price_change_percentage_7d_in_currency === 'number'
                    ? coin.price_change_percentage_7d_in_currency
                    : 0,
                chartData: weeklyChartData,
              },
              monthly: {
                change:
                  typeof coin.price_change_percentage_30d_in_currency === 'number'
                    ? coin.price_change_percentage_30d_in_currency
                    : 0,
                chartData: monthlyChartData,
              },
              yearly: {
                change:
                  typeof coin.price_change_percentage_1y_in_currency === 'number'
                    ? coin.price_change_percentage_1y_in_currency
                    : 0,
                chartData: yearlyChartData,
              },
            },
            rsi: rsiValue ?? undefined,
          } as MarketAsset;
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطای ناشناخته';
      console.error('Failed to fetch or parse from CoinGecko API:', message);
      errors.push('اطلاعات کریپتو بارگذاری نشد.');
    } finally {
      setMarketAssets((prevAssets) => {
        const previousCrypto = prevAssets.filter((asset) => asset.category === 'کریپتو');
        const fallbackCrypto =
          previousCrypto.length > 0 ? previousCrypto : STATIC_CRYPTO_ASSETS;
        const nextCrypto =
          fetchedCryptoAssets && fetchedCryptoAssets.length
            ? fetchedCryptoAssets
            : fallbackCrypto;
        return [...STATIC_NON_CRYPTO_ASSETS, ...nextCrypto];
      });

      if (errors.length > 0) {
        setError(errors.join(' '));
      } else {
        setError(null);
      }

      if (!options?.silent) {
        setIsLoading(false);
      }

      isFetchingMarketData.current = false;
    }
  }, []);

  useEffect(() => {
    fetchMarketAssets();

    const intervalId = window.setInterval(() => {
      fetchMarketAssets({ silent: true });
    }, CRYPTO_REFRESH_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchMarketAssets]);

  useEffect(() => {
    const loadChatHistory = async () => {
      setIsChatLoading(true);
      try {
        const response = await fetch('/api/history');
        if (!response.ok) {
            throw new Error('Failed to fetch chat history');
        }
        const history: Message[] = await response.json();
        
        if (history && history.length > 0) {
            setChatMessages(history);
        } else {
             setChatMessages([{ role: 'model', text: 'سلام! من دستیار هوشمند مالی شما هستم. آماده‌ام تا به سوالات شما در مورد بورس، کریپتو و بازارهای مالی پاسخ دهم.' }]);
        }
      } catch (error) {
          console.error("Error loading chat history:", error);
          setChatMessages([{ role: 'model', text: 'سلام! من دستیار هوشمند مالی شما هستم. در بارگذاری سابقه گفتگو مشکلی پیش آمد.' }]);
      } finally {
        setIsChatLoading(false);
      }
    };

    loadChatHistory();
  }, []);

  const navigateTo = useCallback((newView: View) => {
    window.scrollTo(0, 0);
    if (newView.page === 'main') {
      setActiveTab(newView.tab);
    }
    window.history.pushState(newView, '');
    setView(newView);
  }, []);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  const findAssetInText = (text: string): MarketAsset | null => {
    if (!text) return null;
    const normalizedText = normalizeText(text);
    if (!normalizedText) return null;

    const assetKeywordMap: { [key: string]: string } = {
      'وبملت': 'webmelat',
      'دوج': 'dogecoin',
      'دوجکوین': 'dogecoin',
      'درآمدثابت': 'kamand',
      'خودرو': 'khodro',
      'طلاعیار': 'ayar',
      'اتریوم': 'ethereum',
      'صندوقطلا': 'ayar',
      'فولاد': 'foolad',
      'شپنا': 'shepna',
      'دارایکم': 'dara',
      'اونطلا': 'ayar',
      'بیتکوین': 'bitcoin',
      'طلا': 'ayar',
      'دلار': 'dollar',
      'کگل': 'kegol',
      'کچاد': 'kchad',
      'شستا': 'shasta',
    };

    for (const keyword in assetKeywordMap) {
      const normalizedKeyword = normalizeText(keyword);
      if (!normalizedKeyword) continue;
      if (normalizedText.includes(normalizedKeyword)) {
        const assetId = assetKeywordMap[keyword];
        const asset = marketAssets.find((a) => normalizeText(a.id) === normalizeText(assetId));
        if (asset) return asset;
      }
    }

    const assetById = marketAssets.find((asset) => normalizeText(asset.id) === normalizedText);
    if (assetById) return assetById;

    for (const asset of marketAssets) {
      const normalizedName = normalizeText(asset.name);
      if (
        normalizedName &&
        (normalizedName === normalizedText ||
          normalizedName.includes(normalizedText) ||
          normalizedText.includes(normalizedName))
      ) {
        return asset;
      }

      const displayName = asset.name.includes('(') ? asset.name.split('(')[0] : asset.name;
      const normalizedDisplayName = normalizeText(displayName);
      if (
        normalizedDisplayName &&
        (normalizedDisplayName === normalizedText ||
          normalizedDisplayName.includes(normalizedText) ||
          normalizedText.includes(normalizedDisplayName))
      ) {
        return asset;
      }

      if (asset.aliases?.length) {
        for (const alias of asset.aliases) {
          const normalizedAlias = normalizeText(alias);
          if (
            normalizedAlias &&
            (normalizedAlias === normalizedText ||
              normalizedAlias.includes(normalizedText) ||
              normalizedText.includes(normalizedAlias))
          ) {
            return asset;
          }
        }
      }

      const symbolMatch = asset.name.match(/\(([^)]+)\)/);
      if (symbolMatch) {
        const normalizedSymbol = normalizeText(symbolMatch[1]);
        if (
          normalizedSymbol &&
          (normalizedSymbol === normalizedText ||
            normalizedSymbol.includes(normalizedText) ||
            normalizedText.includes(normalizedSymbol))
        ) {
          return asset;
        }
      }
    }

    return null;
  };
  
  const handleOpenTradePage = useCallback((asset: MarketAsset, action: 'buy' | 'sell') => {
    navigateTo({ page: 'trade', payload: { asset, action } });
  }, [navigateTo]);

  const handleTradeHistorySelect = useCallback(
    (trade: TradeRecord) => {
      const asset = marketAssets.find((a) => a.name === trade.asset);
      if (asset) {
        handleOpenTradePage(asset, trade.type);
      } else {
        navigateTo({ page: 'main', tab: 'wallet' });
      }
    },
    [marketAssets, handleOpenTradePage, navigateTo]
  );
  
  const handleAssetSelect = useCallback((asset: MarketAsset) => {
    navigateTo({ page: 'assetProfile', payload: { asset } });
  }, [navigateTo]);
  
  const findAssetAndShowProfile = useCallback((nameOrId: string) => {
    const asset = findAssetInText(nameOrId);
    if (asset) handleAssetSelect(asset);
    else console.warn(`Asset not found for identifier: ${nameOrId}`);
  }, [marketAssets, handleAssetSelect]);

  const handleSellClick = useCallback((assetToSell: PortfolioSlice) => {
    const asset = findAssetInText(assetToSell.name);
    if (asset) handleOpenTradePage(asset, 'sell');
    else alert(`دارایی '${assetToSell.name}' برای معامله یافت نشد.`);
  }, [marketAssets, handleOpenTradePage]);
  
  const handleUserSelect = useCallback((user: LeaderboardUser) => {
    navigateTo({ page: 'publicProfile', payload: { user } });
  }, [navigateTo]);

  const handleStockSelect = useCallback(
    (stock: Stock) => {
      const normalizedId = normalizeText(stock.id);
      if (normalizedId) {
        const assetById = marketAssets.find((asset) => normalizeText(asset.id) === normalizedId);
        if (assetById) {
          handleAssetSelect(assetById);
          return;
        }
      }

      findAssetAndShowProfile(stock.name);
    },
    [marketAssets, handleAssetSelect, findAssetAndShowProfile],
  );
  const handlePortfolioSliceSelect = useCallback((slice: PortfolioSlice) => findAssetAndShowProfile(slice.name), [findAssetAndShowProfile]);
  const handleMarketSummarySelect = useCallback((summaryItem: MarketSummaryItem) => findAssetAndShowProfile(summaryItem.id), [findAssetAndShowProfile]);
  
  const handleIdeaSelect = useCallback((idea: TradingIdea) => {
    const ideaWithState = tradingIdeas.find(i => i.id === idea.id) || idea;
    navigateTo({ page: 'idea', payload: { idea: ideaWithState } });
  }, [navigateTo, tradingIdeas]);
  
  const handleUserSelectFromIdea = useCallback((userId: number) => {
    const user = leaderboardData.find(u => u.id === userId);
    if (user) handleUserSelect(user);
    else console.warn(`User with id ${userId} not found.`);
  }, [handleUserSelect]);

  const handleNewsSelect = useCallback((article: NewsArticle) => {
    navigateTo({ page: 'news', payload: { article } });
  }, [navigateTo]);

  const handleViewAllNews = useCallback(() => {
    navigateTo({ page: 'main', tab: 'social', section: 'news' });
  }, [navigateTo]);
  
  const handleChatSubmit = useCallback(async (prompt: string) => {
      if (!prompt.trim() || isChatLoading) return;
      
      const userMessage: Message = { role: 'user', text: prompt };
      setChatMessages(prev => [...prev, userMessage]);
      setIsChatLoading(true);

      const saveMessagesToWorker = async (messagesToSave: Message[]) => {
          try {
              await fetch('/api/history', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(messagesToSave)
              });
          } catch (error) {
              console.error("Failed to save chat history:", error);
          }
      };
      
      const rsiMatch = prompt.match(/(rsi|آر اس آی) (?:برای|در) (.*)/i);
      if (rsiMatch && rsiMatch[2]) {
          const assetName = rsiMatch[2].trim();
          const asset = findAssetInText(assetName);
          if (asset && asset.rsi !== undefined) {
              const modelMessage: Message = { role: 'model', text: `شاخص RSI (ساعتی) برای ${asset.name} در حال حاضر ${toPersianDigits(asset.rsi.toFixed(1))} است.` };
              setChatMessages(prev => [...prev, modelMessage]);
              setIsChatLoading(false);
              saveMessagesToWorker([userMessage, modelMessage]);
              return;
          }
      }

      try {
          const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
          if (!apiKey) {
               setTimeout(() => {
                  const detectedAsset = findAssetInText(prompt);
                  let actions: AiAction[] | undefined;
                  if (detectedAsset) {
                    actions = [
                        { label: 'مشاهده جزئیات', type: 'view_profile', assetId: detectedAsset.id },
                        { label: 'صفحه معامله', type: 'trade', assetId: detectedAsset.id },
                    ];
                  }
                  const modelMessage: Message = { role: 'model', text: `پاسخ به سوال شما در مورد "${userMessage.text}" در اینجا نمایش داده می‌شود. این یک پاسخ نمونه است.`, actions };
                  setChatMessages(prev => [...prev, modelMessage]);
                  setIsChatLoading(false);
                  saveMessagesToWorker([userMessage, modelMessage]);
              }, 1500);
              return;
          }
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: { systemInstruction: "You are a helpful financial assistant specializing in stock and cryptocurrency markets for a Persian-speaking audience. Provide concise, informative, and easy-to-understand answers in Persian. Use Persian numerals (۰۱۲۳۴۵۶۷۸۹) for numbers." }
          });
          
          const aiResponseText = response.text;
          const detectedAsset = findAssetInText(aiResponseText) || findAssetInText(prompt);
          let actions: AiAction[] | undefined;
          if (detectedAsset) {
            actions = [
                { label: 'مشاهده جزئیات', type: 'view_profile', assetId: detectedAsset.id },
                { label: 'صفحه معامله', type: 'trade', assetId: detectedAsset.id },
            ];
          }
          const modelMessage: Message = { role: 'model', text: aiResponseText, actions };
          setChatMessages(prev => [...prev, modelMessage]);
          saveMessagesToWorker([userMessage, modelMessage]);
      } catch (error) {
          console.error("Error calling Gemini API:", error);
          const errorMessage: Message = { role: 'model', text: 'متاسفانه مشکلی در ارتباط با هوش مصنوعی پیش آمد. لطفا دوباره تلاش کنید.' };
          setChatMessages(prev => [...prev, errorMessage]);
      } finally {
          setIsChatLoading(false);
      }
  }, [isChatLoading, marketAssets]);

  const handleNewsAnalysis = useCallback((article: NewsArticle) => {
    navigateTo({ page: 'main', tab: 'search' }); // Switch to AI tab
    const context = article.content?.join(' ');
    const prompt = `این خبر را به صورت خلاصه تحلیل کن و تاثیرات احتمالی آن را بر بازارهای مرتبط به زبان ساده توضیح بده: "${article.title}" - خلاصه خبر: "${article.summary}"${context ? ` - جزئیات خبر: "${context}"` : ''}`;
    handleChatSubmit(prompt);
  }, [navigateTo, handleChatSubmit]);

  const handleCopyTrade = useCallback((activity: FollowedActivity) => {
    const asset = findAssetInText(activity.asset.id);
    if (!asset) {
        console.warn(`Asset not found for copy trade: ${activity.asset.id}`);
        alert(`دارایی '${activity.asset.name}' برای کپی کردن معامله یافت نشد.`);
        return;
    }
    
    if (activity.type === 'trade_buy' || activity.type === 'trade_sell') {
        const action = activity.type === 'trade_buy' ? 'buy' : 'sell';
        handleOpenTradePage(asset, action);
    } else {
        console.warn(`Copy trade called for non-trade activity type: ${activity.type}`);
    }
  }, [marketAssets, handleOpenTradePage]);

  const handleAddIdea = useCallback((idea: TradingIdea) => {
    setTradingIdeas(prev => [idea, ...prev]);
  }, []);

  const handleToggleFollow = useCallback((userId: number) => {
    setFollowedUserIds(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  }, []);

  const handleAiActionClick = useCallback((action: AiAction) => {
    const asset = marketAssets.find(a => a.id === action.assetId);
    if (!asset) return;

    if (action.type === 'view_profile') {
        handleAssetSelect(asset);
    } else if (action.type === 'trade') {
        handleOpenTradePage(asset, 'buy');
    }
  }, [marketAssets, handleAssetSelect, handleOpenTradePage]);
  
  const handleLikeIdea = useCallback((ideaId: string) => {
    setTradingIdeas(prevIdeas => {
      return prevIdeas.map(idea => {
        if (idea.id === ideaId) {
          const userHasLiked = !idea.userHasLiked;
          const newLikes = userHasLiked ? idea.likes + 1 : idea.likes - 1;
          return { ...idea, likes: newLikes, userHasLiked };
        }
        return idea;
      });
    });
  }, []);
  
  const handleAddComment = useCallback((ideaId: string, commentText: string) => {
    setTradingIdeas(prevIdeas => {
      return prevIdeas.map(idea => {
        if (idea.id === ideaId) {
          const newComment: IdeaComment = {
            id: `c-${Date.now()}`,
            user: { name: user.name, picture: user.picture },
            text: commentText,
            timestamp: 'همین الان'
          };
          return { 
            ...idea, 
            comments: idea.comments + 1,
            commentsData: [newComment, ...idea.commentsData] 
          };
        }
        return idea;
      });
    });
  }, [user.name, user.picture]);
  
  const getPageTitle = (tab: NavTab): string => {
    switch (tab) {
        case 'home': return 'خانه';
        case 'search': return 'دستیار هوش مصنوعی';
        case 'swap': return 'رصد بازارها';
        case 'wallet': return 'دارایی‌های من';
        case 'social': return 'سوشیال';
        default: return '';
    }
  };

  const renderContent = () => {
    if (view.page !== 'main') return null;

    const homeQuickTradeAsset = staticMarketData.find(a => a.id === 'khodro');
    
    switch (view.tab) {
      case 'home':
        return (
          <HomePage
            onQuickTradeClick={() => { if(homeQuickTradeAsset) handleOpenTradePage(homeQuickTradeAsset, 'buy') }}
            onStockSelect={handleStockSelect}
            onPortfolioSliceSelect={handlePortfolioSliceSelect}
            onMarketSummarySelect={handleMarketSummarySelect}
            onIdeaSelect={handleIdeaSelect}
            marketAssets={marketAssets}
            isLoading={isLoading}
            tradingIdeas={tradingIdeas}
            onLikeIdea={handleLikeIdea}
            newsArticles={financialNewsData}
            onNewsSelect={handleNewsSelect}
            onViewAllNews={handleViewAllNews}
          />
        );
      case 'search':
        return <SearchPage portfolioAssets={userPortfolioData} messages={chatMessages} isLoading={isChatLoading} onSubmit={handleChatSubmit} onActionClick={handleAiActionClick} />;
      case 'swap':
        return <SwapPage onAssetSelect={handleAssetSelect} allAssets={marketAssets} isLoading={isLoading} error={error} />;
      case 'wallet':
        return <WalletPage onSellClick={handleSellClick} onLoanRequestClick={() => navigateTo({ page: 'loan' })} onQuickTradeClick={() => navigateTo({ page: 'quickTrade' })} onPortfolioSliceSelect={handlePortfolioSliceSelect} />;
      case 'social':
        return (
          <SocialTradingPage
            onUserSelect={handleUserSelect}
            onIdeaSelect={handleIdeaSelect}
            onNewsSelect={handleNewsSelect}
            onCopyTrade={handleCopyTrade}
            onAssetSelect={findAssetAndShowProfile}
            tradingIdeas={tradingIdeas}
            onLikeIdea={handleLikeIdea}
            onAddIdea={handleAddIdea}
            assets={marketAssets}
            currentUser={user}
            followedUserIds={followedUserIds}
            onToggleFollow={handleToggleFollow}
            focusSection={view.section}
          />
        );
      default:
        return null;
    }
  };
  
  const renderCurrentPage = () => {
    switch (view.page) {
      case 'trade':
        return <TradePage assetInfo={view.payload} onBack={goBack} />;
      case 'loan':
        return <LoanPage onBack={goBack} />;
      case 'alerts':
        return (
          <NotificationsPage
            notifications={notifications}
            onBack={goBack}
            onMarkAllRead={() =>
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
            onAction={(item: NotificationItem, action: NotificationAction) => {
              setNotifications((prev) =>
                prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
              );
              if (action.view) navigateTo(action.view);
            }}
          />
        );
      case 'assetProfile':
        return <AssetProfilePage asset={view.payload.asset} onBack={goBack} onBuy={(asset) => handleOpenTradePage(asset, 'buy')} onSell={(asset) => handleOpenTradePage(asset, 'sell')} />;
      case 'publicProfile':
        return (
          <PublicProfilePage
            user={view.payload.user}
            onBack={goBack}
            isFollowing={followedUserIds.includes(view.payload.user.id)}
            onToggleFollow={handleToggleFollow}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            user={view.payload.user}
            onBack={goBack}
            section={view.payload.section}
          />
        );
      case 'idea':
        return <TradingIdeaPage idea={view.payload.idea} onBack={goBack} onUserSelect={handleUserSelectFromIdea} onAssetSelect={findAssetAndShowProfile} onLikeIdea={handleLikeIdea} onAddComment={handleAddComment} />;
      case 'quickTrade':
        return <QuickTradePage onBack={goBack} />;
      case 'news':
        return <NewsArticlePage article={view.payload.article} onBack={goBack} onAnalyze={handleNewsAnalysis} />;
      case 'main':
        return (
          <>
            <Header
              user={user}
              activeTabTitle={getPageTitle(view.tab)}
              onProfileClick={() => navigateTo({ page: 'profile', payload: { user } })}
              onQuickTradeClick={() => navigateTo({ page: 'quickTrade' })}
              onAlertsClick={() => navigateTo({ page: 'alerts' })}
              notificationCount={notifications.filter((n) => !n.read).length}
              theme={theme}
              onThemeToggle={handleThemeToggle}
            />
            <main className="px-4">{renderContent()}</main>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout
      activeTab={activeTab}
      onTabChange={(tab) => navigateTo({ page: 'main', tab })}
      showBottomNav={view.page === 'main'}
      onProfile={() => navigateTo({ page: 'profile', payload: { user } })}
      onAlerts={() => navigateTo({ page: 'alerts' })}
      onWallet={() => navigateTo({ page: 'main', tab: 'wallet' })}
      onSettings={() =>
        navigateTo({ page: 'profile', payload: { user, section: 'settings' } })
      }
      onLogout={() => {}}
      onTradeClick={handleTradeHistorySelect}
    >
      <Suspense fallback={<div className="p-4 text-center">در حال بارگذاری...</div>}>
        {renderCurrentPage()}
      </Suspense>
      <InstallPrompt />
    </PageLayout>
  );
};

export default App;