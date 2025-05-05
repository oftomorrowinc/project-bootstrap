export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/', '<rootDir>/tests/unit/'],
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      useESM: true,
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: 'coverage'
};