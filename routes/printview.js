var express = require("express");
var router = express.Router();
var moment = require('moment');
var request = require('request');
var queries = require("./custom_modules/queries.js");
var daysAgo = require("./custom_modules/daysAgo.js");
var sqlQuery = require("./custom_modules/sqlQuery.js");
var isLoggedIn = require("./custom_modules/isLoggedIn.js");
var mustEmp = require("./custom_modules/mustEmp.js");
var QRCode = require('qrcode');



router.post('/:id', isLoggedIn, mustEmp, function(req, res){
    sqlQuery(queries.stores + queries.getDiscounts + queries.storesWhereId, [req.params.id, req.params.id])
    .then(function(rows){
        console.log(rows[1][0]);
        var cred = 'https://' + rows[2][0].api_key + ':' + rows[2][0].pswrd + '@' + rows[2][0].shop_url + '/admin/api/2021-04/';
        var url = req.body.url;
        if(rows[1].length === 0){
            var link = null;         
        } else {
            var link = rows[1][0].link;
        }
        
        if( cred + 'orders/count.json?status=open&created_at_min=' + daysAgo(5) > 1){
            var queryString = bausaCred + 'orders.json?ids=' + req.body.order.map(Number) 
        } else {
            var queryString = cred + 'orders.json?ids=' + req.body.order;   
        }
        request(queryString, function(err, response, body) {
            QRCode.toDataURL(link, (err, src ) => {        
                const data = JSON.parse(body);    
                res.render('printpage', {
                    user : req.user,
                    data : data,
                    moment : moment,
                    rows : rows[0],
                    storeData : rows[2][0],
                    discountData : rows[1][0],
                    qr_code: src,
                    layout : false
                });	
            })
        });	
    })
    .error(function(e){console.log("Error handler " + e)})
    .catch(function(e){console.log("Catch handler " + e)});
});    

module.exports = router;
