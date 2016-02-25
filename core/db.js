var _ = require('lodash'),
    config = require('./config.js'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database(config.database),

    whereOperators = {
        'eq': '=',
        'lt': '<',
        'lte': '<=',
        'gt': '>',
        'gte': '>=',
    },
    operator = value => whereOperators[value.split('__')[0]] || '=',
    trimPrefix = value => ( ! whereOperators[('' + value).split('__')[0]] ? value : ('' + value).split('__')[1] );


module.exports = (() => {

    var sql = { 
        select: (tableName, columns) => `select ${( ! columns ? '*': columns)} from ${tableName}`,
        whereId: id => ( ! id ? '' : ` where id = '${id}'` ),
        where: where => ( ! where ? '' : ` where ${where}` ),
        orderBy: orderBy => ( ! orderBy ? '' : ` order by ${orderBy}` ),
        
        queryToWhere: (query) => {


            return _.reduce(query, function (where, value, key) {
                return where +  ( key === 'orderBy' ? '' : ( '' === where ? '' : ' and ' ) + `${key} ${operator('' + value)} $${key}` );
            }, '');
        },

        queryToParams: (query) => {

    
            return _.reduce(query, function (params, value, key) {
                if ( 'orderBy' === key ) {
                    return params;
                }
                return _.set(params, '$' + key, trimPrefix(value));
            }, {});
        }
    };

    var query = (params) => {
        return sql.select(params.tableName, params.columns) + 
            ( ! params.id ? 
                sql.where(params.where) + sql.where(sql.queryToWhere(params.query)) : 
                sql.whereId(params.id) ) + 
            sql.orderBy(params.query ? params.query.orderBy : null);
    };

    return {
        sql,
        query,
        
        data: function (params, callback) {
            db.serialize(function () {
                db.all(query(params), params.params || sql.queryToParams(params.query), (err, rows) => {
                    callback({ success: ! err, err, data: ( ! err && rows ? ( rows.length === 0 ? null : (rows.length > 1 ? rows : rows[0]) ) : null ) });
                });
            });
        },


        tableData: function (req, callback) {
            this.data({ tableName: req.params.tabela, id: req.params.id, query: req.query }, (result) => callback(result));
        }

    };

}());

