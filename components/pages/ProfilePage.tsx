import React, { useEffect, useRef } from 'react';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { UserIcon } from '../icons/UserIcon';
import { LockClosedIcon } from '../icons/LockClosedIcon';
import { BellIcon } from '../icons/BellIcon';
import { QuestionMarkCircleIcon } from '../icons/QuestionMarkCircleIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { CalendarIcon } from '../icons/CalendarIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { User } from '../../types';
import FinancialHealthSection from '../FinancialHealthSection';
import SupportSection from '../SupportSection';
import PremiumSection from '../PremiumSection';
import SurfaceCard from '../layout/SurfaceCard';
import Page from '../layout/Page';
import { composeSurfaceClasses, metricDescription, metricTitle } from '../designSystem';

/**
 * Props for the ProfilePage component.
 */
interface ProfilePageProps {
  /** The user object containing the profile data to display. */
  user: User;
  /** Callback function to navigate back to the previous view. */
  onBack: () => void;
  /** Optional key to specify a section to scroll to upon loading. */
  section?: 'settings';
}

/**
 * Renders the user profile page.
 * This component displays the user's personal information, financial health summary,
 * premium features, support links, and a list of settings.
 * It supports deep-linking to the settings section.
 *
 * @param {ProfilePageProps} props - The component props.
 * @returns {JSX.Element} The user profile page component.
 */
const ProfilePage: React.FC<ProfilePageProps> = ({ user, onBack, section }) => {
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (section === 'settings' && settingsRef.current) {
      const node = settingsRef.current;
      requestAnimationFrame(() => {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [section]);

  const quickFacts = [
    {
      label: 'وضعیت احراز هویت',
      value: 'تأیید شده',
      icon: <ShieldCheckIcon className="h-5 w-5 text-[rgb(var(--neo-accent))]" />,
    },
    {
      label: 'آخرین ورود',
      value: '۲۳ شهریور ۱۴۰۳',
      icon: <CalendarIcon className="h-5 w-5 text-[rgb(var(--neo-text-secondary))]" />,
    },
    {
      label: 'کد بورسی',
      value: 'آب۱۲۳۴۵',
      icon: <UserIcon className="h-5 w-5 text-[rgb(var(--neo-text-secondary))]" />,
    },
    {
      label: 'اعلان‌های خوانده نشده',
      value: '۲ اعلان جدید',
      icon: <BellIcon className="h-5 w-5 text-[rgb(var(--neo-text-secondary))]" />,
    },
  ];

  const menuItems = [
    {
      text: 'ویرایش اطلاعات',
      description: 'به‌روزرسانی نام، شماره تماس و حساب‌های بانکی',
      icon: <UserIcon className="h-6 w-6 text-[rgb(var(--neo-text-secondary))]" />,
    },
    {
      text: 'امنیت و رمز عبور',
      description: 'مدیریت رمز ورود، ورود دو مرحله‌ای و دستگاه‌های فعال',
      icon: <LockClosedIcon className="h-6 w-6 text-[rgb(var(--neo-text-secondary))]" />,
    },
    {
      text: 'اعلانات',
      description: 'کنترل هشدارهای بازار، اعلان‌های تراکنش و پیام‌ها',
      icon: <BellIcon className="h-6 w-6 text-[rgb(var(--neo-text-secondary))]" />,
    },
    {
      text: 'راهنما و پشتیبانی',
      description: 'دسترسی سریع به سوالات متداول و کانال‌های پشتیبانی',
      icon: <QuestionMarkCircleIcon className="h-6 w-6 text-[rgb(var(--neo-text-secondary))]" />,
    },
  ];

  return (
    <Page
      title="پروفایل کاربری"
      actions={(
        <button onClick={onBack} className="neo-icon-button" aria-label="بازگشت" type="button">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      )}
      spacing="lg"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <SurfaceCard tone="elevated" padding="lg" className="space-y-6">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-right xl:flex-col xl:items-end">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full ring-4 ring-[color:rgba(var(--neo-accent),0.15)] shadow-[var(--neo-surface-shadow)]">
              <img src={user.picture} alt="User Profile" className="h-full w-full object-cover" />
            </div>
            <div className="space-y-4 text-right sm:flex-1 xl:w-full">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[rgb(var(--neo-text-strong))]">{user.name}</h2>
                <p className="text-sm text-[rgb(var(--neo-text-secondary))]">{user.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-right text-sm">
                {quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className={composeSurfaceClasses(
                      'ghost',
                      'sm',
                      'flex items-center justify-end gap-3 text-right'
                    )}
                  >
                    <div>
                      <p className="text-xs font-medium text-[rgb(var(--neo-text-muted))]">{fact.label}</p>
                      <p className={`${metricTitle} text-sm`}>{fact.value}</p>
                    </div>
                    {fact.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <button className="neo-pill-button" type="button">
              مدیریت پروفایل
            </button>
            <button className="neo-pill-button" type="button">
              تنظیمات امنیتی
            </button>
            <button className="neo-pill-button" type="button">
              ارسال درخواست پشتیبانی
            </button>
          </div>
        </SurfaceCard>

        <div className="space-y-6">
          <FinancialHealthSection user={user} />
          <PremiumSection />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2" ref={settingsRef}>
        <SurfaceCard tone="muted" padding="lg" className="space-y-5">
          <header className="flex items-center justify-between gap-3">
            <div className="space-y-1 text-right">
              <h3 className="text-lg font-bold text-[rgb(var(--neo-text-strong))]">تنظیمات حساب</h3>
              <p className={metricDescription}>تنظیمات اصلی حساب کاربری، امنیت و اعلان‌ها</p>
            </div>
          </header>
          <div
            className={composeSurfaceClasses(
              'ghost',
              'none',
              'divide-y divide-[color:var(--neo-divider-color)] overflow-hidden'
            )}
          >
            {menuItems.map((item) => (
              <button
                key={item.text}
                className="flex w-full items-stretch justify-between gap-4 px-5 py-4 text-right transition hover:bg-[color:var(--neo-frame-ghost-bg)]"
                type="button"
              >
                <div className="flex flex-1 items-start justify-end gap-4">
                  <div className="space-y-1 text-right">
                    <p className="text-base font-semibold text-[rgb(var(--neo-text-strong))]">{item.text}</p>
                    <p className="text-sm leading-relaxed text-[rgb(var(--neo-text-secondary))]">{item.description}</p>
                  </div>
                  <div
                    className={composeSurfaceClasses(
                      'ghost',
                      'sm',
                      'flex h-11 w-11 items-center justify-center !p-0'
                    )}
                  >
                    {item.icon}
                  </div>
                </div>
                <ChevronLeftIcon className="h-5 w-5 text-[rgb(var(--neo-text-muted))]" />
              </button>
            ))}
          </div>
          <div
            className={composeSurfaceClasses(
              'ghost',
              'sm',
              'flex items-center justify-between px-5 py-4'
            )}
          >
            <div className="space-y-1 text-right">
              <p className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">خروج از حساب کاربری</p>
              <p className="text-xs text-[rgb(var(--neo-text-secondary))]">برای امنیت بیشتر پس از پایان کار خود خارج شوید.</p>
            </div>
            <button className="rounded-full bg-[rgb(var(--neo-accent))] px-4 py-2 text-xs font-bold text-[rgb(var(--neo-accent-ink))] shadow-sm transition hover:brightness-105" type="button">
              خروج
            </button>
          </div>
        </SurfaceCard>

        <SupportSection />
      </div>
    </Page>
  );
};

export default ProfilePage;
