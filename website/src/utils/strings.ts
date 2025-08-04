/**
 * Truncate text to certain amount of characters, then add "..."
 * @param text
 * @param maxLength
 * @returns
 */
export const truncateText = (text: string, maxLength: number = 500) => {
   if (!text) return;
   return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
