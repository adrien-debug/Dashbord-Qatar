/**
 * Utilitaires de formatage de nombres - Standards Hearst
 * Format européen avec espaces pour les milliers
 */

/**
 * Formate un nombre avec des espaces pour les milliers
 * Ex: 5760 → "5 760"
 * Ex: 5712.5 → "5 712.5"
 */
export function formatNumber(value: number): string {
  // Séparer partie entière et décimale
  const parts = value.toString().split('.');
  // Ajouter espaces pour milliers dans partie entière
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  // Rejoindre avec point décimal
  return parts.join('.');
}

/**
 * Formate un nombre avec décimales et espaces
 * Ex: 5760.50 → "5 760.50"
 */
export function formatNumberWithDecimals(value: number, decimals: number = 2): string {
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Formate une valeur monétaire
 * Ex: 5760000 → "5 760 000 $"
 */
export function formatCurrency(value: number, currency: string = '$', decimals: number = 0): string {
  const formatted = formatNumberWithDecimals(value, decimals);
  return `${formatted} ${currency}`;
}

/**
 * Formate un pourcentage
 * Ex: 0.9567 → "95.67%"
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formate un nombre avec unité
 * Ex: 1020 → "1 020 PH/s"
 */
export function formatWithUnit(value: number, unit: string, decimals: number = 0): string {
  const formatted = formatNumberWithDecimals(value, decimals);
  return `${formatted} ${unit}`;
}

/**
 * Formate un nombre en notation compacte
 * Ex: 1000000 → "1.00M"
 */
export function formatCompact(value: number, decimals: number = 2): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(decimals)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(decimals)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(decimals)}K`;
  }
  return value.toString();
}
