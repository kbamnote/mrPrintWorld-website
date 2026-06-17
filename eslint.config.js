import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Experimental React-Compiler rules kept as advisory warnings — the
      // flagged patterns are intentional: Math.random() seeds the hero particle
      // field once inside useMemo, and device/scroll detection sets state once
      // on mount so first paint is the static hero, then it enhances.
      'react-hooks/purity': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      // react-three-fiber's useFrame loop mutates refs by design.
      'react-hooks/immutability': 'warn',
    },
  },
])
