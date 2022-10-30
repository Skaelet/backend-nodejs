const mongoose = require("mongoose");
const userSchema = require('./mongodb/userSchema');
const conn = mongoose.createConnection('mongodb+srv://Skaelet:backCoder@desafio9.xmupe0a.mongodb.net/ecommerce?retryWrites=true&w=majority');
module.exports = conn.model('User', userSchema);