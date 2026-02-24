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
            'react-hooks/set-state-in-effect': 'off',
            ...jsxA11y.configs.recommended.rules,
        },
    },
    prettierConfig,
];
