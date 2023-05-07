module.exports = {
  'env': {
    'es2022': true,
    'node': true
  },
  "extends": [
    "airbnb-base",
    "eslint:recommended",
    "prettier"],
  "plugins": [
    "prettier"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  'rules': {
    'consistent-return': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'no-console': 0,
    'indent': [
      'error',
      2
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ]
  }
};
