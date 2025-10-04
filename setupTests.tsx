import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
  ok: true,
  json: async () => ({}),
})) as any);

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserver);

Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', { value: vi.fn(), writable: true });

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = { generateContent: async () => ({ text: '[]' }) };
  },
  Type: { OBJECT: 'object' }
}));

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: (props: any) => <button onClick={() => props.onSuccess?.({})}>GoogleLogin</button>,
  GoogleOAuthProvider: ({ children }: any) => <div>{children}</div>
}));

vi.mock('lightweight-charts', () => {
  const fitContent = vi.fn();
  return {
    createChart: vi.fn(() => ({
      addCandlestickSeries: vi.fn(() => ({ setData: vi.fn() })),
      addHistogramSeries: vi.fn(() => ({ setData: vi.fn() })),
      timeScale: vi.fn(() => ({ fitContent })),
      remove: vi.fn(),
    })),
  };
}, { virtual: true });

delete (process.env.API_KEY);
delete (process.env.GEMINI_API_KEY);
