import React, { useEffect, useId, useMemo, useState } from 'react';
import clsx from 'clsx';
import { MarketAsset, MarketSession, SignalStance } from '../types';
import { globalMarketSessions } from '../data/marketData';
import { toPersianDigits } from './formatters';
import { composeHomeCardClasses, HomeCardPadding, HomeCardTone } from './designSystem';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

export type MarketDisplayTab = 'دیده‌بان' | 'پورتفوی من' | 'بیشترین سود' | 'بیشترین ضرر';
export type MarketOverviewTimeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

type MarketListKey = 'watchlist' | 'portfolio' | 'gainers' | 'losers';
export interface MarketOverviewTrendPoint {
  value: number;
  timestamp?: number;
}

export interface MarketOverviewItem {
  id: string;
  assetName: string;
  displayName: string;
  price: string;
  change: number;
  marketLabel: string;
  icon?: React.ReactNode;
  subtitle?: string;
  meta?: string;
  chartPoints?: MarketOverviewTrendPoint[];
  timeframe: MarketOverviewTimeframe;
}

export type PortfolioReturnTrend = 'up' | 'down' | 'neutral';

export interface PortfolioReturnInsight {
  id: string;
  label: string;
  value: string;
  detail?: string;
  trend?: PortfolioReturnTrend;
}

export interface MarketHighlightCard {
  id: string;
  title: string;
  description: string;
  change: number;
  tone: SignalStance;
  item?: MarketOverviewItem;
}

interface MarketOverviewProps {
  marketAssets: MarketAsset[];
  onAssetSelect?: (item: MarketOverviewItem) => void;
  onQuickTradeClick?: () => void;
  isLoading?: boolean;
  onPortfolioItemSelect?: (item: MarketOverviewItem) => void;
  portfolioReturns?: PortfolioReturnInsight[];
  onHighlightsChange?: (cards: MarketHighlightCard[]) => void;
  renderHighlightsInline?: boolean;
}

const displayTabs: MarketDisplayTab[] = ['دیده‌بان', 'پورتفوی من', 'بیشترین سود', 'بیشترین ضرر'];

const tabToKey: Record<MarketDisplayTab, MarketListKey> = {
  'دیده‌بان': 'watchlist',
  'پورتفوی من': 'portfolio',
  'بیشترین سود': 'gainers',
  'بیشترین ضرر': 'losers',
};

const timeframeLabels: Record<MarketOverviewTimeframe, string> = {
  daily: 'روزانه',
  weekly: 'هفتگی',
  monthly: 'ماهانه',
  yearly: 'سالانه',
};

const timeframeDescriptions: Record<MarketOverviewTimeframe, string> = {
  daily: '۲۴ ساعت اخیر',
  weekly: '۷ روز اخیر',
  monthly: '۳۰ روز اخیر',
  yearly: '۱۲ ماه اخیر',
};

const timeframeOptions: { value: MarketOverviewTimeframe; label: string }[] = [
  { value: 'daily', label: timeframeLabels.daily },
  { value: 'weekly', label: timeframeLabels.weekly },
  { value: 'monthly', label: timeframeLabels.monthly },
  { value: 'yearly', label: timeframeLabels.yearly },
];

interface MarketOverviewSections {
  watchlist: MarketOverviewItem[];
  portfolio: MarketOverviewItem[];
  gainers: MarketOverviewItem[];
  losers: MarketOverviewItem[];
}

const preciousMetalKeywords = ['طلا', 'سکه', 'نقره', 'انس', 'پلاتین', 'پالادیوم'];

const formatText = (value?: string) =>
  value ? toPersianDigits(value).replace(/,/g, '،') : '';

const formatPercent = (value: number) => {
  const formatted = `${value >= 0 ? '+' : ''}${Math.abs(value).toFixed(Math.abs(value) >= 1 ? 1 : 2)}`;
  return `${toPersianDigits(formatted)}٪`;
};

const capsuleColorClass: Record<PortfolioReturnTrend, string> = {
  up: 'text-neo-green',
  down: 'text-rose-400',
  neutral: 'text-gray-200',
};

const portfolioToneMap: Record<PortfolioReturnTrend, HomeCardTone> = {
  up: 'positive',
  down: 'negative',
  neutral: 'muted',
};

const sessionStatusStyles: Record<MarketSession['status'], { label: string; className: string }> = {
  open: { label: 'باز', className: 'border-neo-green/40 bg-neo-green/15 text-neo-green' },
  closed: { label: 'بسته', className: 'border-white/20 bg-white/5 text-gray-200' },
  pre: { label: 'پیش‌گشایش', className: 'border-amber-300/30 bg-amber-300/10 text-amber-200' },
  post: { label: 'پس‌گشایش', className: 'border-sky-300/30 bg-sky-300/10 text-sky-200' },
};

const sessionAccentStrip: Record<MarketSession['status'], string> = {
  open: 'from-neo-green/0 via-neo-green/60 to-neo-green/0',
  closed: 'from-white/0 via-white/35 to-white/0',
  pre: 'from-amber-300/0 via-amber-300/55 to-amber-300/0',
  post: 'from-sky-300/0 via-sky-300/55 to-sky-300/0',
};

