module.exports = {
    "setupFiles": [
        "<rootDir>/scripts/jest.beforeTest.js"
    ],
    "moduleFileExtensions": [
        "js",
        "jsx"
    ],
    "transform": {
        ".(js|jsx)": "<rootDir>/scripts/jest.babelTransform.js"
    },
    "testMatch": [
        "<rootDir>/src/*.test.(js|jsx)"
    ],
    "coverageDirectory": "<rootDir>/__coverage__",
    "collectCoverageFrom": [
        "**/src/**/*.{js,jsx}"
    ],
    "coverageReporters": [
        "text",
        "lcov"
    ],
    "mapCoverage": true,
    "transformIgnorePatterns": [
        "/node_modules/",
        "jest.beforeTest.js"
    ]
}
