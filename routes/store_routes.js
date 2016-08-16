var express = require('express');
var Store = require('../models/store.js');

var store_routes = express.Router();

store_routes.route('/')
  .get((req, res) => {
  Store.find({_user_id: req.body._user_id}, (err, stores) => {
    if (err) return console.error(err);
    // console.log(stores);
    res.send(stores);
    });
  })
  .post((req, res) => {
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

// Using trans_router 

var trans_routes = require('./trans_routes.js');

store_routes.use('/:_store_id/trans', trans_routes);

module.exports = store_routes;