const sessionGlowClass: Record<MarketSession['status'], string> = {
  open: 'bg-neo-green/35',
  closed: 'bg-white/15',
  pre: 'bg-amber-300/25',
  post: 'bg-sky-300/30',
};

const sessionToneMap: Record<MarketSession['status'], HomeCardTone> = {
  open: 'positive',
  closed: 'muted',
  pre: 'alert',
  post: 'info',
};

const highlightToneMap: Record<SignalStance, HomeCardTone> = {
  bullish: 'positive',
  bearish: 'negative',
  neutral: 'muted',
};

const sentimentChangeTone: Record<SignalStance, string> = {
  bullish: 'text-neo-green',
  bearish: 'text-red-400',
  neutral: 'text-gray-200',
};

const PAGE_SIZE = 10;

const isImageSource = (value: string) => /^(https?:\/\/|data:image\/|blob:|\/)/i.test(value);

const getFallbackInitials = (label: string) => {
  const sanitized = label
    .replace(/\(.+?\)/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .trim();

  if (!sanitized) {
    return '؟';
  }

  const parts = sanitized.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return sanitized.slice(0, 2) || '؟';
  }

  const [first, second] = parts;
  const initials = `${first?.[0] ?? ''}${second?.[0] ?? ''}`.trim();
  return initials || parts[0]?.slice(0, 2) || sanitized.slice(0, 2) || '؟';
};

const MarketItemIcon: React.FC<{ icon?: MarketAsset['icon']; name: string }> = ({ icon, name }) => {
  const [hasError, setHasError] = useState(false);
  const fallbackInitials = getFallbackInitials(name);

  const renderFallback = () => (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white ring-1 ring-white/10">
      {toPersianDigits(fallbackInitials)}
    </div>
  );

  if (!icon || hasError) {
    return renderFallback();
  }

  if (React.isValidElement(icon)) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/10">
        {icon}
      </div>
    );
  }

  if (typeof icon === 'string') {
    const trimmed = icon.trim();
    if (!trimmed) {
      return renderFallback();
    }

    if (isImageSource(trimmed)) {
      return (
        <div className="h-9 w-9 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
          <img
            src={trimmed}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        </div>
      );
    }

    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl leading-none text-white ring-1 ring-white/10">
        {trimmed}
      </div>
    );
  }

  return renderFallback();
};

const marketLabelOrder = ['بورس', 'صندوق‌ها', 'فلزهای گرانبها', 'بازار ارز', 'بازار کالایی'];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const createLookupKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, '')
    .replace(/\u200c/g, '')
    .trim();

const hashStringToSeed = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) & 0xffffffff;
  }
  return hash >>> 0;
};

const composeHomeCard = (
  extra: string,
  tone: HomeCardTone = 'default',
  padding: HomeCardPadding = 'md',
) => composeHomeCardClasses(tone, padding, extra);

const weekdayLabels = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

const TARGET_BAR_COUNT = weekdayLabels.length;

const sampleTrendPoints = (
  points: MarketOverviewTrendPoint[],
  target: number = TARGET_BAR_COUNT,
): MarketOverviewTrendPoint[] => {
  if (points.length <= target || target <= 1) {
    return points;
  }

  const lastIndex = points.length - 1;

  return Array.from({ length: target }, (_, index) => {
    const ratio = index / (target - 1);
    const mappedIndex = Math.round(ratio * lastIndex);
    return points[mappedIndex];
  });
};

const normalizeSeries = (values: number[]): number[] => {
  if (!values.length) {
    return values;
  }

  const finiteValues = values.filter((value) => Number.isFinite(value));
  if (!finiteValues.length) {
    return values.map(() => 0.5);
  }

  const minValue = Math.min(...finiteValues);
  const maxValue = Math.max(...finiteValues);

  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
    return values.map(() => 0.5);
  }

  const range = maxValue - minValue;

  if (range === 0) {
    return values.map(() => 0.5);
  }

  return values.map((value) => {
    const normalized = (value - minValue) / range;
    if (!Number.isFinite(normalized)) {
      return 0.5;
    }

    return 0.12 + normalized * 0.76;
  });
};

const formatAxisLabelsFromPoints = (
  points: MarketOverviewTrendPoint[],
  fallback: string[],
): string[] => {
  return points.map((point, index) => {
    if (point.timestamp && Number.isFinite(point.timestamp)) {
      try {
        const formatted = new Date(point.timestamp).toLocaleDateString('fa-IR', {
          weekday: 'short',
        });

        if (formatted && formatted !== 'Invalid Date') {
          return formatted;
        }
      } catch (error) {
        // Fallback to default labels below
      }
    }

    return fallback[index % fallback.length];
  });
};

