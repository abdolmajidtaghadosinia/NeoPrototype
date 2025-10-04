import React from 'react';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { LeaderboardUser, PortfolioSlice } from '../../types';
import Portfolio from '../Portfolio';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';
import { CopyIcon } from '../icons/CopyIcon';
import { FollowUserIcon } from '../icons/FollowUserIcon';
import { TrophyIcon } from '../icons/TrophyIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { ChartPieIcon } from '../icons/ChartPieIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { toPersianDigits } from '../formatters';
import { publicProfileRecentTrades } from '../../data/marketData';
import TradeHistoryCard from '../TradeHistoryCard';
import SurfaceCard from '../layout/SurfaceCard';

/**
 * Props for the PublicProfilePage component.
 */
interface PublicProfilePageProps {
  /** The user object from the leaderboard to display. */
  user: LeaderboardUser;
  /** Callback function to navigate back to the previous view. */
  onBack: () => void;
  /** Boolean indicating if the current user is following this profile. */
  isFollowing: boolean;
  /** Callback function to toggle the follow state for the user. */
  onToggleFollow: (userId: number) => void;
}

// Mock data for the profile page
const userPortfolioData: PortfolioSlice[] = [
  { name: 'صندوق طلا عیار', value: 35, color: '#f59e0b' },
  { name: 'سهام خودرو', value: 25, color: '#ef4444' },
  { name: 'صندوق دارا', value: 20, color: '#7a96c2' },
  { name: 'سهام وبملت', value: 15, color: '#475569' },
  { name: 'متفرقه', value: 5, color: '#334155' },
];

/**
 * Props for the StatCard component.
 */
interface StatCardProps {
    /** The icon to be displayed in the card. */
    icon: React.ReactNode;
    /** The label describing the statistic. */
    label: string;
    /** The value of the statistic. */
    value: string;
}

/**
 * A small card component for displaying a key statistic with an icon.
 * Used on the public profile page to show metrics like followers, win rate, etc.
 * @param {StatCardProps} props - The component props.
 * @returns {JSX.Element} A styled statistic card.
 */
const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-white/5 bg-white/5 px-4 py-5 text-center text-white backdrop-blur-sm transition-shadow hover:shadow-xl hover:shadow-neo-green/10 sm:items-end sm:text-right">
        <div className="text-neo-green">{icon}</div>
        <p className="text-base font-bold text-white md:text-lg">{value}</p>
        <p className="text-xs text-gray-400 md:text-sm">{label}</p>
    </div>
);

/**
 * Renders a public-facing profile page for a user, typically a trader from the leaderboard.
 * This page showcases the user's performance statistics, portfolio composition, and recent trades.
 * It also allows the current user to follow/unfollow the profile and initiate a copy trade.
 *
 * @param {PublicProfilePageProps} props - The component props.
 * @returns {JSX.Element} The public profile page component.
 */
