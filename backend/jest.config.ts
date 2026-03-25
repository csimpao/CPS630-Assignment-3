export default {
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@auction-platform/shared$': '<rootDir>/../shared/src/index.ts',
  },
  transformIgnorePatterns: ['node_modules/(?!@auction-platform/shared)'],
};
