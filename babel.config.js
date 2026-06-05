/** @format */

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './source',
        },
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.ts', '.tsx'],
      },
    ],
    'react-native-worklets/plugin',
  ],
  env: {
    production: {
      plugins: [
        [
          'transform-remove-console',
          {
            exclude: ['error', 'warn'],
          },
        ],
      ],
    },
  },
};
