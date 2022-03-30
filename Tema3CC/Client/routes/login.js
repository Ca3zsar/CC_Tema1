const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');

const axios = require('axios');
const bcrypt = require("bcryptjs");

const apiLink = 'https://api-dot-tema-3-cc-345018.lm.r.appspot.com/twitter/login';
// const apiLink = 'http://localhost:8000/twitter/login';

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const checker = require("../utils/jwt-checker");

/* GET home page. */
router.get('/', async function (req, res, next) {
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
router.post('/',
    ///validation
    body('username').isLength({min: 4}),
    // username must be at least 4 chars long
    body('password').isLength({min: 4}),
    // password must be at least 4 chars long

    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors)
            res.render('login', {message: 'Username and password must have at least 4 characters!'});
            return;
        }
        let password = req.body.password;
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        axios.post(apiLink, {
            username: req.body.username,
            password: hash,
        })
            .then(response => {
                console.log(response.data.token);
                console.log(`statusCode: ${res.status}`);
                res.cookie("access_token", response.data.token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge : 3600000 * 24
                    })
                    .status(200).redirect('/tweet');
            })
            .catch(error => {
                res.render('login', {message: 'Username or password incorrect!'});

                console.error(error.response.status)
                console.error(error.response.data["reason"])
            })
    });

module.exports = router;
