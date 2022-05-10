module.exports = {
  env: {
    node: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 8,
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
  overrides: [
    {
      files: [
        'src/**/*.test.js',
      ],
      env: {
        jest: true,
      }
    }
  ],
};
