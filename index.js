const express = require('express');
const router = express.Router();
const ContactosController = require('./ContactosController');
const controller = new ContactosController();
require('dotenv').config()

router.get('/', async function(req, res, next) {
  res.render('index', { 
    key: process.env.GOOGLEKEYPUBLIC,
    alert: false,
  });
});

router.post('/save',(req,res) => controller.add(req,res));

module.exports = router;
