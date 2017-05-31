const mongoose = require('mongoose');
// destructuring
const { Schema } = mongoose;

const transactionLogSchema = new Schema({
  
  stockId: ObjectId,

  transactionType: {
  	type: String,
    trim: true
  },
  quantity: {
  	type: Number
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const transactionLogSchema = mongoose.model('transactionLogSchema', ingredientSchema);

module.exports = transactionLogSchema;