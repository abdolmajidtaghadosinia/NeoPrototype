

import React, { useState } from 'react';
import { FinancialGoal } from '../types';
import { toEnglishDigits, toPersianFormatted } from './formatters';

/**
 * Props for the GoalSettingModal component.
 */
interface GoalSettingModalProps {
  /** Callback function to close the modal. */
  onClose: () => void;
  /**
   * Callback function to save the goal (either new or edited).
   * @param {FinancialGoal} goal - The goal object to be saved.
   */
  onSave: (goal: FinancialGoal) => void;
  /** If provided, the modal will be in 'edit' mode for this goal. Otherwise, it's in 'create' mode. */
  goal?: FinancialGoal;
}

/**
 * A modal component for creating or editing a financial goal.
 * It provides a form for the user to input the goal's name, icon, target amount,
 * and an optional deadline. The modal handles both creation and editing states.
 *
 * @param {GoalSettingModalProps} props - The component props.
 * @returns {JSX.Element} A modal dialog for setting a financial goal.
 */
const GoalSettingModal: React.FC<GoalSettingModalProps> = ({ goal, onClose, onSave }) => {
  const [name, setName] = useState(goal?.name || '');
  const [icon, setIcon] = useState(goal?.icon || '💰');
  const [targetAmount, setTargetAmount] = useState<string>(goal?.targetAmount.toString() || '');
  const [deadline, setDeadline] = useState(goal?.deadline || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericTarget = parseFloat(toEnglishDigits(targetAmount));
    if (!name || isNaN(numericTarget) || numericTarget <= 0) {
      alert('لطفا نام و مبلغ هدف را به درستی وارد کنید.');
      return;
    }
    onSave({
      id: goal?.id || '', // App component will generate ID for new goals
      name,
      icon,
      targetAmount: numericTarget,
      currentAmount: goal?.currentAmount || 0,
      deadline,
      recurringDeposit: goal?.recurringDeposit, // Preserve existing recurring deposit settings
    });
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
        <h2 className="text-xl font-bold text-white mb-6">
          {goal ? 'ویرایش هدف' : 'ایجاد هدف جدید'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="goal-name" className="block text-sm font-semibold text-gray-400 mb-2">نام هدف</label>
            <input
              id="goal-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="مثلا: خرید خانه"
              className="w-full p-3 bg-neo-dark-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neo-green text-white placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-4">
              <div className="flex-grow">
                <label htmlFor="target-amount" className="block text-sm font-semibold text-gray-400 mb-2">مبلغ هدف (تومان)</label>
                 <input
                  id="target-amount"
                  type="text"
                  value={targetAmount ? toPersianFormatted(targetAmount) : ''}
                  onChange={e => setTargetAmount(toEnglishDigits(e.target.value.replace(/،/g, '')))}
                  placeholder="مثلا: ۵۰۰،۰۰۰،۰۰۰"
                  className="w-full p-3 bg-neo-dark-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neo-green text-left text-white placeholder:text-gray-500"
                  style={{direction: 'ltr'}}
                />
              </div>
               <div>
                <label htmlFor="goal-icon" className="block text-sm font-semibold text-gray-400 mb-2">آیکون</label>
                <input
                  id="goal-icon"
                  type="text"
                  value={icon}
                  onChange={e => setIcon(e.target.value)}
                  maxLength={2}
                  className="w-20 p-3 bg-neo-dark-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neo-green text-center text-2xl text-white"
                />
              </div>
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-semibold text-gray-400 mb-2">تاریخ سررسید (اختیاری)</label>
            <input
              id="deadline"
              type="text"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              placeholder="مثلا: ۱۴۰۵/۱۲/۲۹"
              className="w-full p-3 bg-neo-dark-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neo-green text-white placeholder:text-gray-500"
              style={{direction: 'ltr', textAlign: 'right'}}
            />
          </div>

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
              ذخیره هدف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalSettingModal;