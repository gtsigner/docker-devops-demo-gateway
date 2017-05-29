const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'demo'});
});

router.post('/login', function (req, res, next) {
    res.render('index', {title: 'HELLO'});
});

module.exports = router;


