
var express = require('express');
var jwt = require('jsonwebtoken');

var User = require('../models/user.js');
var user_routes = express.Router();
var config = require('../config.js');

//For search queries
user_routes.get('/:query', (req, res) => {
  'use strict';
  console.log('user route called');
  let regex_no = `^${req.params.query}.*`;
  let regex_name = `${req.params.query}.*`;
  User.find( {$or: [{username: {$regex: regex_name, $options: 'i'} }, 
    {phone_number: {$regex: regex_no, $options: 'i'} }, 
    {_id: req.params.query}
  ]}, (err, users) => {
    if (err) res.send(err); 
    else {
      console.log(users);
      res.json(users);  
    }
  })
})

user_routes.put('/:_id', (req, res) => {
  //First, check if the phone number is unique.
  req.body.phone_number = req.body.phone_number.trim();
  console.log(req.body);
  User.findOne({phone_number: req.body.phone_number}, (err, user) => {
    console.log(user);
    if (user && user._id != req.params._id) { 
      res.send({
        success: false,
        message: 'Phone number already exists! Please choose a unique one.'
      });
    }
    else {
     User.findOne({_id: req.params._id}, (err, user) => {
      if (err) res.send(err);
      user.username = req.body.username;
      user.phone_number = req.body.phone_number;
      user.save ((err) => {
        if (err) return console.error(err);
          res.json({
            success: true,
            message: 'Successfully changed user details!'
          })
        })
      })
    }
  })
});

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
    }
  })
});

user_routes.post('/sign_up', (req, res) => {
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
