var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const checker = require("../utils/jwt-checker");

/* GET home page. */
router.get('/', async function(req, res, next) {
    let token = req.cookies["access_token"];
    let result = await checker.verifyToken(token);
    if (result["error"] === undefined) {
        res.redirect('/tweet');
    } else {
        res.render('login', {
            title: 'Login page'
        });
    }
});

module.exports = router;
