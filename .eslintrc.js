module.exports = {
  "parser": "babel-eslint",
  "extends": ["standard-react"],
  "rules": {
    "semi": [2, "always"],
    "no-extra-semi": 2,
    "semi-spacing": [2, { "before": false, "after": true }],
    "id-length": [2, {"exceptions": ["t", "q", "_", "a", "b"]}],
    "no-unused-vars": [2, {"varsIgnorePattern": "styles"}],
    "comma-dangle": [2, "always-multiline"],
    "space-before-function-paren": [2, "never"],
    "no-multiple-empty-lines": [0],
  },
};
