var express = require('express');
var router = express.Router();

var polls = require('../polls/polls');

/* GET home page. */
router.get('/president/:state?', polls.president);

module.exports = router;
