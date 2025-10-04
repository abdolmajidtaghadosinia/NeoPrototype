

import React from 'react';
import { User, LoanStatus } from '../types';
import { toPersianDigits } from './formatters';

const formatToman = (n: number): string => {
    if (n >= 1_000_000_000) {
        return `${toPersianDigits((n / 1_000_000_000).toFixed(1))} میلیارد`;
    }
    if (n >= 1_000_000) {
        return `${toPersianDigits((n / 1_000_000).toFixed(0))} میلیون`;
    }
    return toPersianDigits(n.toLocaleString('fa-IR'));
};

/**
 * A card component that displays the status of a single financial loan.
 * It shows the loan name, interest rate, payment progress, and key details
 * like remaining amount and next payment date.
 *
 * @param {object} props - The component props.
 * @param {LoanStatus} props.loan - The loan status object to display.
 * @returns {JSX.Element} A styled card for displaying loan status.
 */
const LoanStatusCard: React.FC<{ loan: LoanStatus }> = ({ loan }) => {
    const progress = Math.min((loan.paidAmount / loan.totalAmount) * 100, 100);
    const remainingAmount = loan.totalAmount - loan.paidAmount;

    return (
        <div className="bg-neo-dark-2 rounded-xl p-4 w-80 shrink-0 flex flex-col gap-3 text-right">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{loan.icon}</span>
                    <h4 className="font-bold text-white">{loan.name}</h4>
                </div>
                <span className="text-xs font-semibold bg-neo-dark-3 text-gray-300 px-2 py-1 rounded-md">
                    {toPersianDigits(loan.interestRate)}٪ سود
                </span>
            </div>
            
            <div className="w-full bg-neo-dark-3 rounded-full h-2.5">
                <div className="bg-neo-green h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-xs text-gray-300 flex justify-between">
                <span>پرداخت شده: {formatToman(loan.paidAmount)}</span>
                <span className="font-semibold">کل: {formatToman(loan.totalAmount)}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-2 border-t border-gray-700/50 pt-3">
                <div className="text-gray-400">مبلغ باقیمانده:</div>
                <div className="font-bold text-white text-left">{formatToman(remainingAmount)} تومان</div>
                
                <div className="text-gray-400">مبلغ هر قسط:</div>
                <div className="font-bold text-white text-left">{formatToman(loan.installmentAmount)} تومان</div>

                <div className="text-gray-400">اقساط باقیمانده:</div>
                <div className="font-bold text-white text-left">{toPersianDigits(loan.remainingInstallments)} قسط</div>
                
                <div className="text-gray-400">سررسید قسط بعدی:</div>
                <div className="font-bold text-white text-left">{toPersianDigits(loan.nextPaymentDate)}</div>
            </div>

            <button
              className="mt-auto w-full text-center py-2.5 bg-neo-green text-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
            >
                پرداخت قسط
            </button>
        </div>
    );
};

/**
 * Props for the FinancialHealthSection component.
 */
interface FinancialHealthSectionProps {
  /** The user object, which contains a list of their active loans. */
  user: User;
}

/**
 * A section component that displays a user's active loans in a horizontally scrollable list.
 * It uses the `LoanStatusCard` for each loan. If the user has no active loans,
 * it displays a message indicating so.
 *
 * @param {FinancialHealthSectionProps} props - The component props.
 * @returns {JSX.Element} A section displaying the user's loan information.
 */
const FinancialHealthSection: React.FC<FinancialHealthSectionProps> = ({ user }) => {

    return (
        <div className="space-y-6">
            <div>
                 <h3 className="text-lg font-bold text-right mb-2 text-white px-1">وام های شما</h3>
                 <div className="flex w-full gap-3 overflow-x-auto scrollbar-hide flex-nowrap pb-2 -mx-4 px-4">
                    {user.loans && user.loans.length > 0 ? (
                        user.loans.map(loan => <LoanStatusCard key={loan.id} loan={loan} />)
                    ) : (
                        <div className="bg-neo-dark-2 rounded-xl p-4 w-full text-center">
                            <p className="text-gray-400">شما در حال حاضر وام فعالی ندارید.</p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default FinancialHealthSection;