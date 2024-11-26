const express = require('express');
const router = express.Router();
const ContactosController = require('./ContactosController');
const controller = new ContactosController();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/save',(req,res) => controller.add(req,res));

module.exports = router;
