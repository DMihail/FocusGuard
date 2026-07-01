/** @format */

module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:prettier/recommended'],
  plugins: ['prettier', 'simple-import-sort', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',

    // Import order: libraries → @/ path alias → relative → components last
    // Group 2: npm only — scoped (@react-navigation) or bare (zustand). NOT @/ (see ^@(?!/)).
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^react$', '^react-native$'],
          ['^@(?!/)', '^[a-z]'],
          ['^@/'],
          ['^\\.\\.(?!.*/components)(?!components/)', '^\\.(?!components/)(?!\\.\\./)'],
          ['^.*/components', '^\\./components', '^\\.\\./components'],
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'import/order': 'off',
    'sort-imports': 'off',

    // React / React Native
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'warn',

    // Style
    semi: ['error', 'always'],

    // General quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-restricted-globals': ['error', 'event'],
  },
  overrides: [
    {
      files: ['source/**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-expect-error': 'allow-with-description',
            'ts-ignore': true,
            'ts-nocheck': true,
            'ts-check': false,
            minimumDescriptionLength: 3,
          },
        ],
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'react-native',
                importNames: ['NativeModules', 'DeviceEventEmitter', 'NativeEventEmitter'],
                message: 'Use Turbo Modules from @/specs instead of legacy bridge APIs.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['source/specs/**/*Client*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            prefer: 'type-imports',
            fixStyle: 'separate-type-imports',
            disallowTypeAnnotations: false,
          },
        ],
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        'no-restricted-syntax': [
          'error',
          {
            selector: 'TSAnyKeyword',
            message: 'Do not use `any`. Prefer `unknown` or a concrete type.',
          },
        ],
      },
    },
    {
      files: ['*.{spec,test}.{js,ts,tsx}', '**/__tests__/**/*.{js,ts,tsx}'],
      env: { jest: true },
      rules: {
        'no-console': 'off',
        'react-native/no-inline-styles': 'off',
      },
    },
    {
      files: ['scripts/**/*.js'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['*.config.js', '.eslintrc.js', '.prettierrc.js', 'babel.config.js', 'jest.config.js'],
      rules: {
        'simple-import-sort/imports': 'off',
        'simple-import-sort/exports': 'off',
      },
    },
  ],
};
