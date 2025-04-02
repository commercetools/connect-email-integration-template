module.exports = {
    rootDir: '../../',
    displayName: 'Tests Javascript Application - Service',
    testMatch: ['**/tests/integration/?(*.)+(spec|test).js?(x)'],
    testEnvironment: 'node',
    verbose: true,
    silent: true,
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1'
    },
    // Set test environment variables
    setupFiles: ['<rootDir>/tests/integration/jest.setup.js']
};