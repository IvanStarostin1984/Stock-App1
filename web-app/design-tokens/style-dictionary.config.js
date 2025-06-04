const StyleDictionary = require('style-dictionary').default;

function rgbaToHex(rgba) {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/);
  if (!m) return null;
  const r = parseInt(m[1], 10);
  const g = parseInt(m[2], 10);
  const b = parseInt(m[3], 10);
  const a = m[4] ? Math.round(parseFloat(m[4]) * 255) : 255;
  const toHex = n => n.toString(16).padStart(2, '0').toUpperCase();
  return '0x' + toHex(a) + toHex(r) + toHex(g) + toHex(b);
}

StyleDictionary.registerFormat({
  name: 'css/variables-flat',
  format: ({ dictionary }) =>
    dictionary.allTokens.map(t => `--${t.name}:${t.value};`).join('\n')
});

StyleDictionary.registerFormat({
  name: 'dart/constants',
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map(t => {
      const name = t.name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (t.value.startsWith('#') || t.value.startsWith('rgb')) {
        const hex = t.value.startsWith('#')
          ? '0xFF' + t.value.slice(1).toUpperCase()
          : rgbaToHex(t.value);
        return `const ${name} = Color(${hex});`;
      }
      if (t.value.endsWith('px')) {
        return `const ${name} = ${parseFloat(t.value)}.0;`;
      }
      return `const ${name} = '${t.value}';`;
    });
    return "import 'package:flutter/material.dart';\n" + lines.join('\n') + '\n';
  }
});

module.exports = {
  source: ['tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{ destination: 'tokens.scss', format: 'css/variables-flat' }]
    },
    dart: {
      transformGroup: 'js',
      buildPath: 'build/dart/',
      files: [{ destination: 'tokens.dart', format: 'dart/constants' }]
    }
  }
};

