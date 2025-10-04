const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ENGLISH_DIGITS = '0123456789';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/**
 * Converts English digits (0-9) in a string or number to their Persian counterparts (۰-۹).
 * Also handles the decimal point.
 * @param {number | string} n - The number or string to convert.
 * @returns {string} The formatted string with Persian digits.
 */
export const toPersianDigits = (n: number | string): string => {
  return String(n).replace(/[0-9.]/g, (w) => {
    if (w === '.') return '٫';
    return PERSIAN_DIGITS[parseInt(w, 10)];
  });
};

/**
 * Converts Persian or Arabic digits within a string to their English (0-9) equivalents.
 * @param {string} str - The string containing Persian or Arabic digits.
 * @returns {string} The string with all digits converted to English.
 */
export const toEnglishDigits = (str: string): string => {
  if (!str) return '';
  return String(str)
    .replace(new RegExp(`[${PERSIAN_DIGITS}]`, 'g'), (w) => ENGLISH_DIGITS[PERSIAN_DIGITS.indexOf(w)])
    .replace(new RegExp(`[${ARABIC_DIGITS}]`, 'g'), (w) => ENGLISH_DIGITS[ARABIC_DIGITS.indexOf(w)]);
};

/**
 * Parses a price string, which may contain Persian digits and currency symbols, into a floating-point number.
 * @param {string} priceString - The price string to parse (e.g., "۱۵,۳۲۰ ریال" or "$۶۷,۵۰۰.۰۰").
 * @returns {number} The parsed numeric value, or 0 if parsing fails.
 */
export const parsePrice = (priceString: string): number => {
  if (!priceString) return 0;
  const englishStr = toEnglishDigits(priceString);
  const numericStr = englishStr.replace(/[^0-9.]/g, '');
  return parseFloat(numericStr) || 0;
};

/**
 * Formats a number into a standard Persian currency string with thousand separators.
 * @param {number | string} num - The number to format.
 * @returns {string} The formatted string with Persian digits and '،' as a thousand separator.
 */
export const toPersianFormatted = (num: number | string): string => {
  const numStr = String(num);
  const formatted = Number(numStr).toLocaleString('en-US', { maximumFractionDigits: 8 });
  return toPersianDigits(formatted).replace(/,/g, '،');
};
