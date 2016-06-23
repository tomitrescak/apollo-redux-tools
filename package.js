Package.describe({
  name: 'tomi:apollo-mantra',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Tools for fast and easy apollo with mantra',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.use('modules');
  api.use('promise');
  api.mainModule('./dist/client/index.js', 'client');
  api.mainModule('./dist/server/index.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
});
