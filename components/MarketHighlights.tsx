import React, { useMemo, useCallback } from 'react';
import clsx from 'clsx';

import { MarketAsset } from '../types';
import { toPersianDigits } from './formatters';
import AssetIcon, { deriveAssetSymbol } from './AssetIcon';

const indexMakerDefinitions = [
  {
    id: 'fars',
    company: 'صنایع پتروشیمی خلیج فارس',
    industry: 'پتروشیمی',
  },
  {
    id: 'foolad',
    company: 'فولاد مبارکه اصفهان',
    industry: 'فولاد',
  },
  {
    id: 'fameli',
    company: 'ملی صنایع مس ایران',
    industry: 'فلزات اساسی',
  },
  {
    id: 'kegol',
    company: 'معدنی و صنعتی گل‌گهر',
    industry: 'سنگ آهن',
  },
  {
    id: 'tapico',
    company: 'سرمایه‌گذاری نفت و گاز و پتروشیمی تأمین',
    industry: 'هلدینگ پتروشیمی',
  },
  {
    id: 'shepna',
    company: 'پالایش نفت اصفهان',
    industry: 'پالایشی',
  },
  {
    id: 'kchad',
    company: 'معدنی و صنعتی چادرملو',
    industry: 'سنگ آهن',
  },
  {
    id: 'midco',
    company: 'توسعه معادن و صنایع معدنی خاورمیانه',
    industry: 'هلدینگ معدنی',
  },
  {
    id: 'vghadir',
    company: 'سرمایه‌گذاری غدیر',
    industry: 'هلدینگ سرمایه‌گذاری',
  },
  {
    id: 'shbandar',
    company: 'پالایش نفت بندرعباس',
    industry: 'پالایشی',
  },
] as const;

type IndexMakerMetrics = {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
};

const indexTimeframeLabels: Record<keyof IndexMakerMetrics, string> = {
  daily: 'روزانه',
  weekly: 'هفتگی',
  monthly: 'ماهانه',
  yearly: 'سالیانه',
};

const goldFundDefinitions = [
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
] as const;

type GoldFundReturns = {
  three: number;
  six: number;
  nine: number;
  twelve: number;
};

const goldReturnLabels: Record<keyof GoldFundReturns, string> = {
  three: '۳ ماهه',
  six: '۶ ماهه',
  nine: '۹ ماهه',
  twelve: '۱۲ ماهه',
};

const getAssetVariant = (
  category?: MarketAsset['category'],
): NonNullable<React.ComponentProps<typeof AssetIcon>['variant']> => {
  if (!category) {
    return 'default';
  }

  switch (category) {
    case 'بورس':
      return 'stock';
    case 'صندوق‌ها':
      return 'fund';
    case 'کالا':
      return 'commodity';
    case 'ارزها':
      return 'currency';
    default:
      return 'default';
  }
};

interface MarketHighlightsProps {
  marketAssets: MarketAsset[];
  onAssetSelect: (asset: MarketAsset) => void;
}

const MarketHighlights: React.FC<MarketHighlightsProps> = ({ marketAssets, onAssetSelect }) => {
  const formatPercent = useCallback((value: number) => {
    const prefix = value > 0 ? '+' : value < 0 ? '-' : '';
    const magnitude = Math.abs(value);
    const formatted = `${prefix}${magnitude.toFixed(magnitude >= 1 ? 1 : 2)}`;
    return `${toPersianDigits(formatted)}٪`;
  }, []);

  const changeChipClasses = useCallback(
    (value: number) =>
      value >= 0
        ? 'border border-neo-green/40 bg-neo-green/15 text-neo-green'
        : 'border border-rose-400/45 bg-rose-500/15 text-rose-100',
    [],
  );

  const indexMakers = useMemo(
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
        .filter((value): value is typeof indexMakerDefinitions[number] & { asset: MarketAsset; metrics: IndexMakerMetrics } =>
          Boolean(value),
        ),
    [marketAssets],
  );

  const goldFunds = useMemo(
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
        .filter((value): value is typeof goldFundDefinitions[number] & { asset: MarketAsset; returns: GoldFundReturns } =>
          Boolean(value),
        ),
    [marketAssets],
  );

  if (!indexMakers.length && !goldFunds.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-right text-sm text-gray-300">
        داده‌های ویژه شاخص‌ساز و صندوق‌های طلا در دسترس نیست.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {indexMakers.length > 0 && (
        <section className="space-y-4 rounded-3xl border border-white/12 bg-gradient-to-br from-white/8 via-white/4 to-transparent p-5 text-right shadow-[0_24px_60px_-36px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white md:text-base">شاخص‌سازان برتر</h3>
            <span className="text-[11px] text-gray-400">به‌روزرسانی ۱۶ مهر ۱۴۰۴</span>
          </div>
          <div className="space-y-3">
            {indexMakers.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onAssetSelect(item.asset)}
                className={clsx(
                  'flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-neo-green/40 hover:bg-white/10',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-green/60',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <AssetIcon
                        icon={item.asset.icon}
                        name={item.asset.name}
                        symbol={deriveAssetSymbol(item.asset.name)}
                        size="sm"
                        variant={getAssetVariant(item.asset.category)}
                      />
                      <span>{item.company}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">{item.industry}</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">{item.asset.price}</div>
                    <div className={clsx('text-xs font-semibold', item.metrics.daily >= 0 ? 'text-neo-green' : 'text-rose-300')}>
                      {formatPercent(item.metrics.daily)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 text-[11px]">
                  {(Object.entries(item.metrics) as [keyof IndexMakerMetrics, number][]).map(([key, value]) => (
                    <span
                      key={`${item.id}-${key}`}
                      className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold', changeChipClasses(value))}
                    >
                      <span>{indexTimeframeLabels[key]}</span>
                      <span>{formatPercent(value)}</span>
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {goldFunds.length > 0 && (
        <section className="space-y-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/6 via-white/4 to-transparent p-5 text-right shadow-[0_24px_60px_-36px_rgba(0,0,0,0.7)]">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white md:text-base">صندوق‌های طلایی پربازده</h3>
            <span className="text-[11px] text-gray-400">آمار ۱۶ مهر ۱۴۰۴</span>
          </div>
          <div className="space-y-3">
            {goldFunds.map((fund) => (
              <button
                key={fund.id}
                type="button"
                onClick={() => onAssetSelect(fund.asset)}
                className={clsx(
                  'flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-neo-green/40 hover:bg-white/10',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-green/60',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <AssetIcon
                      icon={fund.asset.icon}
                      name={fund.asset.name}
                      symbol={deriveAssetSymbol(fund.asset.name)}
                      size="sm"
                      variant={getAssetVariant(fund.asset.category)}
                    />
                    <span>{fund.name}</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">{fund.asset.price}</div>
                    <div className="text-[11px] text-gray-400">{fund.focus}</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 text-[11px]">
                  {(Object.entries(fund.returns) as [keyof GoldFundReturns, number][]).map(([key, value]) => (
                    <span
                      key={`${fund.id}-${key}`}
                      className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold', changeChipClasses(value))}
                    >
                      <span>{goldReturnLabels[key]}</span>
                      <span>{formatPercent(value)}</span>
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MarketHighlights;
