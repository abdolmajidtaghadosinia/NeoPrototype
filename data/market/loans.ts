import type { LoanStatus } from '@/types';

export const mockUserLoans: LoanStatus[] = [
  {
    id: 'loan1',
    name: 'وام خرید خودرو',
    icon: '🚗',
    totalAmount: 800000000,
    paidAmount: 250000000,
    installmentAmount: 25000000,
    nextPaymentDate: '۱۴۰۴/۰۳/۱۵',
    interestRate: 23,
    remainingInstallments: 22,
  },
  {
    id: 'loan2',
    name: 'وام ضروری',
    icon: '💰',
    totalAmount: 50000000,
    paidAmount: 45000000,
    installmentAmount: 5000000,
    nextPaymentDate: '۱۴۰۴/۰۳/۰۵',
    interestRate: 18,
    remainingInstallments: 1,
  },
];
