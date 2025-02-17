const OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = {
  root: true,
  extends: ['universe/native', 'prettier'],
  rules: {
    'eol-last': OFF,
    quotes: [
      WARN,
      'single',
      { allowTemplateLiterals: true, avoidEscape: true },
    ],
    'jsx-quotes': [WARN, 'prefer-double'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      WARN,
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'prefer-promise-reject-errors': OFF,
    'import/order': OFF,
  },
};
