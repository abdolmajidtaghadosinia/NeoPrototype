
import React from 'react';
import { TradingIdea, MarketAsset } from '../types';
import { ThumbUpIcon } from './icons/ThumbUpIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { toPersianDigits } from './formatters';
import { ThumbUpSolidIcon } from './icons/ThumbUpSolidIcon';
import AssetIcon, { deriveAssetSymbol } from './AssetIcon';

interface TradingIdeasSectionProps {
  ideas: TradingIdea[];
  onIdeaClick: (idea: TradingIdea) => void;
  onLikeClick: (ideaId: string) => void;
  showTitle?: boolean;
  showDescription?: boolean;
}

const getAssetVariant = (
  category?: MarketAsset['category'],
): NonNullable<React.ComponentProps<typeof AssetIcon>['variant']> => {
  switch (category) {
    case 'بورس':
      return 'stock';
    case 'صندوق‌ها':
      return 'fund';
    case 'ارزها':
      return 'currency';
    case 'کالا':
      return 'commodity';
    default:
      return 'default';
  }
};

const IdeaCard: React.FC<{ idea: TradingIdea; onIdeaClick: () => void; onLikeClick: (e: React.MouseEvent) => void; showDescription: boolean }> = ({ idea, onIdeaClick, onLikeClick, showDescription }) => {
  const isBullish = idea.type === 'bullish';
  return (
    <div
      onClick={onIdeaClick}
      className="bg-neo-dark-3 rounded-2xl p-4 w-72 shrink-0 flex flex-col gap-3 text-right transition-all duration-200 hover:bg-opacity-80 hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <img src={idea.user.picture} alt={idea.user.name} className="w-10 h-10 rounded-full object-cover" />
        <p className="font-bold text-sm text-gray-100">{idea.user.name}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <AssetIcon
              icon={idea.asset.icon}
              name={idea.asset.name}
              symbol={deriveAssetSymbol(idea.asset.name)}
              size="xs"
              variant={idea.asset.category ? getAssetVariant(idea.asset.category as MarketAsset['category']) : 'default'}
            />
            <p className="font-semibold text-gray-200">{idea.asset.name}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${isBullish ? 'bg-neo-green/20 text-neo-green' : 'bg-red-500/20 text-red-400'}`}>
          {isBullish ? '▲ صعودی' : '▼ نزولی'}
        </span>
      </div>

      <div className={!showDescription ? 'mt-auto' : ''}>
        <h4 className="font-bold text-white mb-1 truncate">{idea.title}</h4>
        {showDescription && (
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{idea.description}</p>
        )}
      </div>

      <div className="mt-auto flex items-center gap-4 text-sm text-gray-500">
         <button onClick={onLikeClick} className="flex items-center gap-1.5 hover:text-white transition-colors p-1 -m-1">
            {idea.userHasLiked ? <ThumbUpSolidIcon className="w-5 h-5 text-neo-green"/> : <ThumbUpIcon className="w-5 h-5"/>}
            <span className="font-semibold">{toPersianDigits(idea.likes)}</span>
         </button>
         <div className="flex items-center gap-1">
            <ChatBubbleIcon className="w-5 h-5"/>
            <span className="font-semibold">{toPersianDigits(idea.comments)}</span>
         </div>
      </div>
    </div>
  );
};


const TradingIdeasSection: React.FC<TradingIdeasSectionProps> = ({ ideas, onIdeaClick, onLikeClick, showTitle = true, showDescription = true }) => {
  return (
    <div>
        {showTitle && <h2 className="text-xl font-bold text-right mb-4 px-1 text-white">ایده‌های معاملاتی</h2>}
        <div className="flex w-full gap-4 overflow-x-auto scrollbar-hide flex-nowrap pb-2 -mx-4 px-4">
            {ideas.map(idea => (
                <IdeaCard 
                  key={idea.id} 
                  idea={idea} 
                  onIdeaClick={() => onIdeaClick(idea)} 
                  onLikeClick={(e) => {
                    e.stopPropagation(); // Prevent card click when liking
                    onLikeClick(idea.id);
                  }}
                  showDescription={showDescription} 
                />
            ))}
        </div>
    </div>
  );
};

export default TradingIdeasSection;