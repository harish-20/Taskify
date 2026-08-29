import { nextJsConfig } from '@repo/eslint-config/next-js';
import importPlugin from 'eslint-plugin-import';
import storybook from 'eslint-plugin-storybook';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ['.next/**', 'out/**', 'coverage/**', 'next-env.d.ts'],
  },

  ...nextJsConfig,

  {
    plugins: {
      import: importPlugin,
    },

    settings: {
      'import/resolver': {
        node: true,
      },
    },

    rules: {
      'react/prop-types': 'off',

      // Import plugin recommended rules
      ...importPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.typescript.rules,

      // Resolver-dependent rules are disabled because the TS resolver
      // in this workspace is currently incompatible with eslint-plugin-import.
      'import/namespace': 'off',
      'import/default': 'off',
      'import/named': 'off',
      'import/no-unresolved': 'off',

      // Custom rules
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'import/no-duplicates': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-cycle': 'warn',

      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          caughtErrors: 'all',
          ignoreRestSiblings: false,
          ignoreUsingDeclarations: false,
          reportUsedIgnorePattern: false,
        },
      ],
    },
  },

  ...storybook.configs['flat/recommended'],
];
