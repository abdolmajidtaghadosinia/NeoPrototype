
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Message, PortfolioSlice, AiAction } from '../../types';

/**
 * Props for the SearchPage component.
 */
interface SearchPageProps {
    /** An array of the user's portfolio assets to display as quick-query suggestions. */
    portfolioAssets: PortfolioSlice[];
    /** The history of chat messages to be displayed in the interface. */
    messages: Message[];
    /** A boolean indicating if the AI is currently processing a response. */
    isLoading: boolean;
    /** Callback function executed when the user submits a new chat prompt. */
    onSubmit: (prompt: string) => void;
    /** Callback function executed when a user clicks an AI-suggested action button. */
    onActionClick: (action: AiAction) => void;
}

const STORAGE_KEY = 'neo-search-prompt-history';

/**
 * Renders the AI-powered search and chat page.
 * This component provides an interactive interface for users to chat with a financial AI assistant.
 * It features a message display area, a prompt input form, contextual suggestions,
 * a list of the user's assets for quick queries, and persists recent prompts to local storage.
 *
 * @param {SearchPageProps} props - The component props.
 * @returns {JSX.Element} The AI search page component.
 */
const SearchPage: React.FC<SearchPageProps> = ({ portfolioAssets, messages, isLoading, onSubmit, onActionClick }) => {
    const [input, setInput] = useState('');
    const [promptHistory, setPromptHistory] = useState<string[]>([]);
    const [activeSuggestionCategory, setActiveSuggestionCategory] = useState<'markets' | 'portfolio' | 'social'>('markets');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        if (messages.length === 0) {
            return;
        }

        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setPromptHistory(parsed.filter((item): item is string => typeof item === 'string').slice(0, 5));
                }
            }
        } catch (error) {
            console.error('Failed to restore prompt history from storage', error);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        try {
            if (promptHistory.length === 0) {
                window.localStorage.removeItem(STORAGE_KEY);
            } else {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(promptHistory));
            }
        } catch (error) {
            console.error('Failed to persist prompt history', error);
        }
    }, [promptHistory]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const tagName = target?.tagName?.toLowerCase();
            const isTypingContext = tagName === 'input' || tagName === 'textarea' || target?.isContentEditable;

            const focusRequested =
                (event.key === '/' && !event.altKey && !event.metaKey && !event.ctrlKey && !event.shiftKey) ||
                (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey));

            if (!focusRequested || isTypingContext) {
                return;
            }

            event.preventDefault();
            inputRef.current?.focus();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    
    const suggestionMap = useMemo(() => {
        const portfolioSuggestions = portfolioAssets.slice(0, 3).map((asset) => `وضعیت ${asset.name} را بررسی کن و بگو چه ریسکی دارد.`);
        const defaultSuggestions = {
            markets: [
                'آخرین وضعیت شاخص کل بورس و ارزهای پرطرفدار را تحلیل کن.',
                'تحلیل تکنیکال طلای آب‌شده در تایم‌فریم روزانه چیست؟',
                'چشم‌انداز طلا و دلار برای هفته آینده چگونه است؟',
            ],
            portfolio: [
                'ترکیب دارایی‌های من را از نظر ریسک و بازده بررسی کن.',
                'حد ضرر و حد سود پیشنهادی برای پرتفویم چیست؟',
                ...portfolioSuggestions,
            ],
            social: [
                'برترین معامله‌گران رایا در این هفته چه استراتژی‌ای داشته‌اند؟',
                'چکیده ایده‌های صعودی و نزولی منتشر شده امروز را بگو.',
                'کدام دارایی بیشترین توجه کاربران اجتماعی را داشته است؟',
            ],
        } as const;

        return defaultSuggestions;
    }, [portfolioAssets]);

    const activeSuggestions = suggestionMap[activeSuggestionCategory];
    const hasMessages = messages.length > 0;

    const submitPrompt = (prompt: string) => {
        const trimmed = prompt.trim();
        if (!trimmed || isLoading) return;
        setPromptHistory((prev) => {
            const next = [trimmed, ...prev.filter((item) => item !== trimmed)];
            return next.slice(0, 5);
        });
        onSubmit(trimmed);
    };

    const handleHistorySelect = (prompt: string) => {
        submitPrompt(prompt);
        setInput('');
    };

    const handleClearHistory = () => {
        setPromptHistory([]);
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.removeItem(STORAGE_KEY);
            } catch (error) {
                console.error('Failed to clear stored prompt history', error);
            }
        }
    };

    const handleAssetClick = (asset: PortfolioSlice) => {
        const prompt = `درباره دارایی "${asset.name}" برایم توضیح بده. آخرین تحلیل‌ها و اخبار مربوط به آن چیست؟`;
        submitPrompt(prompt);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitPrompt(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-96px)] md:h-screen bg-neo-dark-2 text-gray-200 rounded-2xl overflow-hidden md:flex-row">

            {/* User Assets Section */}
            <div className="p-4 border-b border-gray-800 shrink-0 sticky top-0 bg-neo-dark-2 z-10 md:static md:border-b-0 md:border-l md:w-64 md:overflow-y-auto">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 text-right">دارایی‌های شما</h3>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:mx-0 md:px-0">
                    {portfolioAssets.map(asset => (
                        <button
                            key={asset.name}
                            onClick={() => handleAssetClick(asset)}
                            disabled={isLoading}
                            className="shrink-0 bg-neo-dark-3 hover:bg-gray-700 transition-colors text-gray-200 text-sm font-medium px-4 py-2 rounded-full border border-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed flex items-center gap-2 md:w-full md:justify-between"
                        >
                            {asset.icon && <span className="text-lg">{asset.icon}</span>}
                            <span>{asset.name}</span>
                        </button>
                    ))}
                </div>
                <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-gray-400">پیشنهادهای آماده</h4>
                        <div className="flex items-center gap-1">
                            {([
                                { value: 'markets' as const, label: 'بازار' },
                                { value: 'portfolio' as const, label: 'پرتفو' },
                                { value: 'social' as const, label: 'سوشال' },
                            ]).map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setActiveSuggestionCategory(option.value)}
                                    className={`rounded-full px-2 py-1 text-[10px] font-semibold transition ${
                                        activeSuggestionCategory === option.value
                                            ? 'bg-neo-green text-black'
                                            : 'bg-neo-dark-3 text-gray-300 hover:bg-neo-dark-1'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        {activeSuggestions.map((suggestion, index) => (
                            <button
                                key={`${activeSuggestionCategory}-${index}`}
                                type="button"
                                onClick={() => submitPrompt(suggestion)}
                                className="rounded-xl border border-gray-700 px-3 py-1 text-right text-[11px] text-gray-200 transition hover:border-neo-green hover:text-neo-green"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                    {promptHistory.length > 0 && (
                        <div className="space-y-2 rounded-2xl border border-gray-800/60 bg-neo-dark-3/60 p-3">
                            <div className="flex items-center justify-between">
                                <h5 className="text-xs font-semibold text-gray-300">جستجوهای اخیر</h5>
                                <button
                                    type="button"
                                    onClick={handleClearHistory}
                                    className="text-[10px] font-semibold text-gray-500 hover:text-red-400"
                                >
                                    پاک‌سازی
                                </button>
                            </div>
                            <div className="flex flex-col gap-1">
                                {promptHistory.map((prompt, idx) => (
                                    <button
                                        key={`${prompt}-${idx}`}
                                        type="button"
                                        onClick={() => handleHistorySelect(prompt)}
                                        className="text-right text-[11px] text-gray-300 transition hover:text-neo-green"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
                    {!hasMessages && !isLoading && (
                        <div className="rounded-2xl border border-gray-800/70 bg-neo-dark-2/70 p-6 text-right text-xs text-gray-300 space-y-3">
                            <h4 className="text-sm font-bold text-white">چطور می‌توانم کمک کنم؟</h4>
                            <ul className="space-y-2 pr-5 leading-6">
                                <li className="list-disc">پرس‌وجو درباره روند بازار و شاخص‌های کلیدی</li>
                                <li className="list-disc">تحلیل پورتفوی شخصی و پیشنهادهای مدیریت ریسک</li>
                                <li className="list-disc">پیگیری ایده‌های پرطرفدار و فعالیت معامله‌گران حرفه‌ای</li>
                            </ul>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`w-11/12 max-w-3xl px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-neo-green text-black' : 'bg-neo-dark-3 text-gray-200'}`}>
                                   <p className="whitespace-pre-wrap text-right leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                            {msg.actions && msg.actions.length > 0 && msg.role === 'model' && (
                                <div className="flex justify-start gap-2 mt-2">
                                    {msg.actions.map((action, actionIndex) => (
                                        <button
                                            key={actionIndex}
                                            onClick={() => onActionClick(action)}
                                            className="bg-neo-dark-3 text-neo-green text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="px-4 py-3 rounded-2xl bg-neo-dark-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-neo-green rounded-full animate-pulse delay-0"></span>
                                    <span className="w-2 h-2 bg-neo-green rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-neo-green rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleFormSubmit} className="sticky bottom-0 bg-neo-dark-1/80 p-4 backdrop-blur-sm border-t border-gray-800">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="مثلاً تحلیل طلای آب‌شده یا بررسی پرتفو..."
                            aria-label="ارسال پرسش به دستیار هوشمند"
                            aria-describedby="search-shortcuts"
                            ref={inputRef}
                            className="w-full rounded-full border-2 border-transparent bg-neo-dark-3 py-3 pr-4 pl-12 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neo-green"
                            disabled={isLoading}
                        />
                        <div className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-[10px] font-semibold text-gray-500">
                            <span className="rounded border border-gray-600 bg-neo-dark-2 px-2 py-0.5">/</span>
                            <span className="rounded border border-gray-600 bg-neo-dark-2 px-2 py-0.5">Ctrl + K</span>
                        </div>
                        <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neo-green text-black disabled:bg-gray-600 transition-colors" disabled={isLoading || !input.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 rotate-180">
                                <path d="M3.105 3.105a.75.75 0 01.99 0L19.53 11.232a.75.75 0 010 1.536L4.095 20.895a.75.75 0 01-1.282-.84L4.34 12.5H12.5a.75.75 0 000-1.5H4.34L2.813 3.945a.75.75 0 01.292-.84z" />
                            </svg>
                        </button>
                    </div>
                    <p id="search-shortcuts" className="mt-2 text-[11px] text-gray-500 text-right">
                        برای شروع سریع جستجو از «/» یا «Ctrl + K» استفاده کنید. پنج جستجوی اخیر شما ذخیره و در این بخش در دسترس باقی می‌مانند.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SearchPage;