module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb-base',
  ],
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-control-regex': 0,
    'no-useless-escape': 0,
    'no-unused-vars': 0,
    'no-console': 0,
  },
};
