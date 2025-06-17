import { describe, it, expect } from 'vitest';
import { SymbolTrie } from '../src/utils/SymbolTrie';

describe('SymbolTrie', () => {
  it('returns matches for prefixes', () => {
    const trie = new SymbolTrie();
    trie.load(['AAA', 'AAB']);
    expect(trie.search('AA')).toEqual(['AAA', 'AAB']);
  });

  it('returns empty array when no symbols match', () => {
    const trie = new SymbolTrie();
    trie.load(['AAA', 'AAB']);
    expect(trie.search('ZZ')).toEqual([]);
  });
});

