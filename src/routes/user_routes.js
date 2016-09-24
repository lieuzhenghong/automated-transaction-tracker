/*eslint no-undef: "error"*/
/*eslint-env node*/
'use strict';

const express = require('express');
const User = require('../models/user.js');
const ObjectId = require('mongoose').Types.ObjectId;

var user_routes = express.Router();

//For search queries
user_routes.get('/:query', (req, res) => {
  // http://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
  // The reason I have to do these checks is because I get an error if I try to
  // cast the search string to an ObjectId
  //
  function search() {
    let regex_no = `^${req.params.query}.*`;
    let regex_name = `${req.params.query}.*`;
    User.find( {$or: [{username: {$regex: regex_name, $options: 'i'} }, 
      {phone_number: {$regex: regex_no, $options: 'i'} } ]}, (err, users) => {
      if (err) res.send(err); 
      else {
        res.json(users);  
      }
    });
  }
  
  if (ObjectId.isValid(req.params.query)) {
    if (req.params.query == new ObjectId(req.params.query)) { 
      User.find({_id: req.params.query}, (err, users) => {
        if (err) res.send(err);
        else {
          res.json(users);
        }
      });
    }
    else {
      search(req.params.query);
    }
  }
  else {
    search(req.params.query);
  } 
});

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
            message: 'Successfully changed user details!',
            user: user
          });
        });
      });
    }
  });
});
module.exports = user_routes;
