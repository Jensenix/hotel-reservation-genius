// backend/eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import nodePlugin from 'eslint-plugin-n';
import securityPlugin from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      'dist/**',
      'build/**',
      'logs/**',
      '*.config.js',
    ],
  },

  js.configs.recommended,

  /*
   * SonarJS code-smell rules.
   * Do not also add `sonarjs` inside plugins manually here,
   * because the recommended config already registers it.
   */
  sonarjs.configs.recommended,

  {
    files: ['**/*.{js,mjs,cjs}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },

    plugins: {
      n: nodePlugin,
      security: securityPlugin,
    },

    rules: {
      /*
       * General correctness
       */
      'no-undef': 'error',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-duplicate-imports': 'error',
      'no-unreachable': 'error',
      'no-constant-condition': 'warn',

      /*
       * Async / promise safety
       */
      'no-async-promise-executor': 'error',
      'no-promise-executor-return': 'error',
      'require-await': 'warn',
      'no-await-in-loop': 'warn',
      'no-return-await': 'warn',

      /*
       * Cleaner backend code
       */
      'consistent-return': 'warn',
      'default-case-last': 'warn',
      'no-useless-catch': 'warn',
      'no-else-return': 'warn',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',

      /*
       * Console logs
       */
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info', 'log'],
        },
      ],

      /*
       * Node.js rules
       */
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-process-exit': 'warn',
      'n/prefer-node-protocol': 'warn',

      /*
       * Security rules
       */
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-child-process': 'warn',
      'security/detect-eval-with-expression': 'error',
      'security/detect-new-buffer': 'error',
      'security/detect-no-csrf-before-method-override': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'warn',

      /*
       * SonarJS tuning
       * Keep these as warnings first so you can review gradually.
       */
      'sonarjs/cognitive-complexity': ['warn', 20],
      'sonarjs/no-duplicated-branches': 'warn',
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-redundant-boolean': 'warn',
      'sonarjs/no-small-switch': 'off',
    },
  },

  /*
   * Sequelize migrations/seeders often use CommonJS.
   */
  {
    files: ['migrations/**/*.cjs', 'seeders/**/*.cjs', '**/*.cjs'],

    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
  },
];