import {defineConfig, globalIgnores} from "eslint/config";
import tseslint from "typescript-eslint";
import js = require("@eslint/js");
import reactHooks = require("eslint-plugin-react-hooks");
import reactRefresh = require("eslint-plugin-react-refresh");
import globals = require("globals");

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
])
