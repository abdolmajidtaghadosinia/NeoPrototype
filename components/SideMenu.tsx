import React, { memo, useMemo } from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { AiIcon } from './icons/AiIcon';
import { SwapIcon } from './icons/SwapIcon';
import { WalletSolidIcon } from './icons/WalletSolidIcon';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import { NavTab } from '../types';
import { composeNavItemClasses } from './designSystem';

interface SideMenuProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ activeTab, onTabChange }) => {
  const navItems = useMemo(() => [
    { id: 'swap', label: 'رصد بازارها', icon: <SwapIcon className="w-7 h-7" /> },
    { id: 'search', label: 'دستیار AI', icon: <AiIcon className="w-7 h-7" /> },
    { id: 'home', label: 'خانه', icon: <HomeIcon className="w-7 h-7" /> },
    { id: 'social', label: 'سوشیال', icon: <UsersGroupIcon className="w-7 h-7" /> },
    { id: 'wallet', label: 'دارایی‌ها', icon: <WalletSolidIcon className="w-7 h-7" /> },
  ], []);

  return (
    <aside className="hidden md:flex fixed top-0 right-0 flex-col w-28 h-screen bg-neo-dark-2 border-l border-gray-800 px-4 py-6">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id as NavTab)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={composeNavItemClasses('stacked', isActive)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default memo(SideMenu);
