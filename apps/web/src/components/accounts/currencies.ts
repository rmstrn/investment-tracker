// TODO(Slice 8 Settings): extract shared CURRENCY_CHOICES into packages/shared.
// OpenAPI `Currency` is an open regex `^[A-Z]{3}$`, not a closed enum, so this
// list is a product choice (EU-focused retail audience) rather than a schema
// constraint.
export const CURRENCY_CHOICES = [
  'EUR',
  'USD',
  'GBP',
  'UAH',
  'PLN',
  'CHF',
  'JPY',
  'CAD',
  'AUD',
  'SEK',
] as const;

export type CurrencyChoice = (typeof CURRENCY_CHOICES)[number];

export const DEFAULT_CURRENCY: CurrencyChoice = 'EUR';
