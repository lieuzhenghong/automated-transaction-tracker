var express = require('express');
var jwt = require('jsonwebtoken');

var User = require('../models/user.js');
var user_routes = express.Router();
var config = require('../config.js');

user_routes.post('/authenticate', (req, res) => {
  console.log('/authenticate');
  User.findOne({phone_number: req.body.phone_number}, (err, ph_no) => {
    if (!ph_no) { //If this user does not exist 
      res.json({
        success: false, 
        message: 'Phone number does not exist. \n Did you mean to sign up instead?'
      });
    }
    else if (ph_no) {
      if (ph_no.password != req.body.password) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      }
      else {
        //create a json token
        var token = jwt.sign(ph_no, config.secret, {
          expiresIn: 60 * 60 * 24  //24 hours
        });

        res.json ({
          success: true,
          message: 'Authentication success!',
          token: token
        });
      }
    }
  })
})

user_routes.post('/sign_up', (req, res) => {
  console.log('received');
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

module.exports = user_routes;
