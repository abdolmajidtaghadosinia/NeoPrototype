

import React, { useState } from 'react';
import { FinancialGoal } from '../types';
import { toEnglishDigits, toPersianFormatted } from './formatters';

/**
 * Props for the DepositToGoalModal component.
 */
interface DepositToGoalModalProps {
  /** Callback function to close the modal. */
  onClose: () => void;
  /**
   * Callback for saving a one-time deposit.
   * @param {string} goalId - The ID of the goal being deposited to.
   * @param {number} amount - The amount of the one-time deposit.
   */
  onSave: (goalId: string, amount: number) => void;
  /**
   * Callback for saving or updating a recurring deposit.
   * @param {string} goalId - The ID of the goal.
   * @param {object} recurringInfo - The details of the recurring deposit.
   * @param {number} recurringInfo.amount - The recurring deposit amount.
   * @param {'weekly' | 'monthly'} recurringInfo.frequency - The frequency of the deposit.
   */
  onSaveRecurring: (goalId: string, recurringInfo: { amount: number; frequency: 'weekly' | 'monthly' }) => void;
  /** The financial goal object to which the deposit is being made. */
  goal: FinancialGoal;
}

/**
 * A modal component for adding funds to a financial goal.
 * It supports two modes: a one-time deposit and setting up a recurring deposit.
 * The component manages its own form state and validates user input before submission.
 *
 * @param {DepositToGoalModalProps} props - The component props.
 * @returns {JSX.Element} A modal dialog for depositing to a financial goal.
 */
const DepositToGoalModal: React.FC<DepositToGoalModalProps> = ({ onClose, onSave, onSaveRecurring, goal }) => {
  const [depositType, setDepositType] = useState<'once' | 'recurring'>('once');
  const [oneTimeAmount, setOneTimeAmount] = useState<string>('');
  const [recurringAmount, setRecurringAmount] = useState<string>(goal.recurringDeposit?.amount.toString() || '');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>(goal.recurringDeposit?.frequency || 'monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositType === 'once') {
      const numericAmount = parseFloat(toEnglishDigits(oneTimeAmount));
      if (isNaN(numericAmount) || numericAmount <= 0) {
        alert('لطفا مبلغ واریز را به درستی وارد کنید.');
        return;
      }
      onSave(goal.id, numericAmount);
    } else { // recurring
      const numericAmount = parseFloat(toEnglishDigits(recurringAmount));
      if (isNaN(numericAmount) || numericAmount <= 0) {
        alert('لطفا مبلغ واریز دوره‌ای را به درستی وارد کنید.');
        return;
      }
      onSaveRecurring(goal.id, { amount: numericAmount, frequency });
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-neo-dark-2 rounded-2xl p-6 w-full max-w-md shadow-xl text-right"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-1">واریز به هدف</h2>
        <p className="text-gray-300 mb-6">شما در حال واریز به هدف <span className="font-bold">"{goal.name}"</span> هستید.</p>
        
        <div className="flex items-center bg-neo-dark-3 rounded-xl p-1 mb-4">
            <button onClick={() => setDepositType('recurring')} className={`w-full py-2.5 text-sm font-bold rounded-lg transition-colors ${depositType === 'recurring' ? 'bg-neo-dark-1 text-white shadow' : 'text-gray-400'}`}>
                واریز دوره‌ای
            </button>
            <button onClick={() => setDepositType('once')} className={`w-full py-2.5 text-sm font-bold rounded-lg transition-colors ${depositType === 'once' ? 'bg-neo-dark-1 text-white shadow' : 'text-gray-400'}`}>
                واریز یکباره
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {depositType === 'once' ? (
              <div>
                <label htmlFor="deposit-amount" className="block text-sm font-semibold text-gray-400 mb-2">مبلغ واریز (تومان)</label>
                <input
                  id="deposit-amount"
                  type="text"
                  value={toPersianFormatted(oneTimeAmount)}
                  onChange={e => setOneTimeAmount(toEnglishDigits(e.target.value.replace(/،/g, '')))}
                  placeholder="مثلا: ۵۰۰،۰۰۰"
                  className="w-full p-3 bg-neo-dark-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neo-green text-left text-lg font-bold text-white placeholder:text-gray-500"
                  style={{direction: 'ltr'}}
                  autoFocus
                />
              </div>
          ) : (
             <div className="space-y-4">
                <div>
                    <label htmlFor="recurring-amount" className="block text-sm font-semibold text-gray-400 mb-2">مبلغ واریز دوره‌ای (تومان)</label>
                    <input
                      id="recurring-amount"
                      type="text"
                      value={toPersianFormatted(recurringAmount)}
                      onChange={e => setRecurringAmount(toEnglishDigits(e.target.value.replace(/،/g, '')))}
                      placeholder="مثلا: ۱،۰۰۰،۰۰۰"
                      className="w-full p-3 bg-neo-dark-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neo-green text-left text-lg font-bold text-white placeholder:text-gray-500"
                      style={{direction: 'ltr'}}
                      autoFocus
                    />
                </div>
                 <div>
                    <label htmlFor="frequency" className="block text-sm font-semibold text-gray-400 mb-2">دوره تناوب</label>
                    <select
                        id="frequency"
                        value={frequency}
                        onChange={e => setFrequency(e.target.value as 'weekly' | 'monthly')}
                        className="w-full p-3 bg-neo-dark-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neo-green text-white"
                    >
                        <option value="monthly">ماهانه</option>
                        <option value="weekly">هفتگی</option>
                    </select>
                 </div>
             </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 bg-neo-dark-3 text-gray-200 font-bold rounded-lg hover:bg-opacity-80 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 bg-neo-green text-black font-bold rounded-lg hover:bg-opacity-90 transition-colors"
            >
              {depositType === 'once' ? 'واریز' : 'ذخیره'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositToGoalModal;