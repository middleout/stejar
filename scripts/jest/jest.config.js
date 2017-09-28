module.exports = {
    "setupFiles": [
        "<rootDir>/../../scripts/jest/beforeTest.js"
    ],
    "moduleFileExtensions": [
        "js",
        "jsx"
    ],
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
    "mapCoverage": true
}