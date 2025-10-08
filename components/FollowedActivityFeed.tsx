import React, { ReactNode } from 'react';
import { FollowedActivity, LeaderboardUser } from '../types';
import { leaderboardData } from '../data/marketData';
import { CopyIcon } from './icons/CopyIcon';
import { toPersianDigits } from './formatters';
import AssetIcon, { deriveAssetSymbol } from './AssetIcon';

/**
 * Props for the FollowedActivityFeed component.
 */
interface FollowedActivityFeedProps {
  /** An array of activity objects to be displayed in the feed. */
  activities: FollowedActivity[];
  /** Callback function triggered when the 'Copy Trade' button is clicked. */
  onCopyTrade: (activity: FollowedActivity) => void;
  /** Callback to navigate to the profile of the user who performed the activity. */
  onUserSelect: (user: LeaderboardUser) => void;
  /** Callback to navigate to the profile of the asset involved in the activity. */
  onAssetSelect: (assetId: string) => void;
  /** Optional title for the feed section. Defaults to 'فعالیت دنبال‌شوندگان'. */
  title?: string;
  /** Optional React node containing action elements like filter buttons for the header. */
  headerActions?: ReactNode;
  /** The message to display when the activities array is empty. */
  emptyMessage?: string;
}

/**
 * Renders a single card representing a user's activity (a trade or a new idea).
 * It displays user info, action details, and provides interaction buttons.
 * @param {object} props - The component props.
 * @param {FollowedActivity} props.activity - The activity data to display.
 * @param {function} props.onCopyTrade - Callback to copy the trade.
 * @param {function} props.onUserSelect - Callback to view the user's profile.
 * @param {function} props.onAssetSelect - Callback to view the asset's profile.
 * @returns {JSX.Element} A styled card for a single activity.
 */
const ActivityCard: React.FC<{
    activity: FollowedActivity;
    onCopyTrade: (activity: FollowedActivity) => void;
    onUserSelect: (user: LeaderboardUser) => void;
    onAssetSelect: (assetId: string) => void;
}> = ({ activity, onCopyTrade, onUserSelect, onAssetSelect }) => {

    const actionText = activity.type === 'trade_buy'
        ? 'خرید کرد'
        : activity.type === 'trade_sell'
        ? 'فروش کرد'
        : 'ایده جدید منتشر کرد';
    const actionColor = activity.type === 'trade_buy'
        ? 'text-neo-green'
        : activity.type === 'trade_sell'
        ? 'text-red-500'
        : 'text-blue-400';

    const handleUserClick = () => {
        const user = leaderboardData.find(u => u.id === activity.user.id);
        if (user) {
            onUserSelect(user);
        }
    };

    const isTrade = activity.type === 'trade_buy' || activity.type === 'trade_sell';
    const isIdea = activity.type === 'new_idea';

    return (
        <div className="bg-neo-dark-3 rounded-2xl p-4 w-72 sm:w-80 shrink-0 flex flex-col gap-3 text-right">
            <button onClick={handleUserClick} className="flex items-center gap-3 w-full text-right hover:bg-neo-dark-1/50 p-1 -m-1 rounded-lg transition-colors">
                <img src={activity.user.picture} alt={activity.user.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                    <p className="font-bold text-sm text-gray-100">{activity.user.name}</p>
                    <p className="text-xs text-gray-400">{toPersianDigits(activity.timestamp)}</p>
                </div>
            </button>
            
            <div className="my-2 text-center">
                <p className={`font-bold text-lg ${actionColor}`}>{actionText}</p>

                 {isTrade && activity.tradeAmount && activity.tradeUnit ? (
                    <div className="my-2">
                        <p className="font-bold text-white text-2xl">
                            {toPersianDigits(activity.tradeAmount.toLocaleString())}
                            <span className="text-lg font-medium text-gray-400 mr-1.5">{activity.tradeUnit}</span>
                        </p>
                        {activity.tradePrice && (
                             <div className="text-sm text-gray-400 mt-1 space-y-1">
                                <p>
                                    قیمت واحد:
                                    <span className="font-semibold text-gray-300 mx-1">
                                        {toPersianDigits(activity.tradePrice.toLocaleString())} {activity.tradePriceCurrency}
                                    </span>
                                </p>
                                <p>
                                    ارزش کل:
                                    <span className="font-semibold text-gray-300 mx-1">
                                        {toPersianDigits((activity.tradeAmount * activity.tradePrice).toLocaleString())} {activity.tradePriceCurrency}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                ): null}

                <button onClick={() => onAssetSelect(activity.asset.id)} className="flex items-center justify-center gap-2 mt-2 w-full hover:bg-neo-dark-1/50 p-2 rounded-lg transition-colors">
                    <AssetIcon
                        icon={activity.asset.icon}
                        name={activity.asset.name}
                        symbol={deriveAssetSymbol(activity.asset.name)}
                        size="sm"
                    />
                    <p className="font-semibold text-gray-200">{activity.asset.name}</p>
                </button>

                {isIdea && activity.details && (
                    <p className="mt-3 rounded-xl bg-neo-dark-1/60 p-3 text-sm leading-6 text-gray-300">
                        {activity.details}
                    </p>
                )}
            </div>

            {isTrade && (
                <button
                    onClick={() => onCopyTrade(activity)}
                    className="mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neo-green text-black font-semibold hover:bg-opacity-90 transition-colors shadow-lg shadow-neo-green/20"
                >
                    <CopyIcon className="w-5 h-5" />
                    <span>کپی کردن معامله</span>
                </button>
            )}
        </div>
    );
};

/**
 * A component that displays a horizontal, scrollable feed of activities from followed users.
 * It includes a title, optional header actions (like filters), and uses the `ActivityCard`
 * to render each individual activity.
 *
 * @param {FollowedActivityFeedProps} props - The component props.
 * @returns {JSX.Element} A section containing the activity feed.
 */
const FollowedActivityFeed: React.FC<FollowedActivityFeedProps> = ({
  activities,
  title = 'فعالیت دنبال‌شوندگان',
  headerActions,
  emptyMessage = 'فعلاً فعالیتی در این دسته وجود ندارد.',
  ...props
}) => {
  const hasActivities = activities.length > 0;

  return (
    <div>
        <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-right text-white">{title}</h2>
            {headerActions}
        </div>
        {hasActivities ? (
            <div className="flex w-full gap-4 overflow-x-auto scrollbar-hide flex-nowrap pb-2 -mx-4 px-4">
                {activities.map(activity => (
                    <ActivityCard key={activity.id} activity={activity} {...props} />
                ))}
            </div>
        ) : (
            <div className="rounded-2xl border border-gray-800/60 bg-neo-dark-3/60 p-6 text-center text-sm text-gray-400">
                {emptyMessage}
            </div>
        )}
    </div>
  );
};

export default FollowedActivityFeed;