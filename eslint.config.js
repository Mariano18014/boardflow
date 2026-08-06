const parser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactPlugin = require("eslint-plugin-react");

module.exports = [
    {
        ignores: ["dist/*", "node_modules/*"],
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: parser,
            ecmaVersion: 2020,
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            "react": reactPlugin,
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
            "no-console": ["warn", { allow: ["warn", "error", "info"] }],
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off"
        }
    }
];
