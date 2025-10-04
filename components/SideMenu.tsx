import React, { memo, useMemo } from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { AiIcon } from './icons/AiIcon';
import { SwapIcon } from './icons/SwapIcon';
import { WalletSolidIcon } from './icons/WalletSolidIcon';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import { NavTab } from '../types';

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
    <aside className="hidden md:flex fixed top-0 right-0 flex-col w-28 h-screen bg-neo-dark-2 border-l border-gray-800 py-6">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const isHome = item.id === 'home' && isActive;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as NavTab)}
            aria-label={item.label}
            className={`flex flex-col items-center gap-2 py-5 text-sm transition-colors ${isActive ? (isHome ? 'text-neo-green bg-neo-green/20 rounded-lg' : 'text-neo-green') : 'text-gray-400 hover:text-white'}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};

export default memo(SideMenu);
