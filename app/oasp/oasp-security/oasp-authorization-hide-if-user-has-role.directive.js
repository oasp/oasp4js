/**
 * @ngdoc directive
 * @name oasp.oaspSecurity.directive:hideIfUserHasRole
 * @module oasp.oaspSecurity
 * @directive
 * @restrict A
 * @requires oaspSecurity.oaspAuthorizationService
 * @property  {boolean} hideIfUserHasRole
 */
angular.module('oasp.oaspSecurity')
    .directive('hideIfUserHasRole', ['oaspAuthorizationService', function (oaspAuthorizationService) {
        return {
            restrict: 'A',
            multiElement: true,
            link: function (scope, element, attr) {
                var NG_HIDE_CLASS = 'ng-hide';
                scope.$watch(attr.hideIfUserHasRole, function (requestedRole) {
                    if (angular.isDefined(requestedRole)) {
                        oaspAuthorizationService.userHasAnyRole(requestedRole).then(function (hasAnyRequestedRole) {
                            element[hasAnyRequestedRole ? 'addClass' : 'removeClass'](NG_HIDE_CLASS);
                        });
                    }
                });
            }
        };
    }]);
