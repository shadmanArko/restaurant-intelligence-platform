import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  js.configs.recommended,

  {
    files: ['src/**/*.ts', 'test/**/*.ts'],

    languageOptions: {
      parser: tsParser,

      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },

      globals: {
        ...globals.node,
        ...globals.jest,
        NodeJS: 'readonly',
      },
    },

    plugins: {
      '@typescript-eslint': tseslint,
    },

    rules: {
      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  eslintConfigPrettier,
];