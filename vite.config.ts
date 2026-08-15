import { defineConfig, lazyPlugins } from 'vite-plus'
import { loadEnv } from 'vite-plus'
import react from '@vitejs/plugin-react'
import vercel from 'vite-plugin-vercel/vite'
import { getVercelEntries } from 'vite-plugin-vercel'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

const entries = await getVercelEntries('src/api', { destination: 'api' })

Object.assign(process.env, loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), ''))

// https://vite.dev/config/
export default defineConfig({
  staged: {
    '*': 'vp check --fix'
  },
  lint: {
    plugins: ['oxc', 'typescript', 'unicorn', 'react'],
    categories: {
      correctness: 'warn'
    },
    options: {
      typeAware: true,
      typeCheck: true
    },
    env: {
      builtin: true
    },
    ignorePatterns: ['dist', 'eslint.config.js', 'vite.config.ts', '**/routeTree.gen.ts'],
    overrides: [
      {
        files: ['**/*.{ts,tsx}'],
        rules: {
          'constructor-super': 'error',
          'for-direction': 'error',
          'getter-return': 'error',
          'no-async-promise-executor': 'error',
          'no-case-declarations': 'error',
          'no-class-assign': 'error',
          'no-compare-neg-zero': 'error',
          'no-cond-assign': 'error',
          'no-const-assign': 'error',
          'no-constant-binary-expression': 'error',
          'no-constant-condition': 'error',
          'no-control-regex': 'error',
          'no-debugger': 'error',
          'no-delete-var': 'error',
          'no-dupe-class-members': 'error',
          'no-dupe-else-if': 'error',
          'no-dupe-keys': 'error',
          'no-duplicate-case': 'error',
          'no-empty': 'error',
          'no-empty-character-class': 'error',
          'no-empty-pattern': 'error',
          'no-empty-static-block': 'error',
          'no-ex-assign': 'error',
          'no-extra-boolean-cast': 'error',
          'no-fallthrough': 'error',
          'no-func-assign': 'error',
          'no-global-assign': 'error',
          'no-import-assign': 'error',
          'no-invalid-regexp': 'error',
          'no-irregular-whitespace': 'error',
          'no-loss-of-precision': 'error',
          'no-misleading-character-class': 'error',
          'no-new-native-nonconstructor': 'error',
          'no-nonoctal-decimal-escape': 'error',
          'no-obj-calls': 'error',
          'no-prototype-builtins': 'error',
          'no-redeclare': 'error',
          'no-regex-spaces': 'error',
          'no-self-assign': 'error',
          'no-setter-return': 'error',
          'no-shadow-restricted-names': 'error',
          'no-sparse-arrays': 'error',
          'no-this-before-super': 'error',
          'no-undef': 'error',
          'no-unexpected-multiline': 'error',
          'no-unreachable': 'error',
          'no-unsafe-finally': 'error',
          'no-unsafe-negation': 'error',
          'no-unsafe-optional-chaining': 'error',
          'no-unused-labels': 'error',
          'no-unused-private-class-members': 'error',
          'no-unused-vars': [
            'warn',
            {
              varsIgnorePattern: '^_',
              argsIgnorePattern: '^_'
            }
          ],
          'no-useless-backreference': 'error',
          'no-useless-catch': 'error',
          'no-useless-escape': 'error',
          'no-with': 'error',
          'require-yield': 'error',
          'use-isnan': 'error',
          'valid-typeof': 'error',
          'no-array-constructor': 'error',
          'no-implied-eval': 'off',
          'no-unused-expressions': 'error',
          'no-throw-literal': 'off',
          'prefer-promise-reject-errors': 'off',
          'require-await': 'off',
          'typescript/await-thenable': 'error',
          'typescript/ban-ts-comment': 'error',
          'typescript/no-array-delete': 'error',
          'typescript/no-base-to-string': 'error',
          'typescript/no-duplicate-enum-values': 'error',
          'typescript/no-duplicate-type-constituents': 'error',
          'typescript/no-empty-object-type': 'error',
          'typescript/no-explicit-any': 'off',
          'typescript/no-extra-non-null-assertion': 'error',
          'typescript/no-floating-promises': 'error',
          'typescript/no-for-in-array': 'error',
          'typescript/no-implied-eval': 'error',
          'typescript/no-misused-new': 'error',
          'typescript/no-misused-promises': [
            'error',
            {
              checksVoidReturn: {
                attributes: true
              }
            }
          ],
          'typescript/no-namespace': 'error',
          'typescript/no-non-null-asserted-optional-chain': 'error',
          'typescript/no-redundant-type-constituents': 'error',
          'typescript/no-require-imports': 'error',
          'typescript/no-this-alias': 'error',
          'typescript/no-unnecessary-type-assertion': 'error',
          'typescript/no-unnecessary-type-constraint': 'error',
          'typescript/no-unsafe-argument': 'off',
          'typescript/no-unsafe-assignment': 'off',
          'typescript/no-unsafe-call': 'off',
          'typescript/no-unsafe-declaration-merging': 'error',
          'typescript/no-unsafe-enum-comparison': 'error',
          'typescript/no-unsafe-function-type': 'error',
          'typescript/no-unsafe-member-access': 'off',
          'typescript/no-unsafe-return': 'off',
          'typescript/no-unsafe-unary-minus': 'error',
          'typescript/no-wrapper-object-types': 'error',
          'typescript/only-throw-error': 'error',
          'typescript/prefer-as-const': 'error',
          'typescript/prefer-namespace-keyword': 'error',
          'typescript/prefer-promise-reject-errors': 'error',
          'typescript/require-await': 'off',
          'typescript/restrict-plus-operands': 'error',
          'typescript/restrict-template-expressions': 'error',
          'typescript/triple-slash-reference': 'error',
          'typescript/unbound-method': 'error',
          'react/rules-of-hooks': 'error',
          'react/exhaustive-deps': 'warn',
          'react/only-export-components': [
            'warn',
            {
              allowConstantExport: true
            }
          ]
        },
        env: {
          es2020: true,
          browser: true,
          node: true
        }
      },
      {
        files: ['src/routes/**/*.tsx'],
        rules: {
          'react/only-export-components': 'off',
          'typescript/only-throw-error': 'off'
        }
      }
    ],
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin'
      }
    ],
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error'
    }
  },
  fmt: {
    singleQuote: true,
    jsxSingleQuote: false,
    semi: false,
    trailingComma: 'none',
    endOfLine: 'lf',
    printWidth: 100,
    sortPackageJson: false,
    ignorePatterns: ['**/routeTree.gen.ts']
  },
  plugins: lazyPlugins(() => [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true
    }),
    vercel({ entries }),
    react()
  ]),
  server: {
    port: 5173
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './testSetup.ts'
  }
})
