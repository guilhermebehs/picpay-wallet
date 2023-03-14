module.exports = {
  rootDir: './',
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', ['lcov', { projectRoot: './coverage' }], 'text'],
  coverageThreshold: {
    global: {
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  notify: false,
  preset: 'ts-jest',
  roots: ['test'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  reporters: ['default'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
};
