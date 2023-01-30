var express = require("express");
var router = express.Router();
var cors = require('cors');
var moment = require('moment');
var connection = require("./custom_modules/connection");


	
router.get('/:id', cors(), function(req, res){
    connection.query('SELECT `sku` FROM `product_feedback` WHERE `sku` = ?;SELECT `date`, CONCAT(`first_name`," ", `last_name`) AS `name`, `email`, `comment`, `author`, `source`, `sku` FROM `log` WHERE `sku` = ? ORDER BY `date` DESC; SELECT COUNT(*) AS `count` FROM `request` WHERE `sku` = ?;', [req.params.id, req.params.id,req.params.id], function(err, rows, fields) {
        res.render('feedback_view', {
            obj1: rows[0],
            obj2: rows[1],
            obj3: rows[2],
            moment: moment
        });
	});
});

module.exports = router;