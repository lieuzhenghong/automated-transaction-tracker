'use strict';

const bcrypt = require('bcrypt-nodejs');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const config = require('../config.js');

var auth_routes = express.Router();

auth_routes.post('/authenticate', (req, res) => {
  console.log('/authenticate');
  User.findOne({phone_number: req.body.phone_number}, (err, ph_no) => {
    if (!ph_no) { //If this user does not exist 
      res.json({
        success: false, 
        message: 'Phone number does not exist. \n Did you mean to sign up instead?'
      }); 
    }
    else if (ph_no) {
      bcrypt.compare(req.body.password, ph_no.password, (err, result) => {
        if (err) {
          res.json({
            success: false,
            message: 'Unknown error.'
          });
        }
        else if (result == false) {
          res.json({
            success: false,
            message: 'Wrong password.'
          });
        } 
        else {
          //create a json token
          //console.log(ph_no);
          // console.log(typeof(config.secret));
          const secret = config.secret;
          // console.log(secret);
          
          var token = jwt.sign(ph_no, secret, {
            expiresIn: config.token_expiry_time
          });

          res.json ({
            success: true,
            message: 'Authentication success!',
            _user_id: ph_no._id,
            token: token
          });
        }
      })
    }
  })
});

auth_routes.post('/sign_up', (req, res) => {
  var user = new User({
    // I have to strip phone number of spaces.
    phone_number: req.body.phone_number,
    username: req.body.username,
    password: req.body.password,
    admin: false
  });

  User.findOne({phone_number: req.body.phone_number}, (err, phone_number)=>{
    if (err) throw err;

    if (phone_number) {
      res.json({success: false, message: 'Phone number already exists.'})
    }

    if (!phone_number) {
      user.save((err) => {
        if (err) throw err;
        res.json({success: true, message: 'Sign up successful.'})
      });
    }
    
  });
});

module.exports = auth_routes;
