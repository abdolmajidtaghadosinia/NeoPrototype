import React, { memo } from 'react';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { BellIcon } from './icons/BellIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { User } from '../types';
import { StockMarketIcon } from './icons/StockMarketIcon';

/**
 * Props for the Header component.
 */
interface HeaderProps {
  /** The current user object, used for displaying the profile picture. */
  user: User;
  /** The title of the currently active tab or page. */
  activeTabTitle: string;
  /** Callback function triggered when the user's profile icon is clicked. */
  onProfileClick: () => void;
  /** Callback function triggered when the quick trade/deposit button is clicked. */
  onQuickTradeClick: () => void;
  /** Callback function triggered when the alerts/notifications button is clicked. */
  onAlertsClick: () => void;
  /** The number of unread notifications to display in a badge. */
  notificationCount: number;
  /** The current theme of the application. */
  theme: 'dark' | 'light';
  /** Callback function to toggle the application theme. */
  onThemeToggle: () => void;
}

/**
 * Renders the main application header.
 * The header displays the app logo and title, the current page title,
 * and a set of action icons for quick trade, notifications, theme toggling,
 * and user profile access.
 *
 * @param {HeaderProps} props - The component props.
 * @returns {JSX.Element} The application header component.
 */
const Header: React.FC<HeaderProps> = ({
  user,
  activeTabTitle,
  onProfileClick,
  onQuickTradeClick,
  onAlertsClick,
  notificationCount,
  theme,
  onThemeToggle,
}) => (
  <header className="flex items-center justify-between pr-2 pl-3 py-4 sm:px-4 md:pl-[12rem] md:pr-[7.5rem] xl:pl-[14rem] xl:pr-[9rem]">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 p-1 text-neo-green">
        <StockMarketIcon />
      </div>
      <div className="text-right">
        <h1 className="text-sm font-bold text-[rgb(var(--neo-text-strong))]">نئوبروکر رایا</h1>
        <p className="text-xs text-[rgb(var(--neo-text-secondary))]">{activeTabTitle}</p>
      </div>
    </div>
    <div className="flex items-center gap-3 sm:gap-4">
      <button
        onClick={onQuickTradeClick}
        className="text-[rgb(var(--neo-text-secondary))] transition-colors hover:text-neo-green"
        aria-label="خرید سریع"
        type="button"
      >
        <PlusCircleIcon className="h-8 w-8" />
      </button>
      <button
        onClick={onAlertsClick}
        className="relative text-[rgb(var(--neo-text-secondary))] transition-colors hover:text-neo-green"
        aria-label="هشدارها"
        type="button"
      >
        <BellIcon className="h-8 w-8" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {notificationCount}
          </span>
        )}
      </button>
      <button
        onClick={onThemeToggle}
        className="theme-toggle-button"
        aria-label={theme === 'dark' ? 'تغییر به حالت روز' : 'تغییر به حالت شب'}
        type="button"
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
      <button
        onClick={onProfileClick}
        className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-transparent ring-offset-2 transition-all hover:ring-neo-green focus:outline-none focus:ring-neo-green"
        aria-label="پروفایل کاربری"
        type="button"
      >
        <img src={user.picture} alt="پروفایل کاربری" className="h-full w-full object-cover" />
      </button>
    </div>
  </header>
);

export default memo(Header);
