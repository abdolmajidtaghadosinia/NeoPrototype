
import React, { memo } from 'react';
import { LeaderboardUser } from '../types';
import { FollowUserIcon } from './icons/FollowUserIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { ClockIcon } from './icons/ClockIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { toPersianDigits } from './formatters';
import AssetIcon, { deriveAssetSymbol } from './AssetIcon';

const formatToman = (n: number): string => {
    return toPersianDigits(n.toLocaleString('fa-IR'));
};

/**
 * Displays a directional arrow (up, down, or stable) to indicate a user's rank change.
 * @param {object} props - The component props.
 * @param {'up' | 'down' | 'stable'} props.change - The direction of the rank change.
 * @returns {JSX.Element} An icon representing the rank change.
 */
const RankChangeIndicator: React.FC<{ change: 'up' | 'down' | 'stable' }> = ({ change }) => {
    if (change === 'up') return <ArrowUpIcon className="w-4 h-4 text-neo-green" />;
    if (change === 'down') return <ArrowDownIcon className="w-4 h-4 text-red-400" />;
    return <span className="w-4 h-4 text-gray-400 font-bold flex items-center justify-center">-</span>;
};

/**
 * Renders a user's profile for the top 3 positions on the leaderboard podium.
 * It applies special styling for the first, second, and third ranks.
 * @param {object} props - The component props.
 * @param {LeaderboardUser} props.user - The user data to display.
 * @param {number} props.rank - The user's rank (1, 2, or 3).
 * @param {() => void} props.onClick - Callback function triggered when the user is clicked.
 * @returns {JSX.Element} A styled podium user component.
 */
const PodiumUser: React.FC<{ user: LeaderboardUser; rank: number; onClick: () => void }> = memo(({ user, rank, onClick }) => {
    const isFirst = rank === 1;
    const podiumHeight = isFirst ? 'h-32' : 'h-24';
    const imageSize = isFirst ? 'w-24 h-24' : 'w-20 h-20';
    const medalColor = isFirst ? 'text-neo-green' : rank === 2 ? 'text-gray-400' : 'text-yellow-600';

    return (
        <div className="flex flex-col items-center">
            <button onClick={onClick} className="relative mb-2 group">
                <img src={user.picture} alt={user.name} className={`${imageSize} rounded-full object-cover border-4 border-neo-dark-3 shadow-lg group-hover:ring-4 group-hover:ring-neo-green/50 transition-all`} />
                <div className="absolute -bottom-2 -right-1">
                    <TrophyIcon className={`w-8 h-8 ${medalColor}`} />
                </div>
            </button>
            <p className="font-bold text-white text-sm mt-1">{user.name}</p>
            <p className="font-semibold text-neo-green text-xs">{toPersianDigits(user.profit)}%+</p>
            <div className={`w-20 ${podiumHeight} bg-black/20 rounded-t-lg shadow-inner flex items-center justify-center`}>
                <span className="text-4xl font-bold text-gray-700">{toPersianDigits(rank)}</span>
            </div>
        </div>
    );
});

interface LeaderboardProps {
    users: LeaderboardUser[];
    onUserClick: (user: LeaderboardUser) => void;
    followedUserIds: number[];
    onToggleFollow: (userId: number) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, onUserClick, followedUserIds, onToggleFollow }) => {
    const topThree = users.filter(u => u.rank <= 3).sort((a, b) => a.rank - b.rank);
    const others = users.filter(u => u.rank > 3).sort((a, b) => a.rank - b.rank);
    
    const first = topThree.find(u => u.rank === 1);
    const second = topThree.find(u => u.rank === 2);
    const third = topThree.find(u => u.rank === 3);

    const prizes = [
        { rank: 1, amount: '۱۰,۰۰۰,۰۰۰' },
        { rank: 2, amount: '۵,۰۰۰,۰۰۰' },
        { rank: 3, amount: '۲,۵۰۰,۰۰۰' },
    ];

    return (
        <div className="bg-neo-dark-2 rounded-2xl p-4 overflow-hidden text-white">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">لیگ هفتگی رایا</h2>
                <div className="flex items-center justify-center gap-2 text-gray-300 mt-1">
                    <ClockIcon className="w-5 h-5" />
                    <span className="font-semibold">زمان باقی‌مانده: {toPersianDigits('۳ روز و ۱۲ ساعت')}</span>
                </div>
            </div>

            {/* Podium */}
            {topThree.length === 3 && (
                <div className="flex justify-center items-end gap-4 mb-6">
                    {second && <PodiumUser user={second} rank={2} onClick={() => onUserClick(second)} />}
                    {first && <PodiumUser user={first} rank={1} onClick={() => onUserClick(first)} />}
                    {third && <PodiumUser user={third} rank={3} onClick={() => onUserClick(third)} />}
                </div>
            )}
            
            {/* Prizes */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 mb-6">
                 <h3 className="font-bold text-center text-neo-green mb-3">جوایز این هفته</h3>
                 <div className="flex justify-around">
                     {prizes.map(prize => (
                         <div key={prize.rank} className="text-center">
                             <p className="font-bold text-sm text-gray-300">رتبه {toPersianDigits(prize.rank)}</p>
                             <p className="font-extrabold text-base text-white">{toPersianDigits(prize.amount)} <span className="text-xs">تومان</span></p>
                         </div>
                     ))}
                 </div>
            </div>

            {/* Others List */}
            <div className="space-y-2">
                {others.map((user) => {
                    const isFollowing = followedUserIds.includes(user.id);
                    return (
                        <div
                            key={user.id}
                            className="w-full flex items-center p-2 rounded-lg bg-neo-dark-3 hover:bg-neo-dark-3/50 transition-colors focus:outline-none focus:ring-2 focus:ring-neo-green/50"
                        >
                            <button
                                onClick={() => onUserClick(user)}
                                className="flex items-center gap-3 flex-1 text-right text-left"
                            >
                                <span className="font-bold text-gray-500 text-lg w-6 text-center">#{toPersianDigits(user.rank)}</span>
                                <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                <div className="text-right">
                                    <p className="font-bold text-white text-sm">{user.name}</p>
                                    <p className="text-xs text-white/70">
                                      سود هفته: <span className="font-semibold">{formatToman(user.weeklyProfitValue)} تومان</span>
                                    </p>
                                </div>
                            </button>
                            <div className="flex items-center gap-4 text-sm mr-4">
                                <div className="flex items-center gap-1">
                                    <AssetIcon
                                        icon={user.favoriteAsset.icon}
                                        name={user.favoriteAsset.name}
                                        symbol={deriveAssetSymbol(user.favoriteAsset.name)}
                                        size="xs"
                                    />
                                    <span className="text-white/80 font-medium hidden sm:inline">{user.favoriteAsset.name}</span>
                                </div>
                                <div className="font-bold text-neo-green">{toPersianDigits(user.profit)}%</div>
                                <RankChangeIndicator change={user.rankChange} />
                            </div>
                            <button
                                onClick={() => onToggleFollow(user.id)}
                                className={`ml-3 px-3 py-1 rounded-lg text-xs flex items-center gap-1 ${isFollowing ? 'bg-neo-green text-black' : 'bg-neo-dark-1 text-neo-green border border-neo-green'}`}
                            >
                                <FollowUserIcon className="w-4 h-4" />
                                {isFollowing ? 'دنبال می‌کنید' : 'دنبال'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default memo(Leaderboard);