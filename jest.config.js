/** @format */

const isCI = process.env.CI === 'true';

module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/__tests__/helpers/'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-reanimated|react-native-gesture-handler|react-native-worklets|react-native-localize)/)',
  ],
  maxWorkers: isCI ? 1 : '50%',
  workerIdleMemoryLimit: isCI ? '512MB' : undefined,
  testTimeout: isCI ? 30_000 : 10_000,
};
