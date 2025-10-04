import React, { useState } from 'react';
import { ethers } from 'ethers';
import { toPersianDigits, toEnglishDigits } from './formatters';
import { TokenBalance } from '../types';
import { MetaMaskErrorParser } from '../utils/metaMaskError';

/**
 * Extends the global Window interface to include the MetaMask ethereum provider.
 */
declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * A component for interacting with an ERC20-compatible wallet like MetaMask.
 * It allows users to connect their wallet, view their native and ERC20 token balances,
 * and send tokens to another address. It fetches balances using both direct
 * provider calls (for native currency) and the Covalent API (for ERC20 tokens).
 * The component manages its own state for connection status, balances, and transaction forms.
 *
 * @returns {JSX.Element} The ERC20 wallet interaction component.
 */
const ERC20Wallet: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [selected, setSelected] = useState<string>('ETH');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const parseMetaMaskError = (err: any) => MetaMaskErrorParser.parse(err);

  const connectWallet = async () => {
    setError('');
    if (!window.ethereum) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        const dappUrl = window.location.href.replace(/^https?:\/\//, '');
        window.open(`https://metamask.app.link/dapp/${dappUrl}`, '_blank');
      } else {
        setError('متامسک نصب نشده است');
      }
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts?.length) {
        setError('حسابی یافت نشد');
        return;
      }
      const addr = accounts[0];
      setAddress(addr);

      // detect current chain for proper native token info
      const chainHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainHex, 16);

      const nativeMap: Record<number, { symbol: string; name: string; logo: string }> = {
        1: { symbol: 'ETH', name: 'اتریوم', logo: 'Ξ' },
        56: { symbol: 'BNB', name: 'بایننس کوین', logo: '○' },
        137: { symbol: 'MATIC', name: 'متیک', logo: '⬢' },
        42161: { symbol: 'ETH', name: 'آربیتروم', logo: 'Ξ' },
      };
      const native = nativeMap[chainId] || nativeMap[1];

      const balances: TokenBalance[] = [];

      // Always include native balance directly from MetaMask provider
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [addr, 'latest'],
      });
      const nativeBalance = Number(BigInt(balanceHex)) / 1e18;
      balances.push({
        symbol: native.symbol,
        name: native.name,
        balance: nativeBalance,
        logo: native.logo,
        address: native.symbol,
        decimals: 18,
      });

      // Fetch ERC20 token balances via Covalent's public API key
      try {
        const res = await fetch(
          `https://api.covalenthq.com/v1/${chainId}/address/${addr}/balances_v2/?key=ckey_docs`
        );
        const data = await res.json();
        const items = data?.data?.items;
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            const symbol = item.contract_ticker_symbol || '';
            // Skip native token if we've already added it
            if (symbol === native.symbol) return;
            const decimals = Number(item.contract_decimals || 0);
            const balance = Number(BigInt(item.balance || '0')) / Math.pow(10, decimals);
            balances.push({
              symbol,
              name: item.contract_name || '',
              logo: item.logo_url,
              balance,
              address: item.contract_address || '',
              decimals,
            });
          });
        }
      } catch (apiErr) {
        console.error('token fetch error', apiErr);
      }

      setTokens(balances);
      if (balances.length) setSelected(balances[0].symbol);
    } catch (err) {
      console.error(err);
      setError(parseMetaMaskError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const sendToken = async () => {
    if (!window.ethereum || !address) return;
    const amountEng = toEnglishDigits(amount);
    const token = tokens.find((t) => t.symbol === selected);
    if (!token) {
      setError('توکن نامعتبر است');
      return;
    }
    if (!toAddress) {
      setError('آدرس مقصد را وارد کنید');
      return;
    }
    if (!ethers.isAddress(toAddress)) {
      setError('آدرس مقصد نامعتبر است');
      return;
    }
    if (!amountEng || isNaN(Number(amountEng))) {
      setError('مقدار نامعتبر است');
      return;
    }
    if (Number(amountEng) <= 0) {
      setError('مقدار باید بیشتر از صفر باشد');
      return;
    }
    if (Number(amountEng) > token.balance) {
      setError('موجودی کافی نیست');
      return;
    }
    try {
      setError('');
      setSending(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      if (token.address === 'ETH') {
        const tx = await signer.sendTransaction({
          to: toAddress,
          value: ethers.parseEther(amountEng),
        });
        await tx.wait();
      } else {
        const abi = ['function transfer(address to, uint amount) returns (bool)'];
        const contract = new ethers.Contract(token.address, abi, signer);
        const value = ethers.parseUnits(amountEng, token.decimals);
        const tx = await contract.transfer(toAddress, value);
        await tx.wait();
      }
      setAmount('');
      setToAddress('');
      connectWallet();
    } catch (err) {
      console.error(err);
      setError(parseMetaMaskError(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-neo-dark-3 rounded-2xl p-4 space-y-4">
      <h2 className="text-xl font-bold text-white text-right">کیف پول ERC20</h2>

      {address ? (
        <>
          <div className="flex items-center justify-between bg-neo-dark-2 rounded-xl px-3 py-2">
            <span className="text-gray-300 text-sm">{address}</span>
            <button onClick={handleCopy} className="text-xs text-neo-green font-semibold">کپی</button>
          </div>

          <div className="space-y-2">
            {tokens.map((token) => (
              <div
                key={token.symbol + token.name}
                className="flex items-center justify-between text-white"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  {token.logo ? (
                    token.logo.startsWith('http') ? (
                      <img
                        src={token.logo}
                        alt={token.symbol}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <span>{token.logo}</span>
                    )
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-gray-500" />
                  )}
                  <span className="font-medium">{token.name}</span>
                  <span className="text-gray-400 text-xs">({token.symbol})</span>
                </div>
                <span className="font-semibold">
                  {toPersianDigits(token.balance.toFixed(4))}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-neo-dark-2 pt-4 space-y-2">
            <div className="flex space-x-2 space-x-reverse">
              <select
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value);
                  setError('');
                }}
                className="flex-1 bg-neo-dark-2 text-white rounded-xl px-2 py-1 text-sm"
              >
                {tokens.map((t) => (
                  <option key={t.symbol} value={t.symbol} className="text-black">
                    {t.symbol}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="آدرس مقصد"
                value={toAddress}
                onChange={(e) => {
                  setToAddress(e.target.value);
                  setError('');
                }}
                className="flex-1 bg-neo-dark-2 rounded-xl px-2 py-1 text-white text-sm"
              />
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <input
                type="text"
                placeholder="مقدار"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className="flex-1 bg-neo-dark-2 rounded-xl px-2 py-1 text-white text-sm"
              />
              <button
                onClick={sendToken}
                disabled={sending}
                className="px-4 py-1 rounded-xl bg-neo-green text-black text-sm font-semibold disabled:opacity-50"
              >
                {sending ? 'در حال ارسال...' : 'ارسال'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="w-full text-center py-2 rounded-xl font-semibold text-black bg-neo-green hover:bg-opacity-90 transition-all"
        >
          {loading ? 'در حال اتصال...' : 'اتصال متامسک'}
        </button>
      )}
      {error && (
        <div className="text-red-500 text-sm font-semibold text-right">{error}</div>
      )}
    </div>
  );
};

export default ERC20Wallet;