const generateTrendSeries = (key: string, change: number) => {
  const seed = hashStringToSeed(key);
  const magnitude = Math.min(Math.abs(change), 18);
  const direction = change > 0 ? 1 : change < 0 ? -1 : 0;
  let current = direction === 0 ? 50 : direction > 0 ? 34 : 66;

  return Array.from({ length: 7 }, (_, index) => {
    const shift = (seed >> ((index % 8) * 4)) & 0xf;
    const noise = (shift - 7) * 0.9;

    if (direction === 0) {
      const wave = Math.sin((seed % 17) * 0.3 + index * 0.9) * (5 + magnitude);
      current = clamp(50 + wave + noise, 18, 82);
    } else {
      const step = 3.2 + magnitude * 0.45;
      current = clamp(current + direction * step + noise, 10, 92);
    }

    return Math.round(current);
  });
};

const accentBarStart = 'rgb(var(--neo-accent) / 0.9)';
const accentBarEnd = 'rgb(var(--neo-accent) / 0.8)';
const accentBarBorder = 'rgb(var(--neo-accent))';
const accentBarShadow = 'rgb(var(--neo-accent) / 0.35)';

const monoBarBase: [string, string] = [accentBarStart, accentBarEnd];
const monoBarBorder = accentBarBorder;
const monoBarShadow = accentBarShadow;

const chartPalette: Record<
  'positive' | 'negative' | 'neutral',
  {
    axisClass: string;
    grid: string;
    barBase: [string, string];
    barAccent: [string, string];
    barBorder: string;
    barAccentBorder: string;
    barShadow: string;
  }
> = {
  positive: {
    axisClass: 'text-white/60',
    grid: 'rgba(255, 255, 255, 0.12)',
    barBase: monoBarBase,
    barAccent: monoBarBase,
    barBorder: monoBarBorder,
    barAccentBorder: monoBarBorder,
    barShadow: monoBarShadow,
  },
  negative: {
    axisClass: 'text-white/60',
    grid: 'rgba(255, 255, 255, 0.1)',
    barBase: monoBarBase,
    barAccent: monoBarBase,
    barBorder: monoBarBorder,
    barAccentBorder: monoBarBorder,
    barShadow: monoBarShadow,
  },
  neutral: {
    axisClass: 'text-white/60',
    grid: 'rgba(255, 255, 255, 0.1)',
    barBase: monoBarBase,
    barAccent: monoBarBase,
    barBorder: monoBarBorder,
    barAccentBorder: monoBarBorder,
    barShadow: monoBarShadow,
  },
};

const chartSizeConfig = {
  md: { heightClass: 'h-24', padding: 'p-4', axisGap: 'mt-3', viewBoxHeight: 96 },
  sm: { heightClass: 'h-20', padding: 'p-3.5', axisGap: 'mt-2.5', viewBoxHeight: 80 },
};

type TrendChartSize = keyof typeof chartSizeConfig;

interface MiniTrendChartProps {
  seed?: string;
  change: number;
  size?: TrendChartSize;
  showAxis?: boolean;
  className?: string;
  tone?: 'solid' | 'subtle';
  points?: MarketOverviewTrendPoint[];
}

