import React, { useState, useRef, useEffect, memo } from 'react';
import { GoogleGenAI } from '@google/genai';
import SurfaceCard from './layout/SurfaceCard';
import { Message } from '../types';
import { metricDescription } from './designSystem';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
}

const SupportSection: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subject, setSubject] = useState('');
  const [ticketText, setTicketText] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !ticketText.trim()) return;

    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      subject,
      message: ticketText,
      status: 'open',
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSubject('');
    setTicketText('');
    setTicketSent(true);
    setTimeout(() => setTicketSent(false), 3000);
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || isLoading) return;

    const userMessage: Message = { role: 'user', text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        setMessages((prev) => [...prev, { role: 'model', text: 'کلید API یافت نشد.' }]);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      const aiText = response.text || 'پاسخی دریافت نشد.';
      setMessages((prev) => [...prev, { role: 'model', text: aiText }]);
    } catch (err) {
      console.error('AI support error', err);
      setMessages((prev) => [...prev, { role: 'model', text: 'خطا در پردازش درخواست.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SurfaceCard tone="muted" padding="lg" className="rounded-3xl space-y-5">
        <header className="space-y-1 text-right">
          <h3 className="text-lg font-bold text-[rgb(var(--neo-text-strong))]">پشتیبانی تیکتی</h3>
          <p className={metricDescription}>مشکلات خود را با تیم پشتیبانی در میان بگذارید و روند رسیدگی را دنبال کنید.</p>
        </header>
        <form onSubmit={handleTicketSubmit} className="space-y-3">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="موضوع"
            className="w-full rounded-2xl border border-[color:var(--neo-divider-color)] bg-[color:var(--neo-surface-bg)] px-4 py-3 text-sm text-[rgb(var(--neo-text-strong))] placeholder:text-[rgb(var(--neo-text-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--neo-accent))]/40"
          />
          <textarea
            value={ticketText}
            onChange={(e) => setTicketText(e.target.value)}
            placeholder="شرح مشکل"
            className="h-28 w-full rounded-2xl border border-[color:var(--neo-divider-color)] bg-[color:var(--neo-surface-bg)] px-4 py-3 text-sm text-[rgb(var(--neo-text-strong))] placeholder:text-[rgb(var(--neo-text-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--neo-accent))]/40"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-[rgb(var(--neo-accent))] py-2.5 text-sm font-bold text-[rgb(var(--neo-accent-ink))] transition hover:brightness-105"
          >
            ارسال تیکت
          </button>
          {ticketSent && <p className="text-sm text-[rgb(var(--neo-accent))]">تیکت شما ثبت شد.</p>}
        </form>
        {tickets.length > 0 && (
          <ul className="space-y-2 text-right">
            {tickets.map((t) => (
              <li key={t.id} className="rounded-2xl border border-[color:var(--neo-divider-color)] bg-[color:var(--neo-surface-ghost-bg)] px-4 py-3">
                <p className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">{t.subject}</p>
                <p className="mt-1 text-xs text-[rgb(var(--neo-text-secondary))]">{t.message}</p>
                <p className="mt-1 text-[11px] text-[rgb(var(--neo-text-muted))]">وضعیت: {t.status === 'open' ? 'باز' : 'بسته'}</p>
              </li>
            ))}
          </ul>
        )}
      </SurfaceCard>

      <SurfaceCard tone="muted" padding="lg" className="rounded-3xl space-y-5">
        <header className="space-y-1 text-right">
          <h3 className="text-lg font-bold text-[rgb(var(--neo-text-strong))]">پشتیبانی هوشمند</h3>
          <p className={metricDescription}>سوالات سریع خود را از دستیار هوشمند بپرسید و پاسخ آنی دریافت کنید.</p>
        </header>
        <div className="flex h-80 flex-col rounded-3xl border border-[color:var(--neo-divider-color)] bg-[color:var(--neo-surface-bg)]">
          <div className="neo-animate-stack flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[rgb(var(--neo-accent))] text-[rgb(var(--neo-accent-ink))]'
                      : 'bg-[color:var(--neo-surface-ghost-bg)] text-[rgb(var(--neo-text-secondary))]'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-right">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl bg-[color:var(--neo-surface-ghost-bg)] px-4 py-2 text-sm text-[rgb(var(--neo-text-muted))]">
                  در حال پردازش...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={handleChatSubmit} className="border-t border-[color:var(--neo-divider-color)] px-4 py-3">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="سوال خود را بپرسید"
                className="w-full rounded-full border border-[color:var(--neo-divider-color)] bg-[color:var(--neo-surface-bg)] py-2.5 pr-4 pl-12 text-sm text-[rgb(var(--neo-text-strong))] placeholder:text-[rgb(var(--neo-text-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--neo-accent))]/40"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute left-2 flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--neo-accent))] text-[rgb(var(--neo-accent-ink))] transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[color:var(--neo-divider-color)] disabled:text-[rgb(var(--neo-text-muted))]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rotate-180">
                  <path d="M3.105 3.105a.75.75 0 01.99 0L19.53 11.232a.75.75 0 010 1.536L4.095 20.895a.75.75 0 01-1.282-.84L4.34 12.5H12.5a.75.75 0 000-1.5H4.34L2.813 3.945a.75.75 0 01.292-.84z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </SurfaceCard>
    </div>
  );
};

export default memo(SupportSection);
