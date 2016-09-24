'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config.js');
const secret = config.secret;

const api_routes = express.Router({mergeParams: true});

api_routes.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error(err);
        res.json({
          success: false, 
          message: err
        });
      }
      else {
        req.decoded = decoded;
        next(); 
        //next() is a way to call the callback function defined in the function 
        //params
      }
    });
  }
  else {
    // if no token is provided
    // return an error
    return res.status(403).send({
      success: false,
      message: "No token provided. <a href='login.html'> Try logging in again? </a>"
    })
  }
});

module.exports = api_routes;
