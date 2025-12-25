/**
 * Grid configuration utilities for responsive layouts
 */

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1280,
};

export const GRID_COLUMNS = {
  mobile: 2,
  tablet: 3,
  desktop: 4,
  largeDesktop: 5,
};

export const GAP = 8;
export const PADDING = 32;
export const ASPECT_RATIO = 16 / 9; // Height / Width for 9:16 cards

/**
 * Get number of columns based on screen width
 */
export const getGridColumns = (width = window.innerWidth) => {
  if (width >= BREAKPOINTS.largeDesktop) return GRID_COLUMNS.largeDesktop;
  if (width >= BREAKPOINTS.desktop) return GRID_COLUMNS.desktop;
  if (width >= BREAKPOINTS.tablet) return GRID_COLUMNS.tablet;
  return GRID_COLUMNS.mobile;
};

/**
 * Calculate row height based on screen width and aspect ratio
 */
export const getRowHeight = (width = window.innerWidth) => {
  const columns = getGridColumns(width);
  const cardWidth = (width - PADDING - GAP * (columns - 1)) / columns;
  return Math.round(cardWidth * ASPECT_RATIO) + GAP;
};

/**
 * Get grid settings for current screen
 */
export const getGridSettings = (width = window.innerWidth) => {
  return {
    columns: getGridColumns(width),
    rowHeight: getRowHeight(width),
    gap: GAP,
    padding: PADDING,
  };
};
