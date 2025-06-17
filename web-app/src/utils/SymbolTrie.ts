export class SymbolTrie {
  private symbols: string[] = [];

  private static levenshtein(a: string, b: string): number {
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return dp[a.length][b.length];
  }

  /**
   * Load ticker symbols into the trie.
   *
   * @param list - Symbols to store.
   */
  load(list: string[]) {
    this.symbols = [...list];
  }

  /**
   * Search for ticker prefixes.
   *
   * @param term - Prefix to match.
   * @param limit - Max number of suggestions.
   * @returns Matching symbols up to the given limit.
   */
  search(term: string, limit = 5): string[] {
    const query = term.toLowerCase();
    return this.symbols
      .filter(s => s.toLowerCase().startsWith(query))
      .sort((a, b) =>
        SymbolTrie.levenshtein(a.toLowerCase(), query) -
        SymbolTrie.levenshtein(b.toLowerCase(), query)
      )
      .slice(0, limit);
  }
}
