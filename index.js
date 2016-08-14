'use strict';

var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var assert = require('assert');
var url = 'mongodb://localhost:27017/transactions_db';
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

//normalise_date is a function that sets the timing of the loan to 8am sharp, no
//matter the time of the actual borrowing. 
//The reason for this is so that messages can be sent promptly at 8am in the
//morning.

function normalise_date(date) {
  // console.log(date);
  date.setHours(8,0,0,0);
  // console.log(date);
  // console.log(Date.parse(date));
  return(date);
}

var itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item must have name']
  },
  amount: {
    type: Number,
    min: [1, 'Need at least 1 item'],
    required: [true, 'Input a number']
  }
});

var transSchema = mongoose.Schema({
  date: {
    type: Date,
    // Set to 8 am.
    default: normalise_date(new Date())
  },
  expiry_date: {
    type: Date,
    default: (Date.parse(normalise_date(new Date())) + (60*60*24*30*1000)) //1000 for milliseconds
  },
  returned: {
    type: Boolean,
    default: false
  },
  name: String,
  phone_number: String, 
  items: [itemSchema]
});

var storeSchema = mongoose.Schema({
  name: String,
  transactions: [transSchema]
});

var Store = mongoose.model('Store', storeSchema);
var Trans = mongoose.model("Transaction", transSchema);
var Item = mongoose.model('Item', itemSchema);

app.listen(3001, () => {  
  console.log('expressjs listening on port 3001');
});

/* --------------------------------------------
 *
 * Actual transactions
 *
 * ------------------------------------------- */

app.get('/store', (req, res) => {
  Store.find((err, stores) => {
    if (err) return console.error(err);
    // console.log(stores);
    res.send(stores);
  });
});

app.get('/store/*/trans', (req, res) => {
  var id = req.url.split('/')[2];
  Store.findOne({'_id': id}, (err, store) => {
    if ( err ) console.error(err);
    else {
      console.log(store.transactions);
      res.send(store.transactions);
    }
  });
});

app.post('/store', (req, res) => {
  var store = req.body;
  console.log(store);

  var sto = new Store(store);
  sto.save( (err) => {
    if (err) return console.error(err);
    else {
      res.send(sto);
    }
  });
});

app.post('/store/*/trans', (req, res) => {
  console.log('received');
  var id = req.url.split('/')[2];
  var ed_n =  req.body.expiry_date_number;
  var ed_s = req.body.expiry_date_selector;
  const ms = 1000*60*60*24;
  var days = 0;

  var trans = req.body;
  console.log(trans);
  
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
    Store.findOne({_id: id}, (err, store) => {
        if ( err ) console.error(err);
        
        else {
          store.transactions.push(tr);
          store.save((err) => {
            if (err) {
              res.send(err);
              return console.log(err);
            }
            else {
              console.log('store transactions:' + store.transactions);
              /*
              client.sendMessage({
                to: ("+65"+ tr.phone_number),
                from: config.TWILIO_TEST_NO,
                body: ("Dear " + tr.name + ', Your loan is due on ' +
                      (tr.expiry_date).toString() )
              }, (err, text) => {
                console.log("you sent: " + text.body);
                console.log("status of msg: " + text.status);
                });
              */
              res.send(store.transactions);
            }
          });
        }  
    }); 
  }
});
});

app.put('/trans/*/renew', (req,res) => {
  //console.log(req);
  //console.log(req.url);
  var id = req.url.split('/')[2];
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
      trans.save((err => {
        if (err) return console.error(err);
      }));
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
    }
  });
});

app.put('/trans/*/return', (req,res) => {
  //console.log(req);
  //console.log(req.url);
  var id = req.url.split('/')[2];
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
    transactions_db.collection('stores').deleteMany({});
    transactions_db.collection('transactions').deleteMany({});
    console.log("dropped");
    add_data();
  });

  function add_data() {

    var trans = {
      date: Date.now(),
      expiry_date: ((Date.now()) + 1000 * 60 * 60 * 24 * 7),     
      returned: false,
      items: [],
      phone_number: '82882107',
      name: '3SG Ong Sheng Ping'
    };

    var tra = new Trans(trans);
    tra.save( (err) => {
      if (err) return console.error(err);
      else {
        // console.log(tra);
        console.log('trans saved');
      }
    });
    
    var store =  {
      name: "GE Store",
      transactions: [tra]
    };

    var sto = new Store(store);
    sto.save( (err) => {
      if (err) return console.error(err);
      else {
        console.log(sto);
      }
    });
  }
}
