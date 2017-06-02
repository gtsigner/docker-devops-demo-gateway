var express = require('express');
var router = express.Router();


/* GET home page. */
router.post('/full_coin', function (req, res, next) {
    res.json({msg: 'hell'});
});


module.exports = router;


