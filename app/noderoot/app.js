var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const routes = [
    {route: '/', entry: require("./routes/index")},
    {route: '/control', entry: require("./routes/control")},
    {route: '/protal', entry: require("./routes/protal")},
    {route: '/users', entry: require("./routes/users")},
];
routes.forEach(function (item) {
    app.use(item.route, item.entry);
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({msg: "no api found", code: 404, data: null});
});

module.exports = app;
