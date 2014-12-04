describe('Provider: translationSupport', function () {
    'use strict';
    var translationSupport;
    beforeEach(function () {
        angular.module('fake.module', ['app.oasp-i18n'], function (translationSupportProvider) {
            translationSupportProvider.enableTranslationForModule('dummy');
            translationSupportProvider.enableTranslationForModule('main', true);
        });

        module('fake.module');

        inject(function (_translationSupport_) {
            translationSupport = _translationSupport_;
        });
    });
    it('returns default language', function () {
        expect(translationSupport.moduleHasTranslations('main')).toBeTruthy();
        expect(translationSupport.moduleHasTranslations('dummy')).toBeTruthy();
    });
    it('not enable translation for configured module', function () {
        expect(translationSupport.moduleHasTranslations('not_configured')).toBeFalsy();
    });
    it('returns default module', function () {
        expect(translationSupport.getDefaultTranslationModule()).toBe('main');
    });
});