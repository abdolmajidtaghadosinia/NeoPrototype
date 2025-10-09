import React from 'react';
import { User, LoanStatus } from '../types';
import { toPersianDigits } from './formatters';
import SurfaceCard from './layout/SurfaceCard';
import { composeSurfaceClasses, metricDescription, metricTitle } from './designSystem';

const formatToman = (n: number): string => {
  if (n >= 1_000_000_000) {
    return `${toPersianDigits((n / 1_000_000_000).toFixed(1))} میلیارد`;
  }
  if (n >= 1_000_000) {
    return `${toPersianDigits((n / 1_000_000).toFixed(0))} میلیون`;
  }
  return toPersianDigits(n.toLocaleString('fa-IR'));
};

interface LoanStatusCardProps {
  loan: LoanStatus;
}

const LoanStatusCard: React.FC<LoanStatusCardProps> = ({ loan }) => {
  const progress = Math.min((loan.paidAmount / loan.totalAmount) * 100, 100);
  const remainingAmount = loan.totalAmount - loan.paidAmount;

  return (
    <div
      className={composeSurfaceClasses(
        'ghost',
        'md',
        'w-full space-y-4 neo-shadow-soft sm:min-w-[240px]'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[rgb(var(--neo-text-strong))]">
          <span className="text-xl leading-none">{loan.icon}</span>
          <p className="text-sm font-bold sm:text-base">{loan.name}</p>
        </div>
        <span className="neo-badge neo-badge--ghost text-[11px]">
          {toPersianDigits(loan.interestRate)}٪ سود
        </span>
      </div>

      <div className="space-y-2">
        <div className="neo-progress-track h-2.5">
          <div className="neo-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between text-[11px] font-medium text-[rgb(var(--neo-text-secondary))]">
          <span>پرداخت شده: {formatToman(loan.paidAmount)}</span>
          <span>کل: {formatToman(loan.totalAmount)}</span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
        <div className="text-[rgb(var(--neo-text-muted))]">مبلغ باقیمانده</div>
        <div className="text-left font-semibold text-[rgb(var(--neo-text-strong))]">{formatToman(remainingAmount)} تومان</div>

        <div className="text-[rgb(var(--neo-text-muted))]">مبلغ هر قسط</div>
        <div className="text-left font-semibold text-[rgb(var(--neo-text-strong))]">{formatToman(loan.installmentAmount)} تومان</div>

        <div className="text-[rgb(var(--neo-text-muted))]">اقساط باقیمانده</div>
        <div className="text-left font-semibold text-[rgb(var(--neo-text-strong))]">{toPersianDigits(loan.remainingInstallments)} قسط</div>

        <div className="text-[rgb(var(--neo-text-muted))]">سررسید بعدی</div>
        <div className="text-left font-semibold text-[rgb(var(--neo-text-strong))]">{toPersianDigits(loan.nextPaymentDate)}</div>
      </dl>

      <button
        className="w-full rounded-[var(--neo-radius-lg)] bg-[rgb(var(--neo-accent))] py-2 text-sm font-bold text-[rgb(var(--neo-accent-ink))] transition hover:brightness-105"
        type="button"
      >
        پرداخت قسط
      </button>
    </div>
  );
};

interface FinancialHealthSectionProps {
  user: User;
}

const FinancialHealthSection: React.FC<FinancialHealthSectionProps> = ({ user }) => {
  const hasLoans = user.loans && user.loans.length > 0;
  const totalDebt = hasLoans ? user.loans.reduce((sum, loan) => sum + loan.totalAmount, 0) : 0;
  const totalPaid = hasLoans ? user.loans.reduce((sum, loan) => sum + loan.paidAmount, 0) : 0;

  return (
    <SurfaceCard tone="muted" padding="lg" className="space-y-6">
      <header className="flex flex-col items-end gap-3 text-right sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 text-right">
          <h3 className="text-lg font-bold text-[rgb(var(--neo-text-strong))]">وضعیت مالی و تسهیلات</h3>
          <p className={metricDescription}>نمای کلی از اقساط فعال و وضعیت بازپرداخت شما</p>
        </div>
        {hasLoans && (
          <div className="flex flex-wrap items-center justify-end gap-3 text-xs sm:text-sm">
            <div className="neo-badge neo-badge--ghost text-xs sm:text-sm">
              بدهی کل: <span className={metricTitle}>{formatToman(totalDebt)}</span>
            </div>
            <div className="neo-badge neo-badge--ghost text-xs sm:text-sm">
              پرداخت شده: <span className={metricTitle}>{formatToman(totalPaid)}</span>
            </div>
          </div>
        )}
      </header>

      {hasLoans ? (
        <div className="neo-animate-inline flex flex-col gap-4 sm:flex-row sm:gap-4 sm:overflow-x-auto sm:pb-2">
          {user.loans.map((loan) => (
            <LoanStatusCard key={loan.id} loan={loan} />
          ))}
        </div>
      ) : (
        <div className="neo-outline-dashed px-6 py-12 text-center">
          <p className="text-sm font-semibold text-[rgb(var(--neo-text-secondary))]">شما در حال حاضر وام فعالی ندارید.</p>
          <p className="mt-2 text-xs text-[rgb(var(--neo-text-muted))]">به محض ثبت درخواست تسهیلات، وضعیت آن در این بخش نمایش داده می‌شود.</p>
        </div>
      )}
    </SurfaceCard>
  );
};

export default FinancialHealthSection;
