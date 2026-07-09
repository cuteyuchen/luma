import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  ignores: [
    '**/*.md',
    '**/dist/**',
    '**/node_modules/**',
  ],
  rules: {
    'pnpm/yaml-enforce-settings': 'off',
    'style/spaced-comment': 'off',
  },
})
