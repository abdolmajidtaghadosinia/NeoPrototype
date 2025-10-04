import React, { useState, useRef, useEffect, memo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Message } from '../types';

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
      status: 'open'
    };
    setTickets(prev => [newTicket, ...prev]);
    setSubject('');
    setTicketText('');
    setTicketSent(true);
    setTimeout(() => setTicketSent(false), 3000);
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || isLoading) return;
    const userMessage: Message = { role: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        const modelMessage: Message = { role: 'model', text: 'کلید API یافت نشد.' };
        setMessages(prev => [...prev, modelMessage]);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      const aiText = response.text || 'پاسخی دریافت نشد.';
      const modelMessage: Message = { role: 'model', text: aiText };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      console.error('AI support error', err);
      const modelMessage: Message = { role: 'model', text: 'خطا در پردازش درخواست.' };
      setMessages(prev => [...prev, modelMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-right mb-2 text-white px-1">پشتیبانی تیکتی</h3>
        <form onSubmit={handleTicketSubmit} className="space-y-3 bg-neo-dark-2 p-4 rounded-xl">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="موضوع"
            className="w-full p-2 rounded-lg bg-neo-dark-3 text-white focus:outline-none"
          />
          <textarea
            value={ticketText}
            onChange={(e) => setTicketText(e.target.value)}
            placeholder="شرح مشکل"
            className="w-full p-2 rounded-lg bg-neo-dark-3 text-white h-24 resize-none focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-neo-green text-black font-semibold py-2 rounded-lg hover:bg-green-400 transition-colors"
          >
            ارسال تیکت
          </button>
          {ticketSent && <p className="text-sm text-neo-green text-right">تیکت شما ثبت شد.</p>}
        </form>
        {tickets.length > 0 && (
          <ul className="mt-4 space-y-2">
            {tickets.map(t => (
              <li key={t.id} className="bg-neo-dark-3 p-3 rounded-lg text-right">
                <p className="font-semibold text-gray-200">{t.subject}</p>
                <p className="text-sm text-gray-400 mt-1">{t.message}</p>
                <p className="text-xs text-gray-500 mt-1">وضعیت: {t.status === 'open' ? 'باز' : 'بسته'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="text-lg font-bold text-right mb-2 text-white px-1">پشتیبانی هوشمند</h3>
        <div className="bg-neo-dark-2 rounded-xl flex flex-col h-80">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-neo-green text-black' : 'bg-neo-dark-3 text-gray-200'}`}>
                  <p className="whitespace-pre-wrap text-right">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-neo-dark-3 text-sm text-gray-400">
                  در حال پردازش...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={handleChatSubmit} className="p-4 bg-neo-dark-1/80 border-t border-gray-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="سوال خود را بپرسید"
                className="w-full py-2 pr-4 pl-10 text-white bg-neo-dark-3 rounded-full focus:outline-none focus:ring-2 focus:ring-neo-green placeholder:text-gray-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neo-green text-black disabled:bg-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 rotate-180">
                  <path d="M3.105 3.105a.75.75 0 01.99 0L19.53 11.232a.75.75 0 010 1.536L4.095 20.895a.75.75 0 01-1.282-.84L4.34 12.5H12.5a.75.75 0 000-1.5H4.34L2.813 3.945a.75.75 0 01.292-.84z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(SupportSection);

