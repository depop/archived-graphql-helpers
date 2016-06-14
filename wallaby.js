process.env.BABEL_ENV = 'commonjs';

module.exports = function(wallaby) {
  return {
    files: [
      // {pattern: 'node_modules/babel/node_modules/babel-core/browser-polyfill.js', instrument: false},
      // {pattern: 'node_modules/babel-core/browser-polyfill.js', instrument: false},
      {pattern: 'src/**/__tests__/**/*.test.js', ignore: true},
      'src/**/*.js',
    ],

    tests: [
      'src/**/__tests__/**/*.test.js',
    ],

    env: {
      type: 'node',
      runner: 'node'
    },

    compilers: {
      '**/*.js': wallaby.compilers.babel(),
    },

    testFramework: 'ava',

    debug: true,

    bootstrap: function() {
      global.regeneratorRuntime = require('babel-runtime/regenerator').default;
    },
  };
};
