var express = require('express');
var Store = require('../models/store.js');
var User = require('../models/user.js');
var mongoose = require('mongoose')

var store_routes = express.Router({mergeParams: true});

store_routes.route('/')
  .get((req, res) => {
  console.log(req.params);
  var _user_id = req.params._user_id;
  //Find only those stores which you are the owner (user id = yours) OR a store
  //where you are a contributor
  
  Store.find({$or: [{_user_id: _user_id}, {contributors: { $in: [_user_id]}}]}, 
  (err, stores) => {
    if (err) return console.error(err);
    let users = [];

    // ES6 Promises 
    // need to set Mongoose promises as native promises
    mongoose.Promise = global.Promise;

    //This worked and suddenly doesn't work despite me not touching anything?
    
    var promises = [];
    for (let i = 0; i < stores.length; i++) {
      var query = User.findOne({_id: stores[i]._user_id});
      promises[i] = query.exec();
      promises[i].then(function(user) {
        users.push(user);
      })
    }
    Promise.all(promises).then(() => {
      sendResponse({stores, users})
    });
    
    function sendResponse(payload) {
      res.send(payload)
    }
    });
  })
  .post((req, res) => {
    var store = req.body;
    console.log(store);

    var sto = new Store(store);
    sto.save( (err) => {
      if (err) return console.error(err);
      else {
        res.send({success: true, message:'Store successfully created!'});
      }
    });
  });

store_routes.route('/:_store_id/manage')
  .get((req, res) => {
    
    Store.findOne({_id: req.params._store_id}, (err, store) => {
      let owner = {};
      let contributors = [];
      let promises = [];
      //
      // The Promise.all will take this promise and run the .then before the
      // following for loop runs. So it will only send out the owner but it
      // won't send out the contributors.
      //
      mongoose.Promise = global.Promise;
      for (let i = 0; i < store.contributors.length; i++) { //Shift by 1
        //console.log(store.contributors[i]);
        let query = User.findOne({_id: store.contributors[i]});
        promises[i] = query.exec();
        promises[i].then(function(user) {
          contributors.push(user);
          console.log('i am being called');

        });
      }
      let query = User.findOne({_id: store._user_id});
      promises.push(query.exec());
      promises[promises.length-1].then(function(user) {owner = user;})
      //console.log(promises);

      Promise.all(promises).then(function() {
        res.send([store, owner, contributors]);
      })
    })
  })
  .put((req, res) => {
    console.log('hello');
    Store.findOne({_id: req.params._store_id}, (err, store) => {
      console.log(store);
      //Edit the store according to its details 
      store._user_id = req.params._user_id;
      store.name = req.body.name;
      store.contributors = req.body.contributors;
      store.save((err) => {
        if (err) return console.error(err);
        console.log('store here');
        console.log(store);
        res.json({success: true, message: "Store successfully updated."});
      })
    })  
  })

// Using trans_router 

var trans_routes = require('./trans_routes.js');

store_routes.use('/:_store_id/trans', trans_routes);

module.exports = store_routes;
