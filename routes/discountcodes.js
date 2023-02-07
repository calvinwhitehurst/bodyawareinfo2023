const express = require('express')
const isLoggedIn = require('./custom_modules/isLoggedIn.js')
const connection = require('./custom_modules/connection.js')
const queries = require('./custom_modules/queries.js')
const router = express.Router()

router.get('/adddiscountcode', isLoggedIn, (req, res) => {
  connection.query(
    queries.stores + queries.userName,
    req.user.username,
    (err, rows) => {
      if (err) console.log(err)
      res.render('adddiscountcode', {
        user: req.user,
        rows: rows[0],
        profile: rows[1][0]
      })
    }
  )
})

// router.post('/printshoes', isLoggedIn, (req, res) => {
//   let quantity = req.body.quantity
//   let color = req.body.color
//   let code = req.body.code
//   let name = req.body.name
//   let size = req.body.size
//   res.render('printshoes', {
//     quantity: quantity,
//     color: color,
//     code: code,
//     size: size,
//     name: name,
//     layout: false
//   })
// })

module.exports = router
