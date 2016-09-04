var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var itemSchema = require('./item.js')
var normalise_date = require('../utils/normalise.js');

var transSchema = mongoose.Schema({
  _store_id: {type: Schema.Types.ObjectId, ref: 'Store'},
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
});

var Trans = mongoose.model("Transaction", transSchema);

module.exports = Trans;

