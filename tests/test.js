global.trace = (obj) => {
    console.log(obj);
    return obj;
};

require('./test_db.js');
require('./test_user.js');
require('./test_lib.js');

