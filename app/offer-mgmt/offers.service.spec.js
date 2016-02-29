/*globals oasp*/
describe('Module: \'app.offer-mgmt\', Service: \'offers\'', function () {
    'use strict';
    var contextPath = '/oasp-app/', $httpBackend, offers;

    beforeEach(module('app.offer-mgmt', function ($provide) {
        $provide.value('currentContextPath', oasp.mock.currentContextPathReturning(contextPath));
    }));
    /*jslint nomen: true */
    beforeEach(inject(function (_$httpBackend_, _offers_) {
        $httpBackend = _$httpBackend_;
        offers = _offers_;
    }));
    /*jslint nomen: false */
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    it('loads all offers', function () {
        // given
        var allOffers = {
            pagination: {},
            result: [
                {
                    id: '1'
                }
            ]
        },
            allOffersResult,
            expectedOffer = {
                id: '1'
            },
            searchCriteria = {
                pagination: {
                    page: 1,
                    total: true
                }
            };
        $httpBackend.whenPOST(contextPath + 'services/rest/offermanagement/v1/offer/search', searchCriteria).respond(allOffers);
        // when
        offers.loadAllOffers()
            .then(function (response) {
                allOffersResult = response;
            });
        $httpBackend.flush();
        // then
        expect(allOffersResult[0]).toEqual(expectedOffer);
    });

    it('should load all products', function () {
        // given
        var allProducts = {
            pagination: {},
            result: [
                {
                    id: '1'
                }
            ]
        }, allProductsResult = {},
            expectedProduct = {
                id: '1'
            },
            searchCriteria = {
                pagination: {
                    page: 1,
                    total: true
                }
            };
        $httpBackend.whenPOST(contextPath + 'services/rest/offermanagement/v1/product/search', searchCriteria).respond(allProducts);
        // when
        offers.loadAllProducts()
            .then(function (response) {
                allProductsResult = response;
            });
        $httpBackend.flush();
        // then
        expect(allProductsResult[0]).toEqual(expectedProduct);
    });
});
