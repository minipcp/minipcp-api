global.trace = (obj) => {
    console.log(obj);
    return obj;
};

var express = require('express'), 
    app = express(),
    apiRoutes = express.Router(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    config = require('./core/config.js'),
    db = require('./core/db.js'),
    auth = require('./core/auth.js')(app);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

apiRoutes.post('/auth', auth.authenticate);

apiRoutes.use(auth.verify)


apiRoutes.route('/:tabela?')
    .get(function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        db.tableData(req, (result) => res.send(JSON.stringify(result, null, 2)));
    });


apiRoutes.route('/:tabela/:id?')
    .get(function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        db.tableData(req, (result) => res.send(JSON.stringify(result, null, 2)));
    });


app.use('/api/v1', apiRoutes);

app.listen(config.port, function () {
    console.log(`MiniPCP API listening on port ${config.port}`);
});
