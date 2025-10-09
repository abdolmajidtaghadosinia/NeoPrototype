import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MarketAsset } from '../types';
import { parsePrice } from './formatters';

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface PriceChartProps {
  asset: MarketAsset;
}

const timeframes: { label: string; value: Timeframe }[] = [
  { label: 'روز', value: 'daily' },
  { label: 'هفته', value: 'weekly' },
  { label: 'ماه', value: 'monthly' },
  { label: 'سال', value: 'yearly' },
];

type ThemeMode = 'dark' | 'light';

interface ChartPalette {
  background: string;
  text: string;
  grid: string;
  axis: string;
  accent: string;
  negative: string;
  crosshairBg: string;
  crosshairText: string;
}

const fallbackPalettes: Record<ThemeMode, ChartPalette> = {
  dark: {
    background: 'rgba(17, 17, 17, 0.82)',
    text: '#e5e7eb',
    grid: 'rgba(60, 60, 62, 0.6)',
    axis: 'rgba(60, 60, 62, 0.6)',
    accent: '#d7fe43',
    negative: '#dc2626',
    crosshairBg: 'rgba(17, 17, 17, 0.9)',
    crosshairText: '#f8fafc',
  },
  light: {
    background: 'rgba(255, 255, 255, 0.95)',
    text: '#1f2937',
    grid: 'rgba(203, 213, 225, 0.65)',
    axis: 'rgba(148, 163, 184, 0.65)',
    accent: '#28a168',
    negative: '#dc2626',
    crosshairBg: 'rgba(255, 255, 255, 0.95)',
    crosshairText: '#0f172a',
  },
};

const toCssColor = (value: string | null | undefined, fallback: string): string => {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (/^(#|rgba?\(|hsla?\()/i.test(trimmed)) {
    return trimmed;
  }
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 3) {
    return `rgb(${parts.join(', ')})`;
  }
  if (parts.length === 4) {
    return `rgba(${parts.join(', ')})`;
  }
  return fallback;
};

const resolvePalette = (theme: ThemeMode): ChartPalette => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallbackPalettes[theme];
  }

  try {
    const styles = getComputedStyle(document.documentElement);
    const backgroundVar = styles.getPropertyValue('--neo-surface-muted-bg') || styles.getPropertyValue('--neo-surface-bg');
    const gridVar = styles.getPropertyValue('--neo-surface-border') || styles.getPropertyValue('--neo-divider-color');
    const textVar = styles.getPropertyValue('--neo-text-primary');
    const accentVar = styles.getPropertyValue('--neo-accent');
    const negativeVar = styles.getPropertyValue('--filter-highlight-value-down');
    const crosshairBgVar = styles.getPropertyValue('--neo-surface-bg');
    const crosshairTextVar = styles.getPropertyValue('--neo-text-strong');

    const base = fallbackPalettes[theme];

    return {
      background: toCssColor(backgroundVar, base.background),
      text: toCssColor(textVar, base.text),
      grid: toCssColor(gridVar, base.grid),
      axis: toCssColor(gridVar, base.axis),
      accent: toCssColor(accentVar, base.accent),
      negative: toCssColor(negativeVar, base.negative),
      crosshairBg: toCssColor(crosshairBgVar, base.crosshairBg),
      crosshairText: toCssColor(crosshairTextVar, base.crosshairText),
    };
  } catch (error) {
    console.warn('Unable to resolve chart palette from CSS variables:', error);
    return fallbackPalettes[theme];
  }
};

