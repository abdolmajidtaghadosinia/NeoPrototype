import React, { useMemo } from 'react';
import clsx from 'clsx';
import { HomeIcon } from './icons/HomeIcon';
import { AiIcon } from './icons/AiIcon';
import { SwapIcon } from './icons/SwapIcon';
import { WalletSolidIcon } from './icons/WalletSolidIcon';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = useMemo(
    () =>
      [
        { id: 'swap' as NavTab, label: 'رصد بازارها', icon: <SwapIcon className="w-7 h-7" /> },
        { id: 'search' as NavTab, label: 'دستیار AI', icon: <AiIcon className="w-8 h-8" /> },
        { id: 'home' as NavTab, label: 'خانه', icon: <HomeIcon className="w-9 h-9" /> },
        { id: 'social' as NavTab, label: 'سوشیال', icon: <UsersGroupIcon className="w-8 h-8" /> },
        { id: 'wallet' as NavTab, label: 'دارایی‌ها', icon: <WalletSolidIcon className="w-7 h-7" /> },
      ],
    [],
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-20 rounded-t-2xl border-t border-gray-800 bg-neo-dark-2/90 backdrop-blur-sm"
      aria-label="ناوبری اصلی"
    >
      <div className="flex h-full max-w-md mx-auto items-center justify-around">
        {navItems.map((item) => {
          const isCenter = item.id === 'home';
          const isActive = activeTab === item.id;

          if (isCenter) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={clsx(
                  '-mt-8 flex h-16 w-16 items-center justify-center rounded-full shadow-md transition-all duration-300',
                  isActive
                    ? 'bg-neo-green text-black shadow-lg shadow-neo-green/30'
                    : 'bg-neo-dark-3 text-white',
                )}
              >
                {item.icon}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                'transition-colors',
                isActive ? 'text-neo-green' : 'text-gray-400 hover:text-white',
              )}
            >
              {item.icon}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
