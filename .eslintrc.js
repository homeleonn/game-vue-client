module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'comma-dangle': ['off', 'never'],
    semi: 0,
    indent: 'off',
    'no-trailing-spaces': 'off',
    'no-multiple-empty-lines': 'off',
    'space-before-function-paren': 'off',
    'eol-last': 'off',
    'no-tabs': 'off',
    'no-undef': 'off',
    'no-unreachable': 'off',
    'vue/no-mutating-props': 'off',
    'no-unused-vars': 'off',
    'prefer-const': 'off',
    'quotes': 'off'
  }
}
