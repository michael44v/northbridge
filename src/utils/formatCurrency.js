export const formatUSD = (amount, currencyCode = 'USD') => {
  const code = currencyCode || 'USD';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
    }).format(amount);
  } catch (e) {
    const symbol = code === 'GBP' ? '£' : code === 'EUR' ? '€' : '$';
    return `${symbol}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
};

export const formatUSD_S = (amount) => {
  const value = Number(amount);
  
  // Handle Millions
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  
  // Handle Thousands
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  
  // Handle standard small amounts
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0, // Keeps it to "3 figures" style
  }).format(value);
};