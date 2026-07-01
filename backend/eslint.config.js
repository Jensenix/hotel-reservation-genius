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
    ],
  },

  js.configs.recommended,
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
      'prefer-const': 'warn',
      eqeqeq: ['error', 'always'],
      curly: ['warn', 'all'],
      'no-duplicate-imports': 'warn',
      'no-unreachable': 'error',

      // Too noisy for Express/service facade style
      'require-await': 'off',
      'consistent-return': 'off',

      // Useful but should not block cleanup
      'no-await-in-loop': 'warn',
      'no-useless-catch': 'warn',
      'no-else-return': 'warn',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',

      // Backend logs and shutdown code are acceptable
      'no-console': 'off',
      'n/no-process-exit': 'off',

      // Node rules
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      'n/prefer-node-protocol': 'warn',

      // Security rules
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-child-process': 'warn',
      'security/detect-eval-with-expression': 'error',
      'security/detect-new-buffer': 'error',

      // SonarJS tuning
      'sonarjs/cognitive-complexity': ['warn', 25],
      'sonarjs/no-duplicated-branches': 'warn',
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-redundant-boolean': 'warn',
      'sonarjs/prefer-single-boolean-return': 'warn',

      // Too noisy for Sequelize/raw SQL/event publisher code
      'sonarjs/sql-queries': 'off',
    },
  },

  {
    files: [
      'migrations/**/*.{js,cjs,mjs}',
      'seeders/**/*.{js,cjs,mjs}',
    ],

    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },

    rules: {
      'no-unused-vars': 'off',

      'sonarjs/no-hardcoded-passwords': 'off',

      'no-await-in-loop': 'off',
      'no-console': 'off',
    },
  },
];