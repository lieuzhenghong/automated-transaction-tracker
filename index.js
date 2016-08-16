'use strict';

var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var assert = require('assert');
var url = 'mongodb://localhost:27017/transactions_db';
var jwt = require('jsonwebtoken');
var transactions_db;

/* ------------
 * TWILIO
 * ---------- */

var config = require('./config.js');
var client = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

/* --------------------------------------------
 *
 * Config stuff is here
 *
 * -------------------------------------------- */

MongoClient.connect(url, (err,db) => {
  assert.equal(null, err);
  transactions_db = db;
});

mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error'));
db.once('open', ()=> {
  console.log('connected to mongoose');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.listen(3001, () => {  
  console.log('expressjs listening on port 3001');
});

/* -------------------------------------------
 *
 * Util functions in /utils 
 *
 * -------------------------------------------*/

var normalise_date = require('./utils/normalise.js');

/* --------------------------------------------
 *
 * Actual transactions
 *
 * ------------------------------------------- */

var user_routes = require('./routes/user_routes.js')
app.use('/user', user_routes);

var store_routes = require('./routes/store_routes.js');
app.use('/:_user_id/store', store_routes);

app.get('/test_message*', (req,res) => {
  console.log(req.query);
  test(req.query.phone_number);
  res.send('Sending a message to: ' + req.query.phone_number);
});

app.get('/db_reset', (req,res) => {
  database_reset();
  res.send('OK');
});


/* --------------------
 *
 * Scheduler. 
 *
 * -------------------- */
    
function days_till_expiry(date) {
  return(Math.ceil((date - Date.now())/(1000*60*60*24)));
}

function epoch_of_date_n_days_before_date(number_of_days, date){
  // Quite a mouthful
  var ms = (1000*60*60*24);
  var days_ms = number_of_days * ms;
  // Usage: fn(7, expiry_date) ==> the epoch time stamp
  return(Date.parse(date)-(days_ms));
}

function send_message(err, transactions, days) {
  console.log(transactions);
  console.log(days);

  // short-circuits the code if the transactions array is empty, the reason for
  // this is because it will try and send a message to an empty trans array and
  // thus get trans does not exist
  
  if ( transactions == 0 ) { // == is deliberate
    console.log('no transactions fulfill criteria; not sending any SMSes');
  }
  
  else {
    transactions.forEach(function(trans) {
      if (days <= 0) {
        client.sendMessage({
          to: ("+65"+trans.phone_number),
          from: config.TWILIO_TEST_NO,
          body: ("Dear " + trans.name + ", the loan you made on " + trans.date + 
                "is due today. Please return the items loaned to Log Branch.")        
          }, (err, text) => {
          console.log('you sent: ' + text.body);
          console.log('status of msg: ' + text.status);
        });
      }
      else if (days === 3) {
        client.sendMessage({
          to: ("+65"+trans.phone_number),
          from: config.TWILIO_TEST_NO,
          body: ("Dear " + trans.name + ", the loan you made on " + 
                trans.date + "is due in three days.")        
          }, (err, text) => {
          console.log('you sent: ' + text.body);
          console.log('status of msg: ' + text.status);
        });
      }
      else if (days === 7){
         client.sendMessage({
          to: ("+65"+trans.phone_number),
          from: config.TWILIO_TEST_NO,
          body: ("Dear " + trans.name + ", the loan you made on " + 
                trans.date + "is due in seven days.")
        }, (err, text) => {
          console.log('you sent: ' + text.body);
          console.log('status of msg: ' + text.status);
        }); 
      }
    });
  }
}

function get_all_trans_expiring_in(days) {
  Trans.
    find().
    where('expiry_date').
    lt( (Date.now()) + (1000*3600*24*days) ).
    //this is obviously broken
    gt( (Date.now()) + (1000*3600*24*(days-1)) ).
    where('returned').equals(false).
    exec(function (err, doc) {
      send_message(err, doc, days);
    }
      );
}

var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
  rule.hour = 8;
  rule.minute = 0;
  //rule.second = 0;

var j = schedule.scheduleJob(rule, function(){
  console.log("cronjob called");
  get_all_trans_expiring_in(7);
  get_all_trans_expiring_in(3);
  get_all_trans_expiring_in(0);
});

function test(number) {
 client.sendMessage({
  to: ( "+65"+ number.toString() ),
  from: config.TWILIO_TEST_NO,
  body: "Hi! Welcome to Lieu's Loan Tracker service."
}, (err, text) => {
  console.log('you sent: ' + text.body);
  console.log('status of msg: ' + text.status);
}); 
}


function database_reset() {
  MongoClient.connect(url, (err, db) => {
    transactions_db = db;
    transactions_db.collection('users').deleteMany({}, ()=> {
      transactions_db.collection('stores').deleteMany({}, ()=> {
        transactions_db.collection('transactions').deleteMany({}, add_data);
      });
    });
  });
}

  function add_data() {

    //Remove this asap
    var Store = require('./models/store.js');
    var Trans = require('./models/trans.js');
    var User = require('./models/user.js');

    var user = new User({
    phone_number: '82882107',
    username: "Lieu Zheng Hong",
    password: "password",
    admin: true 
    });

    user.save((err) => {
      if (err) return console.error(err);
      var sto = new Store({
        _user_id: user._id,
        name: "GE Store"
      });

      sto.save((err) => {
        if (err) return console.error(err);

        var tra = new Trans({
          _store_id: sto._id,
          date: Date.now(),
          expiry_date: ((Date.now())+1000*60*60*24*7),
          returned: false,
          phone_number: '82882107',
          name: '3SG Ong Sheng Ping'
        });
        tra.save((err) => {
          if (err) return console.error(err);

          console.log(user);
          console.log(sto);
          console.log(tra);
        });
    });
  });
}
