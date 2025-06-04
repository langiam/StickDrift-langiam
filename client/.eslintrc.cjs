// client/.eslintrc.cjs

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, 
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  settings: {
    react: {
      // “automatic” runtime lets you use JSX without importing React
      version: 'detect',
      pragma: 'React',
      fragment: 'Fragment',
    },
  },
  rules: {
    // 1) Turn off “React must be in scope” for JSX:
    'react/react-in-jsx-scope': 'off',

    // 2) If you want to allow “any” temporarily, lower the severity:
    '@typescript-eslint/no-explicit-any': 'warn',

    // 3) (Optional) If you don’t want to see unused-vars for React components:
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^React$' },
    ],

    // You can add any other custom rules here…
  },
};
