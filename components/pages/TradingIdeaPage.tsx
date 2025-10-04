import React, { useState } from 'react';
import { TradingIdea } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { CalendarIcon } from '../icons/CalendarIcon';
import { ThumbUpIcon } from '../icons/ThumbUpIcon';
import { ChatBubbleIcon } from '../icons/ChatBubbleIcon';
import { VerifiedIcon } from '../icons/VerifiedIcon';
import { toPersianDigits } from '../formatters';
import { ThumbUpSolidIcon } from '../icons/ThumbUpSolidIcon';

/**
 * Props for the TradingIdeaPage component.
 */
interface TradingIdeaPageProps {
  /** The trading idea object to be displayed in full detail. */
  idea: TradingIdea;
  /** Callback function to navigate back to the previous view. */
  onBack: () => void;
  /** Callback function triggered when the idea's author is selected. */
  onUserSelect: (userId: number) => void;
  /** Callback function triggered when the associated asset is selected. */
  onAssetSelect: (assetId: string) => void;
  /** Callback function to handle liking the idea. */
  onLikeIdea: (ideaId: string) => void;
  /** Callback function to submit a new comment on the idea. */
  onAddComment: (ideaId: string, commentText: string) => void;
}

/**
 * Renders a full-page, detailed view of a single trading idea.
 * This component displays the idea's title, description, author details,
 * associated asset information, and a complete comment section.
 * It allows users to like the idea and add their own comments.
 *
 * @param {TradingIdeaPageProps} props - The component props.
 * @returns {JSX.Element} The detailed trading idea page component.
 */
