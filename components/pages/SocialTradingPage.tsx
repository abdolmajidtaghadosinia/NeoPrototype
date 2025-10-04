

import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { LeaderboardUser, TradingIdea, NewsArticle, FollowedActivity, MarketAsset, User } from '../../types';
import Leaderboard from '../Leaderboard';
import NewsSection from '../NewsSection';
import TradingIdeasSection from '../TradingIdeasSection';
import FollowedActivityFeed from '../FollowedActivityFeed';
import { leaderboardData, financialNewsData, followedActivityData } from '../../data/marketData';
import { BoltIcon } from '../icons/BoltIcon';
import { ChatBubbleIcon } from '../icons/ChatBubbleIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { toPersianDigits } from '../formatters';

/**
 * Props for the SocialTradingPage component.
 */
interface SocialTradingPageProps {
  /** Callback function triggered when a user from the leaderboard is selected. */
  onUserSelect: (user: LeaderboardUser) => void;
  /** Callback function triggered when a trading idea is selected. */
  onIdeaSelect: (idea: TradingIdea) => void;
  /** Callback function triggered when a news article is selected. */
  onNewsSelect: (article: NewsArticle) => void;
  /** Callback function to initiate a copy trade from the activity feed. */
  onCopyTrade: (activity: FollowedActivity) => void;
  /** Callback function to navigate to an asset's profile page. */
  onAssetSelect: (assetId: string) => void;
  /** An array of trading ideas to be displayed. */
  tradingIdeas: TradingIdea[];
  /** Callback for when a user likes a trading idea. */
  onLikeIdea: (ideaId: string) => void;
  /** Callback to submit a new trading idea created by the user. */
  onAddIdea: (idea: TradingIdea) => void;
  /** A list of all available market assets, used for populating forms. */
  assets: MarketAsset[];
  /** The currently logged-in user object. */
  currentUser: User;
  /** An array of user IDs that the current user is following. */
  followedUserIds: number[];
  /** Callback function to toggle the follow state for a user. */
  onToggleFollow: (userId: number) => void;
  /** Optional key to specify a section to scroll to and highlight upon loading. */
  focusSection?: 'news';
}

/**
 * Renders the main social trading page, which acts as a hub for community-driven content.
 * It includes a leaderboard, a feed of activities from followed users, a section for
 * viewing and creating trading ideas, and a news section. The component manages
 * local state for filters and the "add idea" form.
 *
 * @param {SocialTradingPageProps} props - The component props.
 * @returns {JSX.Element} The social trading page component.
 */
