import React, { useState } from 'react';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { PortfolioSlice } from '../../types';
import { toPersianDigits } from '../formatters';

/**
 * Props for the QuickSellPage component.
 */
interface QuickSellPageProps {
  /** The portfolio asset to be sold. */
  asset: PortfolioSlice;
  /** Callback function to navigate back to the previous view. */
  onBack: () => void;
}

/**
 * Renders a dedicated page for quickly selling a specified asset from the user's portfolio.
 * This component provides a simple interface for the user to enter the sell amount
 * and confirm the transaction.
 *
 * @param {QuickSellPageProps} props - The component props.
 * @returns {JSX.Element} The quick sell page component.
 */
const QuickSellPage: React.FC<QuickSellPageProps> = ({ asset, onBack }) => {
  const [amount, setAmount] = useState('');

  const handleSell = () => {
    if (!amount.trim()) {
      alert('لطفا مقدار فروش را وارد کنید.');
      return;
    }
    alert(`فروش ${asset.name} به مبلغ ${toPersianDigits(amount)} ریال با موفقیت ثبت شد.`);
  };

  return (
    <div className="pt-4 h-screen flex flex-col">
      <header className="flex items-center justify-between mb-6 px-0">
         <div className="w-8"></div>
         <h1 className="text-2xl font-bold text-gray-800">فروش سریع</h1>
        <button onClick={onBack} className="p-2 text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon className="w-7 h-7" />
        </button>
      </header>

      <div className="p-4 bg-white rounded-xl shadow-sm mb-6 flex items-center gap-4">
        <div className="text-3xl">{asset.icon || '💵'}</div>
        <div className="text-right">
            <p className="font-bold text-lg text-gray-800">{asset.name}</p>
            <p className="text-gray-500">موجودی شما: {asset.amount}</p>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="amount" className="block text-right text-lg font-semibold text-gray-700 mb-2">مبلغ فروش</label>
        <div className="relative">
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="مثلا ۵۰۰,۰۰۰"
            className="w-full text-left appearance-none p-4 pr-16 bg-white border-2 border-gray-200 rounded-xl text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-red-400"
            style={{direction: 'ltr'}}
          />
          <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 text-lg font-semibold">ریال</span>
        </div>
      </div>
      
      <div className="mt-auto pb-4">
        <button 
          onClick={handleSell}
          className="w-full bg-red-500 text-white font-bold text-lg p-4 rounded-xl hover:bg-red-600 transition-colors disabled:bg-gray-300"
          disabled={!amount.trim()}
        >
          فروش
        </button>
      </div>
    </div>
  );
};

export default QuickSellPage;
