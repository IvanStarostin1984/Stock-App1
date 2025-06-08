export class SymbolTrie {
  private symbols: string[] = [];

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
      .slice(0, limit);
  }
}
