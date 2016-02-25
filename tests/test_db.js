var assert = require('assert'),
    db = require('../core/db.js');

// console.log(db.sql.select('tableName'));

describe('db', function () {
    describe('#sql', function () {
        describe('#select', function () {
            it('should return "select * from tableName" when columns is not present', function () {
                assert.equal("select * from tableName", db.sql.select('tableName'));
            });

            it('should return "select column_a, column_b, column_c... from tableName" when columns is present', function () {
                assert.equal("select column_a, column_b, column_c from tableName", db.sql.select('tableName', 'column_a, column_b, column_c'));
            });
        });


        describe('#whereId', function () {
            it('should return empty string when id is not present', function () {
                assert.equal("", db.sql.whereId(undefined));
                assert.equal("", db.sql.whereId(null));
            });

            it('should return where statement when id is present', function () {
                assert.equal(" where id = '1'", db.sql.whereId(1));
                assert.equal(" where id = '2'", db.sql.whereId(2));
            });

        });


        describe('#where', function () {
            it('should return empty string when where is empty', function () {
                assert.equal("", db.sql.where(undefined));
                assert.equal("", db.sql.where(null));
                assert.equal("", db.sql.where(""));
            });

            it('should return where statement when where is present', function () {
                assert.equal(" where name = 'henrique'", db.sql.where("name = 'henrique'"));
                assert.equal(" where codigo = 10", db.sql.where("codigo = 10"));
            });
        });


        describe('#orderBy', function () {
            it('should return empty string when orderBy is empty', function () {
                assert.equal("", db.sql.orderBy(undefined));
                assert.equal("", db.sql.orderBy(null));
                assert.equal("", db.sql.orderBy(""));
            });

            it('should return order by statement when orderBy present', function () {
                assert.equal(" order by id", db.sql.orderBy("id"));
                assert.equal(" order by name, date", db.sql.orderBy("name, date"));
            });
        });


        describe('#queryToWhere', function () {
            it('should return where statement from query props', function () {
                assert.equal("a = $a", db.sql.queryToWhere({ a: 1 }));
                assert.equal("a = $a and b = $b", db.sql.queryToWhere({ a: 1, b: 2 }));
            });

            it('should ignore orderBy prop', function () {
                assert.equal("a = $a", db.sql.queryToWhere({ a: 1, orderBy: "name" }));
            });

            it('should parse eq__ prefix', function () {
                assert.equal("a = $a", db.sql.queryToWhere({ a: 'eq__10' }));
            });
           
            it('should parse lt__ prefix', function () {
                assert.equal("a < $a", db.sql.queryToWhere({ a: 'lt__10' }));
            });

            it('should parse lte__ prefix', function () {
                assert.equal("a <= $a", db.sql.queryToWhere({ a: 'lte__10' }));
            });

            it('should parse gt__ prefix', function () {
                assert.equal("a > $a", db.sql.queryToWhere({ a: 'gt__10' }));
            });

            it('should parse gte__ prefix', function () {
                assert.equal("a >= $a", db.sql.queryToWhere({ a: 'gte__10' }));
            });
        });


        describe('#queryToParams', function () {
            it('should return params object from query props', function () {
                assert.deepEqual({ $a: 1 }, db.sql.queryToParams({ a: 1 }));
                assert.deepEqual({ $a: 1, $b: 2 }, db.sql.queryToParams({ a: 1, b: 2 }));
            })

            it('should ignore orderBy prop from params', function () {
                assert.deepEqual({ $a: 1, $b: 2 }, db.sql.queryToParams({ a: 1, b: 2, orderBy: 'name' }));
            })

            it('should trim operator prefixes', function () {
                assert.deepEqual({ $a: '10' }, db.sql.queryToParams({ a: 'eq__10' }));
                assert.deepEqual({ $a: '10' }, db.sql.queryToParams({ a: 'lt__10' }));
                assert.deepEqual({ $a: '10' }, db.sql.queryToParams({ a: 'lte__10' }));
                assert.deepEqual({ $a: '10' }, db.sql.queryToParams({ a: 'gt__10' }));
                assert.deepEqual({ $a: '10' }, db.sql.queryToParams({ a: 'gte__10' }));
            });
        });

    });


    describe('#query', function () {
        it('should return select statement filtered by id when params.id is present', function () {
            assert.equal("select * from a_table where id = '1'", db.query({ tableName: "a_table", id: 1 }));
            assert.equal("select * from a_table where id = '5'", db.query({ tableName: "a_table", id: 5 }));
        });

        it('should return select without where when no id is present', function () {
            assert.equal("select * from a_table", db.query({ tableName: "a_table" }));
        });


        it('should return select statement according to params', function () {
            assert.equal("select * from a_table where name = 'henrique'", db.query({ tableName: "a_table", where: "name = 'henrique'" }));
            assert.equal("select * from a_table where name = 'henrique' order by date", 
                db.query({ tableName: "a_table", where: "name = 'henrique'", query: { orderBy: "date" } }));
            assert.equal("select id, name, date from a_table where name = 'henrique' order by date", 
                db.query({ tableName: "a_table", where: "name = 'henrique'", query: { orderBy: "date" }, columns: "id, name, date" }));
            assert.equal("select * from a_table where name = $name", db.query({ tableName: "a_table", query: { name: "fulano"} }));
        });
    });

});

