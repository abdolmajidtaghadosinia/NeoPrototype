

import React, { useEffect, useRef } from 'react';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { UserIcon } from '../icons/UserIcon';
import { LockClosedIcon } from '../icons/LockClosedIcon';
import { BellIcon } from '../icons/BellIcon';
import { QuestionMarkCircleIcon } from '../icons/QuestionMarkCircleIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { User } from '../../types';
import FinancialHealthSection from '../FinancialHealthSection';
import SupportSection from '../SupportSection';
import PremiumSection from '../PremiumSection';


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
      // Defer scrolling to ensure the section is laid out
      requestAnimationFrame(() => {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [section]);
  const menuItems = [
    { text: 'ویرایش اطلاعات', icon: <UserIcon className="w-6 h-6 text-gray-400" /> },
    { text: 'امنیت و رمز عبور', icon: <LockClosedIcon className="w-6 h-6 text-gray-400" /> },
    { text: 'اعلانات', icon: <BellIcon className="w-6 h-6 text-gray-400" /> },
    { text: 'راهنما و پشتیبانی', icon: <QuestionMarkCircleIcon className="w-6 h-6 text-gray-400" /> },
  ];

  return (
    <div className="pt-4 h-screen flex flex-col bg-neo-dark-1 text-white">
      <header className="flex items-center justify-between mb-6 px-4">
         <div className="w-8"></div>
         <h1 className="text-2xl font-bold text-white">پروفایل کاربری</h1>
        <button onClick={onBack} className="p-2 text-gray-300 hover:text-neo-green">
          <ArrowLeftIcon className="w-7 h-7" />
        </button>
      </header>
      
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-neo-dark-1 shadow-lg">
           <img src={user.picture} alt="User Profile" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-xl font-bold text-white">{user.name}</h2>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>

      <div className="flex-grow overflow-y-auto px-4 pb-4 space-y-6">
        <FinancialHealthSection
          user={user}
        />
        <PremiumSection />

        <SupportSection />

        <div ref={settingsRef}>
            <h3 className="text-lg font-bold text-right mb-2 text-white px-1">تنظیمات</h3>
            <div className="space-y-4">
                <div className="bg-neo-dark-2 rounded-xl">
                {menuItems.map((item, index) => (
                    <button key={index} className="w-full flex items-center justify-between text-right p-4 transition-colors hover:bg-neo-dark-3 first:rounded-t-xl last:rounded-b-xl">
                    <div className="flex items-center gap-4">
                        {item.icon}
                        <p className="font-semibold text-gray-200">{item.text}</p>
                    </div>
                    <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
                    </button>
                ))}
                </div>

                <div className="space-y-3 pt-4">
                    <button className="w-full text-center p-3 rounded-lg text-gray-400 font-semibold transition-colors hover:bg-neo-dark-3">
                        خروج از برنامه
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;