const PriceChart: React.FC<PriceChartProps> = ({ asset }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof document === 'undefined') {
      return 'dark';
    }
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  });

  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      const nextTheme: ThemeMode = root.dataset.theme === 'light' ? 'light' : 'dark';
      setTheme((prev) => (prev === nextTheme ? prev : nextTheme));
    });

    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const palette = useMemo(() => resolvePalette(theme), [theme]);

  const buildSeriesData = useCallback(
    (tf: Timeframe) => {
      const pointsMap: Record<Timeframe, number> = {
        daily: 24,
        weekly: 7,
        monthly: 30,
        yearly: 12,
      };
      const intervalMap: Record<Timeframe, number> = {
        daily: 60 * 60 * 1000,
        weekly: 24 * 60 * 60 * 1000,
        monthly: 24 * 60 * 60 * 1000,
        yearly: 30.44 * 24 * 60 * 60 * 1000,
      };

      const fallbackBase = parsePrice(asset.price) || 10_000;
      let raw = asset.performance[tf]?.chartData ?? [];
      if (!raw.length) {
        const pts = pointsMap[tf];
        const interval = intervalMap[tf];
        const start = Date.now() - (pts - 1) * interval;
        const fallback: { name: string; value: number }[] = [];
        let val = fallbackBase;
        for (let i = 0; i < pts; i++) {
          if (i > 0) {
            val += (Math.random() - 0.5) * 0.02 * val;
          }
          fallback.push({ name: String(Math.round(start + i * interval)), value: Math.max(0, val) });
        }
        raw = fallback;
      }

      const candles: { time: number; open: number; high: number; low: number; close: number }[] = [];
      const volumes: { time: number; value: number; color: string }[] = [];
      let prev = raw[0]?.value ?? fallbackBase;

      raw.forEach((point, index) => {
        const close = point.value;
        const open = index === 0 ? close : prev;
        const high = Math.max(open, close) * 1.01;
        const low = Math.min(open, close) * 0.99;
        const time = Math.floor(Number(point.name) / 1000);
        const volumeValue = Math.abs(close - open) * 100 + Math.random() * 1000;
        const color = close >= open ? palette.accent : palette.negative;
        candles.push({ time, open, high, low, close });
        volumes.push({ time, value: volumeValue, color });
        prev = close;
      });

      return { candles, volumes };
    },
    [asset, palette.accent, palette.negative],
  );

  useEffect(() => {
    let disposed = false;
    let resizeObserver: ResizeObserver | undefined;

    const initializeChart = async () => {
      const element = containerRef.current;
      if (!element) return;

      chartRef.current?.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;

      const { createChart } = await import('lightweight-charts');
      if (disposed || !containerRef.current) return;

      const width = element.clientWidth || 400;
      const height = element.clientHeight || 320;

      const chart = createChart(element, {
        width,
        height,
        layout: {
          background: { color: palette.background },
          textColor: palette.text,
          fontFamily: 'Vazirmatn, sans-serif',
        },
        grid: {
          vertLines: { color: palette.grid },
          horzLines: { color: palette.grid },
        },
        crosshair: {
          mode: 1,
          vertLine: {
            color: palette.accent,
            labelBackgroundColor: palette.crosshairBg,
            labelTextColor: palette.crosshairText,
          },
          horzLine: {
            color: palette.accent,
            labelBackgroundColor: palette.crosshairBg,
            labelTextColor: palette.crosshairText,
          },
        },
        rightPriceScale: { borderColor: palette.axis },
        timeScale: { borderColor: palette.axis },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: palette.accent,
        downColor: palette.negative,
        wickUpColor: palette.accent,
        wickDownColor: palette.negative,
        borderVisible: false,
      });

      const volumeSeries = chart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: '',
        scaleMargins: { top: 0.8, bottom: 0 },
      });

      chartRef.current = chart;
      candleSeriesRef.current = candleSeries;
      volumeSeriesRef.current = volumeSeries;

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver((entries) => {
          if (!chartRef.current || !entries.length) return;
          const { width: nextWidth, height: nextHeight } = entries[0].contentRect;
          chartRef.current.applyOptions({ width: Math.floor(nextWidth), height: Math.floor(nextHeight) });
        });
        resizeObserver.observe(element);
      }

      const { candles, volumes } = buildSeriesData(timeframe);
      candleSeries.setData(candles);
      volumeSeries.setData(volumes);
      chart.timeScale().fitContent();
    };

    initializeChart();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      chartRef.current?.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [asset, palette, buildSeriesData]);

  useEffect(() => {
    const chart = chartRef.current;
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;

    if (!chart || !candleSeries || !volumeSeries) {
      return;
    }

    const { candles, volumes } = buildSeriesData(timeframe);
    candleSeries.setData(candles);
    volumeSeries.setData(volumes);
    chart.timeScale().fitContent();
  }, [buildSeriesData, timeframe]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-center gap-2 mb-3">
        {timeframes.map(tf => (
          <button
            key={tf.value}
            onClick={() => setTimeframe(tf.value)}
            className={`px-3 py-1 text-sm rounded-full font-semibold transition-colors ${
              timeframe === tf.value
                ? 'bg-neo-green text-[rgb(var(--tabs-active-text))]'
                : 'bg-neo-dark-3 text-[rgb(var(--tabs-inactive-text))]'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>
      <div
        ref={containerRef}
        className="relative w-full h-full min-h-[18rem]"
      />
    </div>
  );
};

export default PriceChart;
