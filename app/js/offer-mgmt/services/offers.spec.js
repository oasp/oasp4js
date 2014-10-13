/*globals oasp*/
describe('Module: \'app.offerMgmt\', Service: \'offers\'', function () {
    'use strict';
    var contextPath = '/oasp-app/', $httpBackend, offers;

    beforeEach(module('app.offerMgmt', function ($provide) {
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
        var allOffers = [{
            id: '1'
        }], loadedOffers;
        $httpBackend.whenGET(contextPath + 'services/rest/offermanagement/offer').respond(allOffers);
        // when
        offers.loadAllOffers()
            .then(function (table) {
                loadedOffers = table;
            });
        $httpBackend.flush();
        // then
        expect(loadedOffers).toEqual(allOffers);
    });
});
