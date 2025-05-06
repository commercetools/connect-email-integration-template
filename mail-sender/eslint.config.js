import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'build/', '.nvmrc'], // Optional: Define ignored files
  },
  {
    files: ['**/*.js'], // Apply to JavaScript files
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.es6,
        ...globals.node,
        ...globals.jest,
        myCustomGlobal: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': 'error',
      'no-const-assign': 'error',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true, // Optional: Report unused ESLint directives
    },
  },
];
