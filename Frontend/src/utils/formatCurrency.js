/**
 * Format number menjadi format rupiah dengan separator ribuan
 * @param {number} amount - Jumlah dalam rupiah (integer)
 * @returns {string} Format rupiah dengan separator (contoh: 100.000)
 */
export function formatCurrency(amount) {
  if (!amount) return "0";
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Format number menjadi format rupiah dengan label "Rp"
 * @param {number} amount - Jumlah dalam rupiah (integer)
 * @returns {string} Format lengkap (contoh: Rp 100.000)
 */
export function formatCurrencyRp(amount) {
  return `Rp ${formatCurrency(amount)}`;
}
