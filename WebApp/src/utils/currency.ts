/**
 * Formats a numeric value into a localized currency string.
 * Uses Intl.NumberFormat to automatically handle symbol placement, 
 * decimal separators, and grouping separators.
 * 
 * @param value The numeric value to format
 * @param currencyCode The ISO currency code (e.g., 'USD', 'EUR')
 * @param options Additional Intl.NumberFormat options
 */
export function formatCurrency(
  value: number,
  currencyCode: string = 'USD',
  options: Intl.NumberFormatOptions = {}
): string {
  // Use the browser's current locale as a base, or default to US if unavailable.
  // Note: For certain currencies like EUR, many European locales place the symbol on the right.
  // Using the browser's locale is usually the best "guess" at formatting preference.
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: options.maximumFractionDigits !== undefined ? Math.min(2, options.maximumFractionDigits) : 2,
    maximumFractionDigits: 2,
  };

  try {
    return new Intl.NumberFormat(undefined, {
      ...defaultOptions,
      ...options,
    }).format(value);
  } catch (err) {
    // Fallback if Intl.NumberFormat fails
    console.error("Currency formatting error:", err);
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}

/**
 * Formats a currency value with optional "compact" notation for large numbers.
 */
export function formatCompactCurrency(
  value: number,
  currencyCode: string = 'USD'
): string {
  if (value >= 1000000) {
    return formatCurrency(value / 1000000, currencyCode, { 
      maximumFractionDigits: 1, 
      notation: 'compact' 
    });
  }
  if (value >= 1000) {
    return formatCurrency(value, currencyCode, { 
      notation: 'compact',
      maximumFractionDigits: 0
    });
  }
  return formatCurrency(value, currencyCode);
}
