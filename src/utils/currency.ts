
/**
 * Format price from cents to currency string
 */
export const formatPrice = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

/**
 * Convert dollars to cents
 */
export const dollarsToCents = (dollars: number): number => {
  return Math.round(dollars * 100);
};

/**
 * Convert cents to dollars
 */
export const centsToDollars = (cents: number): number => {
  return cents / 100;
};

/**
 * Format weight from grams to display format
 */
export const formatWeight = (grams: number): string => {
  if (grams < 1000) {
    return `${grams}g`;
  }
  return `${(grams / 1000).toFixed(1)}kg`;
};
