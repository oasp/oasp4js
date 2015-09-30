/**
 * @ngdoc directive
 * @name oasp.oaspSecurity.directive:showIfUserHasAnyRole
 * @module oasp.oaspSecurity
 * @directive
 * @restrict A
 * @requires oaspSecurity.oaspAuthorizationService
 * @property {boolean} showIfUserHasAnyRole
 */
angular.module('oasp.oaspSecurity')
    .directive('showIfUserHasAnyRole', ['oaspAuthorizationService', function (oaspAuthorizationService) {
        return {
            restrict: 'A',
            multiElement: true,
            link: function (scope, element, attr) {
                var NG_HIDE_CLASS = 'ng-hide';
                scope.$watch(attr.showIfUserHasAnyRole, function (requestedRole) {
                    if (angular.isDefined(requestedRole)) {
                        oaspAuthorizationService.userHasAnyRole(requestedRole).then(function (hasAnyRequestedRole) {
                            element[hasAnyRequestedRole ? 'removeClass' : 'addClass'](NG_HIDE_CLASS);
                        });
                    }
                });
            }
        };
    }]);
