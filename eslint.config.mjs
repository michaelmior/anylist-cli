import globals from 'globals';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },
  {
    files: [
      'src/**/*.test.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      }
    }
  }
];
