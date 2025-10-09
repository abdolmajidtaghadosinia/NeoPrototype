

import React, { useCallback } from 'react';
import { NewsArticle } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { AiIcon } from '../icons/AiIcon';
import { toPersianDigits } from '../formatters';
import { composePageShell, composeSurfaceClasses, SurfacePadding, SurfaceTone } from '../designSystem';

/**
 * Props for the NewsArticlePage component.
 */
interface NewsArticlePageProps {
  /** The news article object to be displayed. */
  article: NewsArticle;
  /** Callback function to navigate back to the previous view. */
  onBack: () => void;
  /** Callback function to trigger an AI analysis of the article. */
  onAnalyze: (article: NewsArticle) => void;
}

/**
 * Renders a full-page view of a single news article.
 * This component displays the article's image, title, summary, and full content.
 * It includes metadata like source and category, and provides a button
 * to trigger an AI-powered analysis of the article content.
 *
 * @param {NewsArticlePageProps} props - The component props.
 * @returns {JSX.Element} The news article page component.
 */
const NewsArticlePage: React.FC<NewsArticlePageProps> = ({ article, onBack, onAnalyze }) => {
  const surface = useCallback(
    (tone: SurfaceTone = 'base', padding: SurfacePadding = 'md', extra?: string) =>
      composeSurfaceClasses(tone, padding, extra),
    [],
  );

  const metadataItems = [
    { label: 'دسته‌بندی', value: article.category },
    { label: 'منبع', value: article.source },
    { label: 'زمان انتشار', value: toPersianDigits(article.time) },
  ];

  return (
    <div className={composePageShell('pt-6 pb-24 lg:pb-16 text-[rgb(var(--neo-text-primary))]')}>
      <header className="flex flex-row-reverse items-start justify-between gap-4 px-4 lg:px-0">
        <button
          onClick={onBack}
          className="neo-icon-button flex h-11 w-11 shrink-0 items-center justify-center"
          aria-label="بازگشت"
          type="button"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex-1 space-y-3 text-right">
          <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-[rgb(var(--neo-text-secondary))]">
            <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold border-[color:var(--neo-chip-border)] bg-[var(--neo-chip-bg)] text-[rgb(var(--neo-chip-color))]">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-[rgb(var(--neo-text-muted))]">
              <span>{article.source}</span>
              <span className="inline-flex items-center gap-1">
                <span>{toPersianDigits(article.time)}</span>
                <ClockIcon className="h-4 w-4 text-[rgb(var(--neo-text-muted))]" />
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold leading-10 tracking-tight text-[rgb(var(--neo-text-strong))] sm:text-3xl">
            {article.title}
          </h1>
        </div>
      </header>

      <div className="mt-6 grid gap-6 px-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start lg:px-0">
        <article
          className={surface(
            'elevated',
            'lg',
            'order-2 space-y-8 overflow-hidden rounded-[var(--neo-radius-xl)] lg:order-1 lg:space-y-10',
          )}
        >
          <div className="relative overflow-hidden rounded-[var(--neo-radius-xl)] bg-[color:var(--neo-frame-bg)]">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-64 w-full object-cover sm:h-80 lg:h-[22rem]"
            />
          </div>

          <section className="space-y-4 text-right">
            <h2 className="text-xl font-semibold text-[rgb(var(--neo-text-strong))]">خلاصه خبر</h2>
            <p className="leading-8 text-[rgb(var(--neo-text-primary))]">{article.summary}</p>
          </section>

          <section className="space-y-5 text-right">
            <h3 className="text-lg font-semibold text-[rgb(var(--neo-text-strong))]">جزئیات کامل</h3>
            <div className="space-y-4">
              {article.content.map((paragraph, index) => (
                <p key={index} className="leading-8 text-[rgb(var(--neo-text-secondary))]">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {article.url && (
            <div className="flex justify-end">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:rgba(var(--neo-accent),0.35)] px-5 py-2 text-sm font-semibold text-[rgb(var(--neo-accent))] transition hover:border-[color:rgba(var(--neo-accent),0.55)] hover:text-[rgb(var(--neo-accent))]"
              >
                مشاهده منبع اصلی
              </a>
            </div>
          )}
        </article>

        <aside className="order-1 flex flex-col gap-6 lg:order-2">
          <div className={surface('ghost', 'lg', 'space-y-4 rounded-[var(--neo-radius-xl)]')}>
            <h2 className="text-lg font-semibold text-[rgb(var(--neo-text-strong))]">اطلاعات خبر</h2>
            <ul className="space-y-3 text-right text-sm">
              {metadataItems.map((item) => (
                <li key={item.label} className="flex flex-col gap-1">
                  <span className="text-[rgb(var(--neo-text-muted))]">{item.label}</span>
                  <span className="text-[rgb(var(--neo-text-primary))] font-semibold">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={surface('base', 'lg', 'space-y-4 rounded-[var(--neo-radius-xl)]')}>
            <h2 className="text-lg font-semibold text-[rgb(var(--neo-text-strong))]">تحلیل پیشنهادی</h2>
            <p className="text-sm leading-7 text-[rgb(var(--neo-text-secondary))]">
              برای درک عمیق‌تر تأثیر این خبر بر پرتفوی شما، از دستیار هوش مصنوعی کمک بگیرید تا نکات کلیدی و فرصت‌های احتمالی
              را بررسی کند.
            </p>
            <button
              onClick={() => onAnalyze(article)}
              type="button"
              className="neo-outline-button flex items-center justify-center gap-2 rounded-[var(--neo-radius-xl)] bg-[rgb(var(--neo-accent))] px-5 py-3 text-base font-semibold text-[rgb(var(--neo-accent-ink))] shadow-[var(--neo-frame-shadow)] transition hover:brightness-105"
            >
              <AiIcon className="h-5 w-5" />
              <span>تحلیل با هوش مصنوعی</span>
            </button>
          </div>
        </aside>
      </div>

      <div className="mt-8 px-4 lg:hidden">
        <button
          onClick={() => onAnalyze(article)}
          type="button"
          className="neo-outline-button flex w-full items-center justify-center gap-2 rounded-[var(--neo-radius-xl)] bg-[rgb(var(--neo-accent))] px-5 py-3 text-base font-semibold text-[rgb(var(--neo-accent-ink))] shadow-[var(--neo-frame-shadow)] transition hover:brightness-105"
        >
          <AiIcon className="h-5 w-5" />
          <span>تحلیل با هوش مصنوعی</span>
        </button>
      </div>
    </div>
  );
};

export default NewsArticlePage;