const MiniTrendChart: React.FC<MiniTrendChartProps> = ({
  seed,
  change,
  size = 'md',
  showAxis = true,
  className,
  tone = 'solid',
  points,
}) => {
  const palette = chartPalette[change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'];
  const { heightClass, padding, axisGap, viewBoxHeight } = chartSizeConfig[size];
  const viewBoxWidth = 100;
  const topPadding = 8;
  const bottomPadding = 10;
  const usableHeight = Math.max(4, viewBoxHeight - topPadding - bottomPadding);
  const reactId = useId();
  const idBase = reactId.replace(/:/g, '');
  const barGradientId = `${idBase}-bar`;
  const accentGradientId = `${idBase}-bar-accent`;
  const shadowId = `${idBase}-shadow`;

  const { series, axisLabels, accentIndices } = useMemo(() => {
    const buildFromPoints = (trendPoints: MarketOverviewTrendPoint[]) => {
      const sanitizedPoints = trendPoints.filter((point) => Number.isFinite(point.value));

      if (!sanitizedPoints.length) {
        return null;
      }

      const sampledPoints = sampleTrendPoints(sanitizedPoints, TARGET_BAR_COUNT);
      const sampledValues = sampledPoints.map((point) => point.value);
      const normalizedSeries = normalizeSeries(sampledValues);
      const safeSeries = normalizedSeries.map((value) =>
        Number.isFinite(value) ? value : 0.5,
      );

      if (!safeSeries.length || safeSeries.every((value) => !Number.isFinite(value))) {
        return null;
      }

      const highestIndex = sampledValues.reduce(
        (bestIndex, value, index) => (value > sampledValues[bestIndex] ? index : bestIndex),
        0,
      );

      const accentSet = new Set<number>();
      if (safeSeries.length) {
        accentSet.add(Math.min(highestIndex, safeSeries.length - 1));
        accentSet.add(safeSeries.length - 1);
      }

      return {
        series: safeSeries,
        axisLabels: formatAxisLabelsFromPoints(sampledPoints, weekdayLabels),
        accentIndices: accentSet,
      };
    };

    if (points && points.length) {
      const fromPoints = buildFromPoints(points);
      if (fromPoints) {
        return fromPoints;
      }
    }

    const fallbackSeries = generateTrendSeries(seed ?? 'fallback', change);
    const normalizedFallback = normalizeSeries(fallbackSeries);
    const safeFallback = normalizedFallback.length
      ? normalizedFallback.map((value) => (Number.isFinite(value) ? value : 0.5))
      : [0.42, 0.5, 0.46, 0.58, 0.52, 0.62, 0.57];

    const fallbackHighest = fallbackSeries.reduce(
      (bestIndex, value, index) => (value > fallbackSeries[bestIndex] ? index : bestIndex),
      0,
    );

    const accentSet = new Set<number>();
    if (safeFallback.length) {
      accentSet.add(Math.min(fallbackHighest, safeFallback.length - 1));
      accentSet.add(safeFallback.length - 1);
    }

    const baseAxis = weekdayLabels.slice(0, safeFallback.length);

    return {
      series: safeFallback,
      axisLabels: baseAxis.length === safeFallback.length ? baseAxis : weekdayLabels.slice(0, safeFallback.length),
      accentIndices: accentSet,
    };
  }, [points, seed, change]);

  const geometry = useMemo(() => {
    const baseline = topPadding + usableHeight;

    if (!series.length) {
      const fallbackGrid = [0.25, 0.5, 0.75].map(
        (ratio) => topPadding + (1 - ratio) * usableHeight,
      );
      return {
        bars: [] as { x: number; y: number; width: number; height: number; index: number }[],
        gridLines: fallbackGrid,
        baseline,
      };
    }

    const safeSeries = series.map((value) => clamp(Number.isFinite(value) ? value : 0.5, 0.04, 0.98));
    const pointsCount = safeSeries.length;
    const gap = pointsCount ? viewBoxWidth / pointsCount : viewBoxWidth;
    const barWidth = clamp(gap * 0.26, 2.4, 6);

    const bars = safeSeries.map((value, index) => {
      const height = Math.max(usableHeight * value, usableHeight * 0.12);
      const y = baseline - height;
      const x = index * gap + (gap - barWidth) / 2;
      return {
        x: Number.isFinite(x) ? clamp(x, 0, Math.max(0, viewBoxWidth - barWidth)) : 0,
        y: Number.isFinite(y) ? y : baseline - height,
        width: barWidth,
        height,
        index,
      };
    });

    const gridLines = [0.25, 0.5, 0.75].map(
      (ratio) => topPadding + (1 - ratio) * usableHeight,
    );

    return { bars, gridLines, baseline };
  }, [series, usableHeight, topPadding]);

  const containerTone =
    tone === 'solid'
      ? 'border-white/10 bg-white/[0.035] shadow-[0_14px_38px_-28px_rgba(0,0,0,0.8)] backdrop-blur'
      : 'border-white/8 bg-white/[0.02] backdrop-blur';

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-2xl transition-all duration-500 ease-out',
        containerTone,
        padding,
        className,
      )}
    >
      <div className={clsx('relative w-full', heightClass)}>
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.barBase[0]} />
              <stop offset="100%" stopColor={palette.barBase[1]} />
            </linearGradient>
            <linearGradient id={accentGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.barAccent[0]} />
              <stop offset="100%" stopColor={palette.barAccent[1]} />
            </linearGradient>
            <filter id={shadowId} x="-40%" y="-40%" width="180%" height="220%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor={palette.barShadow} floodOpacity="0.7" />
            </filter>
          </defs>

          {geometry.gridLines.map((y, index) => (
            <line
              // eslint-disable-next-line react/no-array-index-key
              key={`grid-${index}`}
              x1="0"
              x2={viewBoxWidth}
              y1={y}
              y2={y}
              stroke={palette.grid}
              strokeWidth="0.35"
              strokeDasharray="2 3"
              opacity="0.55"
            />
          ))}

          <line
            x1="0"
            x2={viewBoxWidth}
            y1={geometry.baseline}
            y2={geometry.baseline}
            stroke={palette.grid}
            strokeWidth="0.45"
            opacity="0.6"
          />

          {geometry.bars.map((bar) => {
            const previous = bar.index > 0 ? series[bar.index - 1] : series[bar.index];
            const trendingUp = bar.index === 0 ? change >= 0 : series[bar.index] >= previous;
            const gradient = trendingUp ? accentGradientId : barGradientId;
            const radius = Math.min(2.4, bar.width / 2);
            const isFocus = accentIndices.has(bar.index);
            const borderColor = trendingUp ? palette.barAccentBorder : palette.barBorder;
            return (
              <g key={`bar-${bar.index}`}>
                <rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  rx={radius}
                  ry={radius}
                  fill={`url(#${gradient})`}
                  stroke={borderColor}
                  strokeWidth={isFocus || trendingUp ? 0.9 : 0.55}
                  opacity={isFocus ? 1 : trendingUp ? 0.92 : 0.8}
                  filter={isFocus || trendingUp ? `url(#${shadowId})` : undefined}
                />
              </g>
            );
          })}
        </svg>
      </div>
      {showAxis && axisLabels.length > 0 && (
        <div
          className={clsx(
            'relative flex justify-between text-[10px] font-semibold',
            axisGap,
            palette.axisClass,
          )}
        >
          {axisLabels.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const getMarketLabel = (asset: MarketAsset): string | null => {
  if (asset.category === 'بورس') {
    return 'بورس';
  }

  if (asset.category === 'صندوق‌ها') {
    return 'صندوق‌ها';
  }

  if (asset.category === 'ارزها') {
    return 'بازار ارز';
  }

  if (asset.category === 'کالا') {
    return preciousMetalKeywords.some((keyword) => asset.name.includes(keyword))
      ? 'فلزهای گرانبها'
      : 'بازار کالایی';
  }

  return null;
};

const convertAssetToItem = (
  asset: MarketAsset,
  timeframe: MarketOverviewTimeframe,
): MarketOverviewItem | null => {
  const marketLabel = getMarketLabel(asset);

  if (!marketLabel) {
    return null;
  }

  const hasParenthesis = asset.name.includes('(');
  const displayName = hasParenthesis ? asset.name.split('(')[0].trim() : asset.name;
  const subtitle = hasParenthesis
    ? asset.name.substring(asset.name.indexOf('(') + 1, asset.name.lastIndexOf(')')).trim()
    : undefined;

  const metaSource = asset.marketCap && asset.marketCap !== 'نامشخص'
    ? `ارزش بازار ${asset.marketCap}`
    : asset.volume24h && asset.volume24h !== 'نامشخص'
      ? `حجم ۲۴ساعت ${asset.volume24h}`
      : undefined;

  const preferredOrder: MarketOverviewTimeframe[] = [
    timeframe,
    'daily',
    'weekly',
    'monthly',
    'yearly',
  ];

  const performanceForChart = preferredOrder
    .map((key) => asset.performance?.[key])
    .find((performance) => performance?.chartData?.length);

  const changeValue = asset.performance?.[timeframe]?.change ?? performanceForChart?.change ?? asset.performance.daily.change;

  const chartPoints = performanceForChart?.chartData
    ?.map<MarketOverviewTrendPoint | null>((point) => {
      if (typeof point?.value !== 'number' || Number.isNaN(point.value)) {
        return null;
      }

      const timestamp = Number(point.name);

      return {
        value: point.value,
        timestamp: Number.isFinite(timestamp) ? timestamp : undefined,
      };
    })
    .filter((point): point is MarketOverviewTrendPoint => Boolean(point));

  if (chartPoints?.length) {
    chartPoints.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return a.timestamp - b.timestamp;
      }

      if (a.timestamp) {
        return -1;
      }

      if (b.timestamp) {
        return 1;
      }

      return 0;
    });
  }

  return {
    id: asset.id,
    assetName: asset.name,
    displayName,
    price: asset.price,
    change: changeValue,
    marketLabel,
    icon: <MarketItemIcon icon={asset.icon} name={displayName} />,
    subtitle,
    meta: metaSource,
    chartPoints: chartPoints && chartPoints.length ? chartPoints : undefined,
    timeframe,
  };
};

