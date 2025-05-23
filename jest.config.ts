import type { Config } from "jest";

const config: Config = {
  testMatch: [
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/*.supertest.ts",
  ],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: false }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
