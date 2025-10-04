import React, { useEffect, useRef, useState } from 'react';
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

const PriceChart: React.FC<PriceChartProps> = ({ asset }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let chart: any;
    let candleSeries: any;
    let volumeSeries: any;

    const generateFallback = (price: number) => {
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
      const pts = pointsMap[timeframe];
      const interval = intervalMap[timeframe];
      const start = Date.now() - (pts - 1) * interval;
      const data = [] as { name: string; value: number }[];
      let val = price;
      for (let i = 0; i < pts; i++) {
        if (i > 0) {
          val += (Math.random() - 0.5) * 0.02 * val;
        }
        data.push({ name: String(Math.round(start + i * interval)), value: Math.max(0, val) });
      }
      return data;
    };

    async function init() {
      const element = containerRef.current;
      if (!element) return;
      const { createChart } = await import('lightweight-charts');
      if (!element) return;
      const width = element.clientWidth || 400;
      const height = element.clientHeight || 300;

      chart = createChart(element, {
        width,
        height,
        layout: {
          background: { color: '#1C1C1E' },
          textColor: '#D1D5DB',
        },
        grid: {
          vertLines: { color: '#2C2C2E' },
          horzLines: { color: '#2C2C2E' },
        },
        crosshair: { mode: 1 },
        rightPriceScale: { borderColor: '#2C2C2E' },
        timeScale: { borderColor: '#2C2C2E' },
      });

      candleSeries = chart.addCandlestickSeries({
        upColor: '#16a34a',
        downColor: '#dc2626',
        wickUpColor: '#16a34a',
        wickDownColor: '#dc2626',
        borderVisible: false,
      });

      volumeSeries = chart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: '',
        scaleMargins: { top: 0.8, bottom: 0 },
      });

      let raw = asset.performance[timeframe]?.chartData || [];
      if (!raw.length) {
        const basePrice = parsePrice(asset.price);
        raw = generateFallback(basePrice);
      }

      const candles: any[] = [];
      const volumes: any[] = [];
      let prev = raw[0]?.value || 0;
      raw.forEach((d, idx) => {
        const close = d.value;
        const open = idx === 0 ? close : prev;
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);
        const time = Math.floor(Number(d.name) / 1000);
        const vol = Math.abs(close - open) * 100 + Math.random() * 1000;
        candles.push({ time, open, high, low, close });
        volumes.push({ time, value: vol, color: close >= open ? '#16a34a' : '#dc2626' });
        prev = close;
      });

      candleSeries.setData(candles);
      volumeSeries.setData(volumes);
      chart.timeScale().fitContent();
    }

    init();

    return () => {
      chart?.remove();
    };
  }, [asset, timeframe]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-center gap-2 mb-3">
        {timeframes.map(tf => (
          <button
            key={tf.value}
            onClick={() => setTimeframe(tf.value)}
            className={`px-3 py-1 text-sm rounded-full font-semibold transition-colors ${timeframe === tf.value ? 'bg-neo-green text-black' : 'bg-neo-dark-3 text-gray-300'}`}
          >
            {tf.label}
          </button>
        ))}
      </div>
      <div ref={containerRef} className="flex-1" />
    </div>
  );
};

export default PriceChart;
