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

  it('ranks results by edit distance', () => {
    const trie = new SymbolTrie();
    trie.load(['AAPLX', 'AAPL', 'AAPLXY']);
    expect(trie.search('AAPL', 3)).toEqual(['AAPL', 'AAPLX', 'AAPLXY']);
  });

  it('handles case insensitive queries', () => {
    const trie = new SymbolTrie();
    trie.load(['Abc', 'aBD']);
    expect(trie.search('ab')).toEqual(['Abc', 'aBD']);
  });
});

