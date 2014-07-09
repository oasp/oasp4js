describe('main', function () {
    "use strict";
    describe('currentContextPath', function () {
        var currentContextPath, $window;

        beforeEach(module('oasp.main'));

        beforeEach(function () {
            $window = (function () {
                var location = {};
                return {
                    location: location,
                    letLocationPathnameBe: function (pathnameToBeReturned) {
                        location.pathname = pathnameToBeReturned;
                    }
                };
            }());

            module(function ($provide) {
                $provide.value('$window', $window);
            });

            inject(function ($injector) {
                currentContextPath = $injector.get('currentContextPath');
            });
        });

        it('extracts context path when location path has 2 elements', inject(function (currentContextPath, $location) {
            //given
            var path;
            $window.letLocationPathnameBe('/myContext/some-other-elements');
            //when
            path = currentContextPath.get();
            //then
            expect(path).toEqual('/myContext/');
        }));
        it('returns // when no path contained in the location', inject(function (currentContextPath, $location) {
            //given
            var path;
            $window.letLocationPathnameBe('/');
            //when
            path = currentContextPath.get();
            //then
            expect(path).toEqual('/');
        }));
        it('returns // when path contained in the location is undefined', inject(function (currentContextPath, $location) {
            //given
            var path;
            //when
            path = currentContextPath.get();
            //then
            expect(path).toEqual('/');
        }));
    });
});
