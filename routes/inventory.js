var express = require("express");
var router = express.Router();
var moment = require('moment');
var connection = require("./custom_modules/connection");
var isLoggedIn = require("./custom_modules/isLoggedIn.js");
var queries = require("./custom_modules/queries.js");
var dbsync = require("./custom_modules/dbsync.js");

  var bausacred = 'https://c273415e3735420ab807054497399d99:e53b95b319b9c5f4038e666f7d8b69db@bodyawaretest.myshopify.com/admin/api/2019-04/';
  var baukcred = 'https://a9595455ad3c9257dd1eb3cb7f3946b9:944fb421042a2ffc8023da1b5b3dc32b@bodyawareuktest.myshopify.com/admin/api/2019-04/';
  var xdusacred = 'https://3b725a8ac681b8f13a36b011e752ce53:6611f8abe4ab1261d5a48be7999f1e07@xdresstest.myshopify.com/admin/api/2019-04/';
  var xdukcred = 'https://d3ce8fef088530650829120341d92f5b:c9cc4d6f9b650c43934efaa76e73ae41@xdressuktest.myshopify.com/admin/api/2019-04/';


router.get('/inventoryPage', isLoggedIn, function(req, res){
  query()
  .then(function(results){
    render(results)
  })
  .catch(function(err){
    console.log("Promise rejection error: "+err);
  });
  var render = function(results){ 
    stores = [];
    for (var i = 0;i < results.length; i++){
      stores.push('https://' + results[i].api_key +  ':' + results[i].pswrd + '@' + results[i].shop_url + '/admin/api/2019-04/');
    }
    dbsync(stores);
  }  
  res.render('inventoryPage', {
        user : req.user
    });
});

router.get('/searchInventory', function(req, res){
	connection.query('SELECT `sku` FROM `baus_var` WHERE `sku` LIKE "%' + req.query.key + '%";',
	function(err, rows, fields) {
		if (err) throw err;
		var data=[];
			for(i=0;i<rows.length;i++)
				{data.push(rows[i].sku);
					}
		res.end(JSON.stringify(data));
	});
});

router.get('/inventoryPageTable', isLoggedIn, function(req, res){
    res.render('inventoryPageTable', {
        user : req.user
    });
});

router.post('/searchInventory', function(req, res){
	connection.query('SELECT pr.title AS `title1`, var.title, var.sku, var.inv, var.inv_id FROM baus_prod AS pr, baus_var AS var WHERE pr.prod_id = var.prod_id AND var.sku LIKE "%'+req.body.searchInventory+'%";' , function(err, rows) {
		if (err) {
			console.log(err);
		} else {
                var obj = JSON.parse(JSON.stringify(rows));	
				res.render('inventoryPageTable', {obj: obj});
		}
	});
});	

router.post('/inventoryPageTable', function(req, res){
    connection.query('UPDATE baus_var SET inv = ' + req.body.count + ' WHERE inv_id = ' + req.body.inv_id, function(err){
        if (err) {
			console.log(err);
		} else {
            connection.query('SELECT pr.title AS `title1`, var.title, var.sku, var.inv, var.inv_id FROM baus_prod AS pr, baus_var AS var WHERE pr.prod_id = var.prod_id AND var.sku LIKE "%'+req.body.searchInventory+'%";' , function(err, rows) {
                if (err) {
                    console.log(err);
                } else {
                        var obj = JSON.parse(JSON.stringify(rows));	
                        res.render('inventoryPageTable', {obj: obj});
                }
            });
		}
    });
});

router.get('/inventory', isLoggedIn, function(req, res){//look at later
  connection.query(queries.stores + queries.upload1 + queries.userName, req.user.username, function(err,rows,fields){//put into appropriate js file
    res.render('inventory', {
      user : req.user,
      rows : rows[0],
      rows1 : rows[1],
      profile : rows[2][0],
      moment: moment
    });
  });
});

router.get('/inventory2', isLoggedIn, function(req, res){
	connection.query(queries.stores + queries.upload1 + queries.userName, req.user.username, function(err,rows,fields){//put into appropriate js file
		res.render('inventory2', {
			user : req.user,
			rows : rows[0],
      rows1 : rows[1],
      profile : rows[2][0],
			moment: moment
		});
	});	
});

// router.get('/inventoryPage', isLoggedIn, function(req, res){
//     var ba = bausaCred + 'products.json?ids=1370017235009';
//     request(ba, function(err, response, body) {
//         const data = JSON.parse(body);
//         res.render('inventoryPage', {
//             user : req.user,
//             data : data,
//             moment : moment
//         });
//     });
// });

// router.post('/inventoryPage', isLoggedIn, function(req, res){
//     if( bausaCred + 'orders/count.json?status=open&created_at_min=' + fiveDaysAgo > 1){
//         var ba = bausaCred + 'orders.json?ids=' + req.body.order.map(Number);
        
//     } else {
//         var ba = bausaCred + 'orders.json?ids=' + req.body.order;   
//         //console.log(ba); 
//     }
//     request(ba, function(err, response, body) {
//         const data = JSON.parse(body);    
//         res.render('printpageba', {
//             user : req.user,
//             data : data,
//             moment : moment,
//             layout : false
//         });	
//     });	
// });    

// router.post('/inventoryPage', function (req, res){
// 	const ba = fetchJSON(batestcred + 'products.json?fields=id,title,sku&limit=250');
// 		Promise.all([ba]).then((data) => {
// 			data = JSON.stringify(data)

// 			res.render('inventoryPageTable', {data: data, user: req.user});	;
// 	}).catch(err => console.error('There was a problem', err));
// });

// router.get('/inventoryPageTable', isLoggedIn, function (req, res){
// 	res.render('inventoryPageTable', {
// 		user : req.user // get the user out of session and pass to template
// 	});
// });

module.exports = router;