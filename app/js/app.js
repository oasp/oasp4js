angular.module('ui-bootstrap', ['ui.bootstrap.modal']);
angular.module('oasp', ['oasp.templates', 'oasp.main']);
angular.module('demoApp', ['ui-bootstrap', 'ngRoute', 'oasp']).config(function ($routeProvider) {
    "use strict";
    $routeProvider.otherwise({
        templateUrl: 'html/main/sign-in.html'
    });
});