const mongoose = require('mongoose');
// destructuring
const { Schema } = mongoose;

const stockSchema = new Schema({
  name: {
    type: String, // name = "    Sugar " - the white spaces will be trimmed
    trim: true
  },
  plu: {
  	type: Number,
    index: true,
    unique: true 
  },
  costprice: {
  	type: Number,
    default: 0
  },
  sellprice: {
  	type: Number,
    default: 0
  },
  category: {
  	type: String,
  	trim: true
  },
  qtyOnHand: {
  	type: Number,
    default: 0
  },
  reorderLevel: {
  	type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;