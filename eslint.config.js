import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier/flat';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        ignores: [
            'src/types/openapi/',
            'src/resources/fonts/fontawesome/css',
            'github/',
            'build/',
            'config-overrides.js',
            'cypress.config.js',
            'cypress/support',
            'src/setupProxy.cjs',
        ],
    },
    {
        files: ['**/*.{ts,tsx,js}'],
        languageOptions: {
            ecmaVersion: 2020,
            parser: tsParser,
        },
        plugins: {
            'react-hooks': reactHooks,
            prettier: prettier,
            'jsx-a11y': jsxA11y,
        },
        rules: {
            'prettier/prettier': 'error',
            ...reactHooks.configs.recommended.rules,
            // TODO: Enable react-hooks/set-state-in-effect and fix linter errors
            'react-hooks/set-state-in-effect': 'off',
            // TODO: Enable jsx-a11y and fix linter errors
            // ...jsxA11y.configs.recommended.rules
        },
    },
    prettierConfig,
];
