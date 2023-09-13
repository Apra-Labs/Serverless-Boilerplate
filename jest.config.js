module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/*.test.ts",
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}