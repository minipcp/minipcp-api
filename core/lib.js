var _ = require('lodash');

var unset = (obj, prop) => {
    'use strict';
    let clone = _.clone(obj);
    _.unset(clone, prop);
    return clone;
}

module.exports = {
    unset
};