const SocialTradingPage: React.FC<SocialTradingPageProps> = ({ onUserSelect, onIdeaSelect, onNewsSelect, onCopyTrade, onAssetSelect, tradingIdeas, onLikeIdea, onAddIdea, assets, currentUser, followedUserIds, onToggleFollow, focusSection }) => {
  const defaultAssetId = assets[0]?.id || '';
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ assetId: defaultAssetId, title: '', description: '', type: 'bullish', timeframe: '' });
  const [activityFilter, setActivityFilter] = useState<'all' | 'buy' | 'sell' | 'ideas'>('all');
  const [activityAssetFilter, setActivityAssetFilter] = useState<'all' | string>('all');
  const [ideaFilter, setIdeaFilter] = useState<'all' | 'bullish' | 'bearish'>('all');
  const newsSectionRef = useRef<HTMLDivElement | null>(null);
  const [isNewsHighlighted, setIsNewsHighlighted] = useState(false);

  useEffect(() => {
    if (focusSection === 'news' && newsSectionRef.current) {
      newsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsNewsHighlighted(true);
      const timeout = window.setTimeout(() => setIsNewsHighlighted(false), 2000);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [focusSection]);

  useEffect(() => {
    if (formData.assetId && assets.some((asset) => asset.id === formData.assetId)) {
      return;
    }
    if (defaultAssetId) {
      setFormData((prev) => ({ ...prev, assetId: defaultAssetId }));
    }
  }, [assets, defaultAssetId, formData.assetId]);

  const assetFilterOptions = useMemo(() => {
    const groups = followedActivityData.reduce(
      (acc, activity) => {
        const existing = acc.get(activity.asset.id);
        const currentCount = existing?.count ?? 0;
        acc.set(activity.asset.id, {
          value: activity.asset.id,
          label: activity.asset.name,
          count: currentCount + 1,
        });
        return acc;
      },
      new Map<string, { value: string; label: string; count: number }>()
    );

    return [
      { value: 'all' as const, label: 'همه دارایی‌ها', count: followedActivityData.length },
      ...Array.from(groups.values()).sort((a, b) => b.count - a.count),
    ];
  }, [followedActivityData]);

  const assetFilteredActivities = useMemo(() => {
    if (activityAssetFilter === 'all') {
      return followedActivityData;
    }
    return followedActivityData.filter((activity) => activity.asset.id === activityAssetFilter);
  }, [activityAssetFilter]);

  const activityCounts = useMemo(() => {
    return assetFilteredActivities.reduce(
      (acc, activity) => {
        if (activity.type === 'trade_buy') acc.buy += 1;
        else if (activity.type === 'trade_sell') acc.sell += 1;
        else acc.ideas += 1;
        return acc;
      },
      { buy: 0, sell: 0, ideas: 0 }
    );
  }, [assetFilteredActivities]);

  const filteredActivities = useMemo(() => {
    return assetFilteredActivities.filter((activity) => {
      if (activityFilter === 'buy') return activity.type === 'trade_buy';
      if (activityFilter === 'sell') return activity.type === 'trade_sell';
      if (activityFilter === 'ideas') return activity.type === 'new_idea';
      return true;
    });
  }, [activityFilter, assetFilteredActivities]);

  const selectedAssetLabel = useMemo(() => {
    if (activityAssetFilter === 'all') {
      return '';
    }
    const option = assetFilterOptions.find((item) => item.value === activityAssetFilter);
    return option?.label || '';
  }, [activityAssetFilter, assetFilterOptions]);

  const emptyActivityMessage = useMemo(() => {
    if (activityFilter === 'ideas') {
      return selectedAssetLabel
        ? `برای ${selectedAssetLabel} هنوز ایده‌ای از دنبال‌شوندگان منتشر نشده است.`
        : 'هنوز ایده‌ای از دنبال‌شوندگان منتشر نشده است.';
    }
    if (activityFilter === 'buy') {
      return selectedAssetLabel
        ? `در حال حاضر خرید فعالی برای ${selectedAssetLabel} از دنبال‌شوندگان شما ثبت نشده است.`
        : 'در حال حاضر خرید فعالی از دنبال‌شوندگان شما ثبت نشده است.';
    }
    if (activityFilter === 'sell') {
      return selectedAssetLabel
        ? `هیچ فروش جدیدی برای ${selectedAssetLabel} در این بازه ثبت نشده است.`
        : 'هیچ فروش جدیدی در این بازه ثبت نشده است.';
    }
    if (selectedAssetLabel) {
      return `در حال حاضر فعالیتی برای ${selectedAssetLabel} در دسترس نیست.`;
    }
    return 'فعلاً فعالیتی در دسترس نیست.';
  }, [activityFilter, selectedAssetLabel]);

  const ideaStats = useMemo(() => {
    const bullish = tradingIdeas.filter((idea) => idea.type === 'bullish').length;
    const bearish = tradingIdeas.filter((idea) => idea.type === 'bearish').length;
    const total = tradingIdeas.length;
    const sentiment = total > 0 ? Math.round((bullish / total) * 100) : 0;
    return { bullish, bearish, total, sentiment };
  }, [tradingIdeas]);

  const filteredIdeas = useMemo(() => {
    if (ideaFilter === 'bullish') {
      return tradingIdeas.filter((idea) => idea.type === 'bullish');
    }
    if (ideaFilter === 'bearish') {
      return tradingIdeas.filter((idea) => idea.type === 'bearish');
    }
    return tradingIdeas;
  }, [ideaFilter, tradingIdeas]);

  const topIdea = useMemo(() => {
    if (tradingIdeas.length === 0) return null;
    return tradingIdeas.reduce((best, idea) => (idea.likes > best.likes ? idea : best), tradingIdeas[0]);
  }, [tradingIdeas]);

  const totalCopyableTrades = activityCounts.buy + activityCounts.sell;
  const summaryCards = useMemo(
    () => [
      {
        id: 'copyable',
        label: 'معاملات قابل کپی',
        value: toPersianDigits(totalCopyableTrades),
        description: `${toPersianDigits(activityCounts.buy)} خرید · ${toPersianDigits(activityCounts.sell)} فروش`,
        icon: <BoltIcon className="h-5 w-5 text-neo-green" />,
      },
      {
        id: 'ideas',
        label: 'ایده‌های فعال',
        value: toPersianDigits(ideaStats.total),
        description:
          ideaStats.total > 0
            ? `${toPersianDigits(ideaStats.bullish)} صعودی · ${toPersianDigits(ideaStats.bearish)} نزولی`
            : 'هنوز ایده‌ای ثبت نشده است',
        icon: <ChatBubbleIcon className="h-5 w-5 text-sky-400" />,
      },
      {
        id: 'sentiment',
        label: 'حس بازار',
        value:
          ideaStats.total > 0
            ? `${toPersianDigits(ideaStats.sentiment)}٪ صعودی`
            : 'در انتظار تحلیل‌ها',
        description: 'بر اساس آخرین ایده‌های منتشر شده',
        icon: <TrendingUpIcon className="h-5 w-5 text-amber-300" />,
      },
    ],
    [activityCounts.buy, activityCounts.sell, ideaStats.bearish, ideaStats.bullish, ideaStats.sentiment, ideaStats.total, totalCopyableTrades]
  );

  const activityFilterOptions = useMemo(
    () => [
      {
        value: 'all' as const,
        label: 'همه',
        badge: activityCounts.buy + activityCounts.sell + activityCounts.ideas,
      },
      {
        value: 'buy' as const,
        label: 'خرید',
        badge: activityCounts.buy,
      },
      {
        value: 'sell' as const,
        label: 'فروش',
        badge: activityCounts.sell,
      },
      {
        value: 'ideas' as const,
        label: 'ایده‌ها',
        badge: activityCounts.ideas,
      },
    ],
    [activityCounts.buy, activityCounts.sell, activityCounts.ideas]
  );

  const ideaFilterLabels: Record<'all' | 'bullish' | 'bearish', string> = {
    all: 'همه',
    bullish: 'صعودی',
    bearish: 'نزولی',
  };

  type IdeaTemplate = {
    id: string;
    label: string;
    title: string;
    description: string;
    type: 'bullish' | 'bearish';
    timeframe: string;
    assetId?: string;
  };

  const ideaTemplates = useMemo<IdeaTemplate[]>(() => {
    const khodroId = assets.find((asset) => asset.id === 'khodro')?.id;
    const ayarId = assets.find((asset) => asset.id === 'ayar')?.id;
    const webmelatId = assets.find((asset) => asset.id === 'webmelat')?.id;

    return [
      {
        id: 'tse-outlook',
        label: 'چشم‌انداز شاخص کل',
        title: 'تحلیل ناحیه مقاومتی شاخص کل بورس',
        description: 'بررسی رفتار شاخص کل در محدوده ۲.۲ میلیون واحد با تمرکز بر ورود پول حقیقی.',
        type: 'bullish',
        timeframe: '۱ هفته',
        assetId: webmelatId || defaultAssetId,
      },
      {
        id: 'auto-risk',
        label: 'مدیریت ریسک خودرو',
        title: 'بررسی فشار فروش در نماد خودرو',
        description: 'تحلیل سفارش‌ها و احتمال تشدید عرضه با تمرکز بر محدوده مقاومتی ۲۲۰۰ ریال.',
        type: 'bearish',
        timeframe: '۲ هفته',
        assetId: khodroId || defaultAssetId,
      },
      {
        id: 'gold-hedge',
        label: 'هج طلا',
        title: 'استراتژی هج روی صندوق طلا',
        description: 'پوشش ریسک پرتفوی با استفاده از صندوق طلا در برابر نوسان‌های بازار سهام.',
        type: 'bullish',
        timeframe: '۳ ماهه',
        assetId: ayarId || defaultAssetId,
      },
    ];
  }, [assets, defaultAssetId]);

  const handleTemplateSelect = (template: IdeaTemplate) => {
    setShowForm(true);
    setFormData({
      assetId: template.assetId || defaultAssetId,
      title: template.title,
      description: template.description,
      type: template.type,
      timeframe: template.timeframe,
    });
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({ assetId: defaultAssetId, title: '', description: '', type: 'bullish', timeframe: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selected = assets.find(a => a.id === formData.assetId);
    if (!selected) return;
    const newIdea: TradingIdea = {
      id: Date.now().toString(),
      user: { id: Number(currentUser.id) || 0, name: currentUser.name, picture: currentUser.picture },
      asset: { id: selected.id, name: selected.name, icon: typeof selected.icon === 'string' ? selected.icon : '' },
      type: formData.type as 'bullish' | 'bearish',
      title: formData.title,
      description: formData.description,
      likes: 0,
      comments: 0,
      predictionTimeframe: formData.timeframe,
      commentsData: [],
    };
    onAddIdea(newIdea);
    resetForm();
  };

  return (
    <div className="pt-4 pb-4 space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-6">
      <div className="space-y-4 md:col-span-12">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div key={card.id} className="rounded-2xl border border-gray-800/60 bg-neo-dark-2/70 p-4 text-right shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/30">
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">{card.label}</p>
                  <p className="mt-1 text-lg font-bold text-white">{card.value}</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-6 text-gray-400">{card.description}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-800/60 bg-neo-dark-2/70 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-right">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neo-dark-3/80">
              <UsersIcon className="h-6 w-6 text-neo-green" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400">شبکه شما</p>
              <p className="mt-1 text-sm font-bold text-white">
                {toPersianDigits(followedUserIds.length)} تریدر را دنبال می‌کنید
              </p>
            </div>
          </div>
          {topIdea && (
            <button
              type="button"
              onClick={() => onIdeaSelect(topIdea)}
              className="group flex w-full flex-1 items-center justify-between gap-4 rounded-2xl border border-gray-700/60 bg-neo-dark-3/60 p-4 text-right transition-colors hover:border-neo-green/60 hover:bg-neo-dark-1/60 md:w-auto"
            >
              <div>
                <p className="text-xs font-semibold text-gray-400">محبوب‌ترین ایده امروز</p>
                <p className="mt-1 text-sm font-bold text-white line-clamp-2">{topIdea.title}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {topIdea.asset.icon} {topIdea.asset.name} · {toPersianDigits(topIdea.likes)} پسند
                </p>
              </div>
              <span className="text-2xl text-neo-green transition-transform duration-200 group-hover:translate-x-1">➜</span>
            </button>
          )}
        </div>
      </div>

      <div className="md:col-span-7 space-y-6">
        <FollowedActivityFeed
          activities={filteredActivities}
          onUserSelect={onUserSelect}
          onAssetSelect={onAssetSelect}
          onCopyTrade={onCopyTrade}
          emptyMessage={emptyActivityMessage}
          headerActions={
            <div className="flex flex-col gap-3 text-right md:flex-row md:items-center md:gap-4">
              <label className="flex flex-col text-xs font-semibold text-gray-400 md:flex-row md:items-center md:gap-2">
                <span>فیلتر دارایی</span>
                <select
                  value={activityAssetFilter}
                  onChange={(event) => setActivityAssetFilter(event.target.value)}
                  className="mt-1 rounded-full border border-gray-700 bg-neo-dark-3 px-3 py-1 text-right text-xs font-semibold text-gray-200 transition focus:border-neo-green focus:outline-none focus:ring-0 md:mt-0"
                >
                  {assetFilterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {`${option.label} (${toPersianDigits(option.count)})`}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {activityFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setActivityFilter(option.value)}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      activityFilter === option.value
                        ? 'border-neo-green bg-neo-green text-black'
                        : 'border-gray-700 text-gray-300 hover:border-neo-green/40 hover:text-white'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        activityFilter === option.value ? 'bg-black/20 text-black' : 'bg-neo-dark-1 text-neo-green'
                      }`}
                    >
                      {toPersianDigits(option.badge)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          }
        />
        {selectedAssetLabel && (
          <p className="text-xs text-gray-400 text-right">
            نمایش فعالیت‌های مرتبط با <span className="font-semibold text-gray-200">{selectedAssetLabel}</span>.
            {' '}
            برای بازگشت به همه دارایی‌ها، گزینه «همه دارایی‌ها» را انتخاب کنید.
          </p>
        )}
        <div
          ref={newsSectionRef}
          id="social-news-section"
          className={clsx(
            'transition-all duration-500',
            isNewsHighlighted &&
              'rounded-[1.75rem] ring-2 ring-neo-green/50 ring-offset-2 ring-offset-gray-900',
          )}
        >
          <NewsSection news={financialNewsData} onArticleSelect={onNewsSelect} />
        </div>
      </div>

      <div className="md:col-span-5 space-y-6">
        <div className="space-y-4 rounded-2xl border border-gray-800/60 bg-neo-dark-2/70 p-4">
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-right">
                <label htmlFor="idea-asset" className="mb-1 block text-xs font-semibold text-gray-400">
                  دارایی مورد نظر
                </label>
                <select
                  id="idea-asset"
                  value={formData.assetId}
                  onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                  className="w-full rounded-lg bg-neo-dark-3 p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neo-green"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-right">
                <label htmlFor="idea-title" className="mb-1 block text-xs font-semibold text-gray-400">
                  عنوان ایده
                </label>
                <input
                  id="idea-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثلاً سناریوی شکست مقاومت"
                  className="w-full rounded-lg bg-neo-dark-3 p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neo-green"
                  required
                />
              </div>
              <div className="text-right">
                <label htmlFor="idea-description" className="mb-1 block text-xs font-semibold text-gray-400">
                  توضیحات تحلیلی
                </label>
                <textarea
                  id="idea-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="دلایل ورود، محدوده‌های کلیدی و استراتژی مدیریت ریسک را توضیح دهید."
                  className="w-full rounded-lg bg-neo-dark-3 p-3 text-sm text-white leading-6 focus:outline-none focus:ring-2 focus:ring-neo-green"
                  rows={4}
                  required
                />
                <p className="mt-2 text-[11px] text-gray-500">
                  لطفاً محدوده ورود، اهداف قیمتی و حد ضرر پیشنهادی را مشخص کنید تا معامله‌گران راحت‌تر تصمیم بگیرند.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-right">
                <div>
                  <label htmlFor="idea-type" className="mb-1 block text-xs font-semibold text-gray-400">
                    جهت دیدگاه
                  </label>
                  <select
                    id="idea-type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-lg bg-neo-dark-3 p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neo-green"
                  >
                    <option value="bullish">صعودی</option>
                    <option value="bearish">نزولی</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="idea-timeframe" className="mb-1 block text-xs font-semibold text-gray-400">
                    بازه زمانی پیش‌بینی
                  </label>
                  <input
                    id="idea-timeframe"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    placeholder="مثلاً ۲ هفته"
                    className="w-full rounded-lg bg-neo-dark-3 p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neo-green"
                    required
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-gray-400">الگوهای آماده</p>
                <div className="flex flex-wrap gap-2">
                  {ideaTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleTemplateSelect(template)}
                      className="rounded-full border border-gray-700 px-3 py-1 text-xs font-semibold text-gray-200 transition hover:border-neo-green hover:text-neo-green"
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-neo-green py-2 text-sm font-bold text-black shadow hover:bg-neo-green/90"
                >
                  ثبت ایده
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-lg border border-gray-700 py-2 text-sm font-semibold text-gray-300 hover:border-red-400 hover:text-red-400"
                >
                  انصراف
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-right">
              <h3 className="text-sm font-bold text-white">ایده جدید ثبت کنید</h3>
              <p className="text-xs text-gray-400">
                تجربه‌های معاملاتی خود را با جامعه به اشتراک بگذارید. یکی از الگوهای زیر را انتخاب کنید یا از صفر شروع کنید.
              </p>
              <div className="flex flex-wrap gap-2">
                {ideaTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateSelect(template)}
                    className="rounded-full border border-neo-green/50 px-3 py-1 text-xs font-semibold text-neo-green transition hover:bg-neo-green/10"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="w-full rounded-lg bg-neo-green py-2 text-sm font-semibold text-black shadow hover:bg-neo-green/90"
              >
                شروع نگارش ایده
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-gray-800/60 bg-neo-dark-2/70 p-4">
          <div className="flex flex-col gap-2 text-right sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-white">ایده‌های معاملاتی</h2>
            <div className="flex items-center gap-2">
              {(['all', 'bullish', 'bearish'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setIdeaFilter(filterKey)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    ideaFilter === filterKey
                      ? 'bg-neo-green text-black'
                      : 'bg-neo-dark-3 text-gray-300 hover:bg-neo-dark-1'
                  }`}
                >
                  {ideaFilterLabels[filterKey]}
                </button>
              ))}
            </div>
          </div>
          {filteredIdeas.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-700 bg-neo-dark-3/60 p-6 text-center text-sm text-gray-400">
              هنوز ایده‌ای با این فیلتر منتشر نشده است.
            </div>
          ) : (
            <TradingIdeasSection ideas={filteredIdeas} onIdeaClick={onIdeaSelect} onLikeClick={onLikeIdea} showTitle={false} />
          )}
        </div>

        <Leaderboard
          users={leaderboardData}
          onUserClick={onUserSelect}
          followedUserIds={followedUserIds}
          onToggleFollow={onToggleFollow}
        />
      </div>
    </div>
  );
};

export default SocialTradingPage;
