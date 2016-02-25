var db = require('./db.js'),
    lib = require('./lib.js'),
    md5 = require('md5');


module.exports = {

    isValid: function (userName, password, callback) {
        db.data({ 
            tableName: 'acs_usuarios',  
            where: 'logon = $logon and senhamd5 = $senhamd5', 
            params: { $logon: userName, $senhamd5: md5(password)} 
        }, function (result) {
            if ( result.err || ! result.data || ! result.data.logon ) {
                callback(false);
            } else {
                callback(lib.unset(result.data, 'senhamd5'));
            }
        });
    }

};
