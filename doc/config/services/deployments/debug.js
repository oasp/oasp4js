"use strict";

module.exports = function debugDeployment(getVersion) {
  return {
    name: 'debug',
    examples: {
      commonFiles: {
        scripts: [ '../../../angular.js' ]
      },
      dependencyPath: '../../../'
    },
    scripts: [
      //angular components
      'components/angular-' + getVersion('angular') + '/angular.js',
      'components/angular-route-' + getVersion('angular-route') + '/angular-route.js',
      'components/angular-animate-' + getVersion('angular-animate') + '/angular-animate.js',
      'components/angular-sanitize-' + getVersion('angular-sanitize') + '/angular-sanitize.js',

      //bootstrap
      'js/angular-bootstrap/bootstrap.js',
      'js/angular-bootstrap/dropdown-toggle.js',

      //other (based on angular js doc)
      'components/marked-' + getVersion('marked', 'node_modules', 'package.json') + '/lib/marked.js',
      'components/lunr.js-' + getVersion('lunr.js') + '/lunr.js',
      'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/prettify.js',
      'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/lang-css.js',

      //documentation scripts
      'js/pages-data.js',
      'js/nav-data.js',
      'js/docs.js'
    ],
    stylesheets: [
      'components/bootstrap-' + getVersion('bootstrap') + '/css/bootstrap.css',
      'components/open-sans-fontface-' + getVersion('open-sans-fontface') + '/open-sans.css',
      'css/prettify-theme.css',
      'css/docs.css',
      'css/animations.css'
    ]
  };
};