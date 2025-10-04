
import React from 'react';
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
 * Renders the main bottom navigation bar for mobile and tablet views.
 * It provides quick access to the primary sections of the application,
 * with a distinct, elevated "Home" button in the center.
 *
 * @param {BottomNavProps} props - The component props.
 * @returns {JSX.Element} The bottom navigation component.
 */
const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    const navItems = [
        { id: 'swap', label: 'رصد بازارها', icon: <SwapIcon className="w-7 h-7" /> },
        { id: 'search', label: 'دستیار AI', icon: <AiIcon className="w-8 h-8" /> },
        { id: 'home', label: 'خانه', icon: <HomeIcon className="w-9 h-9" /> },
        { id: 'social', label: 'سوشیال', icon: <UsersGroupIcon className="w-8 h-8" /> },
        { id: 'wallet', label: 'دارایی‌ها', icon: <WalletSolidIcon className="w-7 h-7" /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-neo-dark-2/90 backdrop-blur-sm border-t border-gray-800 h-20 rounded-t-2xl">
            <div className="flex justify-around items-center h-full max-w-md mx-auto">
                {navItems.map((item) => {
                    const isCenter = item.id === 'home';
                    const isActive = activeTab === item.id;

                    if (isCenter) {
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id as NavTab)}
                                aria-label={item.label}
                                className={`-mt-8 flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 transform
                                    ${isActive ? 'bg-neo-green text-black shadow-lg shadow-neo-green/30' : 'bg-neo-dark-3 text-white shadow-md'}
                                `}
                            >
                                {item.icon}
                            </button>
                        );
                    }
                    
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id as NavTab)}
                            className={`transition-colors ${isActive ? 'text-neo-green' : 'text-gray-400 hover:text-white'}`}
                             aria-label={item.label}
                        >
                            {item.icon}
                        </button>
                    )
                })}
            </div>
        </nav>
    );
};

export default BottomNav;