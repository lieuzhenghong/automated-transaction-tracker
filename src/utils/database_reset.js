const bcrypt = require('bcrypt-nodejs');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const config = require('../config.js');

var Store = require('../models/store.js');
var Trans = require('../models/trans.js');
var User = require('../models/user.js');

/* ------------------------
 *
 * Database reset
 *
 * ------------------------ */

function database_reset() {
  MongoClient.connect(config.database, (err, db) => {
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


  var user = new User({
  phone_number: '92337545',
  username: "2WO Shany Ong",
  password: bcrypt.hashSync('shany'),
  admin: false
  });

  var user1 = new User({
    phone_number: '82882107',
    username: 'CPL Lieu Zheng Hong',
    password: bcrypt.hashSync('lieu'),
    admin: true
  });

  var user2 = new User({
    phone_number: '84514964',
    username: '3SG Ong Sheng Ping',
    password: bcrypt.hashSync('ong'),
    admin: false
  })

  user.save((err) => {
    if (err) return console.error(err);

    user2.save((err) => {
      if (err) return console.error(err);
    })

    user1.save ((err) => {
      if (err) return console.error(err);

      var sto = new Store({
        _user_id: user._id,
        name: "GE Store",
        contributors: [user1._id, user2._id] 
      });

      sto.save((err) => {
        if (err) return console.error(err);

        /* var tra = new Trans({
          _store_id: sto._id,
          date: Date.now(),
          expiry_date: ((Date.now())+1000*60*60*24*7),
          returned: false,
          phone_number: '82882107',
          name: '3SG Ong Sheng Ping'
        });
        tra.save((err) => {
          if (err) return console.error(err);

          */

          console.log(user, user1, user2);
          console.log(sto);
          // console.log(tra);
      //});
    });
  });
  });
}

module.exports = database_reset;
