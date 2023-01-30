const express = require("express");
const router = express.Router();
const request = require('request');
var connection = require("./connection");

module.exports = function dbsync(storecred){
  for(var i=0;i< storecred.length; i++){
    var count = storecred[i] + 'products/count.json';
    request(count, function(err, response, body) {
      const data = JSON.parse(body);
      const count = data.count;
    var pagecount = Math.ceil(count / 250);
    var createtable1 = 'CREATE TABLE IF NOT EXISTS`store_' + [i] + '_prod` (`prod_id` varchar(20) NOT NULL,`title` text NOT NULL,PRIMARY KEY (`prod_id`));';
    var createtable2 = 'CREATE TABLE IF NOT EXISTS`store_' + [i] + '_var` (`var_id` varchar(20) NOT NULL,`prod_id` varchar(20) NOT NULL,`inv_id` varchar(20) NOT NULL,`img_id` varchar(20) NOT NULL,`title` varchar(50) NOT NULL,`sku` varchar(15) NOT NULL,`inv` varchar(5) NOT NULL,PRIMARY KEY (`var_id`));';
    connection.query(createtable1);
    connection.query(createtable2);
    for(var h=0; h<= pagecount; h++){
      var store = storecred[i] + 'products.json?fields=id,title,variants&limit=250&page=' + [h]; 
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
                  values2.push(data.products[i].variants[j].id, data.products[i].variants[j].product_id, data.products[i].variants[j].inventory_item_id, data.products[i].variants[j].image_id, data.products[i].variants[j].title, data.products[i].variants[j].sku, data.products[i].variants[j].inventory_quantity);
                  queryString2 = queryString2 + insertString2;
                }
            }
          queryString = queryString.substring(0, queryString.length - 1);
          queryString2 = queryString2.substring(0, queryString2.length - 1);    
          var stmt = 'INSERT IGNORE INTO `store_' + [i] + '_prod` (`prod_id`,`title`) VALUES ' + queryString;
          var stmt2 = 'INSERT IGNORE INTO `store_' + [i] + '_var` (`var_id`,`prod_id`,`inv_id`,`img_id`,`title`,`sku`,`inv`) VALUES ' + queryString2 + ' ON DUPLICATE KEY UPDATE inv = VALUES (inv)';
          connection.query(stmt, values);
          connection.query(stmt2, values2);
        }); 
      }
    });
  };
}
 
module.exports = router;