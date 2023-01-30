const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const request = require('request');
const flash = require('connect-flash');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'controlcenter',
	multipleStatements: true
});

// var bausacred = 'https://c273415e3735420ab807054497399d99:e53b95b319b9c5f4038e666f7d8b69db@bodyawaretest.myshopify.com/admin/api/2019-04/';
// var baukcred = 'https://a9595455ad3c9257dd1eb3cb7f3946b9:944fb421042a2ffc8023da1b5b3dc32b@bodyawareuktest.myshopify.com/admin/api/2019-04/';
// var xdusacred = 'https://3b725a8ac681b8f13a36b011e752ce53:6611f8abe4ab1261d5a48be7999f1e07@xdresstest.myshopify.com/admin/api/2019-04/';
// var xdukcred = 'https://d3ce8fef088530650829120341d92f5b:c9cc4d6f9b650c43934efaa76e73ae41@xdressuktest.myshopify.com/admin/api/2019-04/';

var bausacred = 'https://ee36a21a6286678f0f56f883e7193882:d76d3d25d18efa167160975f0288c2de@bodyawareusa.myshopify.com/admin/api/2021-04/';
var baukcred = 'https://15a3026bb713d29a78b8af9079ed9618:e9838090698a1880875f88b462145c5a@bodyaware.myshopify.com/admin/api/2021-04/';
var xdusacred = 'https://f6919f1edb3a94a88a8a27aad1fd7949:88f1274c36b740fbf9b99e2fdb8ceb26@xdressusa.myshopify.com/admin/api/2021-04/';
var xdukcred = 'https://a0d44a9aeedfd12d4a8ec6f45a536a4e:26d16b7b62845ae3d6e0cf01156c7695@xdress-uk.myshopify.com/admin/api/2021-04/';

function dbsync(storecred, tbleshort){
  var count = storecred + 'products/count.json';
  request(count, function(err, response, body) {
    const data = JSON.parse(body);
    const count = data.count;
  var pagecount = Math.ceil(count / 250);
  var createtable1 = 'CREATE TABLE IF NOT EXISTS`' + tbleshort + '_prod` (`prod_id` varchar(20) NOT NULL,`title` text NOT NULL,PRIMARY KEY (`prod_id`));';
  var createtable2 = 'CREATE TABLE IF NOT EXISTS`' + tbleshort + '_var` (`var_id` varchar(20) NOT NULL,`prod_id` varchar(20) NOT NULL,`inv_id` varchar(20) NOT NULL,`img_id` varchar(20) NOT NULL,`title` varchar(50) NOT NULL,`sku` varchar(15) NOT NULL,`inv` varchar(5) NOT NULL,PRIMARY KEY (`var_id`));';
  connection.query(createtable1);
  connection.query(createtable2);
  for(var h=0; h<= pagecount; h++){
    var store = storecred + 'products.json?fields=id,title,variants&limit=250&page=' + [h]; 
      request(store, function(err, response, body) {
        const data = JSON.parse(body); 
        var queryString = "";
        var queryString2 = "";
        var insertString = "(?,?),";
        var insertString2 = "(?,?,?,?,?,?,?),";
        var values = [];
        var values2= [];
          for(var i=0; i< data.products.length; i++){
              values.push(data.products[i].id, data.products[i].title);
              queryString = queryString + insertString;
              for(var j=0; j< data.products[i].variants.length; j++){
                values2.push(data.products[i].variants[j].id, data.products[i].variants[j].product_id, data.products[i].variants[j].inventory_item_id, data.products[i].variants[j].image_id, data.products[i].variants[j].title, data.products[i].variants[j].sku, data.products[i].variants[j].inventory_quantity)
                queryString2 = queryString2 + insertString2;
              }
          }
        queryString = queryString.substring(0, queryString.length - 1);
        queryString2 = queryString2.substring(0, queryString2.length - 1);    
        var stmt = 'INSERT IGNORE INTO `' + tbleshort + '_prod` (`prod_id`,`title`) VALUES ' + queryString;
        var stmt2 = 'INSERT IGNORE INTO `' + tbleshort + '_var` (`var_id`,`prod_id`,`inv_id`,`img_id`,`title`,`sku`,`inv`) VALUES ' + queryString2;
        connection.query(stmt, values);
        connection.query(stmt2, values2);
      }); 
    }
  });
}

router.post('/baus', function(req, res){
  dbsync(bausacred, 'baus');
  res.redirect('/home');
});
router.post('/bauk', function(req, res){
  dbsync(baukcred, 'bauk');
  res.redirect('/home');
}); 
router.post('/xdus', function(req, res){
  dbsync(xdusacred, 'xdus');
  res.redirect('/home');
}); 
router.post('/xduk', function(req, res){
  dbsync(xdukcred, 'xduk');
  res.redirect('/home');
});  
module.exports = router;