const interleaveByMarket = (
  lists: MarketOverviewItem[][],
  limit: number,
  startIndex = 0,
): MarketOverviewItem[] => {
  const results: MarketOverviewItem[] = [];
  let pointer = startIndex;

  while (results.length < limit) {
    let appended = false;

    for (const list of lists) {
      const item = list[pointer];
      if (item) {
        results.push(item);
        appended = true;

        if (results.length >= limit) {
          break;
        }
      }
    }

    if (!appended) {
      break;
    }

    pointer += 1;
  }

  return results;
};

const buildSections = (items: MarketOverviewItem[]): MarketOverviewSections => {
  if (!items.length) {
    return { watchlist: [], portfolio: [], gainers: [], losers: [] };
  }

  const listsByMarket = items.reduce<Record<string, MarketOverviewItem[]>>((acc, item) => {
    if (!acc[item.marketLabel]) {
      acc[item.marketLabel] = [];
    }

    acc[item.marketLabel].push(item);
    return acc;
  }, {});

  const orderedLists = marketLabelOrder
    .map((label) => {
      const marketItems = listsByMarket[label];
      if (!marketItems) {
        return undefined;
      }

      return [...marketItems].sort((a, b) => b.change - a.change);
    })
    .filter((list): list is MarketOverviewItem[] => Boolean(list));

  const fallbackLists = Object.entries(listsByMarket)
    .filter(([label]) => !marketLabelOrder.includes(label))
    .map(([, marketItems]) => [...marketItems].sort((a, b) => b.change - a.change));

  const mergedLists = [...orderedLists, ...fallbackLists];

  const totalItems = items.length;
  const watchlist = interleaveByMarket(mergedLists, totalItems, 0);
  const portfolio = interleaveByMarket(mergedLists, totalItems, 1);

  const gainers = [...items].sort((a, b) => b.change - a.change);
  const losers = [...items].sort((a, b) => a.change - b.change);

  return {
    watchlist,
    portfolio: portfolio.length ? portfolio : watchlist,
    gainers,
    losers,
  };
};

