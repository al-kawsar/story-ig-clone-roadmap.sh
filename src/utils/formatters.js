/**
 * Format timestamp to relative time (e.g., "2j", "Kemarin")
 */
export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Baru saja";
  if (diffInHours < 24) return `${diffInHours}j`;
  if (diffInHours < 48) return "Kemarin";
  return `${Math.floor(diffInHours / 24)}h`;
};

/**
 * Format number with K/M suffix
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};
