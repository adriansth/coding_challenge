export const truncateText = (text: string, maxLength: number = 500) => {
   if (!text) return;
   return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
