export class MetaMaskErrorParser {
  static parse(err: any): string {
    const code = err?.code ?? err?.data?.code ?? err?.error?.code;
    const msgRaw = err?.data?.message || err?.error?.message || err?.message || '';
    const msg = msgRaw.toLowerCase();
    if (code === 4001 || msg.includes('user rejected')) return 'کاربر درخواست را رد کرد';
    if (code === 4100) return 'دسترسی به حساب مجاز نیست';
    if (code === 4900) return 'اتصال به شبکه قطع است';
    if (code === 4901) return 'شبکه در دسترس نیست';
    if (code === 4902) return 'شبکه انتخاب شده پشتیبانی نمی‌شود';
    if (
      code === 'INSUFFICIENT_FUNDS' ||
      msg.includes('insufficient funds') ||
      msg.includes('insufficient balance')
    )
      return 'موجودی کافی نیست';
    if (msg.includes('insufficient resources')) return 'کمبود منابع';
    if (msg.includes('nonce too low')) return 'نانس خیلی پایین است';
    if (msg.includes('replacement transaction underpriced'))
      return 'کارمزد کافی نیست';
    if (msg.includes('execution reverted')) return 'تراکنش توسط قرارداد رد شد';
    if (msg.includes('network changed')) return 'شبکه تغییر کرده است';
    return msgRaw ? `خطا: ${msgRaw}` : 'خطا در ارتباط با متامسک';
  }
}
