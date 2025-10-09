import React from 'react';
import { Trade } from '../types';
import { toPersianFormatted } from './formatters';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import AssetIcon, { deriveAssetSymbol } from './AssetIcon';

interface TradeHistoryCardProps {
    trade: Trade;
}

const TradeHistoryCard: React.FC<TradeHistoryCardProps> = ({ trade }) => {
    const isBuy = trade.type === 'buy';
    const totalValue = trade.amount * trade.pricePerUnit;

    return (
        <div className="bg-neo-dark-3 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <AssetIcon
                        icon={trade.asset.icon}
                        name={trade.asset.name}
                        symbol={deriveAssetSymbol(trade.asset.name)}
                        size="sm"
                    />
                    <div className="text-right">
                        <p className="font-bold text-white">{trade.asset.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <div className={`p-1 rounded-full ${isBuy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {isBuy ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                            </div>
                            <p className={`font-semibold text-sm ${isBuy ? 'text-green-400' : 'text-red-400'}`}>
                                {isBuy ? 'خرید' : 'فروش'}
                            </p>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 shrink-0">{trade.timestamp}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm pt-3 border-t border-gray-700/50">
                <div>
                    <p className="text-xs text-gray-400 mb-1">مقدار</p>
                    <p className="font-semibold text-white">{`${toPersianFormatted(trade.amount)} ${trade.unit}`}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-1">قیمت واحد</p>
                    <p className="font-semibold text-white">{`${toPersianFormatted(trade.pricePerUnit)} ${trade.currency}`}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-1">ارزش کل</p>
                    <p className="font-semibold text-white">{`${toPersianFormatted(totalValue)} ${trade.currency}`}</p>
                </div>
            </div>
        </div>
    );
};

export default TradeHistoryCard;
