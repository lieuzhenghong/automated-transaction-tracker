var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var transSchema = require('./trans.js')

var storeSchema = mongoose.Schema({
  _user_id: {type: Schema.Types.ObjectId, ref: "User"},
  name: String,
  contributors: [String],
});

var Store = mongoose.model('Store', storeSchema);

module.exports = Store;
