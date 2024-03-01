module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    // '@electron-toolkit/eslint-config-prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-unused-vars': 0,
  },
};
