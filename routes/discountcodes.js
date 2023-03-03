const express = require('express')
const isLoggedIn = require('./custom_modules/isLoggedIn.js')
const connection = require('./custom_modules/connection.js')
const queries = require('./custom_modules/queries.js')
const router = express.Router()

router.get('/adddiscountcode', isLoggedIn, (req, res) => {
  connection.query(
    queries.stores + queries.getAllDiscounts + queries.userName,
    req.user.username,
    (err, rows) => {
      if (err) console.log(err)
      res.render('adddiscountcode', {
        user: req.user,
        rows: rows[0],
        rows2: rows[1],
        profile: rows[2][0]
      })
    }
  )
})

// router.post('/addDiscount', isLoggedIn, (req, res) => {
//   let title = req.body.title
//   let link = req.body.link
//   let message = req.body.message
//   let start_date = req.body.start_date
//   let end_date = req.body.end_date
//   let store = req.body.store 
//   let active = req.body.active
//   res.render('adddiscountcode', {
//     title: title,
//     link: link,
//     message: message,
//     start_date: start_date,
//     end_date: end_date,
//     store: store,
//     active: active
//   })
// })

router.post('/addDiscount', isLoggedIn, (req, res) => {
    let title = req.body.title
    let link = req.body.link
    let message = req.body.message
    let start_date = req.body.start_date
    let end_date = req.body.end_date
    let store = req.body.store 
    let active = req.body.active ? 1 : 0
    var post = {
      title,
      link,
      message,
      start_date,
      end_date,
      store,
      active
    };
    console.log(post);
    connection.query(queries.discountInsert, post, function(error, result) {
      res.redirect('adddiscountcode');
    });
  });

module.exports = router
