var express = require('express');
var router = express.Router();
require('../Listener');
var db = require('../dbHandler');

/* GET home page. */
router.get('/', async (req, res, next) => {
  let records = await db.getAll();
  var list = [];

  records.recordset.forEach(element => {
    list.push(element.message)
  });
  res.render('index', { title: 'Express', message: list });
});

module.exports = router;
