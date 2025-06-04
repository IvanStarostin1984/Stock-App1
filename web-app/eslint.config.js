import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{js,ts,vue}', 'tests/**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: 'module'
      }
    },
    plugins: {
      vue,
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...vue.configs['flat/recommended'].rules,
      ...tsPlugin.configs['flat/recommended'].rules,
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'eol-last': ['error', 'always']
    }
  }
];
