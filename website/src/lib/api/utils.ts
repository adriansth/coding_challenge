/**
 * Helper function to calculate total pages
 * @param totalCount
 * @param limit
 * @returns
 */
export function calculateTotalPages(totalCount: number, limit: number): number {
   return Math.ceil(totalCount / limit);
}

/**
 * Helper function to calculate current page from tokens
 * @param tokens
 * @param limit
 * @returns
 */
export function calculateCurrentPage(tokens: string[], limit: number): number {
   return tokens.length + 1;
}
