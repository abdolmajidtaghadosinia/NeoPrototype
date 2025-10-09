import React, { memo } from 'react';
import type { AssetCategory } from './AssetCategories';
import { toPersianDigits } from './formatters';
import AssetIcon, { deriveAssetSymbol } from './AssetIcon';

/**
 * Renders a detailed view of a single asset category, displaying its constituent assets.
 * This component is typically shown when a user expands a category in the `AssetCategories` list.
 * It calculates and displays the total daily profit/loss for the category and lists each asset
 * with its value and daily change.
 *
 * @param {object} props - The component props.
 * @param {AssetCategory} props.category - The asset category object containing details and a list of assets.
 * @returns {JSX.Element} A styled card containing the detailed asset breakdown.
 */
const AssetCategoryDetails: React.FC<{ category: AssetCategory }> = ({ category }) => {
  const totalPercent = category.assets.reduce((sum, a) => sum + a.value, 0);
  const categoryProfit = category.assets.reduce((sum, a) => {
    const share = a.value / totalPercent;
    const assetValue = category.value * share;
    return sum + (a.dailyChange ? (assetValue * a.dailyChange) / 100 : 0);
  }, 0);

  return (
    <div className="bg-neo-dark-3 rounded-2xl p-4 mt-4 text-white" aria-labelledby="category-details-title">
      <h3 id="category-details-title" className="text-lg font-bold mb-4">{category.name}</h3>
      <p className={`text-sm font-semibold mb-4 ${categoryProfit >= 0 ? 'text-neo-green' : 'text-red-500'}`}>
        {categoryProfit >= 0 ? 'سود امروز' : 'ضرر امروز'}:
        {' '}
        {toPersianDigits(Math.abs(Math.round(categoryProfit)).toLocaleString('fa-IR'))} ریال
      </p>
      <ul className="space-y-3">
        {category.assets.map((asset, idx) => {
          const share = asset.value / totalPercent;
          const assetValue = category.value * share;
          const profit = asset.dailyChange ? (assetValue * asset.dailyChange) / 100 : 0;
          return (
            <li key={idx} className="flex items-center justify-between p-3 rounded-xl bg-neo-dark-2">
              <div className="flex items-center gap-2">
                <AssetIcon
                  icon={asset.icon}
                  name={asset.name}
                  symbol={deriveAssetSymbol(asset.name)}
                  size="xs"
                />
                <div>
                  <p className="font-semibold">{asset.name}</p>
                  {asset.amount && <p className="text-xs text-gray-400 mt-0.5">{asset.amount}</p>}
                </div>
              </div>
              <div className="text-left">
                <p className="font-semibold">
                  {toPersianDigits(Math.round(assetValue).toLocaleString('fa-IR'))}
                  <span className="text-xs text-gray-400 mr-1">ریال</span>
                </p>
                <p className={`text-xs font-bold ${profit >= 0 ? 'text-neo-green' : 'text-red-500'}`}>
                  {profit >= 0 ? '+' : '-'}
                  {toPersianDigits(Math.abs(Math.round(profit)).toLocaleString('fa-IR'))} ریال
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(AssetCategoryDetails);