const PublicProfilePage: React.FC<PublicProfilePageProps> = ({ user, onBack, isFollowing, onToggleFollow }) => {

  const handleCopyTrade = () => {
    alert("ویژگی کپی تریدینگ برای کاربران ویژه فعال است. برای استفاده از این قابلیت, اشتراک خود را فعال کنید.");
  };

  const RankChangeIndicator: React.FC<{ change: 'up' | 'down' | 'stable' }> = ({ change }) => {
    if (change === 'up') return <ArrowUpIcon className="w-5 h-5 text-neo-green" />;
    if (change === 'down') return <ArrowDownIcon className="w-5 h-5 text-red-400" />;
    return <span className="w-5 h-5 text-gray-400 font-bold flex items-center justify-center">-</span>;
  };

  const formatTomanShort = (n: number): string => {
    if (n >= 1_000_000) {
        return toPersianDigits((n / 1_000_000).toFixed(1)) + ' M';
    }
    if (n >= 1_000) {
        return toPersianDigits(Math.round(n / 1_000)) + ' K';
    }
    return toPersianDigits(n);
  };

  const totalPortfolioValue = userPortfolioData.reduce((sum, slice) => sum + slice.value, 0);
  const safePortfolioTotal = totalPortfolioValue || 1;
  const formattedProfitPercentage = `${user.profit >= 0 ? '+' : ''}${toPersianDigits(user.profit)}%`;
  const favoriteAssetLabel = user.favoriteAsset
    ? `${user.favoriteAsset.icon} ${user.favoriteAsset.name}`
    : undefined;


  return (
    <div className="min-h-screen bg-neo-dark-1 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-14 pt-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 text-right">
          <div className="flex flex-col items-end gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">پروفایل {user.name}</h1>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-semibold text-gray-200">
              <TrophyIcon className="h-5 w-5 text-yellow-400" />
              <span>رتبه #{toPersianDigits(user.rank)}</span>
              <RankChangeIndicator change={user.rankChange} />
            </div>
          </div>
          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition hover:text-neo-green"
            aria-label="بازگشت"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-6 pb-4">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:grid-cols-[minmax(0,420px)_1fr]">
            <SurfaceCard tone="elevated" padding="lg" className="h-full">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-right lg:flex-col lg:items-end lg:text-right">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-neo-dark-1/60 shadow-lg shadow-black/40"
                />
                <div className="space-y-2 sm:flex-1 lg:w-full">
                  <div className="flex flex-col items-center gap-2 sm:items-end">
                    <h2 className="text-xl font-bold text-white md:text-2xl">{user.name}</h2>
                    <p className="text-sm font-semibold text-neo-green">سود کل: {toPersianDigits(user.profit)}%</p>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-400 lg:text-sm">
                    سرمایه‌گذار فعال با تمرکز بر دارایی‌های متنوع دیجیتال و بورسی. عملکرد هفته گذشته و نرخ برد بالا نشان می‌دهد که
                    استراتژی او همچنان پایدار است.
                  </p>
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
                <StatCard icon={<TrendingUpIcon className="h-6 w-6" />} label="سود هفته" value={formatTomanShort(user.weeklyProfitValue)} />
                <StatCard icon={<UsersIcon className="h-6 w-6" />} label="دنبال‌کنندگان" value={toPersianDigits(user.followers)} />
                <StatCard icon={<ChartPieIcon className="h-6 w-6" />} label="نرخ برد" value={`${toPersianDigits(user.winRate)}%`} />
                <StatCard icon={<ShieldCheckIcon className="h-6 w-6" />} label="سطح ریسک" value={user.risk} />
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={() => onToggleFollow(user.id)}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-green/70 sm:w-auto sm:min-w-[180px] ${
                    isFollowing
                      ? 'bg-white/5 text-gray-100 hover:bg-white/10'
                      : 'border border-neo-green/80 bg-transparent text-neo-green hover:bg-neo-green/10'
                  }`}
                >
                  <FollowUserIcon className="h-5 w-5" />
                  <span>{isFollowing ? 'دنبال می‌کنید' : 'دنبال کردن'}</span>
                </button>
                <button
                  onClick={handleCopyTrade}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neo-green px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-neo-green/20 transition hover:bg-lime-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-green/70 sm:w-auto sm:min-w-[180px]"
                >
                  <CopyIcon className="h-5 w-5" />
                  <span>کپی کردن معاملات</span>
                </button>
              </div>
            </SurfaceCard>

            <div className="flex flex-col gap-6">
              <SurfaceCard tone="muted" padding="lg" className="h-full">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-white md:text-xl">پرتفوی کلی</h2>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300 md:text-sm">تنوع دارایی</span>
                </div>
                <div className="mt-5 flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,220px)] lg:items-stretch">
                  <div className="flex items-center justify-center">
                    <Portfolio
                      data={userPortfolioData}
                      showCenterText
                      variant="highlight"
                      centerTitle="سود کل"
                      centerValue={formattedProfitPercentage}
                      centerSubtitle={favoriteAssetLabel ? `دارایی محبوب: ${favoriteAssetLabel}` : undefined}
                      centerValueTone={user.profit >= 0 ? 'positive' : 'negative'}
                    />
                  </div>
                  <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-right backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-semibold text-gray-300">دارایی محبوب تریدر</span>
                        <span className="text-sm font-bold text-white">{favoriteAssetLabel ?? 'نامشخص'}</span>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gray-200">{toPersianDigits(user.winRate)}% موفقیت</span>
                    </div>
                    <div className="space-y-3">
                      {userPortfolioData.map((slice) => {
                        const sliceShare = Math.round((slice.value / safePortfolioTotal) * 100);
                        return (
                          <div key={slice.name} className="flex items-center justify-between gap-3 rounded-xl bg-black/20 px-3 py-2">
                            <div className="flex items-center gap-3">
                              <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: slice.color }} aria-hidden="true" />
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-white">{slice.name}</span>
                                {slice.amount && <span className="text-xs text-gray-400">{slice.amount}</span>}
                              </div>
                            </div>
                            <span className="text-sm font-bold text-gray-200">{toPersianDigits(sliceShare)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SurfaceCard>

              <SurfaceCard tone="muted" padding="lg">
                <div className="flex flex-col gap-2 text-right">
                  <h2 className="text-lg font-bold text-white md:text-xl">آخرین معاملات</h2>
                  <p className="text-xs text-gray-400 md:text-sm">
                    ثبت دقیق معاملات اخیر به شما کمک می‌کند تا استراتژی تریدر را بهتر دنبال کنید و نقاط ورود و خروج را تشخیص دهید.
                  </p>
                </div>
                <div className="space-y-3 pt-2">
                  {publicProfileRecentTrades.map((trade) => (
                    <TradeHistoryCard key={trade.id} trade={trade} />
                  ))}
                </div>
              </SurfaceCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;