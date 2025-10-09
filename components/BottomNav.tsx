import React, { useMemo } from 'react';
import clsx from 'clsx';
import { HomeIcon } from './icons/HomeIcon';
import { AiIcon } from './icons/AiIcon';
import { SwapIcon } from './icons/SwapIcon';
import { WalletSolidIcon } from './icons/WalletSolidIcon';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import { NavTab } from '../types';

/**
 * Props for the BottomNav component.
 */
interface BottomNavProps {
  /** The currently active tab, which should be highlighted. */
  activeTab: NavTab;
  /** Callback function triggered when a navigation tab is clicked. */
  onTabChange: (tab: NavTab) => void;
}

/**
 * Renders the main bottom navigation bar for mobile views.
 * The nav adapts to the global design tokens so icons, spacing,
 * and surfaces stay consistent with the rest of the app.
 */
const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = useMemo(
    () =>
      [
        { id: 'swap' as NavTab, label: 'رصد بازارها', icon: <SwapIcon className="h-6 w-6" /> },
        { id: 'search' as NavTab, label: 'دستیار AI', icon: <AiIcon className="h-7 w-7" /> },
        { id: 'home' as NavTab, label: 'خانه', icon: <HomeIcon className="h-7 w-7" /> },
        { id: 'social' as NavTab, label: 'سوشیال', icon: <UsersGroupIcon className="h-6 w-6" /> },
        { id: 'wallet' as NavTab, label: 'دارایی‌ها', icon: <WalletSolidIcon className="h-6 w-6" /> },
      ] satisfies { id: NavTab; label: string; icon: React.ReactNode }[],
    [],
  );

  return (
    <nav className="neo-bottom-nav" aria-label="ناوبری اصلی">
      <div className="neo-bottom-nav__inner">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={clsx('neo-bottom-nav__item', isActive && 'neo-bottom-nav__item--active')}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="neo-bottom-nav__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="neo-bottom-nav__label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
