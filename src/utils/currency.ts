import { CurrencyCode } from '../types';

const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { rate: number; symbol: string; label: string; flag: string }
> = {
  MAD: { rate: 6.5, symbol: 'MAD', label: 'MAD', flag: 'MA' },
  USD: { rate: 0.66, symbol: '$', label: 'USD', flag: 'US' },
  EUR: { rate: 0.61, symbol: '€', label: 'EUR', flag: 'EU' },
  GBP: { rate: 0.52, symbol: '£', label: 'GBP', flag: 'GB' },
};

export const CURRENCIES: CurrencyCode[] = ['MAD', 'USD', 'EUR', 'GBP'];

export function getCurrencyMeta(currency: CurrencyCode) {
  return CURRENCY_CONFIG[currency];
}

export function formatPrice(priceAud: number, currency: CurrencyCode): string {
  const { rate, symbol } = CURRENCY_CONFIG[currency];
  const converted = priceAud * rate;
  if (currency === 'MAD') {
    return `${converted.toFixed(2)} MAD`;
  }
  return `${symbol}${converted.toFixed(2)}`;
}

export function formatInstallment(priceAud: number, currency: CurrencyCode): string {
  const { rate, symbol } = CURRENCY_CONFIG[currency];
  const installment = (priceAud * rate) / 4;
  if (currency === 'MAD') {
    return `${installment.toFixed(2)} MAD`;
  }
  return `${symbol}${installment.toFixed(2)}`;
}
