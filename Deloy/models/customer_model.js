const mongoose = require('mongoose');

const customer = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  image: String
});

module.exports = mongoose.model('customer', customer);