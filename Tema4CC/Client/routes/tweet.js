var express = require('express');
var router = express.Router();

const axios = require('axios');
// const apiLink = 'http://localhost:8000/twitter/tweet';
const apiLink = 'https://tweetcloudcomputing.azurewebsites.net/twitter/tweet';

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const checker = require("../utils/jwt-checker");

router.get('/', async function(req, res, next) {
    let token = req.cookies["access_token"];
    let result = await checker.verifyToken(token);
    if (result["error"] === undefined) {
        res.render('tweet', { title: 'Tweet page' });
    } else {
    res.redirect('/login');
    }
});

router.post('/', function(req, res, next) {

//   console.log(req.body.hashtag);
  axios
  .post(apiLink, {
    hashtag: req.body.hashtag,
  })
  .then(response => {
    console.log(`statusCode: ${response.status}`);
    // console.log(res.data)

    var jsonObj = []
    var i = 0
    response.data.forEach(element => {
        jsonObj[i++] = element.tweet
    });

    res.render('tweets_preview', {data : jsonObj, 'hashtag' : req.body.hashtag});
  })
  .catch(error => {
    // console.error(error)
  })
});

module.exports = router;

