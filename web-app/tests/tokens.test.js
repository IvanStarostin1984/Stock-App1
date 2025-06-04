import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

const css = readFileSync('design-tokens/build/css/tokens.scss', 'utf8');
const dart = readFileSync('design-tokens/build/dart/tokens.dart', 'utf8');

describe('design tokens', () => {
  it('include clr-primary-700 in outputs', () => {
    expect(css).toMatch('--clr-primary-700:#0F3BD9;');
    expect(dart).toMatch('const ClrPrimary700 = Color(0xFF0F3BD9);');
  });
});

