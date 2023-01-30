var express = require("express");
var router = express.Router();
var isLoggedIn = require("./custom_modules/isLoggedIn.js");
var connection = require("./custom_modules/connection");
var queries = require("./custom_modules/queries.js");

router.get("/searchepic", function(req, res) {
  connection.query(
    queries.typeAheadEpic +
      req.query.q +
      '%" OR `variant_sku` LIKE "%' +
      req.query.q +
      '%"',
    function(err, rows, fields) {
      if (err) throw err;
      var data = {
        results: []
      };
      for (i = 0; i < rows.length; i++) {
        var object = {
          title: rows[i].variant_sku,
          description: rows[i].title
        };
        data.results.push(object);
      }
      res.send(JSON.stringify(data));
    }
  );
});

router.post("/searchepic", function(req, res) {
  connection.query(
    queries.stores +
      queries.epicVendor +
      req.body.search +
      '%" OR `variant_sku` LIKE "%' +
      req.body.search +
      '%";' +
      queries.userName,
    req.user.username,
    function(err, rows) {
      if (err) {
        console.log(err);
      } else {
        var obj = JSON.parse(JSON.stringify(rows[1]));
        res.render("epic_search_table", {
          obj: obj,
          rows: rows[0],
          profile: rows[2][0]
        });
      }
    }
  );
});

router.get("/epicvendor", isLoggedIn, function(req, res) {
  connection.query(
    queries.stores + queries.userName,
    req.user.username,
    function(err, rows, fields) {
      res.render("epicvendor", {
        user: req.user,
        rows: rows[0],
        profile: rows[1][0]
      });
    }
  );
});

router.get("/epic_search_table", isLoggedIn, function(req, res) {
  connection.query(
    queries.stores + queries.userName,
    req.user.username,
    function(err, rows, fields) {
      res.render("epic_search_table", {
        user: req.user,
        rows: rows[0],
        profile: rows[1][0]
      });
    }
  );
});

router.post("/searchepic/(:id)", function(req, res) {
  var title = req.body.title;
  var oursku = req.body.oursku;
  var theirsku = req.body.theirsku;
  var vendor = req.body.vendor;
  var ourprice = req.body.ourprice;
  var theirprice = req.body.theirprice;
  var id = req.params.id;
  connection.query(
    queries.epicUpdate,
    [title, oursku, theirsku, vendor, ourprice, theirprice, id],
    function(error, results, fields) {
      res.redirect("/epicvendor");
    }
  );
});

router.get("/searchepic/(:id)", function(req, res) {
  var id = req.params.id;
  connection.query(queries.epicDelete, id, function(error, result) {
    res.redirect("/epicvendor");
  });
});

router.post("/addNewEpic", function(req, res) {
  var title = req.body.title;
  var variant_sku = req.body.oursku;
  var variant_barcode = req.body.theirsku;
  var vendor = req.body.vendor;
  var variant_price = req.body.ourprice;
  var cost_per_item = req.body.theirprice;
  var handle = req.body.handle;
  var image_src = req.body.image_url;
  var post = {
    handle,
    title,
    vendor,
    variant_sku,
    variant_price,
    cost_per_item,
    variant_barcode,
    image_src
  };
  connection.query(queries.epicInsert, post, function(err) {
    res.redirect("/epicvendor");
  });
});

module.exports = router;
