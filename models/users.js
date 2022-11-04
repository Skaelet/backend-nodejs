require('dotenv').config();
const mongoose = require("mongoose");
const userSchema = require('./mongodb/userSchema');
const conn = mongoose.createConnection(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@desafio9.xmupe0a.mongodb.net/ecommerce?retryWrites=true&w=majority`);
module.exports = conn.model('User', userSchema);