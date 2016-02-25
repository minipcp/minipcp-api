var jwt = require('jsonwebtoken'),
    config = require('./config.js'),
    user = require('./user.js');

module.exports = function (app) {

    var authenticate = function (req, res) {
        user.isValid(req.body.name, req.body.password, function (userData) {

            if ( ! userData) {
                res.json({ success: false, message: 'Authentication failed.' });
            } else {
                var token = jwt.sign(userData, app.get('jwtSecret'), {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                res.json({
                    success: true,
                    message: "MiniPCP API user OK",
                    token: token
                });
            }

        })
    };
    

    var verify = function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if ( ! token ) {
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
        }

        jwt.verify(token, app.get('jwtSecret'), function (err, decoded) {
            if ( err ) {
                return res.json({ 
                    success: false, 
                    message: 'Failed to authenticate token.' 
                });
            }

            req.decoded = decoded;
            next();
        })

    };

    app.set('jwtSecret', config.secret);

    return {
        authenticate,
        verify,
    };
};
