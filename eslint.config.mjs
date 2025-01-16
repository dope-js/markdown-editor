import eslint from '@eslint/js';
import prettierConf from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import globals from 'globals';
import { configs as tsConfigs, parser as tsParser, plugin as tsPlugin } from 'typescript-eslint';

const basicConf = {
  ignores: ['dist/*', '**/*.js'],
};

const thirdPartyConf = [
  eslint.configs.recommended,
  ...tsConfigs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
];

const plugins = {
  plugins: {
    '@typescript-eslint': tsPlugin,
    react,
    prettier,
  },
};

const languageOptions = {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.jest,
      ...globals.node,
    },
    parser: tsParser,
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
};

const settings = {
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
      },
      typescript: { project: 'packages/*/tsconfig.json' },
    },
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};

const rules = {
  rules: {
    'import/order': [
      'warn',
      {
        groups: [
          ['external', 'builtin'],
          ['internal', 'sibling', 'parent', 'index'],
        ],

        pathGroups: [
          {
            pattern: '@/**',
            group: 'external',
          },
        ],

        pathGroupsExcludedImportTypes: ['react'],

        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'react/prop-types': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { args: 'after-used', argsIgnorePattern: '^_', vars: 'all', varsIgnorePattern: '^_' },
    ],
  },
};

export default [basicConf, ...thirdPartyConf, plugins, languageOptions, settings, rules, prettierConf];
