const express = require("express");
const router = express.Router();
var connection = require("./custom_modules/connection");
var isLoggedIn = require("./custom_modules/isLoggedIn.js");


router.get('/feedback_search_table', isLoggedIn, function(req, res){
	res.render('feedback_search_table', {
		user : req.user // get the user out of session and pass to template
	});
});

router.get('/feedback', isLoggedIn, function(req, res){
    var insert = 'INSERT IGNORE INTO `product_feedback` (`sku`) SELECT LEFT(`sku`,LOCATE("-",`sku`) - 1) FROM `baus_var`';
	var insert2 = 'INSERT IGNORE INTO `product_feedback` (`sku`) SELECT LEFT(`sku`,LOCATE("-",`sku`) - 1) FROM `xdus_var`';
    connection.query(insert);
	connection.query(insert2);
	req.flash('success', 'The feedback was succesfully added!');
	req.flash('failure', 'There was an error and your feedback was not added.');
    res.render('feedback', {
        user : req.user
    });
});


router.get('/searchFeedback', function(req, res){
	connection.query('SELECT `sku` FROM `product_feedback` WHERE `sku` LIKE "%' + req.query.key + '%";',
	function(err, rows, fields) {
		if (err) throw err;
		var data=[];
			for(i=0;i<rows.length;i++)
				{data.push(rows[i].sku);
					}
		res.end(JSON.stringify(data));
	});
});

router.post('/searchFeedback', function(req, res){
	connection.query('SELECT `sku` FROM `product_feedback` WHERE `sku` LIKE "%'+req.body.searchFeedback+'%" GROUP BY `sku`;' , function(err, rows) {
		if (err) {
			console.log(err);
		} else {
                var obj = JSON.parse(JSON.stringify(rows));		
				res.render('feedback_search_table', {obj: obj});
		}
	});
});	

router.post('/newsku', function(req, res){
	connection.query('INSERT INTO `log` (`first_name`, `last_name`, `email`, `comment`, `source`, `author`, `sku`) VALUES("' + req.body.firstname + '","' + req.body.lastname + '","' + req.body.email + '","' + req.body.comment + '","' + req.body.source + '","' + req.body.author + '","' + req.body.sku + '")', function(error, result){
		if(error){
	  		res.render('feedback', { FailureMessage: req.flash('failure')});
		} else {
			res.render('feedback', { SuccessMessage: req.flash('success')});
		} 
	});
});

module.exports = router;