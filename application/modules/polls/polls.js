var express = require('express');
var router = express.Router();

var pollsController = require('./controllers/PollsController');

/* GET home page. */
router.get('/president/:state?', pollsController.president);

module.exports = router;
