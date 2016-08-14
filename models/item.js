var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item must have name']
  },
  amount: {
    type: Number,
    min: [1, 'Need at least 1 item'],
    required: [true, 'Input a number']
  },
  transaction_id: {type: Schema.Types.ObjectId, ref: "Transaction"}
});


var Item = mongoose.model('Item', itemSchema);

module.exports = Item;

