import React, { useEffect, useState, memo } from 'react';
import { BrowserProvider, parseEther } from 'ethers';
import { MetaMaskErrorParser } from '../utils/metaMaskError';

const PREMIUM_ADDRESS = '0x000000000000000000000000000000000000dead';
const PREMIUM_PRICE_ETH = '0.01';

declare global {
  interface Window { ethereum?: any }
}

const PremiumSection: React.FC = () => {
  const [expiry, setExpiry] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('premiumExpiry');
    if (stored) {
      const time = Number(stored);
      if (time > Date.now()) setExpiry(time);
    }
  }, []);

  const buyPremium = async () => {
    setError(null);
    try {
      if (!window.ethereum) {
        setError('متامسک نصب نشده است');
        return;
      }
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      await signer.sendTransaction({
        to: PREMIUM_ADDRESS,
        value: parseEther(PREMIUM_PRICE_ETH),
      });
      const newExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem('premiumExpiry', String(newExpiry));
      setExpiry(newExpiry);
    } catch (err) {
      setError(MetaMaskErrorParser.parse(err));
    } finally {
      setLoading(false);
    }
  };

  const remaining = expiry ? Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="bg-neo-dark-2 rounded-xl p-4 space-y-3">
      <h3 className="text-lg font-bold text-right text-white">اشتراک پرمیوم</h3>
      {expiry && expiry > Date.now() ? (
        <p className="text-right text-gray-300">اکانت پرمیوم فعال است؛ {remaining} روز باقی مانده.</p>
      ) : (
        <button
          onClick={buyPremium}
          disabled={loading}
          className="w-full bg-neo-green text-black rounded-lg py-2 font-semibold disabled:opacity-50"
        >
          {loading ? 'در حال پرداخت…' : `خرید ماهانه (${PREMIUM_PRICE_ETH} ETH)`}
        </button>
      )}
      {error && <p className="text-red-500 text-sm text-right">{error}</p>}
    </div>
  );
};

export default memo(PremiumSection);