const TradingIdeaPage: React.FC<TradingIdeaPageProps> = ({
  idea,
  onBack,
  onUserSelect,
  onAssetSelect,
  onLikeIdea,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const isBullish = idea.type === 'bullish';

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(idea.id, newComment);
    setNewComment('');
  };

  const stats = [
    {
      label: 'افق زمانی',
      value: idea.predictionTimeframe,
    },
    {
      label: 'محبوبیت',
      value: `${toPersianDigits(idea.likes)} نفر`,
    },
    {
      label: 'نظرات کاربران',
      value: toPersianDigits(idea.commentsData.length),
    },
    {
      label: 'وضعیت ایده',
      value: isBullish ? 'سیگنال صعودی' : 'سیگنال نزولی',
    },
  ];

  return (
    <div className="min-h-screen bg-neo-dark-1 text-white">
      <header className="sticky top-0 z-20 bg-neo-dark-1/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full bg-neo-dark-3/70 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-neo-dark-3 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>بازگشت</span>
          </button>
          <h1 className="flex-1 text-lg sm:text-xl font-bold text-center text-white truncate px-2">{idea.title}</h1>
          <div className="hidden sm:block w-24" aria-hidden="true" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 pt-6 space-y-6">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
          <article className="space-y-6">
            <section className="bg-neo-dark-2/80 rounded-3xl border border-neo-dark-3/60 shadow-lg shadow-black/20 p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-semibold ${
                    isBullish ? 'bg-neo-green/15 text-neo-green' : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  <span className="text-lg">{isBullish ? '▲' : '▼'}</span>
                  {isBullish ? 'ایده صعودی' : 'ایده نزولی'}
                </span>
                <div className="flex items-center gap-2 text-gray-400">
                  <CalendarIcon className="w-5 h-5" />
                  <span className="font-medium">{idea.predictionTimeframe}</span>
                </div>
              </div>

              <div className="space-y-4 text-right">
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug text-white">
                  {idea.title}
                </h2>
                <p className="text-sm sm:text-base leading-7 text-gray-300">
                  {idea.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-neo-dark-3/70 px-4 py-3 text-right border border-neo-dark-4/40"
                  >
                    <p className="text-xs text-gray-400">{stat.label}</p>
                    <p className="mt-1 text-base font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 border-t border-neo-dark-4/40 pt-4 text-sm text-gray-400">
                <button
                  onClick={() => onLikeIdea(idea.id)}
                  className="flex items-center gap-1.5 rounded-full bg-neo-dark-3/60 px-3 py-1.5 hover:bg-neo-dark-3 text-gray-200 hover:text-white transition-colors"
                >
                  {idea.userHasLiked ? (
                    <ThumbUpSolidIcon className="w-5 h-5 text-neo-green" />
                  ) : (
                    <ThumbUpIcon className="w-5 h-5" />
                  )}
                  <span className="font-semibold">{toPersianDigits(idea.likes)} لایک</span>
                </button>
                <div className="flex items-center gap-1.5 rounded-full bg-neo-dark-3/40 px-3 py-1.5">
                  <ChatBubbleIcon className="w-5 h-5" />
                  <span className="font-semibold">{toPersianDigits(idea.comments)} نظر</span>
                </div>
              </div>
            </section>

            <section className="bg-neo-dark-2/80 rounded-3xl border border-neo-dark-3/60 p-6 sm:p-7 space-y-6">
              <header className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-white">نظرات کاربران</h2>
                <span className="text-sm text-gray-400">
                  {toPersianDigits(idea.commentsData.length)} نظر ثبت شده
                </span>
              </header>

              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <textarea
                  placeholder="نظر خود را بنویسید..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full resize-none rounded-2xl border border-neo-dark-4/50 bg-neo-dark-3/80 p-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neo-green"
                  rows={3}
                ></textarea>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-xs text-gray-500 text-right">
                    رعایت احترام در گفتگو باعث نمایش ایده شما برای سایر معامله‌گران می‌شود.
                  </p>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="inline-flex justify-center rounded-full bg-neo-green px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-opacity-90 disabled:bg-neo-dark-3 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    ثبت نظر
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {idea.commentsData.length > 0 ? (
                  idea.commentsData.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start gap-3 rounded-2xl border border-neo-dark-4/40 bg-neo-dark-3/70 p-4 text-right"
                    >
                      <img
                        src={comment.user.picture}
                        alt={comment.user.name}
                        className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                      />
                      <div className="w-full space-y-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-bold text-white">{comment.user.name}</p>
                          <p className="text-xs text-gray-500">{toPersianDigits(comment.timestamp)}</p>
                        </div>
                        <p className="text-sm leading-6 text-gray-300">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-neo-dark-4/60 bg-neo-dark-3/40 p-6 text-center text-sm text-gray-400">
                    هنوز نظری برای این ایده ثبت نشده است.
                  </div>
                )}
              </div>
            </section>
          </article>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-neo-dark-3/60 bg-neo-dark-2/80 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onUserSelect(idea.user.id)}
                  className="flex items-center gap-3 text-right hover:text-white"
                >
                  <img
                    src={idea.user.picture}
                    alt={idea.user.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-neo-dark-4"
                  />
                  <div className="text-right">
                    <p className="text-xs text-gray-400">منتشر شده توسط</p>
                    <div className="flex items-center gap-1">
                      <p className="text-base font-bold text-white">{idea.user.name}</p>
                      {idea.user.isPremium && <VerifiedIcon className="h-5 w-5 text-blue-400" />}
                    </div>
                  </div>
                </button>
                <span className="rounded-full bg-neo-dark-3 px-3 py-1 text-xs text-gray-400">
                  آی‌دی #{toPersianDigits(idea.user.id)}
                </span>
              </div>

              <div className="rounded-2xl bg-neo-dark-3/60 p-4 text-right space-y-3">
                <p className="text-xs text-gray-400">دیدگاه تحلیلگر</p>
                <p className="text-sm text-gray-300 leading-6">
                  این تحلیلگر به‌تازگی سه ایده موفق ثبت کرده است. دنبال کردن او می‌تواند به کشف فرصت‌های مشابه کمک کند.
                </p>
                <button
                  onClick={() => onUserSelect(idea.user.id)}
                  className="inline-flex items-center justify-center rounded-full border border-neo-green/40 px-4 py-2 text-xs font-semibold text-neo-green hover:bg-neo-green/10 transition-colors"
                >
                  مشاهده پروفایل
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-neo-dark-3/60 bg-neo-dark-2/80 p-6 space-y-4">
              <button
                onClick={() => onAssetSelect(idea.asset.id)}
                className="flex items-center justify-between gap-3 text-right w-full hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neo-dark-3 text-2xl">
                    {idea.asset.icon}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">نماد مورد بررسی</p>
                    <p className="text-base font-bold text-white">{idea.asset.name}</p>
                  </div>
                </div>
                <ArrowLeftIcon className="h-5 w-5 rotate-180 text-gray-500" />
              </button>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-neo-dark-3/60 p-3 text-right">
                  <p className="text-xs text-gray-400">نوع سیگنال</p>
                  <p className={`mt-1 font-semibold ${isBullish ? 'text-neo-green' : 'text-red-300'}`}>
                    {isBullish ? 'پیشنهاد خرید' : 'هشدار فروش'}
                  </p>
                </div>
                <div className="rounded-2xl bg-neo-dark-3/60 p-3 text-right">
                  <p className="text-xs text-gray-400">ریسک پیشنهادی</p>
                  <p className="mt-1 font-semibold text-white">متوسط</p>
                </div>
                <div className="rounded-2xl bg-neo-dark-3/60 p-3 text-right">
                  <p className="text-xs text-gray-400">حد ضرر پیشنهادی</p>
                  <p className="mt-1 font-semibold text-white">٪۵-</p>
                </div>
                <div className="rounded-2xl bg-neo-dark-3/60 p-3 text-right">
                  <p className="text-xs text-gray-400">هدف قیمتی</p>
                  <p className="mt-1 font-semibold text-white">٪۱۲+</p>
                </div>
              </div>

              <button
                onClick={() => onAssetSelect(idea.asset.id)}
                className="w-full rounded-full bg-neo-green/90 py-2.5 text-sm font-bold text-black hover:bg-neo-green"
              >
                شروع معامله روی {idea.asset.name}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TradingIdeaPage;
