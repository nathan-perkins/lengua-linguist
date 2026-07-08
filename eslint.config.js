import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: [
      'dist',
      'eslint.config.js',
      'vite.config.ts'
    ]
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.eslint.json']
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': [
        2,
        {
          checksVoidReturn: {
            attributes: true
          }
        }
      ],
      quotes: [
        'error',
        'single',
        { avoidEscape: true, allowTemplateLiterals: true }
      ],
      'jsx-quotes': ['error', 'prefer-double'],
      semi: ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'eol-last': ['error', 'always'],
      'object-curly-newline': [
        'error',
        {
          ObjectExpression: {
            minProperties: 4,
            multiline: true,
            consistent: true
          },
          ObjectPattern: {
            minProperties: 4,
            multiline: true,
            consistent: true
          },
          ImportDeclaration: {
            minProperties: 4,
            multiline: true,
            consistent: true
          },
          ExportDeclaration: {
            minProperties: 4,
            multiline: true,
            consistent: true
          }
        }
      ],
      'object-property-newline': [
        'error',
        { allowAllPropertiesOnSameLine: true }
      ],
      'array-bracket-newline': ['error', { multiline: true, minItems: 4 }],
      'array-element-newline': ['error', { multiline: true, minItems: 4 }]
    }
  },
  {
    files: ['src/routes/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off'
    }
  },
])
