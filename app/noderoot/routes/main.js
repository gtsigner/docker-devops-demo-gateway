var express = require('express');
var router = express.Router();
const config = {
    view_prefix: "home/control/",
};
/* GET home page. */
router.get('/control', function (req, res, next) {
    res.render(config.view_prefix + 'index', {title: 'Express'});
});


router.post('/control', function (req, res, next) {
    res.render(config.view_prefix + 'index', {title: 'Express'});
});


module.exports = router;


