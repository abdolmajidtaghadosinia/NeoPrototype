
import React, { useState, memo } from 'react';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import AssetCategoryDetails from './AssetCategoryDetails';
import { toPersianDigits } from './formatters';
import { PortfolioSlice } from '../types';

/**
 * Represents a categorized group of assets within a user's portfolio.
 */
export interface AssetCategory {
  /** The name of the category (e.g., "سهام", "رمز ارز"). */
  name: string;
  /** The total monetary value of all assets within this category. */
  value: number;
  /** The percentage this category represents of the total portfolio value. */
  percentage: number;
  /** A hex color code associated with the category for UI elements. */
  color: string;
  /** An optional string describing when the category data was last updated. */
  lastUpdated?: string;
  /** An array of individual assets belonging to this category. */
  assets: PortfolioSlice[];
}

/**
 * Props for the AssetCategories component.
 */
interface AssetCategoriesProps {
  /** The total value of the entire portfolio. */
  totalValue: number;
  /** An array of asset categories to be displayed. */
  categories: AssetCategory[];
}

const formatRial = (n: number): string => {
    return toPersianDigits(n.toLocaleString('fa-IR'));
};

/**
 * A component that displays a summary of portfolio assets grouped by category.
 * It features a total value display with a visibility toggle, a composite progress bar
 * showing the portfolio's allocation, and an expandable list of categories,
 * each revealing its constituent assets when opened.
 *
 * @param {AssetCategoriesProps} props - The component props.
 * @returns {JSX.Element} A card displaying the categorized portfolio breakdown.
 */
const AssetCategories: React.FC<AssetCategoriesProps> = ({ totalValue, categories }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="bg-neo-dark-2 text-white rounded-2xl p-4 shadow-lg my-4 font-sans">
      <div className="flex justify-between items-start mb-3">
        <div className="text-right">
          <p className="text-sm text-gray-400">ارزش کل دارایی شما</p>
          <p className="text-3xl font-bold mt-1">
            {isVisible ? (
              <>
                {formatRial(totalValue)}
                <span className="text-base font-medium text-gray-400 mr-1">ریال</span>
              </>
            ) : (
              '••••••••••'
            )}
          </p>
        </div>
        <button onClick={() => setIsVisible(!isVisible)} className="text-gray-400 hover:text-white p-1">
          {isVisible ? <EyeIcon className="w-6 h-6" /> : <EyeSlashIcon className="w-6 h-6" />}
        </button>
      </div>

      <div className="w-full bg-neo-dark-3 rounded-full h-2.5 flex overflow-hidden mb-6">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="h-full"
            style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
            title={`${cat.name}: ${cat.percentage}%`}
          />
        ))}
      </div>

      <div className="space-y-3">
        {categories.map((cat, index) => (
          <div key={index}>
            <button
              className="w-full flex items-center justify-between text-right p-3 rounded-xl bg-neo-dark-3 hover:bg-neo-dark-1/50 transition-colors"
              onClick={() => toggle(index)}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-white text-sm font-bold h-10 w-10 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: cat.color }}
                >
                  {toPersianDigits(cat.percentage)}%
                </span>
                <div>
                    <p className="font-bold text-white text-base">{cat.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{cat.lastUpdated || 'بروزرسانی امروز'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <div className="text-left">
                   <p className="font-semibold text-white">
                      {isVisible ? formatRial(cat.value) : '••••••'}
                   </p>
                   <p className="text-xs text-gray-400">ریال</p>
                 </div>
                 <ChevronLeftIcon className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-90' : ''}`} />
              </div>

            </button>
            {openIndex === index && <AssetCategoryDetails category={cat} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(AssetCategories);
