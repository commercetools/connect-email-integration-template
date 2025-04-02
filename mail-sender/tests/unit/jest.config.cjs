module.exports = {
    rootDir: '../../',
    displayName: 'Tests Javascript Application - Service',
    testMatch: ['**/tests/unit/?(*.)+(spec|test).js?(x)'],
    testEnvironment: 'node',
    verbose: true,
    silent: true,
    setupFiles: ['<rootDir>/tests/unit/jest.setup.js'],
};