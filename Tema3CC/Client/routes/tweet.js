var express = require('express');
var router = express.Router();

const axios = require('axios');
// const apiLink = 'http://localhost:8000/twitter/tweet';
const apiLink = 'https://api-dot-tema-3-cc-345018.lm.r.appspot.com/twitter/tweet';


router.get('/', function(req, res, next) {
  res.render('tweet', { title: 'Tweet page' });
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

