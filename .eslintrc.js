module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "semi": ["error", "always"],
    "indent": ["error", 2, { "SwitchCase": 1 } ],
    "no-extra-semi": "error",
    "brace-style": ["error", "1tbs"],
    "quotes": ["error", "single"],
    "eqeqeq": "error",
    "no-var": "error",
    "curly": "error",
    "no-mixed-spaces-and-tabs": "error",
    "prefer-const": "error",
    "spaced-comment": "error",
    "arrow-spacing": ["error", { "before":  true, "after":  true}],
    "space-before-blocks": ["error", "always"],
    "prefer-template": "error",
    "no-shadow-restricted-names": "error",
    "keyword-spacing": ["error", { "before": true, "after": true }],
  }
}
