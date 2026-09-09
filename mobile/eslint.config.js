const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const noCommentedCode = require('eslint-plugin-no-commented-code');
const noComments = require('eslint-plugin-no-comments');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { 'no-commented-code': noCommentedCode, 'no-comments': noComments },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow' },
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        { selector: 'variable', modifiers: ['destructured'], format: null },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
        { selector: 'typeParameter', format: ['PascalCase'], prefix: ['T'] },
        { selector: 'enumMember', format: ['UPPER_CASE'] },
        { selector: ['objectLiteralProperty', 'typeProperty'], format: null },
        { selector: 'import', format: ['camelCase', 'PascalCase'] },
      ],

      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',

      'no-commented-code/no-commented-code': 'error',
      'no-comments/disallowComments': [
        'error',
        { allow: ['eslint', 'global', '@ts-', 'prettier-ignore'] },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],

      'react/no-multi-comp': ['error', { ignoreStateless: false }],

      'max-lines-per-function': [
        'error',
        { max: 50, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
      complexity: ['error', { max: 10 }],
      'max-depth': ['error', { max: 3 }],
      'max-params': ['error', { max: 4 }],
      'max-nested-callbacks': ['error', { max: 3 }],

      'id-denylist': [
        'error',
        'info',
        'temp',
        'tmp',
        'val',
        'obj',
        'e',
        'cb',
        'foo',
        'bar',
        'next',
        'prev',
        'item',
        'thing',
        'stuff',
        'handler',
        'callback',
        'res',
        'req',
        'str',
        'num',
        'arr',
        'el',
        'elem',
        'fn',
        'func',
      ],
      'id-length': [
        'error',
        { min: 2, exceptions: ['_', 'x', 'y', 'i', 't'], properties: 'never' },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'max-lines-per-function': 'off',
      'max-lines': 'off',
      'max-nested-callbacks': 'off',
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
