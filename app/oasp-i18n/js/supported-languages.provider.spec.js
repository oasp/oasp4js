describe('Provider: supportedLanguagesProvider', function () {
    'use strict';
    var supportedLanguages;
    beforeEach(function () {
        angular.module('fake.module', ['app.oasp-i18n'], function (supportedLanguagesProvider) {
            supportedLanguagesProvider.setSupportedLanguages(
                [
                    {
                        key: 'en',
                        label: 'English'
                    },
                    {
                        key: 'de',
                        label: 'German',
                        'default': true
                    }
                ]
            );
        });

        module('fake.module');

        inject(function (_supportedLanguages_) {
            supportedLanguages = _supportedLanguages_;
        });
    });
    it('return default language', function () {
        expect(supportedLanguages.getDefault().key).toBe('de');
    });
});