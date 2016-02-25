var assert = require('assert'),
    db = require('../core/db.js'),
    user = require('../core/user.js');


describe('user', function () {
    describe('#isValid', function () {
        it('should check if user credentials are valid', function (done) {
            user.isValid('HENRIQUE', '123', function (valid) {
                if ( ! valid ) {
                    throw "USER NOT VALID";
                }
                done();
            });
        });


        it('should check if user credentials are NOT valid', function (done) {
            user.isValid('HENRIQUE', '124', function (valid) {
                if ( valid ) {
                    throw "USER IS VALID";
                }
                done();
            });
        });


        it('should block sql injection', function (done) {
            user.isValid('HENRIQUE', '124\' or 1 = 1', function (valid) {
                if ( valid ) {
                    throw "SQL INJECTION WORKED";
                }
                done();
            });
        });

        // sql injection
        // select * from acs_usuarios where logon = 'HENRIQUE' or '1' = '1' and senhamd5 = 'e72cea7e13ad7e82ecc725097e53bbee'
        it('should block sql injection', function (done) {
            user.isValid('HENRIQUE\' or \'1\' = \'1', '124\'', function (valid) {
                if ( valid ) {
                    throw "SQL INJECTION WORKED";
                }
                done();
            });
        });

    });

});
