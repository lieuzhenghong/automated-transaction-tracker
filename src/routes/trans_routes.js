'use strict';

var express = require('express');
var Trans = require('../models/trans.js');
var config = require('../config.js');
var client = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
var normalise_date = require('../utils/normalise.js');

// Need to set mergeParams: true on this router if I want to access params from
// the parent router
// http://stackoverflow.com/questions/25260818/rest-with-express-js-nested-router

var trans_routes = express.Router({mergeParams: true});


trans_routes.route('/')
  .get((req, res) => {
    console.log('trans_routes called');
    console.log(req.params);
    var id = req.params._store_id;
    Trans.find({'_store_id': id}, (err, transactions) => {
      if ( err ) console.error(err);
      res.send(transactions)
    });
  })
  .post((req, res) => {
    console.log('received');
    var id = req.params._store_id;
    var ed_n =  req.body.expiry_date_number;
    var ed_s = req.body.expiry_date_selector;
    const ms = 1000*60*60*24;
    var days = 0;
    var trans = req.body;
    console.log(trans);
    
    trans._store_id = id;
    trans.expiry_date = new Date();

    console.log(ed_s);
    
    if (ed_s === 'day') {
      days = 1;
    }
    else if (ed_s === 'week') {
      days = 7;
    }
    else if (ed_s === 'month') {
      days = 30;
    }
    else {
      assert(false, 'Should be day, month or year');
    }

    trans.expiry_date = ( Date.parse(normalise_date( trans.expiry_date)) + 
                        (ms * days* ed_n) );
    console.log(trans.expiry_date);
    
    var tr = new Trans(trans);
    console.log(tr);

    tr.save((err) => {
      if (err){
        res.send(err);
        return console.error(err);
      }
      else {
        client.sendMessage({
          to: ("+65"+ tr.phone_number),
          from: config.TWILIO_TEST_NO,
          body: ("Dear " + tr.name + ', Your loan is due on ' +
                (tr.expiry_date).toString() )
        }, (err, text) => {
          console.log("you sent: " + text.body);
          console.log("status of msg: " + text.status);
          });
        res.send(tr);
      }
    });
  });

trans_routes.put('/:_trans_id/renew', (req,res) => {
  //console.log(req);
  //console.log(req.url);
  var id = req.params._trans_id;
  // req.url.split === [ '', 'trans', 'id', 'renew' ]
  console.log(id);
  console.log('received');
  Trans.findOne({'_id': id}, (err,trans) => {
    if (err) {
      return console.error(err);
    }
    else {
      trans.date = normalise_date(new Date());
      trans.expiry_date = (Date.parse(trans.date) + 1000 * 60 * 60 * 24 * 30);
      trans.save((err) => {
        if (err) return console.error(err);
        console.log(trans);
        client.sendMessage({
          to: ("+65"+ trans.phone_number),
          from: config.TWILIO_TEST_NO,
          body: ("Dear" + trans.name , "You just renewed your loan. It is due on " +
          trans.expiry_date.toString())
        }, (err, text) => {
          console.log("you sent: " + text.body);
          console.log("status of msg: " + text.status);
          });
        res.send(trans);
      });
    }
  });
});

trans_routes.put('/:_trans_id/return', (req,res) => {
  //console.log(req);
  //console.log(req.url);
  var id = req.params._trans_id;
  // req.url.split === [ '', 'trans', 'id', 'renew' ]
  console.log(id);
  console.log('received');
  Trans.findOne({'_id': id}, (err,trans) => {
    if (err) {
      return console.error(err);
    }
    else {
      trans.returned = true;
      console.log(trans);
      trans.save((err => {
        if (err) return console.error(err);
      }));
      res.send(trans);
    }
  });
});

module.exports = trans_routes;
