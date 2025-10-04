import React, { useState } from 'react';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { BellIcon } from '../icons/BellIcon';
import type { View } from '../../types';

/**
 * Defines an action button that can be displayed within a notification item.
 */
export interface NotificationAction {
  /** The text displayed on the button. */
  label: string;
  /** The visual style of the button. */
  variant?: 'primary' | 'secondary' | 'danger';
  /** The view to navigate to when the button is clicked. */
  view?: View;
}

/**
 * Represents a single notification item in the list.
 */
export interface NotificationItem {
  /** A unique identifier for the notification. */
  id: number;
  /** The category of the notification, used for filtering. */
  type: 'trade' | 'social' | 'settings' | 'symbol';
  /** The main content text of the notification. */
  message: string;
  /** A human-readable timestamp (e.g., "۸ دقیقه پیش"). */
  time: string;
  /** An optional URL for an avatar image, typically for social notifications. */
  avatar?: string;
  /** An array of actions the user can take. */
  actions?: NotificationAction[];
  /** A boolean indicating whether the notification has been read. */
  read: boolean;
}

type Tab = 'all' | 'trade' | 'social' | 'settings' | 'symbol';

const tabs: { id: Tab; label: string }[] = [
  { id: 'all', label: 'همه' },
  { id: 'trade', label: 'معاملات' },
  { id: 'social', label: 'سوشیال‌تریدینگ' },
  { id: 'settings', label: 'تنظیمات' },
  { id: 'symbol', label: 'نمادها' },
];

/**
 * Props for the NotificationsPage component.
 */
interface NotificationsPageProps {
  /** An array of notification items to be displayed. */
  notifications: NotificationItem[];
  /** Callback function to navigate back to the previous view. */
  onBack: () => void;
  /** Callback function to mark all notifications as read. */
  onMarkAllRead: () => void;
  /**
   * Callback function triggered when a user clicks an action button on a notification.
   * @param {NotificationItem} item - The notification item associated with the action.
   * @param {NotificationAction} action - The action that was clicked.
   */
  onAction: (item: NotificationItem, action: NotificationAction) => void;
}

/**
 * Renders the notifications page, displaying a list of user notifications.
 * This component supports filtering by category and allows users to interact
 * with notifications through actions or mark them as read.
 *
 * @param {NotificationsPageProps} props - The component props.
 * @returns {JSX.Element} The notifications page component.
 */
const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onBack,
  onMarkAllRead,
  onAction,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const filtered =
    activeTab === 'all'
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  return (
    <div className="pt-4 h-screen flex flex-col bg-neo-dark-1 text-white">
      <header className="flex items-center justify-between mb-4 px-4">
        <button
          onClick={onMarkAllRead}
          className="text-xs text-neo-green hover:underline"
        >
          علامت‌گذاری همه خوانده شد
        </button>
        <h1 className="text-2xl font-bold">اعلان‌ها</h1>
        <button
          onClick={onBack}
          className="p-2 text-gray-300 hover:text-neo-green"
        >
          <ArrowLeftIcon className="w-7 h-7" />
        </button>
      </header>

      <div className="flex items-center justify-center gap-1 p-1 bg-neo-dark-2 rounded-xl mb-4 mx-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-neo-green text-black shadow'
                : 'text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-grow overflow-y-auto space-y-3 px-4 pb-4">
        {filtered.map((n) => (
          <div
            key={n.id}
            className={`rounded-xl p-4 flex items-start gap-3 ${
              n.read ? 'bg-neo-dark-2' : 'bg-neo-dark-3'
            }`}
          >
            {n.avatar ? (
              <img
                src={n.avatar}
                alt=""
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-neo-dark-4 flex items-center justify-center">
                <BellIcon className="w-5 h-5 text-neo-green" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-200">{n.message}</p>
                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                  {n.time}
                </span>
              </div>
              {n.actions && (
                <div className="mt-2 flex gap-2">
                  {n.actions.map((a) => (
                    <button
                      key={a.label}
                      onClick={() => onAction(n, a)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        a.variant === 'primary'
                          ? 'bg-neo-green text-black'
                          : a.variant === 'danger'
                          ? 'bg-red-500 text-white'
                          : 'bg-neo-dark-4 text-gray-300'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;

