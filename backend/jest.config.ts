export default {
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@auction-platform/shared$': '<rootDir>/../shared/src/index.ts',
    '^@auction-platform/shared/(.*)$': '<rootDir>/../shared/src/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!@auction-platform/shared)'],
};
