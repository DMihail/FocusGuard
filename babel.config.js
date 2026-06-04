/** @format */

const reactCompilerConfig = {
  target: '19',
  sources: (filename) => {
    if (!filename) {
      return false;
    }

    if (filename.includes('node_modules') || filename.includes('__tests__')) {
      return false;
    }

    return /\.(jsx?|tsx?)$/.test(filename) && (filename.includes('/source/') || /\/index\.js$/.test(filename));
  },
};

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['babel-plugin-react-compiler', reactCompilerConfig],
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
