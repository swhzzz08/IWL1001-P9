import type { Config } from 'jest'

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                rootDir: '.',
                module: 'commonjs',
                moduleResolution: 'node10',
                jsx: 'react-jsx',
                ignoreDeprecations: '6.0',
            },
        }],
    },
}

export default config
