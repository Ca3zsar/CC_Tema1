const express = require('express');
const router = express.Router();

const axios = require('axios');

// const apiLink = 'https://api-dot-tema-3-cc-345018.lm.r.appspot.com/twitter/check-jwt';
const apiLink = 'http://localhost:8000/twitter/check-jwt';

async function verifyToken(token) {
    return axios.post(apiLink, {
      token,
  }).then(
      (response) => {
          return response.data;
      },
      (error) => {
          return {
              "error": "Error while verifying token"
          };
      },
  );
}

module.exports = {
  verifyToken,
};