const MarketOverview: React.FC<MarketOverviewProps> = ({
  marketAssets,
  onAssetSelect,
  onQuickTradeClick,
  isLoading,
  onPortfolioItemSelect,
  portfolioReturns,
  onHighlightsChange,
  renderHighlightsInline = true,
}) => {
  const [activeList, setActiveList] = useState<MarketDisplayTab>('دیده‌بان');
  const [selectedTimeframe, setSelectedTimeframe] = useState<MarketOverviewTimeframe>('daily');
  const [page, setPage] = useState(0);
  const timeframeSelectId = useId();
  const timeframePanelId = `${timeframeSelectId}-panel`;
  const timeframeLabelId = `${timeframeSelectId}-label`;

  const allItems = useMemo(
    () =>
      marketAssets
        .map((asset) => convertAssetToItem(asset, selectedTimeframe))
        .filter((item): item is MarketOverviewItem => Boolean(item)),
    [marketAssets, selectedTimeframe],
  );

  const sections = useMemo(() => buildSections(allItems), [allItems]);

  const itemLookup = useMemo(() => {
    const map = new Map<string, MarketOverviewItem>();
    allItems.forEach((item) => {
      map.set(createLookupKey(item.displayName), item);
      map.set(createLookupKey(item.assetName), item);
    });
    return map;
  }, [allItems]);

  const highlightCards = useMemo<MarketHighlightCard[]>(() => {
    const cards: MarketHighlightCard[] = [];

    const topGainer = sections.gainers[0];
    if (topGainer) {
      cards.push({
        id: 'top-gainer',
        title: 'پیشتاز رشد',
        description: `${topGainer.displayName} در ${timeframeDescriptions[selectedTimeframe]}`,
        change: topGainer.change,
        tone: 'bullish',
        item: topGainer,
      });
    }

    const topLoser = sections.losers[0];
    if (topLoser) {
      cards.push({
        id: 'top-loser',
        title: 'بیشترین فشار فروش',
        description: `${topLoser.displayName} نیازمند پایش دقیق است.`,
        change: topLoser.change,
        tone: 'bearish',
        item: topLoser,
      });
    }

    const commodityLeader = [...allItems]
      .filter((item) => ['فلزهای گرانبها', 'بازار کالایی'].includes(item.marketLabel))
      .sort((a, b) => b.change - a.change)[0];

    if (commodityLeader) {
      cards.push({
        id: 'commodity-leader',
        title: 'رهبر بازار کالایی',
        description: `${commodityLeader.marketLabel} در ${timeframeLabels[selectedTimeframe]} اخیر`,
        change: commodityLeader.change,
        tone: commodityLeader.change >= 0 ? 'bullish' : 'bearish',
        item: commodityLeader,
      });
    }

    return cards.slice(0, 3);
  }, [sections, selectedTimeframe, allItems]);

  useEffect(() => {
    onHighlightsChange?.(highlightCards);
  }, [highlightCards, onHighlightsChange]);

  useEffect(
    () => () => {
      onHighlightsChange?.([]);
    },
    [onHighlightsChange],
  );

  const handleAssetFocus = (item?: MarketOverviewItem) => {
    if (!item) {
      return;
    }

    onAssetSelect?.(item);
    setActiveList('دیده‌بان');
  };

  const activeItems = sections[tabToKey[activeList]] ?? [];
  const totalPages = Math.ceil(activeItems.length / PAGE_SIZE);
  const currentPage = totalPages > 0 ? Math.min(page, totalPages - 1) : 0;

  useEffect(() => {
    setPage(0);
  }, [activeList, selectedTimeframe]);

  useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage);
    }
  }, [currentPage, page]);

  const paginatedItems = useMemo(() => {
    if (!activeItems.length) {
      return [];
    }

    const start = currentPage * PAGE_SIZE;
    return activeItems.slice(start, start + PAGE_SIZE);
  }, [activeItems, currentPage]);

  const renderSkeletonCards = () => (
    <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4 2xl:gap-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={composeHomeCard('min-h-[13rem] animate-pulse', 'muted', 'md')}
        />
      ))}
    </div>
  );

  return (
    <div
      className={composeHomeCard(
        'relative w-full min-w-0 overflow-hidden bg-gradient-to-br from-neo-dark-2 via-neo-dark-3 to-neo-dark-1 px-4 py-5 text-white sm:px-5 sm:py-6 lg:px-6 lg:py-7 xl:px-7 xl:py-8 2xl:px-10 2xl:py-10',
        'default',
        'none',
      )}
    >
      <div className="absolute -top-32 -left-24 h-64 w-64 rounded-full bg-neo-green/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-24 h-72 w-72 rounded-full bg-neo-green/5 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-extrabold text-white sm:text-2xl">بازارها در یک نگاه</h3>
        <div className="relative w-full sm:w-64">
          <label htmlFor={timeframeSelectId} id={timeframeLabelId} className="sr-only">
            انتخاب بازه زمانی بازار
          </label>
          <select
            id={timeframeSelectId}
            aria-labelledby={timeframeLabelId}
            aria-controls={timeframePanelId}
            value={selectedTimeframe}
            onChange={(event) => setSelectedTimeframe(event.target.value as MarketOverviewTimeframe)}
            className="w-full appearance-none rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-right text-sm font-semibold text-white shadow-sm transition focus:border-neo-green/40 focus:outline-none focus:ring-2 focus:ring-neo-green/60"
          >
            {timeframeOptions.map((option) => (
              <option key={option.value} value={option.value} className="text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-200" />
        </div>
      </div>

      <div
        id={timeframePanelId}
        role="tabpanel"
        aria-labelledby={timeframeLabelId}
        className="relative mt-2.5 -mx-2 min-w-0 overflow-x-auto pb-1 scrollbar-hide sm:mx-0 sm:overflow-visible"
      >
        <div className="flex min-w-full gap-2 sm:flex-wrap sm:gap-3">
          {displayTabs.map((tab) => {
            const isActive = activeList === tab;
            const stateClasses = isActive
              ? 'border border-neo-green/40 bg-neo-green/15 text-neo-green backdrop-blur'
              : 'border border-white/10 bg-white/0 text-gray-300 hover:border-white/20 hover:bg-white/5';

            return (
              <button
                key={tab}
                onClick={() => setActiveList(tab)}
                className={`flex min-w-[7.5rem] flex-none items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition-colors ${stateClasses} sm:flex-1 sm:min-w-0`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {activeList === 'پورتفوی من' && portfolioReturns && portfolioReturns.length > 0 && (
        <div className="mt-1 grid w-full gap-4 xl:grid-cols-2 xl:gap-5 2xl:gap-6">
          {portfolioReturns.map((capsule) => {
            const trend = capsule.trend ?? 'neutral';

            return (
              <div
                key={capsule.id}
                className={composeHomeCard(
                  'group relative flex w-full flex-col justify-between px-4 py-3 text-right shadow-[0_14px_30px_-20px_rgba(0,0,0,0.9)] backdrop-blur transition-transform hover:-translate-y-0.5 sm:px-5 sm:py-4',
                  portfolioToneMap[trend],
                  'sm',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-gray-100">{capsule.label}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                      trend === 'neutral'
                        ? 'border-white/10 bg-white/10 text-gray-100'
                        : capsuleColorClass[trend]
                    }`}
                  >
                    {capsule.value}
                  </span>
                </div>
                {capsule.detail && (
                  <p className="mt-2 text-[10px] leading-5 text-gray-300/90">{capsule.detail}</p>
                )}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 rounded-b-3xl bg-gradient-to-t from-white/15 via-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-60" />
              </div>
            );
          })}
        </div>
      )}

      <div className="relative mt-1">
        {isLoading ? (
          renderSkeletonCards()
        ) : activeItems.length ? (
          <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4 2xl:gap-5">
            {paginatedItems.map((item) => {
              const priceLabel = formatText(item.price) || 'نامشخص';
              const metaLabel = formatText(item.meta);

            return (
              <button
                key={item.id}
                onClick={() => {
                  onAssetSelect?.(item);
                  if (activeList === 'پورتفوی من') {
                    onPortfolioItemSelect?.(item);
                  }
                }}
                className={composeHomeCard(
                  'group relative flex h-full min-h-[13rem] flex-col justify-between overflow-hidden p-4 text-right shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_34px_72px_-42px_rgba(80,255,189,0.35)] sm:p-5 xl:p-5',
                  item.change >= 0 ? 'positive' : 'negative',
                  'md',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="relative shrink-0">
                        <span className="pointer-events-none absolute inset-0 rounded-full bg-neo-green/20 opacity-0 transition-opacity duration-200 group-hover:opacity-70" />
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex min-w-0 flex-col gap-1 text-right">
                        <span className="inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-gray-100">
                          <span className="h-1.5 w-1.5 rounded-full bg-neo-green" />
                          {item.marketLabel}
                        </span>
                        <h4 className="line-clamp-2 text-sm font-extrabold leading-6 text-white sm:text-base">
                          {item.displayName}
                        </h4>
                        {item.subtitle && (
                          <p className="line-clamp-2 text-[11px] text-gray-400 sm:text-xs">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-xs ${
                          item.change >= 0 ? 'bg-neo-green/15 text-neo-green' : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {formatPercent(item.change)}
                      </span>
                      <span className="text-[10px] text-gray-400 sm:text-[11px]">
                        بازده {timeframeLabels[item.timeframe]}
                      </span>
                    </div>
                  </div>

                  <MiniTrendChart
                    seed={`${item.id}-${item.marketLabel}-${activeList}-${selectedTimeframe}`}
                    change={item.change}
                    points={item.chartPoints}
                    size="sm"
                    showAxis={false}
                    tone="subtle"
                    className="mt-3 sm:mt-4"
                  />
                  <div className="mt-3 flex flex-wrap items-end justify-between gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <p className="text-[11px] text-gray-400 sm:text-xs">قیمت لحظه‌ای</p>
                      <p className="text-lg font-bold text-white sm:text-xl">{priceLabel}</p>
                    </div>
                    {metaLabel && (
                      <div className="flex max-w-full flex-col items-end gap-1 text-[10px] text-gray-300/90 sm:text-xs">
                        <div className="flex items-center gap-1 text-gray-300 text-right">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                          <span className="block text-right leading-5">{metaLabel}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neo-green/20 via-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className={composeHomeCard('text-center text-sm text-gray-300', 'muted', 'lg')}>
            داده‌ای برای نمایش وجود ندارد.
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-300">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className={`rounded-full border px-3 py-1 font-semibold transition-colors ${
              currentPage === 0
                ? 'cursor-not-allowed border-white/5 text-gray-500'
                : 'border-white/10 text-gray-200 hover:border-neo-green/40 hover:text-neo-green'
            }`}
          >
            قبلی
          </button>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-gray-100">
            صفحه {toPersianDigits(String(currentPage + 1))} از {toPersianDigits(String(totalPages))}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, totalPages > 0 ? totalPages - 1 : 0),
              )
            }
            disabled={currentPage >= totalPages - 1}
            className={`rounded-full border px-3 py-1 font-semibold transition-colors ${
              currentPage >= totalPages - 1
                ? 'cursor-not-allowed border-white/5 text-gray-500'
                : 'border-white/10 text-gray-200 hover:border-neo-green/40 hover:text-neo-green'
            }`}
          >
            بعدی
          </button>
        </div>
      )}

      {renderHighlightsInline && highlightCards.length > 0 && (
        <div className="mt-5 -mx-1 flex gap-3 overflow-x-auto pb-1 sm:mx-0 sm:flex-wrap sm:gap-4">
          {highlightCards.map((highlight) => {
            const toneClass = sentimentChangeTone[highlight.tone];
            return (
              <button
                key={highlight.id}
                type="button"
                onClick={() => handleAssetFocus(highlight.item)}
                className={composeHomeCard(
                  'group flex min-w-[16rem] flex-1 flex-col justify-between p-4 text-right text-sm text-white transition hover:-translate-y-0.5 sm:min-w-[15rem]',
                  highlightToneMap[highlight.tone],
                  'sm',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[11px] font-semibold text-gray-200">{highlight.title}</span>
                    <span className="text-xs leading-5 text-gray-400">{highlight.description}</span>
                  </div>
                  <span className={`rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-bold ${toneClass}`}>
                    {formatPercent(highlight.change)}
                  </span>
                </div>
                {highlight.item && (
                  <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-gray-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-neo-green" />
                    {highlight.item.displayName}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid gap-4 text-right [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        {globalMarketSessions.map((session) => {
          const statusTone = sessionStatusStyles[session.status];
          const details = [
            { id: 'open', label: 'بازگشایی', value: session.openTime },
            { id: 'close', label: 'پایان', value: session.closeTime },
            { id: 'local', label: 'ساعت محلی', value: session.localTime },
          ].filter((detail) => Boolean(detail.value));

          return (
            <div
              key={session.id}
              className={composeHomeCard(
                'group relative overflow-hidden p-5 text-sm text-white shadow-[0_22px_48px_-32px_rgba(0,0,0,0.85)] backdrop-blur transition duration-300 hover:-translate-y-1',
                sessionToneMap[session.status],
                'md',
              )}
            >
              <div
                aria-hidden="true"
                className={clsx(
                  'pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b opacity-80 transition duration-300 group-hover:opacity-100',
                  sessionAccentStrip[session.status],
                )}
              />
              <div
                aria-hidden="true"
                className={clsx(
                  'pointer-events-none absolute -left-20 top-10 h-32 w-32 rounded-full blur-3xl opacity-20 transition duration-500 group-hover:opacity-40',
                  sessionGlowClass[session.status],
                )}
              />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-[11px] text-gray-400">{session.city} • {session.timezone}</span>
                  <h4 className="text-base font-semibold text-white">{session.market}</h4>
                </div>
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold',
                    statusTone.className,
                  )}
                >
                  {statusTone.label}
                </span>
              </div>
              <div className="relative mt-4 flex w-full flex-wrap items-center justify-end gap-2 text-[11px]">
                {details.map((detail) => (
                  <span
                    key={detail.id}
                    className="inline-flex min-w-[7.25rem] items-center justify-between gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] text-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  >
                    <span className="text-[10px] text-gray-400">{detail.label}</span>
                    <span className="font-semibold text-white">{toPersianDigits(detail.value!)}</span>
                  </span>
                ))}
              </div>
              {session.note && (
                <p className="relative mt-4 text-[11px] leading-6 text-gray-300">{session.note}</p>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MarketOverview;
