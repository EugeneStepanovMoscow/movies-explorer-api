module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
};
