angular.module('app.form-samples-mgmt')
    .config(function (valdrProvider) {
        'use strict';

        //----- Valdr constraints configuration ----
        valdrProvider.addConstraints({
            example5AsyncEmail: {
                forbiddenDomain: {
                    maxLength: {
                        message: 'OASP.VALIDATION.SHOWCASE.DOMAIN_MAX_LENGTH',
                        number: 15
                    }
                },
                asyncEmail: {
                    required: {
                        message: 'OASP.VALIDATION.SHOWCASE.EMAIL_REQUIRED'
                    },
                    maxLength: {
                        message: 'OASP.VALIDATION.SHOWCASE.EMAIL_MAX_LENGTH',
                        number: 25
                    }
                }

            }
        });
    })
    .controller('Example5Ctrl', function ($q, $timeout) {
        'use strict';

        var self = this,
            EMAIL_DOMAIN_REGEX = /@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/; //a simple regex for domain
        this.forbiddenDomains = this.forbiddenDomains || ['@forbidden.com'];


        this.customMessageRepo = {
            forbiddenDomain: {
                domainValid: {
                    msg: 'OASP.VALIDATION.SHOWCASE.DOMAIN_VALID'
                },
                notDuplicate: {
                    msg: 'OASP.VALIDATION.SHOWCASE.DOMAIN_DUPLICATE'
                }
            },
            asyncEmail: {
                forbidden: {
                    msg: 'OASP.VALIDATION.SHOWCASE.EMAIL_FORBIDDEN',
                    params: {
                        domain: undefined // will be set dynamically
                    }
                },
                email: {
                    msg: 'OASP.VALIDATION.SHOWCASE.EMAIL_FORMAT'
                }
            }
        };

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        function isForbiddenDomain(email) {
            var isForbidden = false;
            self.forbiddenDomains.forEach(function (domain) {
                if (email && endsWith(email, domain)) {
                    self.customMessageRepo.asyncEmail.forbidden.params.domain = domain; //dynamically set the property for message
                    isForbidden = true;
                    return;
                }
            });
            return isForbidden;
        }


        //----- Manage blacklist ----

        this.addToBlacklist = function (domainToForbid) {
            self.forbiddenDomains.push(domainToForbid);
            self.forbiddenDomainCandidate = undefined;
        };


        this.removeFromBlacklist = function (index) {
            self.forbiddenDomains.splice(index, 1);
        };

        //----- Validation ----

        //## domains ##
        this.isValidDomain = function (domainCandidate) {
            return domainCandidate && domainCandidate.match(EMAIL_DOMAIN_REGEX) !== null;
        };

        this.isNotDuplicate = function (domainCandidate) {
            return domainCandidate && self.forbiddenDomains.indexOf(domainCandidate) === -1;
        };

        //## email ##
        // Angular version >= 1.4.1
        //this.isAllowedOnServer = function ($value, formField) {
        //    return $q(function (resolve, reject) {
        //        $timeout(function afterTimeout(val) {
        //            if (val) {
        //                formField.$touched = true;
        //            }
        //            if (isForbiddenDomain(val)) {
        //                reject();
        //            } else {
        //                resolve();
        //            }
        //        }, 1500, false, $value);
        //    });
        //};

        this.isAllowedOnServer = function ($value, formField) {
            var deferred = $q.defer();
            self.waitingForServer = true;
            $timeout(function afterTimeout() {
                if ($value) {
                    formField.$touched = true;
                }
                if (isForbiddenDomain($value)) {
                    self.waitingForServer = false;
                    deferred.reject();
                } else {
                    self.waitingForServer = false;
                    deferred.resolve();
                }
            }, 1500, false);
            return deferred.promise;
        };

    });
